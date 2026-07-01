/**
 * Payment provider stubs — ready for Stripe and CoinGate integration.
 * Replace the throw statements with real API calls when keys are available.
 */

/**
 * Initiates a Stripe checkout session for a product.
 * TODO: POST to /api/stripe/create-checkout-session with { productId }
 * @param {string} productId
 * @returns {Promise<{url: string}>}
 */
export async function createStripeCheckout(productId) {
  // eslint-disable-next-line no-unused-vars
  void productId;
  throw new Error('Stripe integration not yet configured.');
}

/**
 * Initiates a CoinGate (crypto) order for a product.
 * TODO: POST to /api/coingate/create-order with { productId }
 * @param {string} productId
 * @returns {Promise<{url: string}>}
 */
export async function createCoinGateCheckout(productId) {
  // eslint-disable-next-line no-unused-vars
  void productId;
  throw new Error('CoinGate integration not yet configured.');
}
