/**
 * @file mobile-bridge.js
 * @description Bridges Capacitor / Android native features (device shake accelerometer & haptics)
 * with progressive web fallbacks so the app feels native on Google Play Store devices.
 */

const SHAKE_THRESHOLD = 16.5; // m/s^2 delta threshold for physical shake
const SHAKE_COOLDOWN_MS = 1400;

let lastShakeTime = 0;
let lastAccel = { x: null, y: null, z: null };
let motionListenerAttached = false;

/**
 * Triggers tactile haptic feedback during sphere agitation (Capacitor Haptics or Web Vibration API).
 */
export async function triggerShakeHaptics() {
    try {
        const capHaptics = window.Capacitor?.Plugins?.Haptics;
        if (capHaptics) {
            await capHaptics.impact({ style: 'HEAVY' });
            setTimeout(() => capHaptics.impact({ style: 'MEDIUM' }), 240);
            setTimeout(() => capHaptics.impact({ style: 'LIGHT' }), 480);
            return;
        }
        if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
            navigator.vibrate([45, 160, 40, 160, 30]);
        }
    } catch {
        // Ignore haptics errors on unsupported devices
    }
}

/**
 * Triggers a subtle haptic pulse when the floating die surfaces.
 */
export async function triggerRevealHaptics() {
    try {
        const capHaptics = window.Capacitor?.Plugins?.Haptics;
        if (capHaptics) {
            await capHaptics.notification({ type: 'SUCCESS' });
            return;
        }
        if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
            navigator.vibrate(25);
        }
    } catch {
        // Ignore haptics errors
    }
}

/**
 * Initializes physical device shake detection via DeviceMotionEvent.
 * @param {Function} onShakeDetected Callback invoked when user shakes their phone
 */
export async function initDeviceShakeListener(onShakeDetected) {
    if (motionListenerAttached || typeof window === 'undefined' || !('DeviceMotionEvent' in window)) {
        return false;
    }

    // Handle iOS/WebView explicit permission request if required
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        try {
            const state = await DeviceMotionEvent.requestPermission();
            if (state !== 'granted') return false;
        } catch {
            return false;
        }
    }

    window.addEventListener(
        'devicemotion',
        (event) => {
            const acc = event.accelerationIncludingGravity || event.acceleration;
            if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

            if (lastAccel.x !== null) {
                const deltaX = Math.abs(acc.x - lastAccel.x);
                const deltaY = Math.abs(acc.y - lastAccel.y);
                const deltaZ = Math.abs(acc.z - lastAccel.z);

                if (deltaX + deltaY + deltaZ > SHAKE_THRESHOLD) {
                    const now = Date.now();
                    if (now - lastShakeTime > SHAKE_COOLDOWN_MS) {
                        lastShakeTime = now;
                        onShakeDetected();
                    }
                }
            }

            lastAccel = { x: acc.x, y: acc.y, z: acc.z };
        },
        { passive: true }
    );

    motionListenerAttached = true;
    return true;
}
