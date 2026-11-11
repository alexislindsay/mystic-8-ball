/**
 * @file oracle-store.js
 * @description Centralized state management for the Mystic 8-Ball application.
 */

import { loadHistoryFromStorage, saveHistoryToStorage } from '../services/storage-service.js';

const state = {
    currentMode: 'classic', // 'classic' | 'entropic'
    isShaking: false,
    historyFilter: 'all', // 'all' | 'classic' | 'entropic'
    currentReading: {
        question: 'No question inscribed yet.',
        dieText: 'SHAKE OR TAP TO CONSULT',
        fullText: 'The dark-blue depths are still. Ask a question or tap the sphere.',
        label: 'Awaiting Inquiry',
        tone: 'neutral',
        mode: 'classic'
    },
    historyLog: []
};

/**
 * Hydrates initial history state from localStorage.
 */
export function initStore() {
    state.historyLog = loadHistoryFromStorage();
    return getState();
}

/**
 * Returns a snapshot of the current store state.
 */
export function getState() {
    return state;
}

/**
 * Updates the active Oracle mode ('classic' | 'entropic').
 * @param {'classic' | 'entropic'} mode
 * @returns {boolean} True if mode changed
 */
export function setMode(mode) {
    if (state.currentMode === mode) return false;
    state.currentMode = mode;
    return true;
}

/**
 * Sets whether the sphere is currently executing a shake animation.
 * @param {boolean} shaking
 */
export function setShaking(shaking) {
    state.isShaking = Boolean(shaking);
}

/**
 * Updates the active history filter tab.
 * @param {'all' | 'classic' | 'entropic'} filter
 */
export function setFilter(filter) {
    state.historyFilter = filter;
}

/**
 * Records a newly surfaced revelation into currentReading and historyLog.
 * @param {string} question
 * @param {{dieText: string, fullText: string, tone: string, label: string}} answerObj
 * @param {'classic' | 'entropic'} mode
 */
export function recordReading(question, answerObj, mode) {
    state.currentReading = {
        question,
        dieText: answerObj.dieText,
        fullText: answerObj.fullText,
        label: answerObj.label,
        tone: answerObj.tone,
        mode
    };

    const entry = {
        id: Date.now() + Math.random().toString(36).substring(2, 6),
        question,
        dieText: answerObj.dieText,
        fullText: answerObj.fullText,
        tone: answerObj.tone,
        label: answerObj.label,
        mode,
        timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    };

    state.historyLog.unshift(entry);
    if (state.historyLog.length > 50) {
        state.historyLog.pop();
    }

    saveHistoryToStorage(state.historyLog);
    return entry;
}

/**
 * Clears all entries from the history log.
 */
export function clearHistoryLog() {
    state.historyLog = [];
    saveHistoryToStorage(state.historyLog);
}

/**
 * Computes aggregate counts across the history log.
 */
export function getHistoryStats() {
    const log = state.historyLog;
    return {
        total: log.length,
        positive: log.filter(item => item.tone === 'positive').length,
        hazy: log.filter(item => item.tone === 'hazy').length,
        negative: log.filter(item => item.tone === 'negative').length
    };
}

/**
 * Returns the history log filtered by the active filter tab.
 */
export function getFilteredHistory() {
    if (state.historyFilter === 'all') return state.historyLog;
    return state.historyLog.filter(item => item.mode === state.historyFilter);
}
