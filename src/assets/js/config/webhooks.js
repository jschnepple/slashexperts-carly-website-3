/**
 * Webhook Configuration
 * Centralized configuration for n8n webhook URLs
 *
 * To switch between test and production:
 * - Set USE_TEST_WEBHOOK = true for testing
 * - Set USE_TEST_WEBHOOK = false for production
 */

// ============================================
// TOGGLE THIS TO SWITCH ENVIRONMENTS
// ============================================
const USE_TEST_WEBHOOK = false;  // Set to false for production

// ============================================
// WEBHOOK URLS
// ============================================
const WEBHOOK_ID = 'c8c20240-c102-474c-b54e-ef0e65cee176';
const BASE_URL = 'https://slashexperts.app.n8n.cloud';

export const WEBHOOK_URL = USE_TEST_WEBHOOK
    ? `${BASE_URL}/webhook-test/${WEBHOOK_ID}`
    : `${BASE_URL}/webhook/${WEBHOOK_ID}`;

// Export config for debugging/logging
export const WEBHOOK_CONFIG = {
    isTestMode: USE_TEST_WEBHOOK,
    webhookId: WEBHOOK_ID,
    url: WEBHOOK_URL
};

// Log current mode on import (helpful for debugging)
if (typeof window !== 'undefined') {
    console.log(`[Webhook Config] Mode: ${USE_TEST_WEBHOOK ? 'TEST' : 'PRODUCTION'}`);
    console.log(`[Webhook Config] URL: ${WEBHOOK_URL}`);
}
