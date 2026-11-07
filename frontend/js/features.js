/* =========================================================
   AgriTrace — Extended Features Module
   Voice Assistant | Multilingual Translation | Clear Text View
   Camera Scanner | QR Traceability | Marketplace | Dashboards
   ========================================================= */

/* =========================================================
   VOICE ASSISTANT (WEB SPEECH API + MULTILINGUAL ENGINE)
   Supports English, Tamil, Hindi Voice Input & Synthesis,
   Real Navigation, Product Search, Text Sizing, Page Reading,
   Typed Fallback, Auth/Role Security & Confirmations.
   ========================================================= */

const VOICE_KNOWLEDGE = {
  tomato: {
    en: "Current tomato prices: Farmer gate ₹19-25 per kg, Wholesale mandi ₹32-38 per kg, Consumer retail ₹36-45 per kg. Origin: Hosur, Tamil Nadu. Blockchain verified.",
    ta: "தக்காளி தற்போதைய விலை: விவசாயி விலை கிலோ ₹19-25, மொத்த விற்பனை ₹32-38, நுகர்வோர் சில்லறை விலை கிலோ ₹36-45. இடம்: ஓசூர், தமிழ்நாடு. பிளாக்செயினில் சரிபார்க்கப்பட்டது.",
    hi: "वर्तमान टमाटर की कीमतें: किसान मूल्य ₹19-25 प्रति किग्रा, थोक मंडी ₹32-38, खुदरा मूल्य ₹36-45 प्रति किग्रा। उत्पत्ति: होसुर, तमिलनाडु। ब्लॉकचेन सत्यापित।"
  },
  mango: {
    en: "Alphonso mango prices: Farmer gate ₹30-45 per kg, Wholesale ₹55-70 per kg, Consumer retail ₹85-120 per kg. Origin: Salem, Tamil Nadu.",
    ta: "அல்போன்சா மாம்பழம் விலை: விவசாயி விலை கிலோ ₹30-45, மொத்த விலை ₹55-70, சில்லறை விலை ₹85-120. இடம்: சேலம், தமிழ்நாடு.",
    hi: "अल्फांसो आम की कीमतें: किसान मूल्य ₹30-45 प्रति किग्रा, थोक मूल्य ₹55-70, खुदरा मूल्य ₹85-120 प्रति किग्रा। उत्पत्ति: सेलम, तमिलनाडु।"
  },
  onion: {
    en: "Onion prices: Farmer gate ₹28-35 per kg, Market wholesale ₹45-60 per kg. Origin: Nashik, Maharashtra.",
    ta: "வெங்காயம் விலை: விவசாயி விலை கிலோ ₹28-35, மொத்த சந்தை ₹45-60. இடம்: நாசிக், மகாராஷ்டிரா.",
    hi: "प्याज की कीमतें: किसान मूल्य ₹28-35 प्रति किग्रा, थोक मंडी ₹45-60 प्रति किग्रा। उत्पत्ति: नासिक, महाराष्ट्र।"
  },
  banana: {
    en: "Banana prices: Farmer gate ₹38-48 per kg, Consumer retail ₹55-70 per kg. Origin: Trichy, Tamil Nadu.",
    ta: "வாழைப்பழம் விலை: விவசாயி விலை கிலோ ₹38-48, சில்லறை விலை ₹55-70. இடம்: திருச்சி, தமிழ்நாடு.",
    hi: "केले की कीमतें: किसान मूल्य ₹38-48 प्रति किग्रा, खुदरा मूल्य ₹55-70 प्रति किग्रा। उत्पत्ति: त्रिची, तमिलनाडु।"
  },
  traceability: {
    en: "AgriTrace cryptographically verifies produce provenance. Each lot is anchored to an Ethereum smart contract with IoT cold-chain temperature logs and instant QR code verification.",
    ta: "AgriTrace விளைபொருட்களின் உண்மைத்தன்மையை கிரிப்டோகிராஃபிக் முறையில் சரிபார்க்கிறது. ஒவ்வொரு தொகுதியும் Ethereum ஸ்மார்ட் ஒப்பந்தம் மற்றும் IoT குளிர்பதன தரவுகளுடன் இணைக்கப்பட்டு QR குறியீடு மூலம் சரிபார்க்கப்படுகிறது.",
    hi: "AgriTrace क्रिप्टोग्राफिक रूप से उपज की प्रामाणिकता को सत्यापित करता है। प्रत्येक लॉट को Ethereum स्मार्ट अनुबंध और IoT कोल्ड चेन डेटा से जोड़ा जाता है और QR कोड से सत्यापित किया जाता है।"
  }
};

let voiceRecognition = null;
let isListening = false;
let isSpeaking = false;
let voiceVolume = parseFloat(localStorage.getItem('agritrace_voice_vol') || '1.0');
let isVoiceMuted = localStorage.getItem('agritrace_voice_muted') === 'true';

// Status update
function setVoiceState(state, message) {
  const dot = document.getElementById('voiceStatusDot');
  const text = document.getElementById('voiceStatusText');
  const startBtn = document.getElementById('voiceStartBtn');
  const stopBtn = document.getElementById('voiceStopBtn');
  const micBtn = document.getElementById('voiceMicBtn');
  const micIcon = document.getElementById('voiceMicIcon');
  const langPill = document.getElementById('voiceLangPill');

  const currentLang = typeof window.getCurrentLanguage === 'function' ? window.getCurrentLanguage() : 'en';

  if (dot) {
    dot.className = 'voice-status-dot ' + state;
  }

  if (langPill) {
    langPill.textContent = currentLang === 'ta' ? '🇮🇳 TA' : currentLang === 'hi' ? '🇮🇳 HI' : '🇬🇧 EN';
  }

  if (text) {
    if (message) {
      text.textContent = message;
    } else {
      const stateKey = 'voice_state_' + state;
      text.textContent = typeof window.t === 'function' ? window.t(stateKey) : state;
    }
  }

  if (startBtn && stopBtn) {
    if (state === 'listening') {
      startBtn.style.display = 'none';
      stopBtn.style.display = 'inline-flex';
    } else {
      startBtn.style.display = 'inline-flex';
      stopBtn.style.display = 'none';
    }
  }

  if (micBtn) {
    micBtn.classList.toggle('listening', state === 'listening');
  }
  if (micIcon) {
    micIcon.textContent = state === 'listening' ? '🔴' : '🎤';
  }
}

function updateAudioControlsUI() {
  const muteBtn = document.getElementById('voiceMuteBtn');
  const muteIcon = document.getElementById('voiceMuteIcon');
  const slider = document.getElementById('voiceVolumeSlider');
  const valText = document.getElementById('voiceVolVal');

  if (muteBtn) {
    muteBtn.classList.toggle('muted', isVoiceMuted);
    muteBtn.title = isVoiceMuted ? 'Unmute Voice Assistant' : 'Mute Voice Assistant';
  }
  if (muteIcon) {
    muteIcon.textContent = isVoiceMuted ? '🔇' : voiceVolume > 0.5 ? '🔊' : voiceVolume > 0 ? '🔉' : '🔇';
  }
  if (slider) {
    slider.value = isVoiceMuted ? 0 : Math.round(voiceVolume * 100);
  }
  if (valText) {
    if (isVoiceMuted) {
      valText.textContent = 'Muted';
      valText.style.color = '#ff6b6b';
    } else {
      valText.textContent = `${Math.round(voiceVolume * 100)}%`;
      valText.style.color = 'var(--green)';
    }
  }
}

function setVoiceMuted(muted) {
  isVoiceMuted = muted;
  localStorage.setItem('agritrace_voice_muted', isVoiceMuted ? 'true' : 'false');
  updateAudioControlsUI();
  if (window.speechSynthesis && isVoiceMuted) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    setVoiceState('idle');
  }
  if (typeof showToast === 'function') {
    showToast(isVoiceMuted ? (typeof window.t === 'function' ? window.t('toast_voice_muted') : '🔇 Voice Assistant Muted') : (typeof window.t === 'function' ? window.t('toast_voice_unmuted') : '🔊 Voice Assistant Unmuted'), 'info');
  }
}

function setVoiceVolume(vol) {
  voiceVolume = Math.max(0, Math.min(1, vol));
  localStorage.setItem('agritrace_voice_vol', voiceVolume.toString());
  if (voiceVolume === 0) {
    isVoiceMuted = true;
    localStorage.setItem('agritrace_voice_muted', 'true');
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  } else if (isVoiceMuted && voiceVolume > 0) {
    isVoiceMuted = false;
    localStorage.setItem('agritrace_voice_muted', 'false');
  }
  updateAudioControlsUI();
}

/**
 * Get matching voice for language from speechSynthesis
 */
function getBestVoiceForLanguage(langCode) {
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  if (voices.length === 0) return null;

  if (langCode === 'ta') {
    const taVoice = voices.find(v => v.lang && (v.lang.toLowerCase().includes('ta') || v.name.toLowerCase().includes('tamil')));
    if (taVoice) return taVoice;
  } else if (langCode === 'hi') {
    const hiVoice = voices.find(v => v.lang && (v.lang.toLowerCase().includes('hi') || v.name.toLowerCase().includes('hindi')));
    if (hiVoice) return hiVoice;
  }

  // English voice with Indian accent preference
  const inVoice = voices.find(v => v.lang && v.lang.toLowerCase().includes('en-in'));
  if (inVoice) return inVoice;

  return voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en')) || voices[0];
}

let voiceAudioCtx = null;
function playVoiceChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!voiceAudioCtx) voiceAudioCtx = new AudioCtx();
    if (voiceAudioCtx.state === 'suspended') {
      voiceAudioCtx.resume();
    }
    const osc = voiceAudioCtx.createOscillator();
    const gain = voiceAudioCtx.createGain();
    osc.type = 'sine';
    const t = voiceAudioCtx.currentTime;
    osc.frequency.setValueAtTime(587.33, t); // D5
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.1); // A5
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc.connect(gain);
    gain.connect(voiceAudioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.22);
  } catch (e) {
    // Audio context not allowed yet
  }
}

