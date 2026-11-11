/**
 * @file oracle-answers.js
 * @description Domain datasets for Classic 8-Ball answers, Philosophical/Entropic answers, and sample prompts.
 */
(function (root) {
    'use strict';
    const ns = (root.Mystic8Ball = root.Mystic8Ball || {});

    const CLASSIC_ANSWERS = [
        // 10 Affirmative
        { dieText: "IT IS CERTAIN", fullText: "It is certain.", tone: "positive", label: "Affirmative" },
        { dieText: "DECIDEDLY SO", fullText: "It is decidedly so.", tone: "positive", label: "Affirmative" },
        { dieText: "WITHOUT A DOUBT", fullText: "Without a doubt.", tone: "positive", label: "Affirmative" },
        { dieText: "YES DEFINITELY", fullText: "Yes — definitely.", tone: "positive", label: "Affirmative" },
        { dieText: "RELY ON IT", fullText: "You may rely on it.", tone: "positive", label: "Affirmative" },
        { dieText: "AS I SEE IT YES", fullText: "As I see it, yes.", tone: "positive", label: "Affirmative" },
        { dieText: "MOST LIKELY", fullText: "Most likely.", tone: "positive", label: "Affirmative" },
        { dieText: "OUTLOOK GOOD", fullText: "Outlook good.", tone: "positive", label: "Affirmative" },
        { dieText: "YES", fullText: "Yes.", tone: "positive", label: "Affirmative" },
        { dieText: "SIGNS POINT TO YES", fullText: "Signs point to yes.", tone: "positive", label: "Affirmative" },
        // 5 Non-Committal / Hazy
        { dieText: "REPLY HAZY TRY AGAIN", fullText: "Reply hazy, try again.", tone: "hazy", label: "Uncertain" },
        { dieText: "ASK AGAIN LATER", fullText: "Ask again later.", tone: "hazy", label: "Uncertain" },
        { dieText: "BETTER NOT TELL NOW", fullText: "Better not tell you now.", tone: "hazy", label: "Uncertain" },
        { dieText: "CANNOT PREDICT NOW", fullText: "Cannot predict now.", tone: "hazy", label: "Uncertain" },
        { dieText: "CONCENTRATE & ASK AGAIN", fullText: "Concentrate and ask again.", tone: "hazy", label: "Uncertain" },
        // 5 Negative
        { dieText: "DON'T COUNT ON IT", fullText: "Don't count on it.", tone: "negative", label: "Contrary" },
        { dieText: "MY REPLY IS NO", fullText: "My reply is no.", tone: "negative", label: "Contrary" },
        { dieText: "MY SOURCES SAY NO", fullText: "My sources say no.", tone: "negative", label: "Contrary" },
        { dieText: "OUTLOOK NOT SO GOOD", fullText: "Outlook not so good.", tone: "negative", label: "Contrary" },
        { dieText: "VERY DOUBTFUL", fullText: "Very doubtful.", tone: "negative", label: "Contrary" }
    ];

    const ENTROPIC_ANSWERS = [
        { dieText: "ENTROPY FAVORS IT", fullText: "Entropy favors this trajectory; disorder aligns with your desire.", tone: "positive", label: "Cosmological Alignment" },
        { dieText: "WAVEFUNCTION COLLAPSED", fullText: "The wavefunction has already collapsed in your favor.", tone: "positive", label: "Quantum Certainty" },
        { dieText: "INEVITABLE ATTRACTOR", fullText: "All phase-space paths converge upon this inevitable attractor.", tone: "positive", label: "Deterministic Yes" },
        { dieText: "THE VOID CONSENTS", fullText: "The abyss gazes back and offers a silent nod of consent.", tone: "positive", label: "Existential Affirmation" },
        { dieText: "CAUSALITY PERMITS", fullText: "Local causality permits this outcome without paradox.", tone: "positive", label: "Temporal Harmony" },
        { dieText: "BIFURCATION POINT NEAR", fullText: "You stand at a chaotic bifurcation; the smallest action tips the scale.", tone: "hazy", label: "Chaotic Equilibrium" },
        { dieText: "SUPERPOSITION PERSISTS", fullText: "Both yes and no coexist until your action forces observation.", tone: "hazy", label: "Uncollapsed State" },
        { dieText: "OBSERVER ALTERS OUTCOME", fullText: "Asking the question has already perturbed the outcome.", tone: "hazy", label: "Heisenberg Paradox" },
        { dieText: "MEANING IS SELF-FORGED", fullText: "The cosmos is indifferent; you must author the answer yourself.", tone: "hazy", label: "Absurdist Freedom" },
        { dieText: "TIME IS A FLAT CIRCLE", fullText: "What will happen has already happened; proceed as you always have.", tone: "hazy", label: "Eternal Recurrence" },
        { dieText: "THERMAL NOISE ONLY", fullText: "Your inquiry dissolves into stochastic background radiation.", tone: "hazy", label: "Stochastic Drift" },
        { dieText: "HEAT DEATH PRECEDES IT", fullText: "The universe will reach thermodynamic equilibrium before that occurs.", tone: "negative", label: "Entropic Decay" },
        { dieText: "SECOND LAW FORBIDS IT", fullText: "The Second Law of Thermodynamics strictly forbids this reversal.", tone: "negative", label: "Irreversible No" },
        { dieText: "LOST BEYOND HORIZON", fullText: "That possibility has slipped past the event horizon forever.", tone: "negative", label: "Gravitational No" },
        { dieText: "VACUUM DECAY LIKELIER", fullText: "False vacuum decay is statistically more probable than this.", tone: "negative", label: "Cosmic Improbability" },
        { dieText: "DISSIPATED INTO ETHER", fullText: "The energy required to sustain this outcome has already dissipated.", tone: "negative", label: "Thermodynamic Loss" }
    ];

    const SAMPLE_QUESTIONS = [
        "Will this creative project succeed beyond expectations?",
        "Should I take the leap into the unknown this week?",
        "Is free will an illusion or a lived reality?",
        "Are the stars aligned for a bold career move?",
        "Will clarity arrive if I wait one more day?",
        "Does the universe favor audacity right now?"
    ];

    function pickRandomAnswer(mode) {
        const pool = mode === 'classic' ? CLASSIC_ANSWERS : ENTROPIC_ANSWERS;
        return pool[Math.floor(Math.random() * pool.length)];
    }

    function pickSampleQuestion(currentValue = '') {
        let candidates = SAMPLE_QUESTIONS.filter((q) => q !== currentValue);
        if (candidates.length === 0) candidates = SAMPLE_QUESTIONS;
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    ns.data = { CLASSIC_ANSWERS, ENTROPIC_ANSWERS, SAMPLE_QUESTIONS, pickRandomAnswer, pickSampleQuestion };
})(window);
