/**
 * @file audio-service.js
 * @description Synthesizes liquid agitation and mystical reveal chords using the Web Audio API.
 */

let audioCtx = null;
let soundEnabled = true;

function getAudioContext() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

/**
 * Returns whether synthesized sound effects are currently enabled.
 * @returns {boolean}
 */
export function isSoundEnabled() {
    return soundEnabled;
}

/**
 * Toggles sound effects on or off and returns the new state.
 * @returns {boolean}
 */
export function toggleSoundEnabled() {
    soundEnabled = !soundEnabled;
    return soundEnabled;
}

/**
 * Synthesizes sloshing liquid & muffled plastic die agitation during a shake.
 */
export function playShakeSound() {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;

        // 3 rhythmic bandpass noise bursts simulating liquid slosh inside the sphere
        [0, 0.24, 0.48].forEach((offset, idx) => {
            const bufferSize = Math.floor(ctx.sampleRate * 0.22);
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(220 + idx * 65, now + offset);
            filter.Q.setValueAtTime(2.5, now + offset);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.01, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.28, now + offset + 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.21);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            noise.start(now + offset);
            noise.stop(now + offset + 0.22);
        });
    } catch {
        // Ignore audio errors on restricted autoplay contexts
    }
}

/**
 * Synthesizes a mystical resonant chord when the icosahedron surfaces.
 * @param {'positive' | 'hazy' | 'negative'} toneType
 * @param {'classic' | 'entropic'} mode
 */
export function playRevealSound(toneType, mode = 'classic') {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        let freqs = [293.66, 440.0, 587.33]; // Positive D5 resonant fifth
        if (toneType === 'hazy') {
            freqs = [261.63, 311.13, 466.16]; // Suspended minor 7th
        } else if (toneType === 'negative') {
            freqs = [196.00, 233.08, 293.66]; // Deep somber chord
        }

        freqs.forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = mode === 'entropic' ? 'triangle' : 'sine';
            osc.frequency.setValueAtTime(f * 0.96, now);
            osc.frequency.exponentialRampToValueAtTime(f, now + 0.25);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.06 / (i + 1), now + 0.12);
            gain.gain.exponentialRampToValueAtTime(0.0008, now + 1.35);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 1.4);
        });
    } catch {
        // Ignore audio errors
    }
}