function showVoiceAnswerToast(text) {
  const modal = document.getElementById('voiceModal');
  if (modal && modal.classList.contains('open')) return;

  let toast = document.getElementById('voiceFloatingAnswerToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'voiceFloatingAnswerToast';
    toast.className = 'voice-floating-answer-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <div class="voice-toast-header">
      <span class="voice-toast-mic">🎙️ Voice AI Answer</span>
      <button class="voice-toast-close" type="button" onclick="this.closest('.voice-floating-answer-toast').classList.remove('show')">✕</button>
    </div>
    <div class="voice-toast-body">${text}</div>
  `;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 7500);
}

/**
 * Speak text with appropriate voice, max volume and state tracking
 */
function speak(text, onComplete) {
  const log = document.getElementById('voiceLog');
  let isDuplicate = false;
  if (log && log.lastElementChild) {
    const lastTxt = (log.lastElementChild.textContent || '').trim();
    if (lastTxt.includes(text.substring(0, 25)) || text.includes(lastTxt.substring(0, 25))) {
      isDuplicate = true;
    }
  }
  if (!isDuplicate) {
    appendVoiceBubble('assistant', text);
  }
  showVoiceAnswerToast(text);
  playVoiceChime();

  const synth = window.speechSynthesis;
  if (!synth) return;
  synth.cancel();

  if (isVoiceMuted || voiceVolume <= 0) {
    setVoiceState('idle');
    if (onComplete) onComplete();
    return;
  }

  // Maximum speech volume amplification
  const effectiveVol = 1.0;
  const currentLang = typeof window.getCurrentLanguage === 'function' ? window.getCurrentLanguage() : 'en';
  const utterance = new SpeechSynthesisUtterance(text);
  
  utterance.lang = currentLang === 'ta' ? 'ta-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.rate = 1.0;
  utterance.pitch = 1.02;
  utterance.volume = effectiveVol;

  const voice = getBestVoiceForLanguage(currentLang);
  if (voice) utterance.voice = voice;

  utterance.onstart = () => {
    isSpeaking = true;
    setVoiceState('speaking');
  };

  utterance.onend = () => {
    isSpeaking = false;
    setVoiceState('idle');
    if (onComplete) onComplete();
  };

  utterance.onerror = (e) => {
    console.warn('SpeechSynthesis notice:', e);
    isSpeaking = false;
    setVoiceState('idle');
  };

  synth.speak(utterance);
}

function stopSpeaking() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  isSpeaking = false;
  setVoiceState('idle');
}

function appendVoiceBubble(type, text) {
  const log = document.getElementById('voiceLog');
  if (!log) return;
  const bubble = document.createElement('div');
  bubble.className = 'voice-bubble voice-bubble-' + type;
  bubble.innerHTML = `<span class="voice-bubble-icon" aria-hidden="true">${type === 'user' ? '🎤' : '🤖'}</span><span>${escapeHtml(text)}</span>`;
  log.appendChild(bubble);
  log.scrollTop = log.scrollHeight;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Sensitive action confirmation dialog
 */
function confirmSensitiveAction(actionTitle, actionMessage, onConfirm) {
  const modal = document.getElementById('confirmModal');
  const titleEl = document.getElementById('confirmModalTitle');
  const msgEl = document.getElementById('confirmModalMessage');
  const proceedBtn = document.getElementById('confirmProceedBtn');
  const cancelBtn = document.getElementById('confirmCancelBtn');
  const closeBtn = document.getElementById('closeConfirmModalBtn');

  if (!modal) {
    if (confirm(actionMessage)) onConfirm();
    return;
  }

  if (titleEl) titleEl.textContent = actionTitle;
  if (msgEl) msgEl.textContent = actionMessage;

  const close = () => {
    modal.classList.remove('open');
    proceedBtn.onclick = null;
    cancelBtn.onclick = null;
  };

  proceedBtn.onclick = () => {
    close();
    onConfirm();
  };

  cancelBtn.onclick = close;
  if (closeBtn) closeBtn.onclick = close;

  modal.classList.add('open');
}

/**
 * Execute Voice Commands with Real App Navigation & Actions
 */
function processVoiceCommand(transcript) {
  if (!transcript || !transcript.trim()) return;
  const raw = transcript.trim();
  const lower = raw.toLowerCase();
  appendVoiceBubble('user', raw);
  setVoiceState('processing');

  const currentLang = typeof window.getCurrentLanguage === 'function' ? window.getCurrentLanguage() : 'en';

  // 1. Navigation Commands
  if (/farmer|விவசாயி|किसान/.test(lower) && /dashboard|portal|open|go|view|டாஷ்போர்டு|डैशबोर्ड/.test(lower)) {
    navigateToSection('#farmer', () => {
      const resp = currentLang === 'ta' ? 'விவசாயி டாஷ்போர்டு திறக்கப்படுகிறது.' : currentLang === 'hi' ? 'किसान डैशबोर्ड खोला जा रहा है।' : 'Navigating to Farmer Dashboard.';
      speak(resp);
    });
    return;
  }

  if (/seller|marketplace|product|available|விற்பனையாளர்|சந்தை|बाज़ार|उत्पाद/.test(lower) && /show|open|go|view|காட்டு|दिखाएं/.test(lower)) {
    navigateToSection('#seller', () => {
      const count = (typeof SELLER_LISTINGS !== 'undefined' ? SELLER_LISTINGS.length : 8);
      const resp = currentLang === 'ta' ? `விற்பனையாளர் சந்தையில் ${count} விளைபொருட்கள் இருப்பில் உள்ளன.` : currentLang === 'hi' ? `बाज़ार में ${count} उत्पाद उपलब्ध हैं।` : `Showing ${count} available produce listings in the Seller Marketplace.`;
      speak(resp);
    });
    return;
  }

  if (/dashboard|command center|டாஷ்போர்டு|डैशबोर्ड/.test(lower) && /open|go|view|காட்டு|खोलो/.test(lower)) {
    navigateToSection('#dashboard', () => {
      const resp = currentLang === 'ta' ? 'கட்டுப்பாட்டு மையம் திறக்கப்பட்டது.' : currentLang === 'hi' ? 'कमांड सेंटर खोला गया।' : 'Opening AgriTrace Command Center.';
      speak(resp);
    });
    return;
  }

  if (/traceability|records|register|கண்காணிப்பு|ट्रेसेबिलिटी/.test(lower)) {
    navigateToSection('#records', () => {
      const resp = currentLang === 'ta' ? 'விளைபொருள் பதிவேடு திறக்கப்பட்டது.' : currentLang === 'hi' ? 'उपज ट्रेसेबिलिटी रिकॉर्ड खोला गया।' : 'Opening Produce Traceability Records.';
      speak(resp);
    });
    return;
  }

  if (/price|விலை|मूल्य|कीमत/.test(lower) && /discovery|follow|table|market/.test(lower)) {
    navigateToSection('#prices', () => {
      const resp = currentLang === 'ta' ? 'விலை கண்டறிதல் பகுதி திறக்கப்பட்டது.' : currentLang === 'hi' ? 'मूल्य खोज अनुभाग खोला गया।' : 'Opening Fair Price Discovery section.';
      speak(resp);
    });
    return;
  }

  if (/iot|sensor|temperature|humidity|சென்சார்|सेंसर/.test(lower)) {
    navigateToSection('#sensors', () => {
      const resp = currentLang === 'ta' ? 'IoT குளிர்பதன கண்காணிப்பு திறக்கப்பட்டது.' : currentLang === 'hi' ? 'IoT कोल्ड चेन निगरानी खोली गई।' : 'Opening IoT Cold-Chain Monitoring section.';
      speak(resp);
    });
    return;
  }

  if (/consumer|verify|சரிபார்க்க|सत्यापित/.test(lower)) {
    navigateToSection('#consumer', () => {
      const resp = currentLang === 'ta' ? 'நுகர்வோர் சரிபார்ப்பு பகுதி திறக்கப்பட்டது.' : currentLang === 'hi' ? 'उपभोक्ता सत्यापन अनुभाग खोला गया।' : 'Opening Consumer Verification section.';
      speak(resp);
    });
    return;
  }

  if (/home|main|முகப்பு|होम/.test(lower)) {
    navigateToSection('#home', () => {
      const resp = currentLang === 'ta' ? 'முகப்பு பக்கத்திற்கு செல்கிறது.' : currentLang === 'hi' ? 'मुख्य पृष्ठ पर ले जाया जा रहा है।' : 'Navigating to Home.';
      speak(resp);
    });
    return;
  }

  // 2. Tamil Nadu Agricultural Intelligence & Real AGMARKNET Prices Query
  if (/விலை|price|rate|mandi|market|சந்தை|விவசாய|அறுவடை|harvest|திட்டம்|scheme/.test(lower) &&
      (/தக்காளி|tomato|நெல்|nel|rice|வெங்காயம்|onion|வாழை|banana|மாம்பழம்|mango|தேங்காய்|coconut|கரும்பு|sugarcane|கடலை|groundnut|மஞ்சள்|turmeric|கத்திரிக்காய்|brinjal|மிளகாய்|chilli|பருத்தி|cotton|கிழங்கு|tapioca|மக்கா|maize|முருங்கை|drumstick|சேலம்|salem|மதுரை|madurai|கோவை|coimbatore|ஈரோடு|erode|திண்டுக்கல்|dindigul|தேனி|theni|திருச்சி|trichy|சென்னை|chennai|தூத்துக்குடி|thoothukudi|திருநெல்வேலி|tirunelveli|தஞ்சாவூர்|thanjavur/.test(lower))) {
    navigateToSection('#prices');
    handleAgriMarketVoiceQuery(raw, lower, currentLang);
    return;
  }

  // 3. Specific Search: "Search for tomatoes" / "tomato"
  if (/tomato|தக்காளி|टमाटर/.test(lower)) {
    filterAndSearchProduce('tomato');
    const resp = VOICE_KNOWLEDGE.tomato[currentLang] || VOICE_KNOWLEDGE.tomato.en;
    speak(resp);
    return;
  }

  if (/mango|மாம்பழம்|आम/.test(lower)) {
    filterAndSearchProduce('mango');
    const resp = VOICE_KNOWLEDGE.mango[currentLang] || VOICE_KNOWLEDGE.mango.en;
    speak(resp);
    return;
  }

  if (/onion|வெங்காயம்|प्याज/.test(lower)) {
    filterAndSearchProduce('onion');
    const resp = VOICE_KNOWLEDGE.onion[currentLang] || VOICE_KNOWLEDGE.onion.en;
    speak(resp);
    return;
  }

  if (/banana|வாழை|केला/.test(lower)) {
    filterAndSearchProduce('banana');
    const resp = VOICE_KNOWLEDGE.banana[currentLang] || VOICE_KNOWLEDGE.banana.en;
    speak(resp);
    return;
  }

  // 3. Multilingual Switching Commands
  if (/tamil|தமிழ்/.test(lower)) {
    if (typeof window.setLanguage === 'function') window.setLanguage('ta');
    speak('மொழி தமிழுக்கு மாற்றப்பட்டது. நான் உங்களுக்கு தமிழில் உதவ தயாராக உள்ளேன்.');
    return;
  }

  if (/hindi|हिंदी/.test(lower)) {
    if (typeof window.setLanguage === 'function') window.setLanguage('hi');
    speak('भाषा बदलकर हिंदी कर दी गई है। मैं हिंदी में आपकी सहायता कर सकता हूँ।');
    return;
  }

  if (/english|ஆங்கிலம்|अंग्रेज़ी/.test(lower)) {
    if (typeof window.setLanguage === 'function') window.setLanguage('en');
    speak('Language changed to English. How can I assist you today?');
    return;
  }

  // 4. Accessibility & Typography Commands
  if (/increase text|large text|bigger text|பெரிய எழுத்து|बड़ा टेक्स्ट/.test(lower)) {
    setTextSize('large');
    const resp = currentLang === 'ta' ? 'எழுத்து அளவு பெரிதாக்கப்பட்டது.' : currentLang === 'hi' ? 'टेक्स्ट साइज़ बड़ा कर दिया गया है।' : 'Text size increased to Large for high readability.';
    speak(resp);
    return;
  }

  if (/decrease text|small text|smaller text|சிறிய எழுத்து|छोटा टेक्स्ट/.test(lower)) {
    setTextSize('small');
    const resp = currentLang === 'ta' ? 'எழுத்து அளவு சிறியதாக மாற்றப்பட்டது.' : currentLang === 'hi' ? 'टेक्स्ट साइज़ छोटा कर दिया गया है।' : 'Text size set to Compact.';
    speak(resp);
    return;
  }

  if (/reset text|default text|standard text|இயல்பு எழுத்து|डिफ़ॉल्ट टेक्स्ट/.test(lower)) {
    setTextSize('default');
    const resp = currentLang === 'ta' ? 'இயல்பான எழுத்து அளவு மீட்டமைக்கப்பட்டது.' : currentLang === 'hi' ? 'डिफ़ॉल्ट टेक्स्ट साइज़ बहाल किया गया।' : 'Standard text size restored.';
    speak(resp);
    return;
  }

  if (/clear text|தெளிவான உரை|क्लियर टेक्स्ट/.test(lower)) {
    if (/off|turn off|disable|disable clear text|அணை|बंद/.test(lower)) {
      toggleClearTextView(false);
      speak(currentLang === 'ta' ? 'தெளிவான உரை பயன்முறை அணைக்கப்பட்டது.' : currentLang === 'hi' ? 'क्लियर टेक्स्ट व्यू बंद किया गया।' : 'Standard view restored.');
    } else {
      toggleClearTextView(true);
      speak(currentLang === 'ta' ? 'தெளிவான உரை காட்சி செயல்படுத்தப்பட்டது.' : currentLang === 'hi' ? 'क्लियर टेक्स्ट व्यू सक्रिय किया गया।' : 'Clear Text View activated with high-contrast sharp typography.');
    }
    return;
  }

  // 5. Read Page Aloud
  if (/read|வாசி|पढ़कर|सुनाओ/.test(lower)) {
    readActivePageAloud();
    return;
  }

  // 6. Stop Speaking
  if (/stop speaking|stop talking|shut up|quiet|பேசாதே|நிறுத்து|बोलना बंद|चुप/.test(lower)) {
    stopSpeaking();
    return;
  }

  // 7. Orders & Offers
  if (/order|offer|சலுகை|ஆர்டர்|ऑफ़र|ऑर्डर/.test(lower)) {
    navigateToSection('#farmer', () => {
      viewFarmerOffers('FARM-LOT-001');
      const resp = currentLang === 'ta' ? 'விவசாயி தொகுதிக்கான சலுகைகள் திறக்கப்பட்டது.' : currentLang === 'hi' ? 'उपज लॉट के प्रस्ताव खोले गए।' : 'Opening received buyer offers for batch FARM-LOT-001.';
      speak(resp);
    });
    return;
  }

  // 8. Explain Traceability with Auto-Navigation
  if (/explain traceability|traceability|how does it work|விளக்கம்|समझाएं/.test(lower)) {
    navigateToSection('#records', () => {
      const resp = VOICE_KNOWLEDGE.traceability[currentLang] || VOICE_KNOWLEDGE.traceability.en;
      speak(resp);
    });
    return;
  }

  // 9. Show Price & Quantity with Auto-Navigation
  if (/price and quantity|available quantity|விலை மற்றும் அளவு|कीमत और मात्रा/.test(lower)) {
    navigateToSection('#prices', () => {
      const top = SELLER_LISTINGS.slice(0, 3).map(l => `${l.crop}: ${l.qty} kg at ₹${l.askPrice}/kg`).join(', ');
      const resp = currentLang === 'ta' ? `தற்போதைய இருப்புகள்: ${top}` : currentLang === 'hi' ? `उपलब्ध मात्रा और कीमतें: ${top}` : `Top available listings: ${top}.`;
      speak(resp);
    });
    return;
  }

  // 10. Offline Mode & PWA Capabilities
  if (/offline|pwa|internet|cache|connection|ஆஃப்லைன்|ऑफ़लाइन/.test(lower)) {
    const isOff = !navigator.onLine;
    const resp = currentLang === 'ta'
      ? (isOff ? 'ஆக்ரிட்ரேஸ் தற்போது முழுமையான ஆஃப்லைன் பயன்முறையில் இயங்குகிறது. உள்ளூர் தரவுகள் அனைத்தும் பாதுகாக்கப்பட்டுள்ளன.' : 'ஆக்ரிட்ரேஸ் முழுமையான ஆஃப்லைன் PWA திறனுடன் இயங்குகிறது. இணையம் இல்லாமலும் பயன்படுத்தலாம்.')
      : currentLang === 'hi'
      ? (isOff ? 'एग्रीट्रेस वर्तमान में ऑफ़लाइन मोड में सक्रिय है। सभी रिकॉर्ड और बाज़ार स्थानीय रूप से उपलब्ध हैं।' : 'एग्रीट्रेस पूर्ण ऑफ़लाइन PWA क्षमता से युक्त है। आप बिना इंटरनेट के भी इसका उपयोग कर सकते हैं।')
      : (isOff ? 'AgriTrace is currently running in full Offline Mode. Local blockchain cache, QR scanner, and marketplace are fully operational without internet.' : 'AgriTrace is powered by full Offline PWA architecture. You can browse produce records, price discovery, and use voice AI completely offline.');
    speak(resp);
    return;
  }

  // 10. Help
  if (/help|commands|what can you do|உதவி|मदद/.test(lower)) {
    const helpResp = typeof window.t === 'function' ? window.t('voice_help_response') : 'I can help you navigate AgriTrace, inspect produce prices, check cold chain alerts, and control accessibility settings. Say: "Open farmer dashboard", "Show available products", "Search for tomatoes", "Change language to Tamil", "Increase text size", or "Explain traceability".';
    speak(helpResp);
    return;
  }

  // Fallback
  const fallback = currentLang === 'ta'
    ? `நான் கேட்டது: "${raw}". "தக்காளி விலை", "விவசாயி டாஷ்போர்டு திற", அல்லது "எழுத்து அளவை அதிகரி" என்று கேட்டுப்பாருங்கள்.`
    : currentLang === 'hi'
    ? `मैंने सुना: "${raw}"। "टमाटर की कीमत", "किसान डैशबोर्ड खोलो", या "टेक्स्ट साइज़ बढ़ाओ" कहकर देखें।`
    : `I heard: "${raw}". Try asking about tomato prices, "Open farmer dashboard", or "Increase text size".`;
  speak(fallback);
}

function navigateToSection(hash, callback) {
  const el = document.querySelector(hash);
  if (el) {
    const navPanel = document.getElementById('floatingNavPanel');
    // Calculate header height + generous breathing buffer so content is 100% visible
    let headerOffset = 210;
    if (navPanel) {
      const rect = navPanel.getBoundingClientRect();
      headerOffset = (rect.height > 0 ? rect.height : 210) + 40;
    }
    const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = Math.max(0, elementPosition - headerOffset);

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // Update active nav link across dock and mobile navigation
    document.querySelectorAll('.dock-item, .dock-nav-links a, .nav-links a, .mobile-menu a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === hash);
    });
  }
  // Auto-collapse navigation panel so section content is 100% visible
  const navPanel = document.getElementById('floatingNavPanel');
  const navToggle = document.getElementById('floatingNavToggleBtn');
  if (navPanel && navPanel.classList.contains('is-open')) {
    navPanel.classList.remove('is-open');
    navPanel.classList.add('is-closed');
    navPanel.setAttribute('aria-hidden', 'true');
    if (navToggle) {
      navToggle.classList.add('is-visible');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }
  if (callback) setTimeout(callback, 800);
}

function filterAndSearchProduce(keyword) {
  navigateToSection('#seller', () => {
    const input = document.getElementById('sellerSearchInput');
    if (input) {
      input.value = keyword;
      renderSellerMarketplace(keyword);
    }
    const filterInput = document.getElementById('filterInput');
    if (filterInput) {
      filterInput.value = keyword;
      if (typeof renderRecordTable === 'function') renderRecordTable();
    }
  });
}

/**
 * Handle Tamil Nadu Agricultural Intelligence & Real AGMARKNET Prices Query
 */
function handleAgriMarketVoiceQuery(raw, lower, currentLang) {
  fetch(`/api/tn-market/voice-query?query=${encodeURIComponent(raw)}&lang=${currentLang}`)
    .then(r => r.json())
    .then(res => {
      if (res && res.ok && res.data && res.data.spoken_answer) {
        speak(res.data.spoken_answer);
      } else {
        fallbackAgriMarketVoiceQuery(raw, lower, currentLang);
      }
    })
    .catch(() => fallbackAgriMarketVoiceQuery(raw, lower, currentLang));
}

function fallbackAgriMarketVoiceQuery(raw, lower, currentLang) {
  const records = window.TN_MARKET_PRICE_RECORDS || [];
  const CROPS_MAP = {
    tomato: ["tomato", "தக்காளி", "टमाटर"],
    rice: ["rice", "paddy", "நெல்", "அரிசி", "nel", "चावल", "धान"],
    banana: ["banana", "வாழை", "केला"],
    onion: ["onion", "shallot", "வெங்காயம்", "प्याज"],
    coconut: ["coconut", "தேங்காய்", "தென்னை", "नारियल"],
    sugarcane: ["sugarcane", "கரும்பு", "गन्ना"],
    groundnut: ["groundnut", "peanut", "வேர்க்கடலை", "கடலை", "मूंगफली"],
    turmeric: ["turmeric", "மஞ்சள்", "हल्दी"],
    mango: ["mango", "மாம்பழம்", "आम"],
    brinjal: ["brinjal", "eggplant", "கத்திரிக்காய்", "கத்தரிக்காய்", "बैंगन"],
    chilli: ["chilli", "chili", "மிளகாய்", "मिर्च"],
    cotton: ["cotton", "பருத்தி", "कपास"],
    tapioca: ["tapioca", "cassava", "மரவள்ளிக்கிழங்கு", "கிழங்கு"],
    maize: ["maize", "corn", "மக்காச்சோளம்", "மக்கா", "मक्का"],
    drumstick: ["drumstick", "moringa", "முருங்கை", "सहजन"]
  };
  const DISTRICTS = ["Salem", "Madurai", "Coimbatore", "Erode", "Dindigul", "Theni", "Tiruchirappalli", "Chennai", "Thoothukudi", "Tirunelveli", "Thanjavur"];

  let detectedCrop = "tomato";
  for (const [cropKey, aliases] of Object.entries(CROPS_MAP)) {
    if (aliases.some(a => lower.includes(a))) {
      detectedCrop = cropKey;
      break;
    }
  }

  let detectedDistrict = null;
  for (const dist of DISTRICTS) {
    if (lower.includes(dist.toLowerCase())) {
      detectedDistrict = dist;
      break;
    }
  }

  // Switch crop in UI if element exists
  const cropSelect = document.getElementById("miCropSelector");
  if (cropSelect && cropSelect.value !== detectedCrop) {
    cropSelect.value = detectedCrop;
    cropSelect.dispatchEvent(new Event("change"));
  }

  const matching = records.filter(r => r.commodity_id === detectedCrop && (!detectedDistrict || r.district.toLowerCase() === detectedDistrict.toLowerCase()));
  if (matching.length > 0) {
    const rec = matching[0];
    const unitPrice = (rec.modal_price / 100).toFixed(2);
    const minPrice = (rec.min_price / 100).toFixed(2);
    const maxPrice = (rec.max_price / 100).toFixed(2);
    const cropName = rec.commodity_name;
    const marketName = rec.market_name;

    let ans = "";
    if (currentLang === "ta") {
      ans = `${marketName} சந்தையில் ${cropName} மாதிரி விலை கிலோவுக்கு ₹${unitPrice} (குறைந்தபட்சம் ₹${minPrice}, அதிகபட்சம் ₹${maxPrice}).`;
    } else if (currentLang === "hi") {
      ans = `${marketName} में ${cropName} का मॉडल मूल्य ₹${unitPrice} प्रति किलो है (न्यूनतम ₹${minPrice}, अधिकतम ₹${maxPrice})।`;
    } else {
      ans = `In ${marketName}, ${cropName} modal price is ₹${unitPrice}/kg (Min: ₹${minPrice}, Max: ₹${maxPrice}).`;
    }
    speak(ans);
  } else {
    speak(currentLang === "ta" ? "மன்னிக்கவும், தேர்ந்தெடுக்கப்பட்ட சந்தை விலை தகவல் கிடைக்கவில்லை." : "Sorry, market price data for that query is currently unavailable.");
  }
}

/**
 * Read the current visible section of the application aloud
 */
function readActivePageAloud() {
  const sections = ['#home', '#dashboard', '#records', '#prices', '#sensors', '#kaggle', '#farmer', '#seller', '#consumer'];
  let activeSec = '#home';

  for (const s of sections) {
    const el = document.querySelector(s);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 200 && rect.bottom >= 200) {
        activeSec = s;
        break;
      }
    }
  }

  const currentLang = typeof window.getCurrentLanguage === 'function' ? window.getCurrentLanguage() : 'en';
  let summary = '';

  if (activeSec === '#farmer') {
    summary = currentLang === 'ta'
      ? 'விவசாயி போர்ட்டலில் உள்ளீர்கள். விவசாயி ராஜன் கிருஷ்ணமூர்த்தி, சேலம். மொத்தம் 3 விளைபொருள் தொகுதிகள் செயலில் உள்ளன. இன்று வருவாய் 4,200 ரூபாய்.'
      : currentLang === 'hi'
      ? 'आप किसान डैशबोर्ड पर हैं। किसान राजन कृष्णमूर्ति, सेलम। 3 सक्रिय फसल लॉट उपलब्ध हैं। आज की आय ₹4,200 है।'
      : 'You are on the Farmer Dashboard. Farmer Rajan Krishnamurthy, Salem. 3 active produce lots with ₹4,200 earnings today.';
  } else if (activeSec === '#seller') {
    summary = currentLang === 'ta'
      ? 'விற்பனையாளர் சந்தையில் உள்ளீர்கள். அல்போன்சா மாம்பழம், ரோமா தக்காளி, வெங்காயம் மற்றும் வாழைப்பழம் நேரலை சலுகைகளுக்கு கிடைக்கின்றன.'
      : currentLang === 'hi'
      ? 'आप विक्रेता बाज़ार में हैं। अल्फांसो आम, टमाटर, प्याज और केले लाइव प्रस्तावों के लिए उपलब्ध हैं।'
      : 'You are on the Seller Marketplace. Alphonso mangoes, Roma tomatoes, onions, and bananas are available for offers.';
  } else if (activeSec === '#records') {
    summary = currentLang === 'ta'
      ? 'பிளாக்செயின் கண்காணிப்பு பதிவேட்டில் உள்ளீர்கள். புதிய பயிர் தொகுதியை பதிவு செய்து சரிபார்க்கலாம்.'
      : currentLang === 'hi'
      ? 'आप ब्लॉकचेन ट्रेसेबिलिटी रिकॉर्ड पर हैं। यहां नए लॉट पंजीकृत और सत्यापित किए जाते हैं।'
      : 'You are on the Blockchain Produce Registry. Verified records are anchored to Ethereum.';
  } else if (activeSec === '#prices') {
    summary = currentLang === 'ta'
      ? 'மதிப்பு சங்கிலி விலை கண்டறிதல் பகுதியில் உள்ளீர்கள். பண்ணை முதல் சில்லறை வரை வெளிப்படையான விலை நிர்ணயம் கண்காணிக்கப்படுகிறது.'
      : currentLang === 'hi'
      ? 'आप मूल्य खोज अनुभाग में हैं। खेत से उपभोक्ता तक पारदर्शी कीमतों की निगरानी की जाती है।'
      : 'You are on the Fair Price Discovery section, eliminating middleman markups from farm to market.';
  } else if (activeSec === '#kaggle') {
    summary = 'You are on the Kaggle Datasets section. Browse curated open agricultural datasets for prices, crop production, and fruits and vegetables.';
  } else {
    summary = currentLang === 'ta'
      ? 'AgriTrace ஸ்மார்ட் விவசாய நெட்வொர்க் முகப்பு பக்கத்தில் உள்ளீர்கள். பண்ணை முதல் சந்தை வரை முழு வெளிப்படைத்தன்மையுடன் கூடிய தளம்.'
      : currentLang === 'hi'
      ? 'आप AgriTrace स्मार्ट कृषि नेटवर्क के मुख्य पृष्ठ पर हैं। खेत से बाजार तक पूर्ण पारदर्शिता।'
      : 'Welcome to AgriTrace. A next-generation agricultural traceability network connecting farmers to retail markets with transparency.';
  }

  speak(summary);
}

function startListening() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    const msg = typeof window.t === 'function' ? window.t('voice_speech_unsupported') : 'Speech recognition is not supported in this browser. Please use the text input below.';
    setVoiceState('error', 'Microphone not supported');
    appendVoiceBubble('assistant', msg);
    const input = document.getElementById('voiceTextInput');
    if (input) input.focus();
    return;
  }

  if (voiceRecognition && isListening) {
    voiceRecognition.stop();
    return;
  }

  const currentLang = typeof window.getCurrentLanguage === 'function' ? window.getCurrentLanguage() : 'en';

  try {
    voiceRecognition = new SR();
    voiceRecognition.continuous = false;
    voiceRecognition.interimResults = false;
    voiceRecognition.lang = currentLang === 'ta' ? 'ta-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';

    voiceRecognition.onstart = () => {
      isListening = true;
      setVoiceState('listening');
    };

    voiceRecognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      isListening = false;
      setVoiceState('idle');
      processVoiceCommand(transcript);
    };

    voiceRecognition.onerror = (e) => {
      console.warn('SpeechRecognition notice:', e.error);
      isListening = false;
      setVoiceState('error');
      
      let errMsg = 'Could not recognize speech. Please try again or type below.';
      if (e.error === 'not-allowed' || e.error === 'permission-denied') {
        errMsg = 'Microphone permission was denied. You can type commands in the text box below!';
      } else if (e.error === 'no-speech') {
        errMsg = 'No speech was detected. Please click Start Listening and speak clearly.';
      }
      appendVoiceBubble('assistant', errMsg);
      const textInput = document.getElementById('voiceTextInput');
      if (textInput) textInput.focus();
    };

    voiceRecognition.onend = () => {
      isListening = false;
      if (!isSpeaking) setVoiceState('idle');
    };

    voiceRecognition.start();
  } catch (err) {
    console.warn('SpeechRecognition start notice:', err);
    isListening = false;
    setVoiceState('error');
  }
}

function stopListening() {
  if (voiceRecognition) {
    try {
      voiceRecognition.stop();
    } catch (e) {}
  }
  isListening = false;
  setVoiceState('idle');
}

/**
 * Update Voice Assistant when platform language changes
 */
function updateVoiceAssistantLanguage(langCode) {
  const langPill = document.getElementById('voiceLangPill');
  if (langPill) {
    langPill.textContent = langCode === 'ta' ? '🇮🇳 TA' : langCode === 'hi' ? '🇮🇳 HI' : '🇬🇧 EN';
  }
  setVoiceState('idle');
}

function initVoiceAssistant() {
  const toggleBtn = document.getElementById('voiceToggleBtn');
  const closeBtn = document.getElementById('voiceCloseBtn');
  const panel = document.getElementById('voicePanel');
  const micBtn = document.getElementById('voiceMicBtn');
  const startBtn = document.getElementById('voiceStartBtn');
  const stopBtn = document.getElementById('voiceStopBtn');
  const stopSpeakingBtn = document.getElementById('voiceStopSpeakingBtn');
  const muteBtn = document.getElementById('voiceMuteBtn');
  const volSlider = document.getElementById('voiceVolumeSlider');
  const inputForm = document.getElementById('voiceInputForm');
  const textInput = document.getElementById('voiceTextInput');

  if (!panel) return;

  updateAudioControlsUI();
  setVoiceState('idle');

  if (muteBtn) {
    muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setVoiceMuted(!isVoiceMuted);
    });
  }

  if (volSlider) {
    volSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) / 100;
      setVoiceVolume(val);
    });
  }

  const handleVoiceToggle = () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
      setVoiceState('idle');
      const log = document.getElementById('voiceLog');
      if (log) log.scrollTop = 0;
      const greeting = typeof window.t === 'function' ? window.t('voice_greeting') : 'Welcome to AgriTrace!';
      setTimeout(() => speak(greeting), 400);
    } else {
      stopSpeaking();
      stopListening();
    }
  };

  if (toggleBtn) toggleBtn.addEventListener('click', handleVoiceToggle);

  const floatVoiceBtn = document.getElementById('floatVoiceBtn');
  if (floatVoiceBtn) floatVoiceBtn.addEventListener('click', handleVoiceToggle);

  const mVoiceBtn = document.getElementById('m-voiceToggleBtn');
  if (mVoiceBtn) mVoiceBtn.addEventListener('click', handleVoiceToggle);

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      panel.classList.remove('open');
      panel.classList.remove('is-minimized');
      stopSpeaking();
      stopListening();
    });
  }

  const voiceMinimizeBtn = document.getElementById('voiceMinimizeBtn');
  if (voiceMinimizeBtn) {
    voiceMinimizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('is-minimized');
      const icon = document.getElementById('voiceMinimizeIcon');
      if (icon) {
        icon.textContent = panel.classList.contains('is-minimized') ? '🗖' : '🗕';
      }
    });
  }

  if (startBtn) startBtn.addEventListener('click', startListening);
  if (stopBtn) stopBtn.addEventListener('click', stopListening);
  if (stopSpeakingBtn) stopSpeakingBtn.addEventListener('click', stopSpeaking);
  if (micBtn) {
    micBtn.addEventListener('click', () => {
      if (isListening) stopListening();
      else startListening();
    });
  }

  // Quick Action Buttons
  document.querySelectorAll('.voice-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.dataset.cmd;
      if (cmd) processVoiceCommand(cmd);
    });
  });

  // Typed Fallback Form Submission
  if (inputForm) {
    inputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!textInput) return;
      const val = textInput.value.trim();
      if (val) {
        textInput.value = '';
        processVoiceCommand(val);
      }
    });
  }
}

/* =========================================================
   CLEAR TEXT VIEW (HIGH READABILITY & ACCESSIBILITY SYSTEM)
   Repaired root cause: Prevents broken span color inheritance,
   eliminates moving visual clutter, applies accessible fonts.
   ========================================================= */

function toggleClearTextView(forceState) {
  const isCurrentlyActive = document.body.classList.contains('clear-text-view');
  const nextState = forceState !== undefined ? forceState : !isCurrentlyActive;

  if (nextState) {
    document.body.classList.add('clear-text-view');
    localStorage.setItem('agritrace_clear_text', 'true');
    updateClearTextButtons(true);
    if (typeof showToast === 'function') {
      showToast(typeof window.t === 'function' ? window.t('toast_clear_text_on') : '👓 Clear Text View Activated: High-contrast, sharp typography for all pages.', 'success');
    }
  } else {
    document.body.classList.remove('clear-text-view');
    localStorage.setItem('agritrace_clear_text', 'false');
    updateClearTextButtons(false);
    if (typeof showToast === 'function') {
      showToast(typeof window.t === 'function' ? window.t('toast_clear_text_off') : '👓 Standard View Restored.', 'success');
    }
  }

  // Notify any active components
  window.dispatchEvent(new CustomEvent('agritrace:clearTextChanged', { detail: { active: nextState } }));
}

function updateClearTextButtons(active) {
  const ids = ['clearTextViewBtn', 'floatClearTextBtn', 'm-clearTextViewBtn'];
  ids.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.classList.toggle('active', active);
      const label = btn.querySelector('.tv-label, .tv-text');
      if (label) {
        label.textContent = active ? (typeof window.t === 'function' ? window.t('clear_text_on') : 'Clear Text: ON') : (typeof window.t === 'function' ? window.t('clear_text_btn') : 'Clear Text');
      }
    }
  });
}

/**
 * Text Size Accessibility Control System
 * Supports: 'small', 'default', 'large'
 */
function setTextSize(size) {
  const validSizes = ['small', 'default', 'large'];
  const targetSize = validSizes.includes(size) ? size : 'default';

  document.documentElement.setAttribute('data-text-size', targetSize);
  document.body.classList.remove('text-size-small', 'text-size-default', 'text-size-large');
  document.body.classList.add('text-size-' + targetSize);
  localStorage.setItem('agritrace_text_size', targetSize);

  // Update button active state
  const fontDec = document.getElementById('fontDecBtn');
  const fontReset = document.getElementById('fontResetBtn');
  const fontInc = document.getElementById('fontIncBtn');

  if (fontDec) fontDec.classList.toggle('active', targetSize === 'small');
  if (fontReset) fontReset.classList.toggle('active', targetSize === 'default');
  if (fontInc) fontInc.classList.toggle('active', targetSize === 'large');

  if (typeof showToast === 'function') {
    const toastKey = 'toast_text_size_' + targetSize;
    showToast(typeof window.t === 'function' ? window.t(toastKey) : `Text Size: ${targetSize}`, 'success');
  }
}

function initClearTextView() {
  // Restore saved Clear Text View
  const savedClearText = localStorage.getItem('agritrace_clear_text') === 'true';
  if (savedClearText) {
    document.body.classList.add('clear-text-view');
    updateClearTextButtons(true);
  }

  // Restore saved Text Size
  const savedTextSize = localStorage.getItem('agritrace_text_size') || 'default';
  setTextSize(savedTextSize);

  // Bind Buttons
  const clearBtn = document.getElementById('clearTextViewBtn');
  if (clearBtn) clearBtn.addEventListener('click', () => toggleClearTextView());

  const floatBtn = document.getElementById('floatClearTextBtn');
  if (floatBtn) floatBtn.addEventListener('click', () => toggleClearTextView());

  const mClearBtn = document.getElementById('m-clearTextViewBtn');
  if (mClearBtn) mClearBtn.addEventListener('click', () => toggleClearTextView());

  // Font Size Stepper Buttons (if present)
  const fontDec = document.getElementById('fontDecBtn');
  const fontReset = document.getElementById('fontResetBtn');
  const fontInc = document.getElementById('fontIncBtn');

  if (fontDec) fontDec.addEventListener('click', () => setTextSize('small'));
  if (fontReset) fontReset.addEventListener('click', () => setTextSize('default'));
  if (fontInc) fontInc.addEventListener('click', () => setTextSize('large'));

  // Floating Toolbar Controls (Dismiss / Reopen / Translate / Builder)
  const floatBar = document.getElementById('accessibilityToolbar');
  const floatDismissBtn = document.getElementById('floatDismissBtn');
  const floatReopenBtn = document.getElementById('floatReopenBtn');
  const floatTranslateBtn = document.getElementById('floatTranslateBtn');
  const floatBuilderBtn = document.getElementById('floatBuilderBtn');

  if (floatDismissBtn && floatBar && floatReopenBtn) {
    floatDismissBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      floatBar.style.display = 'none';
      floatReopenBtn.style.display = 'inline-flex';
    });

    floatReopenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      floatBar.style.display = 'flex';
      floatReopenBtn.style.display = 'none';
    });
  }

  if (floatTranslateBtn) {
    floatTranslateBtn.addEventListener('click', () => {
      const allLangBtn = document.getElementById('allLangModalBtn');
      if (allLangBtn) allLangBtn.click();
    });
  }

  if (floatBuilderBtn) {
    floatBuilderBtn.addEventListener('click', () => {
      const footerBtn = document.getElementById('footerBuilderProfileBtn');
      if (footerBtn) {
        footerBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        footerBtn.click();
      }
    });
  }
}

/* =========================================================
   PRODUCE DATABASE & CAMERA SCANNER
   ========================================================= */

const PRODUCE_DATABASE = {
  tomato:   { emoji: '🍅', name: 'Tomato',    grade: 'A',  tempRange: '10-15', humidity: '85', shelfLife: '7-14 days',  priceRange: '₹20-40/kg',  region: 'Hosur, Tamil Nadu' },
  potato:   { emoji: '🥔', name: 'Potato',    grade: 'A',  tempRange: '4-10',  humidity: '90', shelfLife: '30-60 days', priceRange: '₹15-30/kg',  region: 'Agra, Uttar Pradesh' },
  onion:    { emoji: '🧅', name: 'Onion',     grade: 'B',  tempRange: '0-5',   humidity: '65', shelfLife: '30-60 days', priceRange: '₹25-50/kg',  region: 'Nashik, Maharashtra' },
  banana:   { emoji: '🍌', name: 'Banana',    grade: 'A',  tempRange: '13-15', humidity: '85', shelfLife: '5-7 days',   priceRange: '₹30-60/kg',  region: 'Trichy, Tamil Nadu' },
  mango:    { emoji: '🥭', name: 'Mango',     grade: 'A+', tempRange: '8-12',  humidity: '85', shelfLife: '10-14 days', priceRange: '₹60-120/kg', region: 'Salem, Tamil Nadu' },
  chilli:   { emoji: '🌶️', name: 'Chilli',    grade: 'A+', tempRange: '7-10',  humidity: '80', shelfLife: '14-21 days', priceRange: '₹40-80/kg',  region: 'Guntur, Andhra Pradesh' },
  capsicum: { emoji: '🫑', name: 'Capsicum',  grade: 'A',  tempRange: '7-10',  humidity: '90', shelfLife: '14-21 days', priceRange: '₹35-70/kg',  region: 'Ooty, Tamil Nadu' },
  grapes:   { emoji: '🍇', name: 'Grapes',    grade: 'A+', tempRange: '0-2',   humidity: '90', shelfLife: '14-21 days', priceRange: '₹80-150/kg', region: 'Nashik, Maharashtra' },
};

let cameraStream = null;

function displayProduceResult(key) {
  const produce = PRODUCE_DATABASE[key];
  if (!produce) return;
  const resultEl = document.getElementById('cameraProduceResult');
  if (!resultEl) return;

  const btnConfirm = typeof window.t === 'function' ? window.t('camera_btn_confirm') : '✓ Confirm & Link to Batch';
  const btnChange = typeof window.t === 'function' ? window.t('camera_btn_change') : '↺ Change Produce';

  resultEl.innerHTML = `
    <div class="produce-result-card">
      <div class="produce-emoji-big">${produce.emoji}</div>
      <div class="produce-result-info">
        <div class="produce-result-name">${produce.name}</div>
        <div class="produce-result-grade">Grade ${produce.grade}</div>
        <div class="produce-result-meta">
          <span>🌡️ ${produce.tempRange}°C</span>
          <span>💧 ${produce.humidity}%</span>
          <span>⏱️ ${produce.shelfLife}</span>
          <span>💰 ${produce.priceRange}</span>
          <span>📍 ${produce.region}</span>
        </div>
        <div class="produce-result-actions">
          <button class="small-button" onclick="confirmProduceAndLink('${key}')">${btnConfirm}</button>
          <button class="small-button" onclick="showProduceSelector()">${btnChange}</button>
        </div>
      </div>
    </div>
  `;
  resultEl.style.display = 'block';
}

function confirmProduceAndLink(key) {
  const produce = PRODUCE_DATABASE[key];
  if (!produce) return;
  const cropNameEl = document.getElementById('cropName');
  if (cropNameEl) cropNameEl.value = produce.name.toUpperCase();
  const tempEl = document.getElementById('storageTemperature');
  if (tempEl) tempEl.value = parseFloat(produce.tempRange.split('-')[0]);
  const humidityEl = document.getElementById('storageHumidity');
  if (humidityEl) humidityEl.value = parseFloat(produce.humidity);
  const gradeEl = document.getElementById('qualityGrade');
  if (gradeEl) gradeEl.value = produce.grade.replace('+', '');
  
  if (typeof showToast === 'function') {
    showToast(`${produce.emoji} ${produce.name} linked to batch! Form auto-filled.`, 'success');
  }
  closeCameraModal();
  setTimeout(() => {
    const formEl = document.getElementById('records');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
  }, 500);
}

function showProduceSelector() {
  const selector = document.getElementById('produceSelectorGrid');
  if (!selector) return;
  selector.style.display = 'grid';
  selector.innerHTML = Object.entries(PRODUCE_DATABASE).map(([key, data]) =>
    `<button class="produce-select-btn" onclick="displayProduceResult('${key}')"><span>${data.emoji}</span><span>${data.name}</span></button>`
  ).join('');
}

function initCameraScanner() {
  const openBtn = document.getElementById('openCameraBtn');
  const closeBtn = document.getElementById('closeCameraBtn');
  const captureBtn = document.getElementById('captureProduceBtn');
  const modal = document.getElementById('cameraModal');
  const video = document.getElementById('cameraVideo');

  if (!openBtn || !modal) return;

  openBtn.addEventListener('click', async () => {
    modal.classList.add('open');
    const resultEl = document.getElementById('cameraProduceResult');
    if (resultEl) resultEl.style.display = 'none';
    const selectorGrid = document.getElementById('produceSelectorGrid');
    if (selectorGrid) selectorGrid.style.display = 'none';
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (video) { video.srcObject = cameraStream; video.play(); }
    } catch (err) {
      const feed = document.getElementById('cameraFeed');
      if (feed) feed.innerHTML = `<div class="camera-demo-mode"><div class="camera-demo-icon">📷</div><p>Camera unavailable or permission denied</p><p style="color:var(--muted);margin-top:6px;font-size:12.5px;">Manual Catalog Mode — Select produce directly below:</p></div>`;
      showProduceSelector();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeCameraModal);

  if (captureBtn) {
    captureBtn.addEventListener('click', () => {
      captureBtn.textContent = '🔍 Matching Catalog Entry...';
      captureBtn.disabled = true;
      const loadingEl = document.getElementById('recognitionLoader');
      if (loadingEl) loadingEl.style.display = 'flex';
      setTimeout(() => {
        const keys = Object.keys(PRODUCE_DATABASE);
        const key = keys[Math.floor(Math.random() * keys.length)];
        if (loadingEl) loadingEl.style.display = 'none';
        captureBtn.textContent = typeof window.t === 'function' ? window.t('camera_btn_identify') : '📷 Sample Catalog Match';
        captureBtn.disabled = false;
        displayProduceResult(key);
        if (typeof speak === 'function') {
          speak(`Sample matched: ${PRODUCE_DATABASE[key].name}, Grade ${PRODUCE_DATABASE[key].grade}. Price range ${PRODUCE_DATABASE[key].priceRange}.`);
        }
      }, 1200);
    });
  }
}

function closeCameraModal() {
  const modal = document.getElementById('cameraModal');
  if (modal) modal.classList.remove('open');
  if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; }
}

/* =========================================================
   QR CODE & TRACEABILITY DISPLAY
   ========================================================= */

function generateQRCode(text, container) {
  if (!container) return;
  container.innerHTML = '';
  const canvas = document.createElement('canvas');
  const size = 180;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#05130d';
  ctx.fillRect(0, 0, size, size);

  const hash = Array.from(text).reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) & 0xffffffff, 7);
  const grid = 21;
  const cell = size / grid;

  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      const isCorner =
        (r < 7 && c < 7) ||
        (r < 7 && c >= grid - 7) ||
        (r >= grid - 7 && c < 7);
      let filled = false;
      if (isCorner) {
        const lr = r < 7 ? r : r - (grid - 7);
        const lc = c < 7 ? c : c - (grid - 7);
        filled = (lr === 0 || lr === 6 || lc === 0 || lc === 6) || (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4);
      } else {
        const bit = ((hash ^ (r * 19 + c * 37)) & 0x7fffffff) % 3 === 0;
        filled = bit;
      }
      if (filled) {
        ctx.fillStyle = '#39ff88';
        ctx.fillRect(c * cell, r * cell, cell - 0.5, cell - 0.5);
      }
    }
  }
  container.appendChild(canvas);
}

function displayTraceabilityProfile(record, container) {
  if (!container) return;
  const harvestDate = record.harvest_date ? new Date(record.harvest_date).toLocaleDateString('en-IN') : 'N/A';
  const isVerified = !!record.blockchain_verified;
  const isDemo = !!record.is_demo;
  const qrData = `${window.location.origin}${window.location.pathname}#trace?lotId=${encodeURIComponent(record.lot_id)}`;
  const farmerCapture = record.farmer_price && record.consumer_price ? Math.round((record.farmer_price / record.consumer_price) * 100) : '--';

  const rawGrade = String(record.quality_grade || 'A').trim();
  const gradeDisplay = rawGrade.toLowerCase().startsWith('grade') ? rawGrade : `Grade ${rawGrade}`;

  const tOrigin = typeof window.t === 'function' ? window.t('label_origin') : 'Origin';
  const tHarvest = typeof window.t === 'function' ? window.t('label_harvest_date') : 'Harvest Date';
  const tGrade = typeof window.t === 'function' ? window.t('label_quality_grade') : 'Quality Grade';
  const tTemp = typeof window.t === 'function' ? window.t('label_temp') : 'Storage Temp';
  const tHumidity = typeof window.t === 'function' ? window.t('label_humidity') : 'Humidity';
  const tFarmerPrice = typeof window.t === 'function' ? window.t('label_farmer_price') : 'Farmer Price';
  const tConsumerPrice = typeof window.t === 'function' ? window.t('label_consumer_price') : 'Consumer Price';

  const tStep1 = typeof window.t === 'function' ? window.t('consumer_journey_harvest') : 'Harvested at Farm';
  const tStep2 = typeof window.t === 'function' ? window.t('consumer_journey_registered') : 'Registered on AgriTrace';
  const tStep3 = typeof window.t === 'function' ? window.t('consumer_journey_blockchain') : 'Blockchain Verified';
  const tStep4 = typeof window.t === 'function' ? window.t('consumer_journey_coldchain') : 'Cold Chain Monitored';
  const tStep5 = typeof window.t === 'function' ? window.t('consumer_journey_delivered') : 'Delivered to Market';

  const badgeClass = isDemo ? 'trace-badge-unverified' : (isVerified ? 'trace-badge-verified' : 'trace-badge-unverified');
  const badgeLabel = isDemo ? '📋 DEMO RECORD (OFF-CHAIN)' : (isVerified ? '✓ BLOCKCHAIN VERIFIED' : '⚠ UNVERIFIED');

  container.innerHTML = `
    <div class="trace-profile" style="background:#13281e !important; border:2px solid #34d399 !important; border-radius:18px !important; padding:24px !important; box-shadow:0 12px 36px rgba(0,0,0,0.4) !important; color:#ffffff !important;">
      <div class="trace-header" style="display:flex; justify-content:space-between; align-items:flex-start; padding-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.15); margin-bottom:18px; flex-wrap:wrap; gap:10px;">
        <div>
          <div class="trace-lot-id" style="font-size:13.5px; font-family:monospace; color:#34d399 !important; font-weight:800; letter-spacing:0.06em;">${escapeHtml(record.lot_id)}</div>
          <div class="trace-crop-name" style="font-size:28px; font-weight:900; color:#ffffff !important; margin-top:4px;">${escapeHtml(record.crop_name || 'Produce')}</div>
        </div>
        <div class="trace-badge ${badgeClass}" style="padding:6px 14px; font-size:12.5px; font-weight:800; border-radius:999px; background:${isVerified ? '#059669' : '#ea580c'} !important; color:#ffffff !important; border:1px solid ${isVerified ? '#34d399' : '#fb923c'} !important;">
          ${badgeLabel}
        </div>
      </div>
      <div class="trace-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:12px; margin-bottom:18px;">
        <div class="trace-item" style="background:rgba(255,255,255,0.08) !important; border:1px solid rgba(255,255,255,0.14) !important; border-radius:12px; padding:12px 16px; display:flex; align-items:center; gap:12px;"><span class="trace-icon" style="font-size:22px;">🌾</span><div><div class="trace-label" style="font-size:11.5px; text-transform:uppercase; letter-spacing:0.05em; color:#a7f3d0 !important; font-weight:800;">${tOrigin}</div><div class="trace-value" style="font-size:16px; font-weight:800; color:#ffffff !important;">${escapeHtml(record.origin || 'N/A')}</div></div></div>
        <div class="trace-item" style="background:rgba(255,255,255,0.08) !important; border:1px solid rgba(255,255,255,0.14) !important; border-radius:12px; padding:12px 16px; display:flex; align-items:center; gap:12px;"><span class="trace-icon" style="font-size:22px;">📅</span><div><div class="trace-label" style="font-size:11.5px; text-transform:uppercase; letter-spacing:0.05em; color:#a7f3d0 !important; font-weight:800;">${tHarvest}</div><div class="trace-value" style="font-size:16px; font-weight:800; color:#ffffff !important;">${harvestDate}</div></div></div>
        <div class="trace-item" style="background:rgba(255,255,255,0.08) !important; border:1px solid rgba(255,255,255,0.14) !important; border-radius:12px; padding:12px 16px; display:flex; align-items:center; gap:12px;"><span class="trace-icon" style="font-size:22px;">⭐</span><div><div class="trace-label" style="font-size:11.5px; text-transform:uppercase; letter-spacing:0.05em; color:#a7f3d0 !important; font-weight:800;">${tGrade}</div><div class="trace-value" style="font-size:16px; font-weight:800; color:#ffffff !important;">${escapeHtml(gradeDisplay)}</div></div></div>
        <div class="trace-item" style="background:rgba(255,255,255,0.08) !important; border:1px solid rgba(255,255,255,0.14) !important; border-radius:12px; padding:12px 16px; display:flex; align-items:center; gap:12px;"><span class="trace-icon" style="font-size:22px;">🌡️</span><div><div class="trace-label" style="font-size:11.5px; text-transform:uppercase; letter-spacing:0.05em; color:#a7f3d0 !important; font-weight:800;">${tTemp}</div><div class="trace-value" style="font-size:16px; font-weight:800; color:#ffffff !important;">${record.storage_temperature_c != null ? record.storage_temperature_c : '--'}°C</div></div></div>
        <div class="trace-item" style="background:rgba(255,255,255,0.08) !important; border:1px solid rgba(255,255,255,0.14) !important; border-radius:12px; padding:12px 16px; display:flex; align-items:center; gap:12px;"><span class="trace-icon" style="font-size:22px;">💧</span><div><div class="trace-label" style="font-size:11.5px; text-transform:uppercase; letter-spacing:0.05em; color:#a7f3d0 !important; font-weight:800;">${tHumidity}</div><div class="trace-value" style="font-size:16px; font-weight:800; color:#ffffff !important;">${record.storage_humidity_pct != null ? record.storage_humidity_pct : '--'}%</div></div></div>
        <div class="trace-item" style="background:rgba(255,255,255,0.08) !important; border:1px solid rgba(255,255,255,0.14) !important; border-radius:12px; padding:12px 16px; display:flex; align-items:center; gap:12px;"><span class="trace-icon" style="font-size:22px;">💰</span><div><div class="trace-label" style="font-size:11.5px; text-transform:uppercase; letter-spacing:0.05em; color:#a7f3d0 !important; font-weight:800;">${tFarmerPrice}</div><div class="trace-value" style="font-size:16px; font-weight:800; color:#ffffff !important;">₹${record.farmer_price != null ? record.farmer_price : '--'}/kg</div></div></div>
        <div class="trace-item" style="background:rgba(255,255,255,0.08) !important; border:1px solid rgba(255,255,255,0.14) !important; border-radius:12px; padding:12px 16px; display:flex; align-items:center; gap:12px;"><span class="trace-icon" style="font-size:22px;">🛒</span><div><div class="trace-label" style="font-size:11.5px; text-transform:uppercase; letter-spacing:0.05em; color:#a7f3d0 !important; font-weight:800;">${tConsumerPrice}</div><div class="trace-value" style="font-size:16px; font-weight:800; color:#ffffff !important;">₹${record.consumer_price != null ? record.consumer_price : '--'}/kg</div></div></div>
        <div class="trace-item" style="background:rgba(255,255,255,0.08) !important; border:1px solid rgba(255,255,255,0.14) !important; border-radius:12px; padding:12px 16px; display:flex; align-items:center; gap:12px;"><span class="trace-icon" style="font-size:22px;">📊</span><div><div class="trace-label" style="font-size:11.5px; text-transform:uppercase; letter-spacing:0.05em; color:#a7f3d0 !important; font-weight:800;">Farmer Share</div><div class="trace-value" style="font-size:16px; font-weight:800; color:#ffffff !important;">${farmerCapture}%</div></div></div>
      </div>
      <div class="trace-blockchain" style="background:rgba(0,0,0,0.45) !important; border:1px solid rgba(52,211,153,0.3) !important; border-radius:12px; padding:14px 18px; margin-bottom:18px;">
        <div class="trace-bc-title" style="font-size:12.5px; font-weight:800; letter-spacing:0.08em; color:#38bdf8 !important; margin-bottom:8px;">⛓ BLOCKCHAIN RECORD</div>
        <div class="trace-hash" style="display:flex; justify-content:space-between; font-size:13px; color:#cbd5e1 !important; margin-bottom:6px; flex-wrap:wrap; gap:6px;"><span style="color:#94a3b8 !important; font-weight:700;">Metadata Hash:</span><code style="font-family:monospace; color:#4ade80 !important; font-weight:700; background:rgba(0,0,0,0.4); padding:2px 6px; border-radius:4px;">${(record.metadata_hash || 'N/A').substring(0, 34)}…</code></div>
        ${record.blockchain_tx_hash ? `<div class="trace-hash" style="display:flex; justify-content:space-between; font-size:13px; color:#cbd5e1 !important; margin-bottom:4px; flex-wrap:wrap; gap:6px;"><span style="color:#94a3b8 !important; font-weight:700;">TX Hash:</span><code style="font-family:monospace; color:#4ade80 !important; font-weight:700; background:rgba(0,0,0,0.4); padding:2px 6px; border-radius:4px;">${record.blockchain_tx_hash.substring(0, 34)}…</code></div>` : ''}
      </div>
      <div class="trace-bottom" style="display:grid; grid-template-columns:auto 1fr; gap:22px; align-items:center; padding-top:16px; border-top:1px solid rgba(255,255,255,0.15);">
        <div>
          <div class="trace-label" style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#34d399 !important; margin-bottom:10px;">QR CODE</div>
          <div id="traceQRCode"></div>
        </div>
        <div class="trace-journey" style="display:flex; flex-direction:column; gap:9px;">
          <div class="trace-label" style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#34d399 !important; margin-bottom:4px;">SUPPLY CHAIN JOURNEY</div>
          <div class="journey-step done" style="display:flex; align-items:center; gap:10px; font-size:14.5px; color:#ffffff !important; font-weight:700;"><span>🌾</span> ${tStep1} — ${escapeHtml(record.origin || 'Farm')}</div>
          <div class="journey-step done" style="display:flex; align-items:center; gap:10px; font-size:14.5px; color:#ffffff !important; font-weight:700;"><span>📋</span> ${tStep2}</div>
          <div class="journey-step ${isVerified ? 'done' : 'pending'}" style="display:flex; align-items:center; gap:10px; font-size:14.5px; color:${isVerified ? '#ffffff' : '#94a3b8'} !important; font-weight:700;"><span>⛓</span> ${tStep3}</div>
          <div class="journey-step ${record.storage_temperature_c != null ? 'done' : 'pending'}" style="display:flex; align-items:center; gap:10px; font-size:14.5px; color:${record.storage_temperature_c != null ? '#ffffff' : '#94a3b8'} !important; font-weight:700;"><span>🚚</span> ${tStep4}</div>
          <div class="journey-step pending" style="display:flex; align-items:center; gap:10px; font-size:14.5px; color:#94a3b8 !important; font-weight:600;"><span>🛒</span> ${tStep5}</div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const qrContainer = document.getElementById('traceQRCode');
    if (qrContainer) generateQRCode(qrData, qrContainer);
  }, 80);
}

async function lookupAndShowQRRecord(lotId) {
  const resultEl = document.getElementById('qrModalResult');
  if (!resultEl) return;
  const cleanId = String(lotId || '').trim();
  if (!cleanId) return;

  const allRec = typeof allRecords !== 'undefined' ? allRecords : [];
  const demos = typeof DEMO_FALLBACK_RECORDS !== 'undefined' ? DEMO_FALLBACK_RECORDS : [];
  let record = [...allRec, ...demos].find(r => r.lot_id && r.lot_id.toLowerCase() === cleanId.toLowerCase());

  if (!record) {
    const listing = SELLER_LISTINGS.find(l => l.lotId.toLowerCase() === cleanId.toLowerCase());
    if (listing) {
      record = {
        lot_id: listing.lotId, crop_name: listing.crop, origin: listing.origin,
        harvest_date: listing.harvest, quality_grade: listing.grade,
        storage_temperature_c: listing.temp, storage_humidity_pct: listing.humidity,
        farmer_price: listing.askPrice, consumer_price: Math.round(listing.askPrice * 1.42),
        blockchain_verified: listing.verified, metadata_hash: '0xdemo' + listing.lotId,
        blockchain_tx_hash: listing.verified ? '0xtx' + listing.lotId : null,
        is_demo: true
      };
    }
  }

  // Query backend database/API if not cached in memory
  if (!record && typeof api === 'function') {
    resultEl.innerHTML = `<div style="text-align:center;padding:24px;color:var(--muted);">🔍 Searching database & blockchain for <strong>${escapeHtml(cleanId)}</strong>…</div>`;
    try {
      const res = await api(`/traceability/${encodeURIComponent(cleanId)}`);
      if (res && res.record) {
        record = res.record;
      }
    } catch (err) {
      console.warn("Backend lookup query notice:", err.message);
    }
  }

  if (record) {
    displayTraceabilityProfile(record, resultEl);
  } else {
    resultEl.innerHTML = `
      <div style="text-align:center;padding:28px 18px;color:#fca5a5;background:rgba(239,68,68,0.1);border-radius:10px;border:1px solid rgba(239,68,68,0.3);">
        <div style="font-size:28px;margin-bottom:6px;">⚠️</div>
        <h4 style="color:#f87171;margin-bottom:6px;">Lot Not Found</h4>
        <p style="font-size:13px;color:#e2e8f0;margin:0;">No registered produce record found for Lot ID: <strong>${escapeHtml(cleanId)}</strong>.</p>
      </div>
    `;
  }
}

function initQRScanner() {
  const openBtn = document.getElementById('openQRScannerBtn');
  const closeBtn = document.getElementById('closeQRScannerBtn');
  const modal = document.getElementById('qrScannerModal');
  const lookupBtn = document.getElementById('qrLookupBtn');
  const input = document.getElementById('qrLotInput');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      modal.classList.add('open');
      lookupAndShowQRRecord('DEMO-AGR-0001');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  }

  if (lookupBtn && input) {
    lookupBtn.addEventListener('click', () => {
      const val = input.value.trim();
      if (val) lookupAndShowQRRecord(val);
    });
  }
}

/* =========================================================
   FARMER DASHBOARD & OFFERS
   ========================================================= */

const FARMER_DATA = {
  farmer: { name: 'Rajan Krishnamurthy', id: 'FRM-TN-0042', location: 'Salem, Tamil Nadu', rating: 4.8, since: '2019' },
  produce: [
    { lotId: 'FARM-LOT-001', crop: 'Alphonso Mango', emoji: '🥭', qty: 250, unit: 'kg', grade: 'A+', askPrice: 85, offers: 3, status: 'active', verified: true },
    { lotId: 'FARM-LOT-002', crop: 'Roma Tomato',    emoji: '🍅', qty: 180, unit: 'kg', grade: 'A',  askPrice: 22, offers: 5, status: 'negotiating', verified: true },
    { lotId: 'FARM-LOT-003', crop: 'Guntur Chilli',  emoji: '🌶️', qty: 90,  unit: 'kg', grade: 'A+', askPrice: 55, offers: 2, status: 'sold', verified: true },
  ],
  earnings: { today: 4200, week: 18600, month: 72000, total: 328000 },
};

function renderFarmerDashboard() {
  const infoEl = document.getElementById('farmerInfo');
  if (infoEl) {
    const user = typeof agriCurrentUser !== 'undefined' && agriCurrentUser ? agriCurrentUser : null;
    if (user && user.role === 'farmer') {
      infoEl.innerHTML = `
        <div class="dash-profile">
          <div class="dash-avatar">👨‍🌾</div>
          <div class="dash-profile-info">
            <div class="dash-name">${escapeHtml(user.name)}</div>
            <div class="dash-id">${escapeHtml(user.email)}</div>
            <div class="dash-location">📍 ${escapeHtml(user.location || 'Tamil Nadu, India')}</div>
            <div class="dash-meta"><span>⭐ 4.9/5.0</span><span>Verified Farmer Account</span></div>
          </div>
        </div>
      `;
    } else {
      const f = FARMER_DATA.farmer;
      infoEl.innerHTML = `
        <div class="dash-profile">
          <div class="dash-avatar">👨‍🌾</div>
          <div class="dash-profile-info">
            <div class="dash-name">${f.name}</div>
            <div class="dash-id">${f.id}</div>
            <div class="dash-location">📍 ${f.location}</div>
            <div class="dash-meta"><span>⭐ ${f.rating}/5.0</span><span>Since ${f.since}</span></div>
          </div>
        </div>
      `;
    }
  }

  const earningsEl = document.getElementById('farmerEarnings');
  if (earningsEl) {
    const e = FARMER_DATA.earnings;
    const tToday = typeof window.t === 'function' ? window.t('farmer_earnings_today') : 'Today';
    const tWeek = typeof window.t === 'function' ? window.t('farmer_earnings_week') : 'This Week';
    const tMonth = typeof window.t === 'function' ? window.t('farmer_earnings_month') : 'This Month';
    const tTotal = typeof window.t === 'function' ? window.t('farmer_earnings_total') : 'Total Earnings';

    earningsEl.innerHTML = `
      <div class="earnings-grid">
        <div class="earning-card"><span>${tToday}</span><strong>₹${e.today.toLocaleString('en-IN')}</strong></div>
        <div class="earning-card"><span>${tWeek}</span><strong>₹${e.week.toLocaleString('en-IN')}</strong></div>
        <div class="earning-card"><span>${tMonth}</span><strong>₹${e.month.toLocaleString('en-IN')}</strong></div>
        <div class="earning-card earning-total"><span>${tTotal}</span><strong>₹${e.total.toLocaleString('en-IN')}</strong></div>
      </div>
    `;
  }

  const listEl = document.getElementById('farmerProduceList');
  if (listEl) {
    const btnOffers = typeof window.t === 'function' ? window.t('farmer_btn_offers') : 'View Offers';
    const btnQR = typeof window.t === 'function' ? window.t('farmer_btn_qr') : 'QR Code';
    const btnTrace = typeof window.t === 'function' ? window.t('farmer_btn_trace') : 'Trace';

    const realLots = (typeof allRecords !== 'undefined' && Array.isArray(allRecords)) ? allRecords.filter(r => !r.is_demo) : [];
    
    let produceItems = [];
    if (realLots.length > 0) {
      produceItems = realLots.map(r => ({
        lotId: r.lot_id,
        crop: r.crop_name,
        emoji: '🌱',
        qty: r.quantity || '500',
        unit: 'kg',
        grade: r.quality_grade || 'A',
        askPrice: r.farmer_price || 0,
        offers: 1,
        status: r.blockchain_verified ? 'verified' : (r.blockchain_tx_hash ? 'anchored' : 'registered'),
        isReal: true
      }));
    }

    produceItems = produceItems.concat(FARMER_DATA.produce.map(p => ({ ...p, isReal: false })));

    listEl.innerHTML = produceItems.map(p => `
      <div class="produce-row produce-status-${p.status}">
        <div class="produce-row-left">
          <span class="produce-row-emoji">${p.emoji}</span>
          <div>
            <div class="produce-row-lot">${escapeHtml(p.lotId)} ${p.isReal ? '<span style="color:#4ade80;font-size:10px;font-weight:700;margin-left:4px;">● REGISTRY</span>' : '<span style="color:var(--muted);font-size:10px;margin-left:4px;">[DEMO]</span>'}</div>
            <div class="produce-row-name">${escapeHtml(p.crop)}</div>
          </div>
        </div>
        <div class="produce-row-right">
          <span>${escapeHtml(String(p.qty))} ${escapeHtml(p.unit || 'kg')}</span>
          <span>Grade ${escapeHtml(p.grade)}</span>
          <span>₹${Number(p.askPrice)}/kg</span>
          <span class="offers-count">${p.offers} offer${p.offers !== 1 ? 's' : ''}</span>
          <span class="status-badge status-${p.status}">${p.status.toUpperCase()}</span>
        </div>
        <div class="produce-row-actions">
          ${p.status !== 'sold' ? `<button class="small-button" onclick="viewFarmerOffers('${escapeHtml(p.lotId)}')">${btnOffers}</button>` : `<span class="sold-label">✓ SOLD</span>`}
          <button class="small-button" onclick="generateBatchQR('${escapeHtml(p.lotId)}')">${btnQR}</button>
          <button class="small-button" onclick="lookupAndShowQRRecord('${escapeHtml(p.lotId)}'); document.getElementById('qrScannerModal').classList.add('open')">${btnTrace}</button>
        </div>
      </div>
    `).join('');
  }
}

const DEMO_OFFERS = {
  'FARM-LOT-001': [
    { seller: 'Ramesh Traders, Coimbatore', price: 80, qty: 100, time: '2 hours ago', status: 'new' },
    { seller: 'Chennai Fresh Market', price: 78, qty: 200, time: '4 hours ago', status: 'new' },
    { seller: 'AgroHub Direct, Bangalore', price: 75, qty: 250, time: '1 day ago', status: 'reviewing' },
  ],
  'FARM-LOT-002': [
    { seller: 'Metro Retail, Chennai', price: 21, qty: 50, time: '30 min ago', status: 'new' },
    { seller: 'Koyambedu Market', price: 20, qty: 100, time: '2 hours ago', status: 'new' },
    { seller: 'FreshDirect Logistics', price: 19, qty: 180, time: '6 hours ago', status: 'reviewing' },
    { seller: 'GreenMart, Salem', price: 22, qty: 80, time: '8 hours ago', status: 'new' },
    { seller: 'Agri Wholesale Hub', price: 18, qty: 180, time: '1 day ago', status: 'reviewing' },
  ],
};

function viewFarmerOffers(lotId) {
  const modal = document.getElementById('offersModal');
  if (!modal) return;
  const titleEl = document.getElementById('offersModalTitle');
  const contentEl = document.getElementById('offersModalContent');
  if (titleEl) {
    titleEl.textContent = `${typeof window.t === 'function' ? window.t('farmer_offers_title') : 'Offers for'} ${lotId}`;
  }

  const offers = DEMO_OFFERS[lotId] || [
    { seller: 'Cooperative Mandi Buyer', price: 50, qty: 100, time: 'Just now', status: 'new' }
  ];

  const tAccept = typeof window.t === 'function' ? window.t('farmer_accept_btn') : '✓ Accept';
  const tCounter = typeof window.t === 'function' ? window.t('farmer_counter_btn') : '↺ Counter';
  const tDecline = typeof window.t === 'function' ? window.t('farmer_decline_btn') : '✕ Decline';

  if (contentEl) contentEl.innerHTML = offers.map((o, i) => `
    <div class="offer-card offer-${o.status}">
      <div class="offer-main">
        <div>
          <div class="offer-seller">${o.seller}</div>
          <div class="offer-meta">${o.qty} kg &nbsp;•&nbsp; ${o.time} &nbsp;•&nbsp; <span class="offer-status-tag">${o.status}</span></div>
        </div>
        <div class="offer-price">₹${o.price}/kg</div>
      </div>
      <div class="offer-actions">
        <button class="small-button accept-btn" onclick="acceptFarmerOffer(${i}, '${lotId}', ${o.price})">${tAccept}</button>
        <button class="small-button counter-btn" onclick="counterFarmerOffer(${i}, ${o.price})">${tCounter}</button>
        <button class="small-button reject-btn" onclick="this.closest('.offer-card').style.opacity='0.4'">${tDecline}</button>
      </div>
    </div>
  `).join('');

  modal.classList.add('open');
}

function acceptFarmerOffer(idx, lotId, price) {
  confirmSensitiveAction(
    'Accept Offer & Initiate Transaction',
    `Are you sure you want to accept the offer of ₹${price}/kg for lot ${lotId}? This will create an on-chain settlement agreement and award completion points.`,
    () => {
      const modal = document.getElementById('offersModal');
      if (modal) modal.classList.remove('open');
      if (typeof showToast === 'function') {
        showToast(typeof window.t === 'function' ? window.t('toast_offer_accepted') : `✓ Offer of ₹${price}/kg accepted for ${lotId}!`, 'success');
      }
      if (typeof speak === 'function') {
        speak(`Offer of ₹${price} per kg accepted for lot ${lotId}. Blockchain settlement initiated.`);
      }

      // Sync with database orders & award product completion points
      const token = localStorage.getItem('agritrace_jwt_token');
      if (token) {
        const apiBase = (typeof API_BASE !== 'undefined' ? API_BASE : (window.API_BASE || 'http://127.0.0.1:4001/api'));
        fetch(`${apiBase}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            produceRecordId: lotId,
            cropName: lotId,
            quantity: 100,
            unitPrice: price,
            notes: `Accepted offer for ${lotId} at ₹${price}/kg`
          })
        }).then(r => r.json()).then(ordData => {
          if (ordData && ordData.order) {
            return fetch(`${apiBase}/orders/${ordData.order.id}/status`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ status: 'completed' })
            });
          }
        }).then(() => {
          if (typeof renderFarmerPortal === 'function') renderFarmerPortal();
        }).catch(err => console.warn('Order completion notice:', err));
      }
    }
  );
}

