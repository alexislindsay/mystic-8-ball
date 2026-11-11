/**
 * @file main.js
 * @description Application bootstrap, UI event wiring, and controller coordination.
 */

import { pickRandomAnswer, pickSampleQuestion } from './data/oracle-answers.js';
import { toggleSoundEnabled, playShakeSound, playRevealSound } from './services/audio-service.js';
import { initDeviceShakeListener, triggerShakeHaptics, triggerRevealHaptics } from './services/mobile-bridge.js';
import {
    initStore,
    getState,
    setMode,
    setShaking,
    setFilter,
    recordReading,
    clearHistoryLog,
    getHistoryStats,
    getFilteredHistory
} from './state/oracle-store.js';
import {
    renderModeChange,
    startSphereShakeAnimation,
    finishSphereShakeAnimation
} from './ui/sphere-view.js';
import {
    renderReadoutBanner,
    renderStats,
    renderFilterTabs,
    renderHistoryList,
    copyReadingToClipboard
} from './ui/chronicle-view.js';

function refreshChronicleUI() {
    renderHistoryList(getFilteredHistory());
    renderStats(getHistoryStats());
}

export function handleModeSelect(mode) {
    const state = getState();
    if (setMode(mode)) {
        renderModeChange(mode, state.isShaking);
    }
}

export function handleAudioToggle() {
    const enabled = toggleSoundEnabled();
    const iconEl = document.getElementById('audioIcon');
    if (iconEl) {
        iconEl.setAttribute('data-lucide', enabled ? 'volume-2' : 'volume-x');
        iconEl.className = enabled ? 'w-4 h-4 text-blue-400' : 'w-4 h-4 text-slate-500';
        if (window.lucide) window.lucide.createIcons();
    }
}

export function triggerShake(sourceLabel = 'Unspoken inquiry (Direct shake)') {
    const state = getState();
    if (state.isShaking) return;
    setShaking(true);

    // Ensure device motion listener is active after first user interaction
    initDeviceShakeListener(() => triggerShake('Unspoken inquiry (Device shake)'));

    const questionInput = document.getElementById('questionInput');
    const rawQuestion = questionInput ? questionInput.value.trim() : '';
    const recordedQuestion = rawQuestion.length > 0 ? rawQuestion : sourceLabel;

    startSphereShakeAnimation();
    playShakeSound();
    triggerShakeHaptics();

    const activeMode = state.currentMode;
    const chosen = pickRandomAnswer(activeMode);

    setTimeout(() => {
        finishSphereShakeAnimation(chosen.dieText);
        playRevealSound(chosen.tone, activeMode);
        triggerRevealHaptics();

        recordReading(recordedQuestion, chosen, activeMode);
        renderReadoutBanner(getState().currentReading);
        refreshChronicleUI();

        setShaking(false);
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
        questionInput.value = pickSampleQuestion(questionInput.value);
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
        copyReadingToClipboard(getState().currentReading);
    });

    document.getElementById('clearHistoryBtn')?.addEventListener('click', () => {
        clearHistoryLog();
        refreshChronicleUI();
    });

    ['all', 'classic', 'entropic'].forEach((filterKey) => {
        const btnId = `filter${filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}`;
        document.getElementById(btnId)?.addEventListener('click', () => {
            setFilter(filterKey);
            renderFilterTabs(filterKey);
            renderHistoryList(getFilteredHistory());
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
    initStore();
    refreshChronicleUI();
    bindEvents();
    initDeviceShakeListener(() => triggerShake('Unspoken inquiry (Device shake)'));
});
