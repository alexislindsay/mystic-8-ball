/**
 * @file storage-service.js
 * @description Manages local persistence of the Oracle Chronicle history.
 */
(function (root) {
    'use strict';
    const ns = (root.Mystic8Ball = root.Mystic8Ball || {});

    const STORAGE_KEY = 'mystic8BallHistory_v1';
    const MAX_HISTORY_ITEMS = 50;

    function loadHistoryFromStorage() {
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

    function saveHistoryToStorage(historyLog) {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(historyLog.slice(0, MAX_HISTORY_ITEMS))
            );
        } catch {
            // Ignore storage quota or private-browsing errors
        }
    }

    ns.storage = { loadHistoryFromStorage, saveHistoryToStorage };
})(window);
