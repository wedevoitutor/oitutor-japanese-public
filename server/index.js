import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import subscribeRouter from './routes/subscribe.js'
import stripeRouter, { stripeWebhookHandler } from './routes/stripe.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))

// Stripe webhook — must be mounted BEFORE express.json() so the raw body
// is preserved for signature verification.
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler)

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'oitutor-api' })
})

app.use(express.json())

app.use('/api/subscribe', subscribeRouter)
app.use('/api/stripe', stripeRouter)

app.listen(PORT, () => console.log(`Server running on :${PORT}`))