function counterFarmerOffer(idx, currentPrice) {
  const price = prompt(`Counter offer (current: ₹${currentPrice}/kg)\nEnter your counter price (₹/kg):`);
  if (price && !isNaN(price) && parseFloat(price) > 0) {
    const modal = document.getElementById('offersModal');
    if (modal) modal.classList.remove('open');
    if (typeof showToast === 'function') {
      showToast(typeof window.t === 'function' ? window.t('toast_counter_sent') : `Counter offer of ₹${price}/kg sent successfully!`, 'success');
    }
  }
}

function generateBatchQR(lotId) {
  const modal = document.getElementById('batchQRModal');
  if (!modal) return;
  const lotIdEl = document.getElementById('batchQRLotId');
  if (lotIdEl) lotIdEl.textContent = lotId;
  const qrContainer = document.getElementById('batchQRCode');
  const targetUrl = `${window.location.origin}${window.location.pathname}#trace?lotId=${encodeURIComponent(lotId)}`;
  if (qrContainer) generateQRCode(targetUrl, qrContainer);
  modal.classList.add('open');
  if (typeof showToast === 'function') showToast(`QR Code generated for ${lotId}`, 'success');
}

/* =========================================================
   SELLER MARKETPLACE
   ========================================================= */

const SELLER_LISTINGS = [
  { lotId: 'FARM-LOT-001', crop: 'Alphonso Mango', emoji: '🥭', qty: 250, grade: 'A+', askPrice: 85,  origin: 'Salem, TN',      harvest: '2026-10-04', farmer: 'Rajan K.',    verified: true,  temp: 9.2, humidity: 87 },
  { lotId: 'FARM-LOT-002', crop: 'Roma Tomato',    emoji: '🍅', qty: 180, grade: 'A',  askPrice: 22,  origin: 'Hosur, TN',      harvest: '2026-10-05', farmer: 'Priya M.',    verified: true,  temp: 12,  humidity: 82 },
  { lotId: 'FARM-LOT-004', crop: 'Onion',          emoji: '🧅', qty: 400, grade: 'B',  askPrice: 28,  origin: 'Nashik, MH',     harvest: '2026-10-03', farmer: 'Suresh P.',   verified: false, temp: 4,   humidity: 67 },
  { lotId: 'FARM-LOT-005', crop: 'Banana',         emoji: '🍌', qty: 150, grade: 'A',  askPrice: 38,  origin: 'Trichy, TN',     harvest: '2026-10-06', farmer: 'Kavitha R.',  verified: true,  temp: 14,  humidity: 88 },
  { lotId: 'FARM-LOT-006', crop: 'Guntur Chilli',  emoji: '🌶️', qty: 75,  grade: 'A+', askPrice: 58,  origin: 'Guntur, AP',     harvest: '2026-10-02', farmer: 'Reddy S.',    verified: true,  temp: 8.5, humidity: 81 },
  { lotId: 'FARM-LOT-007', crop: 'Capsicum',       emoji: '🫑', qty: 120, grade: 'A',  askPrice: 45,  origin: 'Ooty, TN',       harvest: '2026-10-05', farmer: 'Kumar V.',    verified: true,  temp: 8,   humidity: 91 },
  { lotId: 'FARM-LOT-008', crop: 'Potato',         emoji: '🥔', qty: 500, grade: 'A',  askPrice: 18,  origin: 'Agra, UP',       harvest: '2026-10-01', farmer: 'Sharma R.',   verified: true,  temp: 6,   humidity: 92 },
  { lotId: 'FARM-LOT-009', crop: 'Grapes',         emoji: '🍇', qty: 80,  grade: 'A+', askPrice: 110, origin: 'Nashik, MH',     harvest: '2026-10-06', farmer: 'Patil A.',    verified: true,  temp: 1.5, humidity: 91 },
];

