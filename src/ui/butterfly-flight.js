/**
 * @file butterfly-flight.js
 * @description Choreographs the two luminous photorealistic butterflies:
 * 1. On page load, both sit perched on the left and right sloped walls of the glowing white triangle
 *    inside the 8-Ball window (matching the app icon).
 * 2. After a brief moment, they flutter their wings and fly out:
 *    - Left butterfly flies outside the window and lands on the upper-left curve of the 8-Ball sphere.
 *    - Right butterfly flies up and lands on the "Shake" button to highlight user interaction.
 */
(function (root) {
    'use strict';
    const ns = (root.Mystic8Ball = root.Mystic8Ball || {});

    let hasFlownOut = false;
    let resizeFrame = null;

    function getElements() {
        return {
            bfLeft: document.getElementById('butterflyCompanionLeft'),
            bfRight: document.getElementById('butterflyCompanionRight'),
            dieWrapper: document.getElementById('dieWrapper'),
            sphere: document.getElementById('eightBallContainer'),
            shakeBtn: document.getElementById('shakeSubmitBtn')
        };
    }

    /**
     * Positions both butterflies directly on the left & right sloped edges of the white triangle
     * inside the 8-Ball portal window so the initial load matches the app icon.
     */
    function positionInsideWindow() {
        const { bfLeft, bfRight, dieWrapper } = getElements();
        if (!bfLeft || !bfRight || !dieWrapper) return;

        const rect = dieWrapper.getBoundingClientRect();
        const w = rect.width * 0.56;
        const h = rect.height * 0.88;

        // Left butterfly nestled along the left slope of the central triangle
        bfLeft.style.width = `${w}px`;
        bfLeft.style.height = `${h}px`;
        bfLeft.style.left = `${rect.left - w * 0.34}px`;
        bfLeft.style.top = `${rect.top + rect.height * 0.04}px`;
        bfLeft.style.transform = 'rotate(0deg)';

        // Right butterfly nestled along the right slope of the central triangle
        bfRight.style.width = `${w}px`;
        bfRight.style.height = `${h}px`;
        bfRight.style.left = `${rect.right - w * 0.66}px`;
        bfRight.style.top = `${rect.top + rect.height * 0.04}px`;
        bfRight.style.transform = 'rotate(0deg)';
    }

    /**
     * Positions the left butterfly perched on the outer upper-left curve of the 8-Ball sphere,
     * and the right butterfly perched on the interactive "Shake" button.
     */
    function positionAtLandedTargets() {
        const { bfLeft, bfRight, sphere, shakeBtn } = getElements();
        if (!bfLeft || !bfRight || !sphere || !shakeBtn) return;

        const sphereRect = sphere.getBoundingClientRect();
        const btnRect = shakeBtn.getBoundingClientRect();

        // 1. Left Butterfly lands on the upper-left outer rim of the 8-Ball sphere
        const sphereBfW = Math.max(54, sphereRect.width * 0.19);
        const sphereBfH = sphereBfW * 1.55;
        bfLeft.style.width = `${sphereBfW}px`;
        bfLeft.style.height = `${sphereBfH}px`;
        bfLeft.style.left = `${sphereRect.left + sphereRect.width * 0.03}px`;
        bfLeft.style.top = `${sphereRect.top + sphereRect.height * 0.02}px`;
        bfLeft.style.transform = 'rotate(-18deg)';

        // 2. Right Butterfly lands on the top-right edge of the "Shake" button
        const btnBfW = 38;
        const btnBfH = 58;
        bfRight.style.width = `${btnBfW}px`;
        bfRight.style.height = `${btnBfH}px`;
        bfRight.style.left = `${btnRect.right - btnBfW * 0.55}px`;
        bfRight.style.top = `${btnRect.top - btnBfH * 0.62}px`;
        bfRight.style.transform = 'rotate(14deg)';
    }

    /**
     * Triggers the initial takeoff flight from inside the 8-ball window to the 8-ball rim & Shake button.
     */
    function launchOpeningFlight() {
        const { bfLeft, bfRight } = getElements();
        if (!bfLeft || !bfRight) return;

        // Place immediately inside the window without transition first
        bfLeft.style.transition = 'none';
        bfRight.style.transition = 'none';
        bfLeft.classList.add('state-perched-inside');
        bfRight.classList.add('state-perched-inside');
        positionInsideWindow();

        // Force layout reflow
        void bfLeft.offsetWidth;
        bfLeft.style.transition = '';
        bfRight.style.transition = '';

        // After 1.15s of showing the full icon composition inside the 8-ball, fly out!
        setTimeout(() => {
            hasFlownOut = true;
            bfLeft.classList.remove('state-perched-inside');
            bfRight.classList.remove('state-perched-inside');
            bfLeft.classList.add('state-flying');
            bfRight.classList.add('state-flying');

            positionAtLandedTargets();

            // Settle into gentle resting wing-flap upon landing
            setTimeout(() => {
                bfLeft.classList.remove('state-flying');
                bfRight.classList.remove('state-flying');
                bfLeft.classList.add('state-landed');
                bfRight.classList.add('state-landed');
            }, 2150);
        }, 1150);
    }

    /**
     * Triggers an excited flutter when the user shakes the 8-Ball.
     */
    function flutterOnShake() {
        const { bfLeft, bfRight } = getElements();
        if (!bfLeft || !bfRight || !hasFlownOut) return;

        bfLeft.classList.remove('state-landed');
        bfRight.classList.remove('state-landed');
        bfLeft.classList.add('state-flying');
        bfRight.classList.add('state-flying');

        setTimeout(() => {
            bfLeft.classList.remove('state-flying');
            bfRight.classList.remove('state-flying');
            bfLeft.classList.add('state-landed');
            bfRight.classList.add('state-landed');
        }, 950);
    }

    function initButterflyCompanions() {
        launchOpeningFlight();

        const syncPositions = () => {
            if (resizeFrame) cancelAnimationFrame(resizeFrame);
            resizeFrame = requestAnimationFrame(() => {
                const { bfLeft, bfRight } = getElements();
                if (!bfLeft || !bfRight) return;
                bfLeft.style.transition = 'none';
                bfRight.style.transition = 'none';
                if (hasFlownOut) {
                    positionAtLandedTargets();
                } else {
                    positionInsideWindow();
                }
                void bfLeft.offsetWidth;
                bfLeft.style.transition = '';
                bfRight.style.transition = '';
            });
        };

        window.addEventListener('resize', syncPositions, { passive: true });
        window.addEventListener('scroll', syncPositions, { passive: true });
    }

    ns.butterflies = {
        initButterflyCompanions,
        flutterOnShake
    };
})(window);
