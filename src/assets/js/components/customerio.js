/**
 * Customer.io Integration Utility
 * Standardized methods for identifying users and tracking form events
 *
 * Usage:
 *   import { identifyUser, trackEvent } from '../components/customerio.js';
 *
 *   identifyUser({
 *       email: 'user@example.com',
 *       formName: 'contact_form',
 *       attributes: { first_name: 'John', company: 'Acme' }
 *   });
 */

import { getUtmData, flattenUtmForPayload } from './utm.js';

const DEFAULT_SOURCE = 'website';

/**
 * Identify a user in Customer.io with form data
 * Creates or updates the user profile and optionally tracks a form_submitted event
 *
 * @param {Object} options
 * @param {string} options.email - User email (used as unique ID in Customer.io)
 * @param {string} options.formName - Form identifier (e.g., 'pipeline_calculator', 'contact_form')
 * @param {Object} options.attributes - Additional attributes to send (first_name, company, etc.)
 * @param {boolean} options.trackEvent - Whether to also track a form_submitted event (default: true)
 * @returns {boolean} Success status
 */
export function identifyUser({ email, formName, attributes = {}, trackEvent = true }) {
    if (typeof _cio === 'undefined') {
        console.warn('Customer.io not loaded - skipping identify');
        return false;
    }

    if (!email || !formName) {
        console.error('identifyUser requires email and formName');
        return false;
    }

    // Get UTM data for attribution
    const utmData = flattenUtmForPayload(getUtmData());

    // Build the payload with standard fields
    const payload = {
        id: email,
        email: email,
        source: DEFAULT_SOURCE,
        form_name: formName,
        form_submitted_at: new Date().toISOString(),
        page_url: window.location.pathname,
        referrer: document.referrer || null,
        // Include UTM parameters for attribution
        ...utmData,
        // User-provided attributes (may override UTM if needed)
        ...attributes
    };

    try {
        // Identify/update the user in Customer.io
        _cio.identify(payload);

        // Optionally track a form submission event
        if (trackEvent) {
            _cio.track('form_submitted', {
                form_name: formName,
                page_url: window.location.pathname,
                timestamp: new Date().toISOString()
            });
        }

        console.log(`Customer.io: Identified user for ${formName}`, { email, formName });
        return true;
    } catch (error) {
        console.error('Customer.io identify failed:', error);
        return false;
    }
}

/**
 * Track a custom event in Customer.io
 * Use this for events beyond form submission (e.g., pdf_downloaded, quiz_completed)
 *
 * @param {string} eventName - Event name (e.g., 'pdf_downloaded', 'meeting_booked')
 * @param {Object} eventData - Event properties
 * @returns {boolean} Success status
 */
export function trackEvent(eventName, eventData = {}) {
    if (typeof _cio === 'undefined') {
        console.warn('Customer.io not loaded - skipping track');
        return false;
    }

    if (!eventName) {
        console.error('trackEvent requires eventName');
        return false;
    }

    // Get UTM data for event attribution
    const utmData = flattenUtmForPayload(getUtmData());

    try {
        _cio.track(eventName, {
            // Include UTM parameters
            ...utmData,
            // User-provided event data
            ...eventData,
            timestamp: new Date().toISOString()
        });

        console.log(`Customer.io: Tracked event ${eventName}`, eventData);
        return true;
    } catch (error) {
        console.error('Customer.io track failed:', error);
        return false;
    }
}
