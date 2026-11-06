/**
 * AgriTrace Algorithm Story Reel Controller
 * 
 * Drives the aesthetic, animated short-video story reel showing
 * the 5-step Farm-to-Fork Web3 + AI workflow with animated characters.
 */

(function () {
    "use strict";

    const STEPS = [
        {
            id: 1,
            title: "Farm Origin & IoT Genesis",
            phaseTag: "01 • Origin",
            characterName: "Farmer Arumugam",
            characterRole: "Organic Cultivator",
            characterEmoji: "👨‍🌾",
            quote: "“I record freshly harvested organic tomatoes at dawn. IoT sensors log 24.5°C & 68% RH, automatically anchoring Lot #LOT-2026 to the blockchain ledger.”",
            actionText: "View Produce Origin ➔",
            actionHash: "#trace",
            sceneId: "scene-origin"
        },
        {
            id: 2,
            title: "AI Quality Grading Engine",
            phaseTag: "02 • AI Inspection",
            characterName: "Dr. Priya Raman",
            characterRole: "AI Quality Auditor",
            characterEmoji: "🔬",
            quote: "“Our Kaggle neural vision model scans skin texture and firmness in milliseconds: Grade-A certified with a 98.4% freshness index & zero tampering!”",
            actionText: "Inspect AI Quality ➔",
            actionHash: "#verify",
            sceneId: "scene-ai"
        },
        {
            id: 3,
            title: "Cold-Chain IoT Logistics",
            phaseTag: "03 • Cold Transit",
            characterName: "Murugan",
            characterRole: "Cold-Chain Courier",
            characterEmoji: "🚚",
            quote: "“My reefer truck locks temperature at 4.2°C. Live BLE sensors stream telemetry to Ethereum. If cold chain ever breaks, the smart contract flags it instantly.”",
            actionText: "Track IoT Sensors ➔",
            actionHash: "#iot",
            sceneId: "scene-transit"
        },
        {
            id: 4,
            title: "Algorithmic Market & Escrow",
            phaseTag: "04 • Fair Escrow",
            characterName: "Lakshmi",
            characterRole: "Co-Op Exchange Director",
            characterEmoji: "🏪",
            quote: "“Algorithmic pricing cuts out predatory middlemen! Smart contract escrow unlocks fair ₹34.50/kg rates and instant +500 AgriPoints rewards to the farmer.”",
            actionText: "Check Market Prices ➔",
            actionHash: "#prices",
            sceneId: "scene-market"
        },
        {
            id: 5,
            title: "Consumer Proof & Verification",
            phaseTag: "05 • Verified QR",
            characterName: "Sara & Family",
            characterRole: "Conscious Consumer",
            characterEmoji: "👩‍🍳",
            quote: "“One smartphone scan of the package QR code reveals the entire farm-to-fork story: farmer identity, harvest timestamp, and tamper-proof blockchain authenticity!”",
            actionText: "Verify Any QR Code ➔",
            actionHash: "#verify",
            sceneId: "scene-consumer"
        }
    ];

    const STEP_DURATION_MS = 5500; // 5.5 seconds per step
    let currentStepIndex = 0;
    let isPlaying = true;
    let stepStartTime = null;
    let animFrameId = null;

    // DOM Elements
    let containerEl = null;
    let barTracks = [];
    let barFills = [];
    let stageEls = [];
    let pillBtns = [];
    let characterAvatarEl = null;
    let characterNameEl = null;
    let characterRoleBadgeEl = null;
    let phaseTagEl = null;
    let quoteEl = null;
    let actionPillEl = null;
    let stepCounterEl = null;
    let playPauseBtn = null;
    let nextBtn = null;
    let prevBtn = null;

    function initReel() {
        containerEl = document.getElementById("workflowStoryReel");
        if (!containerEl) return;

        barTracks = Array.from(containerEl.querySelectorAll(".reel-bar-track"));
        barFills = Array.from(containerEl.querySelectorAll(".reel-bar-fill"));
        stageEls = Array.from(containerEl.querySelectorAll(".reel-stage"));
        pillBtns = Array.from(containerEl.querySelectorAll(".reel-step-btn"));

        characterAvatarEl = containerEl.querySelector(".character-avatar-circle");
        characterNameEl = containerEl.querySelector(".character-name span");
        characterRoleBadgeEl = containerEl.querySelector(".character-badge-role");
        phaseTagEl = containerEl.querySelector(".step-phase-tag");
        quoteEl = containerEl.querySelector(".character-quote");
        actionPillEl = containerEl.querySelector(".character-action-pill");
        stepCounterEl = containerEl.querySelector(".reel-step-counter");

        playPauseBtn = document.getElementById("reelPlayPauseBtn");
        nextBtn = document.getElementById("reelNextBtn");
        prevBtn = document.getElementById("reelPrevBtn");

        // Event listeners
        if (playPauseBtn) {
            playPauseBtn.addEventListener("click", togglePlayPause);
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                goToStep((currentStepIndex + 1) % STEPS.length);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                goToStep((currentStepIndex - 1 + STEPS.length) % STEPS.length);
            });
        }

        // Click on top progress bar tracks
        barTracks.forEach((track, idx) => {
            track.addEventListener("click", () => {
                goToStep(idx);
            });
        });

        // Click on bottom selector pills
        pillBtns.forEach((btn, idx) => {
            btn.addEventListener("click", () => {
                goToStep(idx);
            });
        });

        // Pause on mouse hover so user can read comfortably
        const cardEl = containerEl.querySelector(".workflow-reel-card");
        if (cardEl) {
            cardEl.addEventListener("mouseenter", () => {
                // soft pause on hover
                wasPlayingBeforeHover = isPlaying;
                isHovered = true;
            });
            cardEl.addEventListener("mouseleave", () => {
                isHovered = false;
                stepStartTime = performance.now() - currentStepElapsed;
            });
        }

        // Set initial step
        goToStep(0);

        // Start animation loop
        requestAnimationFrame(reelLoop);
    }

    let isHovered = false;
    let wasPlayingBeforeHover = true;
    let currentStepElapsed = 0;

    function goToStep(index) {
        currentStepIndex = index;
        stepStartTime = performance.now();
        currentStepElapsed = 0;

        const step = STEPS[currentStepIndex];

        // 1. Update story progress bars
        barTracks.forEach((track, idx) => {
            track.classList.remove("completed", "active");
            if (idx < currentStepIndex) {
                track.classList.add("completed");
                barFills[idx].style.width = "100%";
            } else if (idx === currentStepIndex) {
                track.classList.add("active");
                barFills[idx].style.width = "0%";
            } else {
                barFills[idx].style.width = "0%";
            }
        });

        // 2. Switch visual stage scenes
        stageEls.forEach((stage, idx) => {
            if (idx === currentStepIndex) {
                stage.classList.add("active");
            } else {
                stage.classList.remove("active");
            }
        });

        // 3. Update character narrative & speech
        if (characterAvatarEl) {
            characterAvatarEl.textContent = step.characterEmoji;
        }
        if (characterNameEl) {
            characterNameEl.textContent = step.characterName;
        }
        if (characterRoleBadgeEl) {
            characterRoleBadgeEl.textContent = step.characterRole.split(" ")[0];
        }
        if (phaseTagEl) {
            phaseTagEl.textContent = step.phaseTag;
        }
        if (quoteEl) {
            quoteEl.style.opacity = "0";
            setTimeout(() => {
                quoteEl.textContent = step.quote;
                quoteEl.style.opacity = "1";
            }, 150);
        }
        if (actionPillEl) {
            actionPillEl.textContent = step.actionText;
            actionPillEl.setAttribute("href", step.actionHash);
        }
        if (stepCounterEl) {
            stepCounterEl.textContent = `0${step.id} / 05`;
        }

        // 4. Update bottom pills
        pillBtns.forEach((btn, idx) => {
            if (idx === currentStepIndex) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    }

    function togglePlayPause() {
        isPlaying = !isPlaying;
        if (playPauseBtn) {
            playPauseBtn.textContent = isPlaying ? "⏸" : "▶";
            playPauseBtn.setAttribute("title", isPlaying ? "Pause reel" : "Play reel");
        }
        if (isPlaying) {
            stepStartTime = performance.now() - currentStepElapsed;
        }
    }

    function reelLoop(now) {
        if (isPlaying && !isHovered) {
            if (!stepStartTime) stepStartTime = now;
            currentStepElapsed = now - stepStartTime;

            const progress = Math.min(currentStepElapsed / STEP_DURATION_MS, 1);
            if (barFills[currentStepIndex]) {
                barFills[currentStepIndex].style.width = `${progress * 100}%`;
            }

            if (currentStepElapsed >= STEP_DURATION_MS) {
                goToStep((currentStepIndex + 1) % STEPS.length);
            }
        }
        requestAnimationFrame(reelLoop);
    }

    // Initialize when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initReel);
    } else {
        initReel();
    }
})();
