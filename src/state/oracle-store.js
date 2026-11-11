/**
 * @file oracle-store.js
 * @description Centralized state management for the Mystic 8-Ball application.
 */
(function (root) {
    'use strict';
    const ns = (root.Mystic8Ball = root.Mystic8Ball || {});

    const state = {
        currentMode: 'classic',
        isShaking: false,
        historyFilter: 'all',
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

    function initStore() {
        state.historyLog = ns.storage.loadHistoryFromStorage();
        return getState();
    }

    function getState() {
        return state;
    }

    function setMode(mode) {
        if (state.currentMode === mode) return false;
        state.currentMode = mode;
        return true;
    }

    function setShaking(shaking) {
        state.isShaking = Boolean(shaking);
    }

    function setFilter(filter) {
        state.historyFilter = filter;
    }

    function recordReading(question, answerObj, mode) {
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

        ns.storage.saveHistoryToStorage(state.historyLog);
        return entry;
    }

    function clearHistoryLog() {
        state.historyLog = [];
        ns.storage.saveHistoryToStorage(state.historyLog);
    }

    function getHistoryStats() {
        const log = state.historyLog;
        return {
            total: log.length,
            positive: log.filter((item) => item.tone === 'positive').length,
            hazy: log.filter((item) => item.tone === 'hazy').length,
            negative: log.filter((item) => item.tone === 'negative').length
        };
    }

    function getFilteredHistory() {
        if (state.historyFilter === 'all') return state.historyLog;
        return state.historyLog.filter((item) => item.mode === state.historyFilter);
    }

    ns.store = {
        initStore,
        getState,
        setMode,
        setShaking,
        setFilter,
        recordReading,
        clearHistoryLog,
        getHistoryStats,
        getFilteredHistory
    };
})(window);
