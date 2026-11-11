/**
 * @file storage-service.js
 * @description Manages local persistence of the Oracle Chronicle history.
 */

const STORAGE_KEY = 'mystic8BallHistory_v1';
const MAX_HISTORY_ITEMS = 50;

/**
 * Loads saved history entries from localStorage.
 * @returns {Array<Object>}
 */
export function loadHistoryFromStorage() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return Array.isArray(parsed) ? parsed : [];
        }
    } catch {
        // Ignore storage read errors in restricted environments
    }
    return [];
}

/**
 * Persists the history log array to localStorage (capped at 50 entries).
 * @param {Array<Object>} historyLog
 */
export function saveHistoryToStorage(historyLog) {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(historyLog.slice(0, MAX_HISTORY_ITEMS))
        );
    } catch {
        // Ignore storage quota or private-browsing errors
    }
}