function renderSellerMarketplace(filter) {
  const listEl = document.getElementById('sellerListingGrid');
  if (!listEl) return;
  const f = (filter || '').toLowerCase().trim();
  const filtered = SELLER_LISTINGS.filter(l =>
    !f || l.crop.toLowerCase().includes(f) || l.origin.toLowerCase().includes(f) ||
    l.grade.toLowerCase().includes(f) || l.farmer.toLowerCase().includes(f)
  );

  if (filtered.length === 0) {
    listEl.innerHTML = '<p style="color:var(--muted);text-align:center;padding:30px;grid-column:1/-1;">No listings match your search.</p>';
    return;
  }

  const tAvailable = typeof window.t === 'function' ? window.t('seller_available') : 'available';
  const tHarvested = typeof window.t === 'function' ? window.t('seller_harvested') : 'Harvested';
  const tOffer = typeof window.t === 'function' ? window.t('seller_make_offer') : 'Make Offer';
  const tTrace = typeof window.t === 'function' ? window.t('seller_view_trace') : 'View Trace';

  listEl.innerHTML = filtered.map(l => {
    const harvestDate = new Date(l.harvest).toLocaleDateString('en-IN');
    return `
      <div class="seller-listing-card">
        <div class="listing-top">
          <div class="listing-emoji-big">${l.emoji}</div>
          <div class="listing-verified-badge ${l.verified ? 'verified' : 'unverified'}">${l.verified ? '✓ VERIFIED' : '⚠ UNVERIFIED'}</div>
        </div>
        <div class="listing-crop-name">${l.crop}</div>
        <div class="listing-grade">Grade ${l.grade}</div>
        <div class="listing-details">
          <div class="listing-detail"><span>📦</span>${l.qty} kg ${tAvailable}</div>
          <div class="listing-detail"><span>📍</span>${l.origin}</div>
          <div class="listing-detail"><span>👨‍🌾</span>${l.farmer}</div>
          <div class="listing-detail"><span>📅</span>${tHarvested} ${harvestDate}</div>
          <div class="listing-detail"><span>🌡️</span>${l.temp}°C &nbsp; 💧 ${l.humidity}%</div>
        </div>
        <div class="listing-footer">
          <div class="listing-ask-price">₹${l.askPrice}<span>/kg</span></div>
          <div class="listing-actions">
            <button class="small-button offer-btn" onclick="makeSellerOffer('${l.lotId}', ${l.askPrice}, '${l.crop}')">${tOffer}</button>
            <button class="small-button" onclick="openQRForLot('${l.lotId}')">${tTrace}</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openQRForLot(lotId) {
  const modal = document.getElementById('qrScannerModal');
  if (modal) modal.classList.add('open');
  setTimeout(() => lookupAndShowQRRecord(lotId), 100);
}

function makeSellerOffer(lotId, askPrice, cropName) {
  const offerPrice = prompt(`Make an offer for ${cropName} (${lotId})\nFarmer asking: ₹${askPrice}/kg\n\nYour offer price (₹/kg):`);
  if (offerPrice && !isNaN(offerPrice) && parseFloat(offerPrice) > 0) {
    confirmSensitiveAction(
      'Submit Purchase Offer',
      `Confirm submitting an offer of ₹${offerPrice}/kg for lot ${lotId} (${cropName})?`,
      () => {
        if (typeof showToast === 'function') {
          showToast(`✓ Offer of ₹${offerPrice}/kg submitted for ${lotId}`, 'success');
        }
        if (typeof speak === 'function') {
          speak(`Offer of ₹${offerPrice} per kg submitted for ${cropName}.`);
        }

        // Create purchase order in database
        const token = localStorage.getItem('agritrace_jwt_token');
        if (token) {
          const apiBase = (typeof API_BASE !== 'undefined' ? API_BASE : (window.API_BASE || 'http://127.0.0.1:4001/api'));
          fetch(`${apiBase}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
              produceRecordId: lotId,
              cropName: cropName,
              quantity: 100,
              unitPrice: parseFloat(offerPrice),
              notes: `Seller offer of ₹${offerPrice}/kg for ${lotId}`
            })
          }).then(r => r.json()).then(() => {
            if (typeof renderSellerPortal === 'function') renderSellerPortal();
          }).catch(e => console.warn('Order offer notice:', e));
        }
      }
    );
  }
}

