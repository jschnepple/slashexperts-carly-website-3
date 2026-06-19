/**
 * UTM Parameter Tracking Utility
 * Captures and persists UTM parameters and click IDs for marketing attribution
 *
 * Features:
 * - Captures UTM params: utm_source, utm_medium, utm_campaign, utm_content, utm_term
 * - Captures click IDs: gclid (Google), fbclid (Facebook), msclkid (Microsoft), li_fat_id (LinkedIn)
 * - Uses sessionStorage for persistence across page navigation
 * - "First touch wins" attribution with 30-minute re-attribution window
 *
 * Usage:
 *   import { getUtmData, flattenUtmForPayload, initUtmTracking } from '../components/utm.js';
 *
 *   // Get current UTM data
 *   const utmData = getUtmData();
 *
 *   // Flatten for form payloads
 *   const payload = { ...formData, ...flattenUtmForPayload(getUtmData()) };
 */

const STORAGE_KEY = 'slashexperts_utm';
const ATTRIBUTION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

// UTM parameters to capture
const UTM_PARAMS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term'
];

// Click IDs to capture
const CLICK_ID_PARAMS = [
    'gclid',      // Google Ads
    'fbclid',     // Facebook/Meta
    'msclkid',    // Microsoft Ads
    'li_fat_id'   // LinkedIn
];

/**
 * Parse UTM parameters and click IDs from current URL
 * @returns {Object|null} Object with captured params, or null if none found
 */
export function parseUtmFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const captured = {};
    let hasParams = false;

    // Capture UTM parameters
    UTM_PARAMS.forEach(param => {
        const value = params.get(param);
        if (value) {
            captured[param] = value;
            hasParams = true;
        }
    });

    // Capture click IDs
    CLICK_ID_PARAMS.forEach(param => {
        const value = params.get(param);
        if (value) {
            captured[param] = value;
            hasParams = true;
        }
    });

    return hasParams ? captured : null;
}

/**
 * Get stored UTM data from sessionStorage
 * Returns null if expired (past 30-minute re-attribution window)
 * @returns {Object|null} Stored UTM data with timestamp, or null
 */
export function getStoredUtm() {
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        const data = JSON.parse(stored);

        // Check if data has expired for re-attribution purposes
        // Note: We still return the data, but allow new params to override
        return data;
    } catch (error) {
        console.warn('UTM: Error reading from sessionStorage', error);
        return null;
    }
}

/**
 * Store UTM data in sessionStorage with timestamp
 * @param {Object} utmData - UTM parameters to store
 */
export function storeUtm(utmData) {
    try {
        const dataToStore = {
            ...utmData,
            captured_at: new Date().toISOString(),
            captured_timestamp: Date.now()
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
        console.warn('UTM: Error writing to sessionStorage', error);
    }
}

/**
 * Check if stored UTM data is within the re-attribution window
 * @param {Object} storedData - Data from sessionStorage
 * @returns {boolean} True if within 30-minute window (should not override)
 */
function isWithinAttributionWindow(storedData) {
    if (!storedData || !storedData.captured_timestamp) return false;
    const elapsed = Date.now() - storedData.captured_timestamp;
    return elapsed < ATTRIBUTION_TIMEOUT_MS;
}

/**
 * Main function: Get UTM data from URL or storage
 * Implements "first touch wins" with 30-minute re-attribution timeout
 * @returns {Object|null} UTM data object or null if none available
 */
export function getUtmData() {
    const urlParams = parseUtmFromUrl();
    const storedParams = getStoredUtm();

    // If we have URL params
    if (urlParams) {
        // Check if we should override stored params (outside attribution window)
        if (!storedParams || !isWithinAttributionWindow(storedParams)) {
            // Store new params
            storeUtm(urlParams);
            return {
                ...urlParams,
                captured_at: new Date().toISOString()
            };
        }
        // Within attribution window - keep original first touch
        return storedParams;
    }

    // No URL params - return stored if available
    return storedParams;
}

/**
 * Flatten UTM data for form payloads
 * Removes internal tracking fields (captured_timestamp) and formats for webhook/CIO
 * @param {Object|null} utmData - UTM data object from getUtmData()
 * @returns {Object} Flattened object ready for payload spreading
 */
export function flattenUtmForPayload(utmData) {
    if (!utmData) return {};

    const payload = {};

    // Copy UTM params
    UTM_PARAMS.forEach(param => {
        if (utmData[param]) {
            payload[param] = utmData[param];
        }
    });

    // Copy click IDs
    CLICK_ID_PARAMS.forEach(param => {
        if (utmData[param]) {
            payload[param] = utmData[param];
        }
    });

    // Include capture timestamp if available
    if (utmData.captured_at) {
        payload.utm_captured_at = utmData.captured_at;
    }

    return payload;
}

/**
 * Initialize UTM tracking on page load
 * Should be called early in the page lifecycle to capture params before navigation
 */
export function initUtmTracking() {
    // Check for UTM params in URL and store if needed
    const urlParams = parseUtmFromUrl();
    const storedParams = getStoredUtm();

    if (urlParams) {
        // Only store if outside attribution window or no existing data
        if (!storedParams || !isWithinAttributionWindow(storedParams)) {
            storeUtm(urlParams);
            console.log('UTM: Captured new parameters', urlParams);
        } else {
            console.log('UTM: Within attribution window, keeping original first touch');
        }
    }
}

/**
 * Clear stored UTM data (useful for testing)
 */
export function clearUtmData() {
    try {
        sessionStorage.removeItem(STORAGE_KEY);
        console.log('UTM: Cleared stored data');
    } catch (error) {
        console.warn('UTM: Error clearing sessionStorage', error);
    }
}

/**
 * Debug helper: Get current UTM state
 * @returns {Object} Current state including URL params, stored params, and effective params
 */
export function debugUtmState() {
    return {
        urlParams: parseUtmFromUrl(),
        storedParams: getStoredUtm(),
        effectiveParams: getUtmData(),
        isWithinWindow: isWithinAttributionWindow(getStoredUtm())
    };
}
