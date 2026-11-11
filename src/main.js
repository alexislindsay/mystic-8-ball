/**
 * @file main.js
 * @description Application bootstrap, UI event wiring, and controller coordination.
 */
(function (root) {
    'use strict';
    const ns = (root.Mystic8Ball = root.Mystic8Ball || {});

    function refreshChronicleUI() {
        ns.chronicleView.renderHistoryList(ns.store.getFilteredHistory());
        ns.chronicleView.renderStats(ns.store.getHistoryStats());
    }

    function handleModeSelect(mode) {
        const state = ns.store.getState();
        if (ns.store.setMode(mode)) {
            ns.sphereView.renderModeChange(mode, state.isShaking);
        }
    }

    function handleAudioToggle() {
        const enabled = ns.audio.toggleSoundEnabled();
        const iconEl = document.getElementById('audioIcon');
        if (iconEl) {
            iconEl.setAttribute('data-lucide', enabled ? 'volume-2' : 'volume-x');
            iconEl.className = enabled ? 'w-4 h-4 text-blue-400' : 'w-4 h-4 text-slate-500';
            if (window.lucide) window.lucide.createIcons();
        }
    }

    function triggerShake(sourceLabel = 'Unspoken inquiry (Direct shake)') {
        const state = ns.store.getState();
        if (state.isShaking) return;
        ns.store.setShaking(true);

        ns.mobile.initDeviceShakeListener(() => triggerShake('Unspoken inquiry (Device shake)'));

        const questionInput = document.getElementById('questionInput');
        const rawQuestion = questionInput ? questionInput.value.trim() : '';
        const recordedQuestion = rawQuestion.length > 0 ? rawQuestion : sourceLabel;

        ns.sphereView.startSphereShakeAnimation();
        ns.audio.playShakeSound();
        ns.mobile.triggerShakeHaptics();

        const activeMode = state.currentMode;
        const chosen = ns.data.pickRandomAnswer(activeMode);

        setTimeout(() => {
            ns.sphereView.finishSphereShakeAnimation(chosen.dieText);
            ns.audio.playRevealSound(chosen.tone, activeMode);
            ns.mobile.triggerRevealHaptics();

            ns.store.recordReading(recordedQuestion, chosen, activeMode);
            ns.chronicleView.renderReadoutBanner(ns.store.getState().currentReading);
            refreshChronicleUI();

            ns.store.setShaking(false);
        }, 920);
    }

    function toggleClearButton() {
        const input = document.getElementById('questionInput');
        const btn = document.getElementById('clearInputBtn');
        if (!input || !btn) return;
        btn.classList.toggle('hidden', input.value.length === 0);
    }

    function bindEvents() {
        const questionInput = document.getElementById('questionInput');
        const oracleForm = document.getElementById('oracleForm');
        const eightBallContainer = document.getElementById('eightBallContainer');

        document.getElementById('btnModeClassic')?.addEventListener('click', () => handleModeSelect('classic'));
        document.getElementById('btnModeEntropy')?.addEventListener('click', () => handleModeSelect('entropic'));
        document.getElementById('btnAudioToggle')?.addEventListener('click', handleAudioToggle);

        document.getElementById('randomPromptBtn')?.addEventListener('click', () => {
            if (!questionInput) return;
            questionInput.value = ns.data.pickSampleQuestion(questionInput.value);
            toggleClearButton();
            questionInput.focus();
        });

        document.getElementById('clearInputBtn')?.addEventListener('click', () => {
            if (!questionInput) return;
            questionInput.value = '';
            toggleClearButton();
            questionInput.focus();
        });

        questionInput?.addEventListener('input', toggleClearButton);

        oracleForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            triggerShake();
        });

        eightBallContainer?.addEventListener('click', () => triggerShake());
        eightBallContainer?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                triggerShake();
            }
        });

        document.getElementById('copyResultBtn')?.addEventListener('click', () => {
            ns.chronicleView.copyReadingToClipboard(ns.store.getState().currentReading);
        });

        document.getElementById('clearHistoryBtn')?.addEventListener('click', () => {
            ns.store.clearHistoryLog();
            refreshChronicleUI();
        });

        ['all', 'classic', 'entropic'].forEach((filterKey) => {
            const btnId = `filter${filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}`;
            document.getElementById(btnId)?.addEventListener('click', () => {
                ns.store.setFilter(filterKey);
                ns.chronicleView.renderFilterTabs(filterKey);
                ns.chronicleView.renderHistoryList(ns.store.getFilteredHistory());
            });
        });

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && document.activeElement !== questionInput) {
                e.preventDefault();
                triggerShake();
            }
        });
    }

    window.addEventListener('DOMContentLoaded', () => {
        if (window.lucide) window.lucide.createIcons();
        ns.store.initStore();
        refreshChronicleUI();
        bindEvents();
        ns.mobile.initDeviceShakeListener(() => triggerShake('Unspoken inquiry (Device shake)'));
    });
})(window);