function initSellerMarketplace() {
  const searchInput = document.getElementById('sellerSearchInput');
  if (searchInput) searchInput.addEventListener('input', () => renderSellerMarketplace(searchInput.value));

  document.querySelectorAll('.seller-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.seller-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (searchInput) searchInput.value = '';
      renderSellerMarketplace(btn.dataset.filter || '');
    });
  });

  renderSellerMarketplace();
}

/* =========================================================
   CONSUMER VERIFICATION
   ========================================================= */

function initConsumerVerification() {
  const scanBtn = document.getElementById('consumerScanBtn');
  const lotInput = document.getElementById('consumerLotInput');
  const resultEl = document.getElementById('consumerTraceResult');

  if (scanBtn && lotInput) {
    const doLookup = () => {
      const lotId = lotInput.value.trim();
      if (!lotId) {
        if (typeof showToast === 'function') showToast('Please enter a Lot ID to verify', 'error');
        return;
      }
      if (resultEl) {
        resultEl.style.display = 'block';
        resultEl.innerHTML = `<div style="text-align:center;padding:30px;"><div class="scan-spinner"></div><p style="margin-top:14px;color:var(--muted);">Verifying ${escapeHtml(lotId)}…</p></div>`;
      }

      let record = null;
      const allRec = typeof allRecords !== 'undefined' ? allRecords : [];
      const demos = typeof DEMO_FALLBACK_RECORDS !== 'undefined' ? DEMO_FALLBACK_RECORDS : [];
      record = [...allRec, ...demos].find(r => r.lot_id && r.lot_id.toLowerCase() === lotId.toLowerCase());

      if (!record) {
        const listing = SELLER_LISTINGS.find(l => l.lotId.toLowerCase() === lotId.toLowerCase());
        if (listing) {
          record = {
            lot_id: listing.lotId, crop_name: listing.crop, origin: listing.origin,
            harvest_date: listing.harvest, quality_grade: listing.grade,
            storage_temperature_c: listing.temp, storage_humidity_pct: listing.humidity,
            farmer_price: listing.askPrice, consumer_price: Math.round(listing.askPrice * 1.42),
            blockchain_verified: listing.verified, metadata_hash: '0xdemo' + listing.lotId,
            blockchain_tx_hash: listing.verified ? '0xtx' + listing.lotId : null,
          };
        }
      }

      setTimeout(() => {
        if (resultEl) {
          if (record) {
            displayTraceabilityProfile(record, resultEl);
          } else {
            resultEl.innerHTML = `<div style="text-align:center;padding:30px;color:var(--muted);"><div style="font-size:40px;margin-bottom:12px;">🔍</div><p>No record found for <strong style="color:var(--green)">${escapeHtml(lotId)}</strong></p><p style="font-size:13px;margin-top:10px;">Try: DEMO-AGR-0001 &nbsp;|&nbsp; DEMO-AGR-0002 &nbsp;|&nbsp; FARM-LOT-001</p></div>`;
          }
        }
      }, 700);
    };

    scanBtn.addEventListener('click', doLookup);
    lotInput.addEventListener('keydown', e => { if (e.key === 'Enter') doLookup(); });
  }

  document.querySelectorAll('.consumer-demo-scan').forEach(btn => {
    btn.addEventListener('click', () => {
      const lotId = btn.dataset.lotId;
      if (lotId && lotInput) { lotInput.value = lotId; if (scanBtn) scanBtn.click(); }
    });
  });
}

