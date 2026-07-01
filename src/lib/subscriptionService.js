import { supabase } from './supabase'

/**
 * Calls a Stripe backend endpoint with the current user's Supabase JWT.
 * Returns null if the user is not authenticated.
 */
async function callStripe(endpoint) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  const res = await fetch(`/api/stripe/${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) throw new Error(`Stripe ${endpoint} failed: ${res.status}`)
  return res.json()
}

/** Starts a checkout session and redirects the user to Stripe. */
export async function startCheckout() {
  const result = await callStripe('create-checkout-session')
  if (!result) { window.location.href = '/login'; return }
  window.location.href = result.url
}

/** Opens the Stripe customer portal for subscription management. */
export async function openBillingPortal() {
  const result = await callStripe('create-portal-session')
  if (!result) { window.location.href = '/login'; return }
  window.location.href = result.url
}
