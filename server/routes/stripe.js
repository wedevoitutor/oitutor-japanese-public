import { Router } from 'express'
import Stripe from 'stripe'
import { supabaseAdmin } from '../lib/supabase.js'

const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// --- auth helper --------------------------------------------------------

async function getAuthedUser(req) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token || !supabaseAdmin) return null
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  return user
}

// --- POST /api/stripe/create-checkout-session ---------------------------

router.post('/create-checkout-session', async (req, res) => {
  try {
    const user = await getAuthedUser(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const { data: student, error: sErr } = await supabaseAdmin
      .from('students')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (sErr) return res.status(404).json({ error: 'Student record not found' })

    // Get or create Stripe customer
    let customerId = student?.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_id: user.id },
      })
      customerId = customer.id
      await supabaseAdmin
        .from('students')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: process.env.STRIPE_PRICE_PREMIUM_MONTHLY, quantity: 1 }],
      success_url: `${FRONTEND_URL}/subscription/success`,
      cancel_url: `${FRONTEND_URL}/subscription/cancel`,
      client_reference_id: user.id,
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error('create-checkout-session:', err.message)
    res.status(500).json({ error: 'Checkout failed' })
  }
})

// --- POST /api/stripe/create-portal-session -----------------------------

router.post('/create-portal-session', async (req, res) => {
  try {
    const user = await getAuthedUser(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const { data: student } = await supabaseAdmin
      .from('students')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!student?.stripe_customer_id) {
      return res.status(400).json({ error: 'No Stripe customer' })
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: student.stripe_customer_id,
      return_url: `${FRONTEND_URL}/student`,
    })

    res.json({ url: portal.url })
  } catch (err) {
    console.error('create-portal-session:', err.message)
    res.status(500).json({ error: 'Portal failed' })
  }
})

// --- Webhook handler (exported separately, needs raw body) --------------

export async function stripeWebhookHandler(req, res) {
  const signature = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const subscription = await stripe.subscriptions.retrieve(session.subscription)
        await supabaseAdmin
          .from('students')
          .update({
            stripe_subscription_id: subscription.id,
            subscription_status: subscription.status,
            subscription_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('id', session.client_reference_id)
        break
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        await supabaseAdmin
          .from('students')
          .update({
            subscription_status: subscription.status,
            subscription_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('stripe_customer_id', subscription.customer)
        break
      }
      default:
        // Unhandled event type — ignore
        break
    }
    res.json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err.message)
    res.status(500).send('Webhook handler failed')
  }
}

export default router