/* =========================================================
   SMART ALERTS
   ========================================================= */

const SMART_ALERTS = [
  { type: 'warning', icon: '🌡️', title: 'Temperature Alert',    msg: 'Lot FARM-LOT-002: 18°C — above optimal threshold (10-15°C)', time: '5 min ago' },
  { type: 'info',    icon: '💰', title: 'New Offer Received',   msg: 'Ramesh Traders offered ₹80/kg for FARM-LOT-001 (250 kg)',     time: '12 min ago' },
  { type: 'success', icon: '✓',  title: 'Delivery Confirmed',   msg: 'DEMO-AGR-0003 delivered to Chennai Koyambedu Market',         time: '1 hour ago' },
  { type: 'warning', icon: '💧', title: 'Humidity High',         msg: 'Lot FARM-LOT-005: 96% humidity — near upper threshold',      time: '2 hours ago' },
  { type: 'info',    icon: '⛓', title: 'Blockchain Verified',   msg: 'FARM-LOT-006 successfully anchored on Ethereum',              time: '3 hours ago' },
];

function renderAlerts() {
  const alertsHtml = SMART_ALERTS.map(a => `
    <div class="alert-item alert-${a.type}">
      <div class="alert-icon-wrap">${a.icon}</div>
      <div class="alert-body">
        <div class="alert-title">${a.title}</div>
        <div class="alert-msg">${a.msg}</div>
        <div class="alert-time">${a.time}</div>
      </div>
    </div>
  `).join('');

  const alertsEl = document.getElementById('smartAlertsList');
  if (alertsEl) alertsEl.innerHTML = alertsHtml;

  const sidebarEl = document.getElementById('smartAlertsListSidebar');
  if (sidebarEl) sidebarEl.innerHTML = alertsHtml;

  const badge = document.getElementById('alertBadge');
  const warnings = SMART_ALERTS.filter(a => a.type === 'warning').length;
  if (badge) {
    badge.textContent = warnings;
    badge.style.display = warnings > 0 ? 'inline-flex' : 'none';
  }
}

/* =========================================================
   MODAL CLOSING & NAVIGATION
   ========================================================= */

function initModalClose() {
  document.querySelectorAll('.feat-modal').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.classList.remove('open');
        closeCameraModal();
      }
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.feat-modal.open').forEach(m => m.classList.remove('open'));
      closeCameraModal();
    }
  });

  const closeBatchQR = document.getElementById('closeBatchQRBtn');
  if (closeBatchQR) closeBatchQR.addEventListener('click', () => {
    const m = document.getElementById('batchQRModal');
    if (m) m.classList.remove('open');
  });

  const closeOffers = document.getElementById('closeOffersModalBtn');
  if (closeOffers) closeOffers.addEventListener('click', () => {
    const m = document.getElementById('offersModal');
    if (m) m.classList.remove('open');
  });

  const closeBuilder = document.getElementById('closeBuilderModalBtn');
  if (closeBuilder) closeBuilder.addEventListener('click', () => {
    const m = document.getElementById('builderModal');
    if (m) m.classList.remove('open');
  });

  const closeHardhat = document.getElementById('closeHardhatModalBtn');
  if (closeHardhat) closeHardhat.addEventListener('click', () => {
    const m = document.getElementById('hardhatModal');
    if (m) m.classList.remove('open');
  });

  const closeAllLang = document.getElementById('closeAllLangModalBtn');
  if (closeAllLang) closeAllLang.addEventListener('click', () => {
    const m = document.getElementById('allLangModal');
    if (m) m.classList.remove('open');
  });
}

function initBuilderProfile() {
  const openModal = () => {
    const modal = document.getElementById('builderModal');
    if (modal) modal.classList.add('open');
  };

  const navBuilderBtn = document.getElementById('builderInfoBtn');
  if (navBuilderBtn) navBuilderBtn.addEventListener('click', openModal);

  const heroBuilderBadge = document.getElementById('heroBuilderBadge');
  if (heroBuilderBadge) heroBuilderBadge.addEventListener('click', openModal);

  const floatBuilderBtn = document.getElementById('floatBuilderBtn');
  if (floatBuilderBtn) floatBuilderBtn.addEventListener('click', openModal);
}

function initHardhatLocalModal() {
  const openModal = () => {
    const modal = document.getElementById('hardhatModal');
    if (modal) {
      modal.classList.add('open');
      if (typeof updateWalletUI === 'function') {
        updateWalletUI();
      }
    }
  };

  const navBtn = document.getElementById('hardhatAccountBtn');
  if (navBtn) navBtn.addEventListener('click', openModal);

  const floatBtn = document.getElementById('floatHardhatBtn');
  if (floatBtn) floatBtn.addEventListener('click', openModal);

  const closeBtn = document.getElementById('closeHardhatModalBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      const modal = document.getElementById('hardhatModal');
      if (modal) modal.classList.remove('open');
    });
  }

  const connectBtn = document.getElementById('btnModalConnectMetaMask');
  if (connectBtn) {
    connectBtn.addEventListener('click', () => {
      if (typeof connectWallet === 'function') {
        connectWallet();
      }
    });
  }
}

