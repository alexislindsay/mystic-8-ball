/**
 * @file sphere-view.js
 * @description Renders 3D sphere visual states, mode transitions, liquid bubbles, and icosahedron die animations.
 */
(function (root) {
    'use strict';
    const ns = (root.Mystic8Ball = root.Mystic8Ball || {});

    function spawnBubbles(count = 12) {
        const container = document.getElementById('bubbleContainer');
        if (!container) return;

        for (let i = 0; i < count; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'liquid-bubble';
            const size = Math.floor(Math.random() * 9) + 4;
            const left = Math.floor(Math.random() * 76) + 12;
            const bottom = Math.floor(Math.random() * 35) + 5;
            const drift = `${(Math.random() * 40 - 20).toFixed(0)}px`;
            const delay = `${(Math.random() * 0.45).toFixed(2)}s`;

            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${left}%`;
            bubble.style.bottom = `${bottom}%`;
            bubble.style.setProperty('--drift', drift);
            bubble.style.animationDelay = delay;

            container.appendChild(bubble);

            setTimeout(() => {
                bubble.remove();
            }, 1750);
        }
    }

    function renderModeChange(mode, isShaking) {
        const btnClassic = document.getElementById('btnModeClassic');
        const btnEntropy = document.getElementById('btnModeEntropy');
        const modeBadge = document.getElementById('modeBadge');
        const pedestalGlow = document.getElementById('pedestalGlow');

        if (mode === 'classic') {
            btnClassic.className = 'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 bg-blue-600 text-white shadow-md shadow-blue-600/30';
            btnEntropy.className = 'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 text-slate-400 hover:text-slate-200';
            modeBadge.textContent = 'Classic Mode';
            modeBadge.className = 'text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30';
            pedestalGlow.className = 'absolute -bottom-3 w-56 sm:w-72 h-10 bg-blue-600/20 rounded-full blur-2xl pointer-events-none transition-all duration-700';
        } else {
            btnEntropy.className = 'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 bg-purple-600 text-white shadow-md shadow-purple-600/30';
            btnClassic.className = 'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 text-slate-400 hover:text-slate-200';
            modeBadge.textContent = 'Entropic Mode';
            modeBadge.className = 'text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30';
            pedestalGlow.className = 'absolute -bottom-3 w-56 sm:w-72 h-10 bg-purple-600/25 rounded-full blur-2xl pointer-events-none transition-all duration-700';
        }

        if (!isShaking) {
            const dieWrapper = document.getElementById('dieWrapper');
            const dieText = document.getElementById('dieAnswerText');
            dieWrapper.classList.remove('die-surfaced');
            dieWrapper.classList.add('die-submerged');
            spawnBubbles(6);

            setTimeout(() => {
                dieText.textContent = mode === 'classic' ? 'CLASSIC FATE READY' : 'ENTROPY ENGINE READY';
                const randomAngle = (Math.random() * 14 - 7).toFixed(1);
                dieWrapper.style.transform = `scale(1) rotate(${randomAngle}deg)`;
                dieWrapper.classList.remove('die-submerged');
                dieWrapper.classList.add('die-surfaced');
            }, 420);
        }
    }

    function startSphereShakeAnimation() {
        const ball = document.getElementById('eightBallContainer');
        const dieWrapper = document.getElementById('dieWrapper');
        const liquidSwirl = document.getElementById('liquidSwirl');
        const shakeBtn = document.getElementById('shakeSubmitBtn');

        shakeBtn.disabled = true;
        shakeBtn.classList.add('opacity-60');

        dieWrapper.classList.remove('die-surfaced');
        dieWrapper.classList.add('die-submerged');

        liquidSwirl.classList.add('agitated');
        ball.classList.remove('shaking');
        void ball.offsetWidth;
        ball.classList.add('shaking');

        spawnBubbles(16);
    }

    function finishSphereShakeAnimation(dieTextStr) {
        const ball = document.getElementById('eightBallContainer');
        const dieWrapper = document.getElementById('dieWrapper');
        const liquidSwirl = document.getElementById('liquidSwirl');
        const shakeBtn = document.getElementById('shakeSubmitBtn');
        const dieText = document.getElementById('dieAnswerText');

        dieText.textContent = dieTextStr;

        const restingTilt = (Math.random() * 18 - 9).toFixed(1);
        dieWrapper.style.transform = `scale(1) rotate(${restingTilt}deg)`;

        liquidSwirl.classList.remove('agitated');
        ball.classList.remove('shaking');
        spawnBubbles(8);

        dieWrapper.classList.remove('die-submerged');
        dieWrapper.classList.add('die-surfaced');

        shakeBtn.disabled = false;
        shakeBtn.classList.remove('opacity-60');
    }

    ns.sphereView = {
        spawnBubbles,
        renderModeChange,
        startSphereShakeAnimation,
        finishSphereShakeAnimation
    };
})(window);
