/**
 * @file chronicle-view.js
 * @description Renders the live readout banner, Oracle Chronicle history log, statistics bar, and clipboard copy.
 */
(function (root) {
    'use strict';
    const ns = (root.Mystic8Ball = root.Mystic8Ball || {});

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function refreshLucideIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    function renderReadoutBanner(reading) {
        const dot = document.getElementById('readoutCategoryDot');
        const label = document.getElementById('readoutCategoryLabel');
        const fullAnswer = document.getElementById('readoutFullAnswer');
        const questionEcho = document.getElementById('readoutQuestionEcho');

        label.textContent = `${reading.mode === 'classic' ? 'Classic Oracle' : 'Entropic Oracle'} • ${reading.label}`;
        fullAnswer.textContent = `"${reading.fullText}"`;
        questionEcho.textContent = `Asked: "${reading.question}"`;

        if (reading.tone === 'positive') {
            dot.className = 'w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]';
        } else if (reading.tone === 'hazy') {
            dot.className = 'w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]';
        } else {
            dot.className = 'w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]';
        }
    }

    function renderStats(stats) {
        document.getElementById('statTotal').textContent = stats.total;
        document.getElementById('statAffirmative').textContent = stats.positive;
        document.getElementById('statHazy').textContent = stats.hazy;
        document.getElementById('statNegative').textContent = stats.negative;
    }

    function renderFilterTabs(activeFilter) {
        const tabs = {
            all: document.getElementById('filterAll'),
            classic: document.getElementById('filterClassic'),
            entropic: document.getElementById('filterEntropic')
        };

        Object.keys(tabs).forEach((key) => {
            if (!tabs[key]) return;
            tabs[key].className = key === activeFilter
                ? 'px-2.5 py-1 rounded-md bg-slate-800 text-white font-medium transition'
                : 'px-2.5 py-1 rounded-md text-slate-400 hover:text-slate-200 transition';
        });
    }

    function renderHistoryList(entries) {
        const listEl = document.getElementById('historyList');
        if (!listEl) return;

        if (entries.length === 0) {
            listEl.innerHTML = `
                <div class="h-56 flex flex-col items-center justify-center text-center px-4 text-slate-500">
                    <div class="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 text-slate-600">
                        <i data-lucide="compass" class="w-5 h-5"></i>
                    </div>
                    <p class="text-xs font-medium text-slate-400">No revelations recorded yet</p>
                    <p class="text-[11px] text-slate-500 mt-1 max-w-[220px]">
                        Ask a question, tap the 8-Ball, or shake your device to surface your first answer.
                    </p>
                </div>
            `;
            refreshLucideIcons();
            return;
        }

        listEl.innerHTML = entries.map((item) => {
            let badgeClasses = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25';
            if (item.tone === 'hazy') {
                badgeClasses = 'bg-amber-500/10 text-amber-300 border-amber-500/25';
            } else if (item.tone === 'negative') {
                badgeClasses = 'bg-purple-500/10 text-purple-300 border-purple-500/25';
            }

            const modeTag = item.mode === 'classic'
                ? '<span class="text-[10px] font-mono text-blue-400">Classic</span>'
                : '<span class="text-[10px] font-mono text-purple-400">Entropic</span>';

            return `
                <div class="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700/80 transition group">
                    <div class="flex items-center justify-between gap-2 mb-1.5">
                        <div class="flex items-center gap-2">
                            ${modeTag}
                            <span class="text-slate-600">&bull;</span>
                            <span class="text-[10px] font-mono text-slate-500">${escapeHtml(item.timestamp)}</span>
                        </div>
                        <span class="text-[10px] font-mono px-2 py-0.5 rounded-full border ${badgeClasses}">
                            ${escapeHtml(item.dieText)}
                        </span>
                    </div>
                    <p class="text-xs text-slate-300 font-medium line-clamp-2 mb-1">
                        Q: "${escapeHtml(item.question)}"
                    </p>
                    <p class="text-xs text-blue-200/90 italic">
                        &rarr; ${escapeHtml(item.fullText)}
                    </p>
                </div>
            `;
        }).join('');
    }

    async function copyReadingToClipboard(currentReading) {
        const textToCopy = `🎱 Mystic 8-Ball (${currentReading.mode.toUpperCase()}): "${currentReading.question}" → ${currentReading.fullText} [${currentReading.dieText}]`;

        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                const tempInput = document.createElement('textarea');
                tempInput.value = textToCopy;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
            }
        } catch {
            // Ignore clipboard errors
        }

        const copyBtnText = document.getElementById('copyBtnText');
        if (copyBtnText) {
            const originalText = copyBtnText.textContent;
            copyBtnText.textContent = 'Copied!';
            setTimeout(() => {
                copyBtnText.textContent = originalText;
            }, 1600);
        }
    }

    ns.chronicleView = {
        renderReadoutBanner,
        renderStats,
        renderFilterTabs,
        renderHistoryList,
        copyReadingToClipboard
    };
})(window);