function initAllLanguageModal() {
  const modal = document.getElementById('allLangModal');
  const openBtn = document.getElementById('allLangModalBtn');
  const floatBtn = document.getElementById('floatTranslateBtn');
  const mBtn = document.getElementById('m-allLangModalBtn');

  const openModal = () => { if (modal) modal.classList.add('open'); };

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (floatBtn) floatBtn.addEventListener('click', openModal);
  if (mBtn) mBtn.addEventListener('click', openModal);

  const grid = document.getElementById('allLangGrid');
  if (grid && typeof SUPPORTED_LANGUAGES !== 'undefined') {
    grid.innerHTML = SUPPORTED_LANGUAGES.map(lang => `
      <div class="all-lang-item" data-code="${lang.code}">
        <span class="all-lang-flag">${lang.flag}</span>
        <div class="all-lang-info">
          <strong>${lang.native}</strong>
          <small>${lang.name}</small>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.all-lang-item').forEach(item => {
      item.addEventListener('click', () => {
        if (typeof window.setLanguage === 'function') {
          window.setLanguage(item.dataset.code);
        }
        if (modal) modal.classList.remove('open');
      });
    });
  }
}

// Global exports
window.toggleClearTextView = toggleClearTextView;
window.setTextSize = setTextSize;
window.processVoiceCommand = processVoiceCommand;
window.speak = speak;
window.stopSpeaking = stopSpeaking;
window.startListening = startListening;
window.stopListening = stopListening;
window.viewFarmerOffers = viewFarmerOffers;
window.acceptFarmerOffer = acceptFarmerOffer;
window.counterFarmerOffer = counterFarmerOffer;
window.makeSellerOffer = makeSellerOffer;
window.generateBatchQR = generateBatchQR;
window.lookupAndShowQRRecord = lookupAndShowQRRecord;
window.confirmProduceAndLink = confirmProduceAndLink;
window.showProduceSelector = showProduceSelector;
window.displayProduceResult = displayProduceResult;
window.confirmSensitiveAction = confirmSensitiveAction;
window.updateVoiceAssistantLanguage = updateVoiceAssistantLanguage;

/* =========================================================
   MAIN DOM INIT & EVENT BUS
   ========================================================= */

/* ---------------------------------------------------------
   HERO TITLE CYCLIC PRODUCE ANIMATION
   Cyclic transition between:
   - "FROM FARM TO MARKET / WITH COMPLETE TRANSPARENCY"
   - Different fruits and different vegetables one by one!
   --------------------------------------------------------- */
function initHeroProduceCycler() {
  const line1El = document.getElementById('heroLine1');
  const line2El = document.getElementById('heroLine2');
  const titleEl = document.getElementById('heroProduceTitle');
  if (!line1El || !line2El || !titleEl) return;

  const PRODUCE_SETS = {
    en: [
      {
        line1: 'FROM <span class="gradient-text hero-text-glow">FARM</span> TO <span class="gradient-text hero-text-glow">MARKET</span>',
        line2: 'WITH <span class="gradient-text hero-text-glow">COMPLETE</span> <span class="gradient-text hero-text-glow">TRANSPARENCY</span>'
      },
      {
        line1: 'CRISP ORGANIC <span class="gradient-text hero-text-glow">APPLES</span> <span class="hero-produce-badge">🍎</span>',
        line2: 'FRESH GARDEN <span class="gradient-text hero-text-glow">CARROTS</span> <span class="hero-produce-badge">🥕</span>'
      },
      {
        line1: 'GOLDEN RIPE <span class="gradient-text hero-text-glow">MANGOES</span> <span class="hero-produce-badge">🥭</span>',
        line2: 'VIBRANT CRISP <span class="gradient-text hero-text-glow">BELL PEPPERS</span> <span class="hero-produce-badge">🫑</span>'
      },
      {
        line1: 'SWEET RED <span class="gradient-text hero-text-glow">STRAWBERRIES</span> <span class="hero-produce-badge">🍓</span>',
        line2: 'TENDER GREEN <span class="gradient-text hero-text-glow">BROCCOLI</span> <span class="hero-produce-badge">🥦</span>'
      },
      {
        line1: 'FARM FRESH <span class="gradient-text hero-text-glow">TOMATOES</span> <span class="hero-produce-badge">🍅</span>',
        line2: 'ORGANIC BABY <span class="gradient-text hero-text-glow">SPINACH</span> <span class="hero-produce-badge">🥬</span>'
      },
      {
        line1: 'SUN-RIPENED <span class="gradient-text hero-text-glow">ORANGES</span> <span class="hero-produce-badge">🍊</span>',
        line2: 'COOL CRISP <span class="gradient-text hero-text-glow">CUCUMBERS</span> <span class="hero-produce-badge">🥒</span>'
      },
      {
        line1: 'GOLDEN SWEET <span class="gradient-text hero-text-glow">CORN</span> <span class="hero-produce-badge">🌽</span>',
        line2: 'EARTHY HARVEST <span class="gradient-text hero-text-glow">POTATOES</span> <span class="hero-produce-badge">🥔</span>'
      },
      {
        line1: 'LUSH GREEN <span class="gradient-text hero-text-glow">WATERMELONS</span> <span class="hero-produce-badge">🍉</span>',
        line2: 'PLUMP PURPLE <span class="gradient-text hero-text-glow">EGGPLANTS</span> <span class="hero-produce-badge">🍆</span>'
      }
    ],
    ta: [
      {
        line1: 'பண்ணையிலிருந்து <span class="gradient-text hero-text-glow">சந்தைக்கு</span>',
        line2: 'முழுமையான <span class="gradient-text hero-text-glow">வெளிப்படைத்தன்மையுடன்</span>'
      },
      {
        line1: 'சுவையான ஆர்கானிக் <span class="gradient-text hero-text-glow">ஆப்பிள்கள்</span> <span class="hero-produce-badge">🍎</span>',
        line2: 'புதிய தோட்டத்து <span class="gradient-text hero-text-glow">கேரட்டுகள்</span> <span class="hero-produce-badge">🥕</span>'
      },
      {
        line1: 'தித்திக்கும் பழுத்த <span class="gradient-text hero-text-glow">மாம்பழங்கள்</span> <span class="hero-produce-badge">🥭</span>',
        line2: 'வண்ணக் குடைமிளகாய் <span class="gradient-text hero-text-glow">பெப்பர்ஸ்</span> <span class="hero-produce-badge">🫑</span>'
      },
      {
        line1: 'இனிப்பு செந்தேனி <span class="gradient-text hero-text-glow">ஸ்ட்ராபெர்ரி</span> <span class="hero-produce-badge">🍓</span>',
        line2: 'பச்சை பசுமையான <span class="gradient-text hero-text-glow">ப்ரோக்கோலி</span> <span class="hero-produce-badge">🥦</span>'
      },
      {
        line1: 'பண்ணை பசுமை <span class="gradient-text hero-text-glow">தக்காளி</span> <span class="hero-produce-badge">🍅</span>',
        line2: 'ஆர்கானிக் சுவை <span class="gradient-text hero-text-glow">பசலைக்கீரை</span> <span class="hero-produce-badge">🥬</span>'
      },
      {
        line1: 'இனிப்பு பொன் <span class="gradient-text hero-text-glow">சோளம்</span> <span class="hero-produce-badge">🌽</span>',
        line2: 'மண்மணம் கமழும் <span class="gradient-text hero-text-glow">உருளைக்கிழங்கு</span> <span class="hero-produce-badge">🥔</span>'
      }
    ],
    hi: [
      {
        line1: 'खेत से <span class="gradient-text hero-text-glow">बाजार तक</span>',
        line2: 'पूर्ण <span class="gradient-text hero-text-glow">पारदर्शिता के साथ</span>'
      },
      {
        line1: 'स्वादिष्ट जैविक <span class="gradient-text hero-text-glow">सेब</span> <span class="hero-produce-badge">🍎</span>',
        line2: 'ताजा बागवानी <span class="gradient-text hero-text-glow">गाजर</span> <span class="hero-produce-badge">🥕</span>'
      },
      {
        line1: 'मीठे पके हुए <span class="gradient-text hero-text-glow">आम</span> <span class="hero-produce-badge">🥭</span>',
        line2: 'रंगीन शिमला <span class="gradient-text hero-text-glow">मिर्च</span> <span class="hero-produce-badge">🫑</span>'
      },
      {
        line1: 'रसीली लाल <span class="gradient-text hero-text-glow">स्ट्रॉबेरी</span> <span class="hero-produce-badge">🍓</span>',
        line2: 'ताजा हरी <span class="gradient-text hero-text-glow">ब्रोकोली</span> <span class="hero-produce-badge">🥦</span>'
      },
      {
        line1: 'खेत के ताजे <span class="gradient-text hero-text-glow">टमाटर</span> <span class="hero-produce-badge">🍅</span>',
        line2: 'पौष्टिक जैविक <span class="gradient-text hero-text-glow">पालक</span> <span class="hero-produce-badge">🥬</span>'
      },
      {
        line1: 'मीठा सुनहरा <span class="gradient-text hero-text-glow">भुट्टा</span> <span class="hero-produce-badge">🌽</span>',
        line2: 'स्वादिष्ट ताजा <span class="gradient-text hero-text-glow">आलू</span> <span class="hero-produce-badge">🥔</span>'
      }
    ]
  };

  let currentIndex = 0;
  let cycleTimer = null;
  const CYCLE_INTERVAL = 3200; // 3.2 seconds display per item
  let isPaused = false;

  function getCurrentItems() {
    const lang = (typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en') || 'en';
    return PRODUCE_SETS[lang] || PRODUCE_SETS.en;
  }

  function renderStep(nextIdx) {
    const items = getCurrentItems();
    currentIndex = ((nextIdx % items.length) + items.length) % items.length;
    const target = items[currentIndex];

    // Out animation
    line1El.classList.add('is-changing-out');
    line2El.classList.add('is-changing-out');

    setTimeout(() => {
      // Set new content
      line1El.innerHTML = target.line1;
      line2El.innerHTML = target.line2;

      // Position for entrance
      line1El.classList.remove('is-changing-out');
      line2El.classList.remove('is-changing-out');
      line1El.classList.add('is-changing-in');
      line2El.classList.add('is-changing-in');

      // Trigger reflow
      void line1El.offsetWidth;

      // Remove in classes to animate in smoothly
      line1El.classList.remove('is-changing-in');
      line2El.classList.remove('is-changing-in');
    }, 420);
  }

  function startCycle() {
    stopCycle();
    cycleTimer = setInterval(() => {
      if (!isPaused && document.visibilityState !== 'hidden') {
        renderStep(currentIndex + 1);
      }
    }, CYCLE_INTERVAL);
  }

  function stopCycle() {
    if (cycleTimer) {
      clearInterval(cycleTimer);
      cycleTimer = null;
    }
  }

  // Hover to pause so user can inspect any produce
  titleEl.addEventListener('mouseenter', () => { isPaused = true; });
  titleEl.addEventListener('mouseleave', () => { isPaused = false; });

  // Handle visibility state change (e.g. background tab)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      stopCycle();
    } else {
      startCycle();
    }
  });

  // Re-sync on language change
  window.addEventListener('agritrace:languageChanged', () => {
    currentIndex = 0;
    const items = getCurrentItems();
    line1El.innerHTML = items[0].line1;
    line2El.innerHTML = items[0].line2;
    startCycle();
  });

  startCycle();

  // Expose for external control or testing
  window.heroProduceCycler = {
    next: () => renderStep(currentIndex + 1),
    prev: () => renderStep(currentIndex - 1),
    pause: () => { isPaused = true; },
    resume: () => { isPaused = false; },
    stop: stopCycle,
    start: startCycle,
    getCurrentIndex: () => currentIndex,
    getItems: getCurrentItems
  };
}

/* ---------------------------------------------------------
   NAVIGATION MENU
   - Shown by default across the top from left margin to right margin
   - Accessible without requiring the user to touch/click any button
   - Optional minimize button (✕) to collapse into floating "< Navigation" button
   - Click "< Navigation" to expand again
   - Internally scrollable rows with mouse-wheel support
   --------------------------------------------------------- */
function initFloatingPopNav() {
  const toggleBtn = document.getElementById('floatingNavToggleBtn');
  const panel = document.getElementById('floatingNavPanel');
  if (!toggleBtn || !panel) return;

  const closeBtn = document.getElementById('floatingNavCloseBtn');
  const dockLinks = panel.querySelectorAll('.dock-item');
  const scrollRows = panel.querySelectorAll('.floating-nav-scroll-row');

  function openMenu() {
    panel.classList.remove('is-closed');
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    toggleBtn.classList.remove('is-visible');
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    panel.classList.remove('is-open');
    panel.classList.add('is-closed');
    panel.setAttribute('aria-hidden', 'true');
    toggleBtn.classList.add('is-visible');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    if (panel.classList.contains('is-closed')) {
      openMenu();
    } else {
      closeMenu();
    }
  }

  // Ensure default state: OPEN on home, collapsed if deep-linked to a specific section
  if (window.location.hash && window.location.hash !== '#home' && window.location.hash !== '') {
    closeMenu();
  } else {
    openMenu();
  }

  // Toggle button click (when minimized to reopen)
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openMenu();
  });

  // Close/Minimize button click
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
      toggleBtn.focus();
    });
  }

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.classList.contains('is-closed')) {
      e.preventDefault();
      closeMenu();
      toggleBtn.focus();
    }
  });

  // Automatic Navigation Collapse on interacting outside (Mouse + Touch + Pointer)
  const handleOutsideInteraction = (e) => {
    if (panel.classList.contains('is-open')) {
      if (!panel.contains(e.target) && !toggleBtn.contains(e.target)) {
        closeMenu();
      }
    }
  };

  ['pointerdown', 'touchstart', 'click'].forEach(evt => {
    document.addEventListener(evt, handleOutsideInteraction, { passive: true });
  });

  // Automatic Collapse when scrolling the document
  window.addEventListener('scroll', () => {
    if (panel.classList.contains('is-open') && window.scrollY > 80) {
      closeMenu();
    }
  }, { passive: true });

  // Navigation item selection: smoothly navigate and auto-collapse navigation
  dockLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        navigateToSection(href);
        closeMenu();
      }
    });
  });

  // Automatic Collapse when any modal or box opens (monitored via MutationObserver)
  if ('MutationObserver' in window) {
    const modalObserver = new MutationObserver(() => {
      const anyOpenModal = document.querySelector('.modal.open, .feat-modal.open, .tn-modal-backdrop.open, .voice-panel.open, .auth-modal.open, [role="dialog"].open');
      if (anyOpenModal && panel.classList.contains('is-open')) {
        closeMenu();
      }
    });
    modalObserver.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class', 'style'] });
  }

  // Enable mouse-wheel horizontal scrolling on scroll rows
  scrollRows.forEach(row => {
    row.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        row.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  });

  // IntersectionObserver for scroll spy active states
  const sectionIds = ['home', 'dashboard', 'records', 'prices', 'sensors', 'farmer', 'seller', 'consumer', 'datasets', 'documentation'];
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.id;
          dockLinks.forEach(item => {
            const itemNav = item.getAttribute('data-nav') || (item.getAttribute('href') || '').replace('#', '');
            const isActive = itemNav === currentId;
            item.classList.toggle('active', isActive);
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(sec => observer.observe(sec));
  }

  // Expose global methods for testing/accessibility
  window.floatingNav = {
    open: openMenu,
    close: closeMenu,
    toggle: toggleMenu,
    isOpen: () => panel.classList.contains('is-open')
  };
}

/* ---------------------------------------------------------
   OFFLINE RESILIENCE & PWA SERVICE WORKER MANAGER
   --------------------------------------------------------- */
function initOfflineResilience() {
  const badge = document.getElementById('offlineStatusBadge');
  const text = document.getElementById('offlineStatusText');

  function updateStatus() {
    const isOnline = navigator.onLine;
    if (badge) {
      badge.classList.toggle('online', isOnline);
      badge.classList.toggle('offline', !isOnline);
      badge.title = isOnline
        ? 'AgriTrace PWA Online — Network active with local offline caching'
        : 'AgriTrace PWA Offline Mode — Full local access to records, marketplace & speech assistant';
    }
    if (text) {
      if (typeof window.t === 'function') {
        text.textContent = isOnline ? window.t('status_online') : window.t('status_offline');
      } else {
        text.textContent = isOnline ? 'Online' : 'Offline';
      }
    }
    document.body.classList.toggle('is-offline', !isOnline);
  }

  window.addEventListener('online', () => {
    updateStatus();
    if (typeof showToast === 'function') {
      showToast('✓ Back Online — Syncing latest agricultural network data', 'success');
    }
  });

  window.addEventListener('offline', () => {
    updateStatus();
    if (typeof showToast === 'function') {
      showToast('⚡ Offline Mode Active — Complete local access to records, marketplace & voice AI', 'warning');
    }
  });

  // Initial status check
  updateStatus();

  // Register PWA Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('[AgriTrace] Service Worker registered for offline resilience. Scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[AgriTrace] Service Worker registration failed (falling back to cache):', err);
        });
    });
  }
}

// ---------------------------------------------------------
// Uiverse.io Leaf Decorative Button Animation Controller (MuhammadHasann)
// ---------------------------------------------------------
function initUiverseLeafButtons() {
  const leafPath = 'M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z';

  const targetButtons = document.querySelectorAll(
    '.primary-button, .agri-animated-btn, .uiverse-leaf-btn, .tn-show-more-btn, #consumerScanBtn, #confirmProceedBtn, #captureProduceBtn, .tn-modal-btn.tn-btn-primary, .uiverse-doc-btn.uiverse-doc-btn-primary'
  );

  targetButtons.forEach(btn => {
    if (!btn.querySelector('.icon-1')) {
      for (let i = 1; i <= 5; i++) {
        const iconDiv = document.createElement('div');
        iconDiv.className = `icon-${i}`;
        iconDiv.innerHTML = `<svg class="fil-leaf-${i}" viewBox="0 0 24 24" width="100%" height="100%"><path class="fil-leaf-${i}" d="${leafPath}"/></svg>`;
        btn.appendChild(iconDiv);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Accessibility & Clear Text & Text Sizing
  initClearTextView();

  // 1b. Uiverse.io Leaf Animation Buttons
  initUiverseLeafButtons();

  // 2. Voice Assistant
  initVoiceAssistant();

  // 3. Floating Pop-up Navigation Menu
  initFloatingPopNav();

  // 3b. Hero Title Cyclic Produce Animation
  initHeroProduceCycler();

  // 4. Offline Resilience & PWA Service Worker
  initOfflineResilience();

  // 5. Modals & Scanners
  initCameraScanner();
  initQRScanner();
  initModalClose();
  initBuilderProfile();
  initHardhatLocalModal();
  initAllLanguageModal();

  // 6. Dashboards & Alerts
  renderFarmerDashboard();
  initSellerMarketplace();
  initConsumerVerification();
  renderAlerts();

  // 7. Preload speech synthesis voices
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }

  // 8. Listen for language changes and re-render dynamic content
  window.addEventListener('agritrace:languageChanged', () => {
    renderFarmerDashboard();
    renderSellerMarketplace();
    renderAlerts();
    updateClearTextButtons(document.body.classList.contains('clear-text-view'));
    updateAudioControlsUI();
    const textEl = document.getElementById('offlineStatusText');
    if (textEl && typeof window.t === 'function') {
      textEl.textContent = navigator.onLine ? window.t('status_online') : window.t('status_offline');
    }
  });
});


/* =========================================================
   KAGGLE DATASETS — SEARCH & CATEGORY FILTER
   ========================================================= */

/** Active category filter for the Kaggle section */
let _kaggleActiveFilter = 'all';

/**
 * Called on every keystroke in the search input.
 * Hides cards that don't match the current keyword + active category filter.
 */
function filterKaggleDatasets() {
  const input = document.getElementById('kaggleSearchInput');
  const keyword = input ? input.value.trim().toLowerCase() : '';
  _applyKaggleFilters(keyword, _kaggleActiveFilter);
}

/**
 * Called when a category tab is clicked.
 * @param {string} filterValue - 'all' | 'agricultural-prices' | 'crop-production' | 'fruits-vegetables'
 * @param {HTMLElement} clickedBtn - the clicked button element
 */
function setKaggleFilter(filterValue, clickedBtn) {
  _kaggleActiveFilter = filterValue;

  // Update tab aria / active class
  const tabs = document.querySelectorAll('.kaggle-filter-tab');
  tabs.forEach(btn => {
    const isActive = btn.dataset.filter === filterValue;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  const keyword = (document.getElementById('kaggleSearchInput') || {}).value || '';
  _applyKaggleFilters(keyword.trim().toLowerCase(), filterValue);
}

/**
 * Internal: applies both keyword and category filters to the card grid.
 */
function _applyKaggleFilters(keyword, category) {
  const cards = document.querySelectorAll('.kaggle-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const cardCategory = (card.dataset.category || '').toLowerCase();
    const cardTitle    = (card.dataset.title    || '').toLowerCase();
    const cardDesc     = (card.querySelector('.kaggle-card-desc') || {}).textContent || '';

    const matchesCategory = category === 'all' || cardCategory === category;
    const matchesKeyword  = !keyword
      || cardTitle.includes(keyword)
      || cardDesc.toLowerCase().includes(keyword)
      || cardCategory.includes(keyword);

    const visible = matchesCategory && matchesKeyword;
    card.style.display = visible ? '' : 'none';
    if (visible) visibleCount++;
  });

  // Show/hide no-results message
  const noResults = document.getElementById('kaggleNoResults');
  if (noResults) {
    noResults.style.display = visibleCount === 0 ? 'flex' : 'none';
  }

  // Update count badge
  const countBadge = document.getElementById('kaggleCountBadge');
  if (countBadge) {
    if (visibleCount === cards.length) {
      countBadge.textContent = `${cards.length} Datasets`;
    } else {
      countBadge.textContent = `${visibleCount} of ${cards.length} Datasets`;
    }
  }
}

// Algorithm Video Resilience
function initAlgorithmVideo() {
  const video = document.getElementById('algorithmVideoPlayer');
  if (!video) return;
  video.muted = true;
  video.defaultMuted = true;
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Browser autoplay policy handled; fallback poster remains displayed
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initAlgorithmVideo();
});

/* =========================================================
   AGRITRACE MASTER PRESENTATION SLIDE VIEWER MODAL
   ========================================================= */

let currentSlideIndex = 1;
const TOTAL_SLIDES = 5;

const PRESENTATION_SLIDES = [
  // SLIDE 1
  `
  <div style="width:100%; max-width:960px; background:#f7f5ec url('docs/presentation_assets/image-1002-1.jpeg') center/cover no-repeat; border-radius:18px; padding:45px 50px; position:relative; overflow:hidden; box-shadow:0 12px 35px rgba(0,0,0,0.08);">
    <div style="position:absolute; inset:0; background:rgba(247,245,236,0.92); z-index:1;"></div>
    <div style="position:relative; z-index:2;">
      <div style="display:inline-flex; align-items:center; gap:8px; background:#1e382c; color:#ffffff; padding:6px 18px; border-radius:20px; font-size:13px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:18px;">
        DOMAIN &bull; AGRITRACE
      </div>
      <h2 style="font-family:var(--font-heading, Georgia, serif); font-size:34px; line-height:1.2; font-weight:700; color:#14281f; margin-bottom:12px;">
        Blockchain-Enabled Farm-to-Market Traceability and Transparent Price Discovery System.
      </h2>
      <p style="font-size:18px; color:#3b5e4c; font-weight:600; margin-bottom:28px;">
        From Farm to Market. Fair Prices. Trusted Produce.
      </p>
      
      <div style="background:#ffffff; border:1.5px solid #ded9cb; border-radius:16px; padding:22px 28px; box-shadow:0 8px 24px rgba(0,0,0,0.04);">
        <div style="display:inline-block; background:#7B9B3A; color:#ffffff; font-size:12px; font-weight:800; padding:3px 12px; border-radius:6px; margin-bottom:10px;">
          TEAM 1
        </div>
        <div style="font-size:16px; font-weight:700; color:#14281f; margin-bottom:4px;">
          Presented by: Guru Prasanth S, Leun Hammi D, Jeyaprasanna M
        </div>
        <div style="font-size:13px; color:#526359; font-weight:500; margin-bottom:12px;">
          Register Number: [9925009028, 99250040308, 99250040310] &nbsp;|&nbsp; Department: [Mech, CSE(Ds)]
        </div>
        <div style="border-top:1px solid #ded9cb; padding-top:10px; font-size:14px; color:#244033; font-weight:600;">
          <strong>Supervisor:</strong> Dr. P. Chinnasamy &nbsp;|&nbsp; <strong>Designation:</strong> Associate Professor
        </div>
      </div>
    </div>
  </div>
  `,

  // SLIDE 2
  `
  <div style="width:100%; max-width:960px; background:#f7f5ec; border-radius:18px; padding:35px 40px; box-shadow:0 12px 35px rgba(0,0,0,0.08);">
    <div style="font-size:12px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; color:#7B9B3A; margin-bottom:4px;">PROJECT RECAP</div>
    <h2 style="font-family:var(--font-heading, Georgia, serif); font-size:28px; font-weight:700; color:#14281f; margin-bottom:20px;">THE NEED FOR AGRITRACE</h2>
    
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px;">
      <div style="background:#ffffff; border:1.5px solid #ded9cb; border-radius:14px; padding:20px; display:flex; flex-direction:column;">
        <h4 style="font-size:16px; font-weight:800; color:#1e382c; margin-bottom:12px; display:flex; align-items:center; gap:8px;">⚠️ Existing challenges</h4>
        <ul style="font-size:13.5px; color:#244033; line-height:1.5; padding-left:18px; display:flex; flex-direction:column; gap:8px; margin-bottom:14px; flex:1;">
          <li>Multiple intermediaries can reduce direct buyer access.</li>
          <li>Market prices are not always easy to compare.</li>
          <li>Produce origin and handling details may be fragmented.</li>
          <li>Agricultural information is spread across platforms.</li>
        </ul>
        <div style="border-radius:10px; overflow:hidden; height:160px; border:1px solid #ded9cb;">
          <img src="docs/presentation_assets/image-2-1.jpeg" alt="Farmers in field" style="width:100%; height:100%; object-fit:cover;">
        </div>
      </div>

      <div style="background:#ffffff; border:1.5px solid #ded9cb; border-radius:14px; padding:20px; display:flex; flex-direction:column;">
        <h4 style="font-size:16px; font-weight:800; color:#1e382c; margin-bottom:12px; display:flex; align-items:center; gap:8px;">🌱 AgriTrace solution</h4>
        <ul style="font-size:13.5px; color:#244033; line-height:1.5; padding-left:18px; display:flex; flex-direction:column; gap:8px; margin-bottom:14px; flex:1;">
          <li>Digital farmer-to-buyer marketplace with separate portals.</li>
          <li>Transparent crop-price info &amp; district-wise comparison.</li>
          <li>Government datasets, crop information, &amp; blockchain trace.</li>
          <li>QR-based verification where supported.</li>
        </ul>
        <div style="border-radius:10px; overflow:hidden; height:160px; border:1px solid #ded9cb;">
          <img src="docs/presentation_assets/image-2-2.png" alt="AgriTrace Web App" style="width:100%; height:100%; object-fit:cover;">
        </div>
      </div>
    </div>

    <div style="background:#1e382c; color:#ffffff; border-radius:12px; padding:12px 20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; font-size:13.5px; font-weight:600;">
      <div>Farmer &rarr; AgriTrace platform &rarr; Buyer &nbsp;|&nbsp; Price transparency &bull; Digital marketplace &bull; Traceability</div>
      <a href="https://guru-prasanths.github.io/AgriTrace-/" target="_blank" style="color:#a7f3d0; text-decoration:none; font-family:monospace; font-size:12.5px; background:rgba(255,255,255,0.1); padding:4px 10px; border-radius:6px;">Web App: guru-prasanths.github.io/AgriTrace-/ &nearr;</a>
    </div>
  </div>
  `,

  // SLIDE 3
  `
  <div style="width:100%; max-width:960px; background:#f7f5ec; border-radius:18px; padding:35px 40px; box-shadow:0 12px 35px rgba(0,0,0,0.08);">
    <div style="font-size:12px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; color:#7B9B3A; margin-bottom:4px;">PRESENTATION ROUTE</div>
    <h2 style="font-family:var(--font-heading, Georgia, serif); font-size:28px; font-weight:700; color:#14281f; margin-bottom:24px;">AGENDA &ndash; EXPLORING THE AGRITRACE ECOSYSTEM</h2>
    
    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16px;">
      <div style="background:#ffffff; border:1.5px solid #ded9cb; border-radius:14px; padding:18px; display:flex; align-items:flex-start; gap:14px;">
        <span style="background:#1e382c; color:#fff; font-size:15px; font-weight:800; width:34px; height:34px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">01</span>
        <div style="font-size:14.5px; font-weight:700; color:#14281f; line-height:1.35; margin-top:4px;">Project overview and objectives</div>
      </div>
      <div style="background:#ffffff; border:1.5px solid #ded9cb; border-radius:14px; padding:18px; display:flex; align-items:flex-start; gap:14px;">
        <span style="background:#1e382c; color:#fff; font-size:15px; font-weight:800; width:34px; height:34px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">02</span>
        <div style="font-size:14.5px; font-weight:700; color:#14281f; line-height:1.35; margin-top:4px;">Farmer and seller authentication</div>
      </div>
      <div style="background:#ffffff; border:1.5px solid #ded9cb; border-radius:14px; padding:18px; display:flex; align-items:flex-start; gap:14px;">
        <span style="background:#1e382c; color:#fff; font-size:15px; font-weight:800; width:34px; height:34px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">03</span>
        <div style="font-size:14.5px; font-weight:700; color:#14281f; line-height:1.35; margin-top:4px;">Digital agricultural marketplace</div>
      </div>
      <div style="background:#ffffff; border:1.5px solid #ded9cb; border-radius:14px; padding:18px; display:flex; align-items:flex-start; gap:14px;">
        <span style="background:#1e382c; color:#fff; font-size:15px; font-weight:800; width:34px; height:34px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">04</span>
        <div style="font-size:14.5px; font-weight:700; color:#14281f; line-height:1.35; margin-top:4px;">Crop listings and order management</div>
      </div>
      <div style="background:#ffffff; border:1.5px solid #ded9cb; border-radius:14px; padding:18px; display:flex; align-items:flex-start; gap:14px;">
        <span style="background:#1e382c; color:#fff; font-size:15px; font-weight:800; width:34px; height:34px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">05</span>
        <div style="font-size:14.5px; font-weight:700; color:#14281f; line-height:1.35; margin-top:4px;">Tamil Nadu agriculture datasets</div>
      </div>
      <div style="background:#ffffff; border:1.5px solid #ded9cb; border-radius:14px; padding:18px; display:flex; align-items:flex-start; gap:14px;">
        <span style="background:#1e382c; color:#fff; font-size:15px; font-weight:800; width:34px; height:34px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">06</span>
        <div style="font-size:14.5px; font-weight:700; color:#14281f; line-height:1.35; margin-top:4px;">District-wise market price comparison</div>
      </div>
      <div style="background:#ffffff; border:1.5px solid #ded9cb; border-radius:14px; padding:18px; display:flex; align-items:flex-start; gap:14px;">
        <span style="background:#1e382c; color:#fff; font-size:15px; font-weight:800; width:34px; height:34px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">07</span>
        <div style="font-size:14.5px; font-weight:700; color:#14281f; line-height:1.35; margin-top:4px;">Blockchain-based traceability &amp; QR verification</div>
      </div>
      <div style="background:#ffffff; border:1.5px solid #ded9cb; border-radius:14px; padding:18px; display:flex; align-items:flex-start; gap:14px;">
        <span style="background:#1e382c; color:#fff; font-size:15px; font-weight:800; width:34px; height:34px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">08</span>
        <div style="font-size:14.5px; font-weight:700; color:#14281f; line-height:1.35; margin-top:4px;">AgriTrace Points and accessibility</div>
      </div>
      <div style="background:#ffffff; border:1.5px solid #ded9cb; border-radius:14px; padding:18px; display:flex; align-items:flex-start; gap:14px;">
        <span style="background:#1e382c; color:#fff; font-size:15px; font-weight:800; width:34px; height:34px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">09</span>
        <div style="font-size:14.5px; font-weight:700; color:#14281f; line-height:1.35; margin-top:4px;">Technology architecture &amp; future scope</div>
      </div>
    </div>
  </div>
  `,

  // SLIDE 4
  `
  <div style="width:100%; max-width:960px; background:#f7f5ec; border-radius:18px; padding:30px 35px; box-shadow:0 12px 35px rgba(0,0,0,0.08);">
    <div style="font-size:12px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; color:#7B9B3A; margin-bottom:4px;">FUNCTIONAL ARCHITECTURE</div>
    <h2 style="font-family:var(--font-heading, Georgia, serif); font-size:26px; font-weight:700; color:#14281f; margin-bottom:18px;">AGRITRACE &ndash; SYSTEM WORKFLOW AND FUNCTIONAL ARCHITECTURE</h2>
    
    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; margin-bottom:16px;">
      <div style="background:#ffffff; border:1.5px solid #ded9cb; border-radius:12px; padding:12px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
          <img src="docs/presentation_assets/image-4-1.png" style="width:20px; height:20px; object-fit:contain;">
          <span style="font-size:13.5px; font-weight:800; color:#1e382c;">Authentication</span>
        </div>
        <p style="font-size:11px; color:#3b5e4c; line-height:1.4; margin:0;">Farmer &amp; Seller portals &bull; email/password &bull; Google auth &bull; role-based access</p>
      </div>

      <div style="background:#ffffff; border:1.5px solid #ded9cb; border-radius:12px; padding:12px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
          <img src="docs/presentation_assets/image-4-2.png" style="width:20px; height:20px; object-fit:contain;">
          <span style="font-size:13.5px; font-weight:800; color:#1e382c;">Listing</span>
        </div>
        <p style="font-size:11px; color:#3b5e4c; line-height:1.4; margin:0;">Crop name &bull; images &bull; quantity/unit &bull; price/location &bull; availability</p>
      </div>

      <div style="background:#ffffff; border:1.5px solid #ded9cb; border-radius:12px; padding:12px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
          <img src="docs/presentation_assets/image-4-3.png" style="width:20px; height:20px; object-fit:contain;">
          <span style="font-size:13.5px; font-weight:800; color:#1e382c;">Marketplace</span>
        </div>
        <p style="font-size:11px; color:#3b5e4c; line-height:1.4; margin:0;">Browse &bull; compare listings &bull; submit requests/offers &bull; connect directly</p>
      </div>

      <div style="background:#ffffff; border:1.5px solid #ded9cb; border-radius:12px; padding:12px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
          <img src="docs/presentation_assets/image-4-4.png" style="width:20px; height:20px; object-fit:contain;">
          <span style="font-size:13.5px; font-weight:800; color:#1e382c;">Orders</span>
        </div>
        <p style="font-size:11px; color:#3b5e4c; line-height:1.4; margin:0;">Track requests &bull; manage status &bull; coordinate interactions &bull; transactions</p>
      </div>

      <div style="background:#ffffff; border:1.5px solid #ded9cb; border-radius:12px; padding:12px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
          <img src="docs/presentation_assets/image-4-5.png" style="width:20px; height:20px; object-fit:contain;">
          <span style="font-size:13.5px; font-weight:800; color:#1e382c;">Price discovery</span>
        </div>
        <p style="font-size:11px; color:#3b5e4c; line-height:1.4; margin:0;">Tamil Nadu datasets &bull; tomato compare across Salem, Madurai, CBE, Erode</p>
      </div>

      <div style="background:#ffffff; border:1.5px solid #ded9cb; border-radius:12px; padding:12px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
          <img src="docs/presentation_assets/image-4-6.png" style="width:20px; height:20px; object-fit:contain;">
          <span style="font-size:13.5px; font-weight:800; color:#1e382c;">Traceability</span>
        </div>
        <p style="font-size:11px; color:#3b5e4c; line-height:1.4; margin:0;">Produce Batch &rarr; Digital Record &rarr; Blockchain Tx &rarr; QR Verification</p>
      </div>

      <div style="background:#ffffff; border:1.5px solid #ded9cb; border-radius:12px; padding:12px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
          <img src="docs/presentation_assets/image-4-7.png" style="width:20px; height:20px; object-fit:contain;">
          <span style="font-size:13.5px; font-weight:800; color:#1e382c;">AgriTrace Points</span>
        </div>
        <p style="font-size:11px; color:#3b5e4c; line-height:1.4; margin:0;">Eligible activities &bull; completion rewards &bull; daily eligibility &bull; history</p>
      </div>

      <div style="background:#ffffff; border:1.5px solid #ded9cb; border-radius:12px; padding:12px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
          <img src="docs/presentation_assets/image-4-8.png" style="width:20px; height:20px; object-fit:contain;">
          <span style="font-size:13.5px; font-weight:800; color:#1e382c;">Accessibility</span>
        </div>
        <p style="font-size:11px; color:#3b5e4c; line-height:1.4; margin:0;">Simple navigation &bull; responsive &bull; readable text &bull; voice assistant</p>
      </div>
    </div>

    <div style="background:#1e382c; color:#ffffff; border-radius:10px; padding:12px 18px; font-size:12.5px; font-weight:600; margin-bottom:10px;">
      <span style="color:#a7f3d0; font-weight:800;">Architecture:</span> HTML5 | CSS3 | JS &rarr; Node.js | Express.js &rarr; PostgreSQL | Solidity | Hardhat | MetaMask | ethers.js &rarr; TN Datasets
    </div>
    
    <div style="font-size:11px; color:#64748b; line-height:1.4;">
      <div>&bull; Comparison fields: Min, max, modal price, market, date, unit. Illustrative placeholder data.</div>
      <div>&bull; Traceability boundary: supported records only. QR verification where supported.</div>
    </div>
  </div>
  `,

  // SLIDE 5
  `
  <div style="width:100%; max-width:960px; background:#f7f5ec; border-radius:18px; padding:35px 40px; box-shadow:0 12px 35px rgba(0,0,0,0.08);">
    <div style="font-size:12px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; color:#7B9B3A; margin-bottom:4px;">CLOSING</div>
    <h2 style="font-family:var(--font-heading, Georgia, serif); font-size:28px; font-weight:700; color:#14281f; margin-bottom:20px;">THANK YOU</h2>

    <div style="background:#0d231a url('docs/presentation_assets/image-5-1.jpeg') center/cover no-repeat; border-radius:20px; padding:45px 40px; text-align:center; position:relative; overflow:hidden; box-shadow:0 16px 40px rgba(0,0,0,0.25);">
      <div style="position:absolute; inset:0; background:rgba(13,35,26,0.75); backdrop-filter:blur(2px); z-index:1;"></div>
      <div style="position:relative; z-index:2;">
        <div style="font-size:13px; font-weight:800; letter-spacing:2.5px; text-transform:uppercase; color:#a7f3d0; margin-bottom:14px;">THE FUTURE OF AGRICULTURE</div>
        <h3 style="font-family:var(--font-heading, Georgia, serif); font-size:32px; font-weight:700; color:#ffffff; line-height:1.25; margin-bottom:14px;">
          EVERY CROP. EVERY JOURNEY.<br>EVERY TRANSACTION.
        </h3>
        <p style="font-size:15px; color:#e2e8f0; max-width:650px; margin:0 auto 28px auto; line-height:1.5;">
          AgriTrace transforms agricultural supply chains into a connected, transparent and verifiable digital ecosystem.
        </p>
        <button type="button" onclick="closeSlideDeckModal(); if(typeof navigateToSection==='function'){navigateToSection('#verification');}" style="background:#fdfbf7; color:#14281f; font-size:14.5px; font-weight:800; padding:12px 32px; border-radius:30px; border:none; cursor:pointer; box-shadow:0 6px 20px rgba(0,0,0,0.3);">
          START TRACEABILITY &rarr;
        </button>
      </div>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:18px; font-size:13.5px; font-weight:700; color:#244033;">
      <div>CSE223 &nbsp;|&nbsp; APPLIED BLOCKCHAIN : TEAM 1</div>
      <div>AgriTrace Platform Ecosystem</div>
    </div>
  </div>
  `
];

function openSlideDeckModal(slideNumber = 1) {
  const modal = document.getElementById('slideDeckModal');
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  goToSlide(slideNumber);
}

function closeSlideDeckModal() {
  const modal = document.getElementById('slideDeckModal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

function goToSlide(n) {
  if (n < 1) n = 1;
  if (n > TOTAL_SLIDES) n = TOTAL_SLIDES;
  currentSlideIndex = n;

  const stage = document.getElementById('slideStage');
  if (stage && PRESENTATION_SLIDES[n - 1]) {
    stage.innerHTML = PRESENTATION_SLIDES[n - 1];
  }

  const indicator = document.getElementById('slideIndicator');
  if (indicator) {
    indicator.textContent = `Slide ${n} of ${TOTAL_SLIDES}`;
  }

  // Update dots
  for (let i = 1; i <= TOTAL_SLIDES; i++) {
    const dot = document.getElementById(`slideDot${i}`);
    if (dot) {
      if (i === n) {
        dot.style.background = '#1e382c';
        dot.style.color = '#ffffff';
        dot.style.borderColor = '#1e382c';
      } else {
        dot.style.background = '#ffffff';
        dot.style.color = '#14281f';
        dot.style.borderColor = '#ded9cb';
      }
    }
  }

  const prevBtn = document.getElementById('prevSlideBtn');
  if (prevBtn) prevBtn.disabled = (n === 1);
  const nextBtn = document.getElementById('nextSlideBtn');
  if (nextBtn) nextBtn.disabled = (n === TOTAL_SLIDES);
}

function prevSlide() {
  if (currentSlideIndex > 1) goToSlide(currentSlideIndex - 1);
}

function nextSlide() {
  if (currentSlideIndex < TOTAL_SLIDES) goToSlide(currentSlideIndex + 1);
}

// Keyboard arrow navigation
document.addEventListener('keydown', e => {
  const modal = document.getElementById('slideDeckModal');
  if (!modal || modal.style.display !== 'flex') return;
  if (e.key === 'ArrowRight' || e.key === 'PageDown') nextSlide();
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') prevSlide();
  else if (e.key === 'Escape') closeSlideDeckModal();
});

window.openSlideDeckModal = openSlideDeckModal;
window.closeSlideDeckModal = closeSlideDeckModal;
window.goToSlide = goToSlide;
window.prevSlide = prevSlide;
window.nextSlide = nextSlide;


