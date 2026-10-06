/* =========================================================
   AgriTrace — Extended Features Module
   Multi-Language | Voice | Camera | QR | Marketplace | Traceability
   ========================================================= */

/* =========================================================
   MULTI-LANGUAGE SYSTEM
   ========================================================= */

const TRANSLATIONS = {
  en: {
    name: "English", flag: "🇬🇧",
    nav_home: "Home", nav_dashboard: "Dashboard", nav_traceability: "Traceability",
    nav_price: "Price Discovery", nav_iot: "IoT Monitoring", nav_farmer: "Farmer",
    nav_seller: "Seller", nav_consumer: "Verify",
    connect_wallet: "Connect Wallet",
    footer_rights: "© 2026 AgriTrace. All rights reserved.",
    toast_lang: "Language changed to English",
    voice_greeting: "Welcome to AgriTrace! I can help you with produce traceability, prices, and supply chain information. Try asking: What is the price of tomatoes?",
  },
  ta: {
    name: "தமிழ்", flag: "🇮🇳",
    nav_home: "முகப்பு", nav_dashboard: "டாஷ்போர்டு", nav_traceability: "கண்காணிப்பு",
    nav_price: "விலை கண்டறிதல்", nav_iot: "IoT கண்காணிப்பு", nav_farmer: "விவசாயி",
    nav_seller: "விற்பனையாளர்", nav_consumer: "சரிபார்க்க",
    connect_wallet: "வாலட் இணைக்க",
    footer_rights: "© 2026 AgriTrace. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    toast_lang: "மொழி தமிழுக்கு மாற்றப்பட்டது",
    voice_greeting: "AgriTrace-க்கு வரவேற்கிறோம்! விளைபொருள் கண்காணிப்பு, விலைகள் மற்றும் சப்ளை சேன் தகவல்களுக்கு நான் உதவுகிறேன்.",
  },
  hi: {
    name: "हिंदी", flag: "🇮🇳",
    nav_home: "होम", nav_dashboard: "डैशबोर्ड", nav_traceability: "ट्रेसेबिलिटी",
    nav_price: "मूल्य खोज", nav_iot: "IoT निगरानी", nav_farmer: "किसान",
    nav_seller: "विक्रेता", nav_consumer: "सत्यापित करें",
    connect_wallet: "वॉलेट कनेक्ट करें",
    footer_rights: "© 2026 AgriTrace. सर्वाधिकार सुरक्षित।",
    toast_lang: "भाषा हिंदी में बदली गई",
    voice_greeting: "AgriTrace में आपका स्वागत है! मैं उपज ट्रेसेबिलिटी, कीमतों और आपूर्ति श्रृंखला जानकारी में मदद कर सकता हूं।",
  },
  te: {
    name: "తెలుగు", flag: "🇮🇳",
    nav_home: "హోమ్", nav_dashboard: "డాష్‌బోర్డ్", nav_traceability: "ట్రేసబిలిటీ",
    nav_price: "ధర అన్వేషణ", nav_iot: "IoT పర్యవేక్షణ", nav_farmer: "రైతు",
    nav_seller: "విక్రేత", nav_consumer: "ధృవీకరించు",
    connect_wallet: "వ్యాలెట్ కనెక్ట్",
    footer_rights: "© 2026 AgriTrace. అన్ని హక్కులు నిల్వ చేయబడ్డాయి.",
    toast_lang: "భాష తెలుగుకు మార్చబడింది",
    voice_greeting: "AgriTrace కి స్వాగతం! నేను పంట ట్రేసబిలిటీ, ధరలు మరియు సరఫరా గొలుసు సమాచారంలో సహాయం చేయగలను.",
  },
  kn: {
    name: "ಕನ್ನಡ", flag: "🇮🇳",
    nav_home: "ಮನೆ", nav_dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", nav_traceability: "ಟ್ರೇಸಬಿಲಿಟಿ",
    nav_price: "ಬೆಲೆ ಅನ್ವೇಷಣೆ", nav_iot: "IoT ಮೇಲ್ವಿಚಾರಣೆ", nav_farmer: "ರೈತ",
    nav_seller: "ಮಾರಾಟಗಾರ", nav_consumer: "ಪರಿಶೀಲಿಸಿ",
    connect_wallet: "ವ್ಯಾಲೆಟ್ ಸಂಪರ್ಕಿಸಿ",
    footer_rights: "© 2026 AgriTrace. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
    toast_lang: "ಭಾಷೆ ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ",
    voice_greeting: "AgriTrace ಗೆ ಸ್ವಾಗತ! ನಾನು ಬೆಳೆ ಟ್ರೇಸಬಿಲಿಟಿ, ಬೆಲೆಗಳು ಮತ್ತು ಪೂರೈಕೆ ಸರಪಳಿ ಮಾಹಿತಿಯಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ.",
  },
  ml: {
    name: "മലയാളം", flag: "🇮🇳",
    nav_home: "ഹോം", nav_dashboard: "ഡാഷ്‌ബോർഡ്", nav_traceability: "ട്രേസബിലിറ്റി",
    nav_price: "വില കണ്ടെത്തൽ", nav_iot: "IoT നിരീക്ഷണം", nav_farmer: "കർഷകൻ",
    nav_seller: "വിൽക്കുന്നയാൾ", nav_consumer: "പരിശോധിക്കുക",
    connect_wallet: "വാലറ്റ് കണക്‌റ്റ് ചെയ്യുക",
    footer_rights: "© 2026 AgriTrace. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.",
    toast_lang: "ഭാഷ മലയാളത്തിലേക്ക് മാറ്റി",
    voice_greeting: "AgriTrace-ലേക്ക് സ്വാഗതം! ഉൽപ്പന്ന ട്രേസബിലിറ്റി, വിലകൾ, സപ്ലൈ ചെയിൻ വിവരങ്ങൾ എന്നിവയിൽ ഞാൻ സഹായിക്കും.",
  }
};

let currentLang = 'en';

function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  localStorage.setItem('agritrace_lang', lang);
  const t = TRANSLATIONS[lang];

  // Nav links
  const mappings = {
    'nav-home': t.nav_home, 'nav-dashboard': t.nav_dashboard,
    'nav-traceability': t.nav_traceability, 'nav-price': t.nav_price,
    'nav-iot': t.nav_iot, 'nav-farmer': t.nav_farmer,
    'nav-seller': t.nav_seller, 'nav-consumer': t.nav_consumer,
  };
  Object.entries(mappings).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
    const mel = document.getElementById('m-' + id);
    if (mel) mel.textContent = text;
  });

  // data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });

  // Footer rights
  const footerRights = document.getElementById('footerRights');
  if (footerRights) footerRights.textContent = t.footer_rights;

  // Active lang indicator
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  if (typeof showToast === 'function') showToast(t.toast_lang, 'success');
}

function initLanguageSystem() {
  const saved = localStorage.getItem('agritrace_lang') || 'en';
  const container = document.getElementById('langSwitcher');
  if (!container) return;

  Object.entries(TRANSLATIONS).forEach(([code, data]) => {
    const btn = document.createElement('button');
    btn.className = 'lang-option';
    btn.dataset.lang = code;
    btn.title = data.name;
    btn.type = 'button';
    btn.innerHTML = `<span>${data.flag}</span><span>${data.name}</span>`;
    btn.addEventListener('click', () => setLanguage(code));
    container.appendChild(btn);
  });

  setLanguage(saved);
}

/* =========================================================
   VOICE ASSISTANT
   ========================================================= */

const VOICE_COMMANDS = [
  { patterns: ['price of tomato', 'tomato price', 'tomato'], response: "Current tomato prices: Farmer price ₹19-25 per kg, Market price ₹32-38 per kg, Consumer price ₹36-45 per kg. Blockchain verified.", nav: null },
  { patterns: ['price of mango', 'mango price', 'mango'], response: "Current Alphonso mango prices: Farmer price ₹30-45 per kg, Market price ₹55-70 per kg. From Salem, Tamil Nadu.", nav: null },
  { patterns: ['price of onion', 'onion price', 'onion'], response: "Onion prices: Farmer ₹28-35 per kg, Market ₹45-60 per kg. From Nashik, Maharashtra.", nav: null },
  { patterns: ['price of banana', 'banana price', 'banana'], response: "Banana prices: Farmer ₹38-48 per kg, Market ₹55-70 per kg. From Trichy, Tamil Nadu.", nav: null },
  { patterns: ['go to dashboard', 'open dashboard', 'dashboard'], response: "Navigating to Dashboard.", nav: '#dashboard' },
  { patterns: ['go home', 'home page', 'home'], response: "Taking you to the home page.", nav: '#home' },
  { patterns: ['traceability', 'trace records', 'records'], response: "Opening Traceability Records.", nav: '#records' },
  { patterns: ['iot', 'sensor', 'temperature monitoring'], response: "Opening IoT Sensor Monitoring.", nav: '#sensors' },
  { patterns: ['farmer', 'farmer dashboard'], response: "Opening Farmer Dashboard.", nav: '#farmer' },
  { patterns: ['seller', 'marketplace'], response: "Opening Seller Marketplace.", nav: '#seller' },
  { patterns: ['verify', 'consumer', 'consumer page'], response: "Opening Consumer Verification.", nav: '#consumer' },
  { patterns: ['price discovery', 'prices'], response: "Opening Price Discovery section.", nav: '#prices' },
  { patterns: ['alert', 'warning', 'sensor alert'], response: "Checking alerts. Temperature alert on FARM-LOT-002: 18°C above threshold. Humidity high on FARM-LOT-005 at 96%. All other sensors normal.", nav: null },
  { patterns: ['help', 'what can you do', 'commands', 'how to use'], response: "I can help you navigate AgriTrace and check produce prices. Try saying: Price of tomatoes, Go to dashboard, Open farmer dashboard, or What are the alerts?", nav: null },
];

let voiceRecognition = null;
let isVoiceActive = false;
let voiceVolume = parseFloat(localStorage.getItem('agritrace_voice_vol') || '1.0');
let isVoiceMuted = localStorage.getItem('agritrace_voice_muted') === 'true';

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
  }
  if (typeof showToast === 'function') {
    showToast(isVoiceMuted ? '🔇 Voice Assistant Muted' : '🔊 Voice Assistant Unmuted', 'info');
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

function speak(text) {
  appendVoiceBubble('assistant', text);

  const synth = window.speechSynthesis;
  if (!synth) return;
  synth.cancel();

  // If muted or volume is zero, don't generate spoken audio
  if (isVoiceMuted || voiceVolume <= 0) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-IN';
  utterance.rate = 0.92;
  utterance.pitch = 1.05;
  utterance.volume = voiceVolume;
  const voices = synth.getVoices();
  const match = voices.find(v => v.lang.startsWith('en-IN')) || voices.find(v => v.lang.startsWith('en'));
  if (match) utterance.voice = match;
  synth.speak(utterance);
}

function processVoiceCommand(transcript) {
  const lower = transcript.toLowerCase().trim();
  appendVoiceBubble('user', transcript);
  for (const cmd of VOICE_COMMANDS) {
    if (cmd.patterns.some(p => lower.includes(p))) {
      speak(cmd.response);
      if (cmd.nav) {
        setTimeout(() => {
          const target = document.querySelector(cmd.nav);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 1600);
      }
      return;
    }
  }
  speak("I heard: " + transcript + ". Try asking about tomato prices, or say go to dashboard.");
}

function appendVoiceBubble(type, text) {
  const log = document.getElementById('voiceLog');
  if (!log) return;
  const bubble = document.createElement('div');
  bubble.className = 'voice-bubble voice-bubble-' + type;
  bubble.innerHTML = `<span class="voice-bubble-icon">${type === 'user' ? '🎤' : '🤖'}</span><span>${text}</span>`;
  log.appendChild(bubble);
  log.scrollTop = log.scrollHeight;
}

function initVoiceAssistant() {
  const toggleBtn = document.getElementById('voiceToggleBtn');
  const closeBtn = document.getElementById('voiceCloseBtn');
  const panel = document.getElementById('voicePanel');
  const micBtn = document.getElementById('voiceMicBtn');
  const muteBtn = document.getElementById('voiceMuteBtn');
  const volSlider = document.getElementById('voiceVolumeSlider');

  if (!toggleBtn || !panel) return;

  // Initialize Audio Controls UI
  updateAudioControlsUI();

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

  toggleBtn.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
      const t = TRANSLATIONS[currentLang];
      setTimeout(() => speak(t.voice_greeting || TRANSLATIONS.en.voice_greeting), 400);
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', () => { panel.classList.remove('open'); });

  document.querySelectorAll('.voice-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => { const cmd = btn.dataset.cmd; if (cmd) processVoiceCommand(cmd); });
  });

  if (micBtn) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      voiceRecognition = new SR();
      voiceRecognition.continuous = false;
      voiceRecognition.interimResults = false;
      voiceRecognition.lang = 'en-IN';

      voiceRecognition.onresult = (e) => {
        const t = e.results[0][0].transcript;
        processVoiceCommand(t);
        micBtn.classList.remove('listening');
        isVoiceActive = false;
        micBtn.innerHTML = '<span>🎤</span>';
      };
      voiceRecognition.onend = () => { micBtn.classList.remove('listening'); isVoiceActive = false; micBtn.innerHTML = '<span>🎤</span>'; };
      voiceRecognition.onerror = () => { micBtn.classList.remove('listening'); isVoiceActive = false; micBtn.innerHTML = '<span>🎤</span>'; };

      micBtn.addEventListener('click', () => {
        if (isVoiceActive) {
          voiceRecognition.stop();
        } else {
          voiceRecognition.start();
          micBtn.classList.add('listening');
          micBtn.innerHTML = '<span>🔴</span>';
          isVoiceActive = true;
          appendVoiceBubble('assistant', '🎤 Listening… speak now.');
        }
      });
    } else {
      micBtn.innerHTML = '<span>🎤</span>';
      micBtn.style.opacity = '0.5';
      micBtn.title = 'Speech not supported in this browser';
    }
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
  brinjal:  { emoji: '🍆', name: 'Brinjal',   grade: 'B',  tempRange: '10-15', humidity: '85', shelfLife: '7-10 days',  priceRange: '₹25-45/kg',  region: 'Coimbatore, Tamil Nadu' },
  capsicum: { emoji: '🫑', name: 'Capsicum',  grade: 'A',  tempRange: '7-10',  humidity: '90', shelfLife: '14-21 days', priceRange: '₹35-70/kg',  region: 'Ooty, Tamil Nadu' },
  carrot:   { emoji: '🥕', name: 'Carrot',    grade: 'A',  tempRange: '0-5',   humidity: '95', shelfLife: '30-60 days', priceRange: '₹20-40/kg',  region: 'Ooty, Tamil Nadu' },
  grapes:   { emoji: '🍇', name: 'Grapes',    grade: 'A+', tempRange: '0-2',   humidity: '90', shelfLife: '14-21 days', priceRange: '₹80-150/kg', region: 'Nashik, Maharashtra' },
};

let cameraStream = null;
let scannedProduceType = null;

function displayProduceResult(key) {
  const produce = PRODUCE_DATABASE[key];
  if (!produce) return;
  scannedProduceType = key;
  const resultEl = document.getElementById('cameraProduceResult');
  if (!resultEl) return;

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
          <button class="small-button" onclick="confirmProduceAndLink('${key}')">✓ Confirm &amp; Link to Batch</button>
          <button class="small-button" onclick="showProduceSelector()">↺ Change Produce</button>
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
  if (typeof showToast === 'function') showToast(`${produce.emoji} ${produce.name} linked to batch! Form auto-filled.`, 'success');
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
      if (feed) feed.innerHTML = `<div class="camera-demo-mode"><div class="camera-demo-icon">📷</div><p>Camera unavailable in this environment</p><p style="color:var(--green);margin-top:8px;font-size:11px;">DEMO MODE — Click "Identify Produce" to simulate AI recognition</p></div>`;
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeCameraModal);

  if (captureBtn) {
    captureBtn.addEventListener('click', () => {
      captureBtn.textContent = '🔍 Analyzing with AI...';
      captureBtn.disabled = true;
      const loadingEl = document.getElementById('recognitionLoader');
      if (loadingEl) loadingEl.style.display = 'flex';
      setTimeout(() => {
        const keys = Object.keys(PRODUCE_DATABASE);
        const key = keys[Math.floor(Math.random() * keys.length)];
        if (loadingEl) loadingEl.style.display = 'none';
        captureBtn.textContent = '📷 Identify Produce';
        captureBtn.disabled = false;
        displayProduceResult(key);
        if (typeof speak === 'function') speak(`I detected ${PRODUCE_DATABASE[key].name}, Grade ${PRODUCE_DATABASE[key].grade}. Price range ${PRODUCE_DATABASE[key].priceRange}.`);
      }, 2200);
    });
  }
}

function closeCameraModal() {
  const modal = document.getElementById('cameraModal');
  if (modal) modal.classList.remove('open');
  if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; }
}

/* =========================================================
   QR CODE SYSTEM
   ========================================================= */

function generateQRCode(data, container) {
  if (!container) return;
  const encoded = encodeURIComponent(data);
  const size = 180;
  container.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&color=39FF88&bgcolor=020807&format=png&margin=12" alt="QR Code" style="border-radius:12px;border:2px solid rgba(57,255,136,0.4);" width="${size}" height="${size}" loading="lazy" />`;
}

let qrCameraStream = null;

function initQRScanner() {
  const openBtn = document.getElementById('openQRScannerBtn');
  const closeBtn = document.getElementById('closeQRScannerBtn');
  const modal = document.getElementById('qrScannerModal');
  const manualInput = document.getElementById('qrManualInput');
  const lookupBtn = document.getElementById('qrLookupBtn');

  if (!openBtn || !modal) return;

  openBtn.addEventListener('click', () => {
    modal.classList.add('open');
    const resultEl = document.getElementById('qrScanResult');
    if (resultEl) { resultEl.style.display = 'none'; resultEl.innerHTML = ''; }
    initQRCameraScanner();
  });

  if (closeBtn) closeBtn.addEventListener('click', () => { modal.classList.remove('open'); stopQRCamera(); });

  if (lookupBtn && manualInput) {
    lookupBtn.addEventListener('click', () => { const id = manualInput.value.trim(); if (id) lookupAndShowQRRecord(id); });
    manualInput.addEventListener('keydown', e => { if (e.key === 'Enter') lookupBtn.click(); });
  }

  document.querySelectorAll('.qr-demo-btn').forEach(btn => {
    btn.addEventListener('click', () => { const id = btn.dataset.lotId; if (id) lookupAndShowQRRecord(id); });
  });
}

function initQRCameraScanner() {
  const video = document.getElementById('qrScanVideo');
  if (!video) return;
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => { qrCameraStream = stream; video.srcObject = stream; video.play(); })
    .catch(() => {
      const feedEl = document.getElementById('qrCameraFeed');
      if (feedEl) feedEl.innerHTML = `<div class="camera-demo-mode"><div class="camera-demo-icon">🔲</div><p>Camera unavailable</p><p style="color:var(--green);font-size:11px;margin-top:8px;">Use manual lookup or demo buttons below</p></div>`;
    });
}

function stopQRCamera() {
  if (qrCameraStream) { qrCameraStream.getTracks().forEach(t => t.stop()); qrCameraStream = null; }
}

async function lookupAndShowQRRecord(lotId) {
  const resultEl = document.getElementById('qrScanResult');
  if (!resultEl) return;
  resultEl.style.display = 'block';
  resultEl.innerHTML = `<div style="text-align:center;padding:30px;"><div class="scan-spinner"></div><p style="margin-top:14px;color:var(--muted);">Looking up ${lotId}…</p></div>`;

  let record = null;

  // Check allRecords (from app.js)
  if (typeof allRecords !== 'undefined') {
    record = allRecords.find(r => r.lot_id && r.lot_id.toLowerCase() === lotId.toLowerCase());
  }

  // Check demo fallback
  if (!record && typeof DEMO_FALLBACK_RECORDS !== 'undefined') {
    record = DEMO_FALLBACK_RECORDS.find(r => r.lot_id && r.lot_id.toLowerCase() === lotId.toLowerCase());
  }

  // Check seller listings
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

  // Try API
  if (!record) {
    try {
      const res = await fetch(`http://127.0.0.1:4000/api/records?lot=${encodeURIComponent(lotId)}&limit=1`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) { const data = await res.json(); record = Array.isArray(data) ? data[0] : data; }
    } catch (_) {}
  }

  if (!record) {
    resultEl.innerHTML = `<div style="text-align:center;padding:30px;color:var(--muted);"><div style="font-size:38px;margin-bottom:12px;">🔍</div><p>No record found for <strong style="color:var(--green)">${lotId}</strong></p><p style="font-size:11px;margin-top:10px;">Try: DEMO-AGR-0001 &nbsp;|&nbsp; FARM-LOT-001 &nbsp;|&nbsp; FARM-LOT-005</p></div>`;
    return;
  }

  displayTraceabilityProfile(record, resultEl);
}

function displayTraceabilityProfile(record, container) {
  if (!container) return;
  const harvestDate = record.harvest_date ? new Date(record.harvest_date).toLocaleDateString('en-IN') : 'N/A';
  const isVerified = !!record.blockchain_verified;
  const qrData = `https://agritrace.io/verify/${record.lot_id}`;
  const farmerCapture = record.farmer_price && record.consumer_price ? Math.round((record.farmer_price / record.consumer_price) * 100) : '--';

  container.innerHTML = `
    <div class="trace-profile">
      <div class="trace-header">
        <div>
          <div class="trace-lot-id">${record.lot_id}</div>
          <div class="trace-crop-name">${record.crop_name || 'Produce'}</div>
        </div>
        <div class="trace-badge ${isVerified ? 'trace-badge-verified' : 'trace-badge-unverified'}">
          ${isVerified ? '✓ BLOCKCHAIN VERIFIED' : '⚠ UNVERIFIED'}
        </div>
      </div>
      <div class="trace-grid">
        <div class="trace-item"><span class="trace-icon">🌾</span><div><div class="trace-label">Origin</div><div class="trace-value">${record.origin || 'N/A'}</div></div></div>
        <div class="trace-item"><span class="trace-icon">📅</span><div><div class="trace-label">Harvest Date</div><div class="trace-value">${harvestDate}</div></div></div>
        <div class="trace-item"><span class="trace-icon">⭐</span><div><div class="trace-label">Quality Grade</div><div class="trace-value">Grade ${record.quality_grade || 'N/A'}</div></div></div>
        <div class="trace-item"><span class="trace-icon">🌡️</span><div><div class="trace-label">Storage Temp</div><div class="trace-value">${record.storage_temperature_c || '--'}°C</div></div></div>
        <div class="trace-item"><span class="trace-icon">💧</span><div><div class="trace-label">Humidity</div><div class="trace-value">${record.storage_humidity_pct || '--'}%</div></div></div>
        <div class="trace-item"><span class="trace-icon">💰</span><div><div class="trace-label">Farmer Price</div><div class="trace-value">₹${record.farmer_price || '--'}/kg</div></div></div>
        <div class="trace-item"><span class="trace-icon">🛒</span><div><div class="trace-label">Consumer Price</div><div class="trace-value">₹${record.consumer_price || '--'}/kg</div></div></div>
        <div class="trace-item"><span class="trace-icon">📊</span><div><div class="trace-label">Farmer Capture</div><div class="trace-value">${farmerCapture}%</div></div></div>
      </div>
      <div class="trace-blockchain">
        <div class="trace-bc-title">⛓ BLOCKCHAIN RECORD</div>
        <div class="trace-hash"><span>Metadata Hash:</span><code>${(record.metadata_hash || 'N/A').substring(0, 34)}…</code></div>
        ${record.blockchain_tx_hash ? `<div class="trace-hash"><span>TX Hash:</span><code>${record.blockchain_tx_hash.substring(0, 34)}…</code></div>` : ''}
      </div>
      <div class="trace-bottom">
        <div>
          <div class="trace-label" style="margin-bottom:10px;">QR CODE</div>
          <div id="traceQRCode"></div>
        </div>
        <div class="trace-journey">
          <div class="trace-label" style="margin-bottom:12px;">SUPPLY CHAIN JOURNEY</div>
          <div class="journey-step done"><span>🌾</span> Harvested — ${record.origin || 'Farm'}</div>
          <div class="journey-step done"><span>📋</span> Registered on AgriTrace</div>
          <div class="journey-step ${isVerified ? 'done' : 'pending'}"><span>⛓</span> ${isVerified ? 'Blockchain Verified' : 'Pending Verification'}</div>
          <div class="journey-step ${record.storage_temperature_c ? 'done' : 'pending'}"><span>🚚</span> Cold Chain Monitored</div>
          <div class="journey-step pending"><span>🛒</span> Delivered to Market</div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const qrContainer = document.getElementById('traceQRCode');
    if (qrContainer) generateQRCode(qrData, qrContainer);
  }, 80);

  if (typeof speak === 'function') {
    speak(`Record found. ${record.crop_name} from ${record.origin}. Harvested ${harvestDate}. Farmer price ₹${record.farmer_price} per kg. ${isVerified ? 'Blockchain verified.' : 'Not yet blockchain verified.'}`);
  }
}

/* =========================================================
   FARMER DASHBOARD
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

  const earningsEl = document.getElementById('farmerEarnings');
  if (earningsEl) {
    const e = FARMER_DATA.earnings;
    earningsEl.innerHTML = `
      <div class="earnings-grid">
        <div class="earning-card"><span>Today</span><strong>₹${e.today.toLocaleString('en-IN')}</strong></div>
        <div class="earning-card"><span>This Week</span><strong>₹${e.week.toLocaleString('en-IN')}</strong></div>
        <div class="earning-card"><span>This Month</span><strong>₹${e.month.toLocaleString('en-IN')}</strong></div>
        <div class="earning-card earning-total"><span>Total Earnings</span><strong>₹${e.total.toLocaleString('en-IN')}</strong></div>
      </div>
    `;
  }

  const listEl = document.getElementById('farmerProduceList');
  if (listEl) {
    listEl.innerHTML = FARMER_DATA.produce.map(p => `
      <div class="produce-row produce-status-${p.status}">
        <div class="produce-row-left">
          <span class="produce-row-emoji">${p.emoji}</span>
          <div>
            <div class="produce-row-lot">${p.lotId}</div>
            <div class="produce-row-name">${p.crop}</div>
          </div>
        </div>
        <div class="produce-row-right">
          <span>${p.qty} ${p.unit}</span>
          <span>Grade ${p.grade}</span>
          <span>₹${p.askPrice}/kg</span>
          <span class="offers-count">${p.offers} offer${p.offers !== 1 ? 's' : ''}</span>
          <span class="status-badge status-${p.status}">${p.status.toUpperCase()}</span>
        </div>
        <div class="produce-row-actions">
          ${p.status !== 'sold' ? `<button class="small-button" onclick="viewFarmerOffers('${p.lotId}')">View Offers</button>` : `<span class="sold-label">✓ SOLD</span>`}
          <button class="small-button" onclick="generateBatchQR('${p.lotId}')">QR Code</button>
          <button class="small-button" onclick="lookupAndShowQRRecord('${p.lotId}'); document.getElementById('qrScannerModal').classList.add('open')">Trace</button>
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
  if (titleEl) titleEl.textContent = `Offers for ${lotId}`;

  const offers = DEMO_OFFERS[lotId] || [
    { seller: 'Demo Buyer', price: 50, qty: 100, time: 'Just now', status: 'new' }
  ];

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
        <button class="small-button accept-btn" onclick="acceptFarmerOffer(${i}, '${lotId}', ${o.price})">✓ Accept</button>
        <button class="small-button counter-btn" onclick="counterFarmerOffer(${i}, ${o.price})">↺ Counter</button>
        <button class="small-button reject-btn" onclick="this.closest('.offer-card').style.opacity='0.4'">✕ Decline</button>
      </div>
    </div>
  `).join('');

  modal.classList.add('open');
}

function acceptFarmerOffer(idx, lotId, price) {
  document.getElementById('offersModal').classList.remove('open');
  if (typeof showToast === 'function') showToast(`✓ Offer of ₹${price}/kg accepted for ${lotId}! Transaction initiated.`, 'success');
  if (typeof speak === 'function') speak(`Offer of ₹${price} per kg accepted for lot ${lotId}. Transaction is now pending.`);
}

function counterFarmerOffer(idx, currentPrice) {
  const price = prompt(`Counter offer (current: ₹${currentPrice}/kg)\nEnter your counter price (₹/kg):`);
  if (price && !isNaN(price)) {
    document.getElementById('offersModal').classList.remove('open');
    if (typeof showToast === 'function') showToast(`Counter offer of ₹${price}/kg sent successfully!`, 'success');
  }
}

function generateBatchQR(lotId) {
  const modal = document.getElementById('batchQRModal');
  if (!modal) return;
  const lotIdEl = document.getElementById('batchQRLotId');
  if (lotIdEl) lotIdEl.textContent = lotId;
  const qrContainer = document.getElementById('batchQRCode');
  if (qrContainer) generateQRCode(`https://agritrace.io/verify/${lotId}`, qrContainer);
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
          <div class="listing-detail"><span>📦</span>${l.qty} kg available</div>
          <div class="listing-detail"><span>📍</span>${l.origin}</div>
          <div class="listing-detail"><span>👨‍🌾</span>${l.farmer}</div>
          <div class="listing-detail"><span>📅</span>Harvested ${harvestDate}</div>
          <div class="listing-detail"><span>🌡️</span>${l.temp}°C &nbsp; 💧 ${l.humidity}%</div>
        </div>
        <div class="listing-footer">
          <div class="listing-ask-price">₹${l.askPrice}<span>/kg</span></div>
          <div class="listing-actions">
            <button class="small-button offer-btn" onclick="makeSellerOffer('${l.lotId}', ${l.askPrice}, '${l.crop}')">Make Offer</button>
            <button class="small-button" onclick="openQRForLot('${l.lotId}')">View Trace</button>
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
    const pct = Math.round(((askPrice - parseFloat(offerPrice)) / askPrice) * 100);
    const below = pct > 0 ? ` (${pct}% below asking)` : pct < 0 ? ` (${Math.abs(pct)}% above asking)` : '';
    if (typeof showToast === 'function') showToast(`✓ Offer of ₹${offerPrice}/kg submitted for ${lotId}${below}`, 'success');
    if (typeof speak === 'function') speak(`Offer of ₹${offerPrice} per kg submitted for ${cropName}. The farmer will be notified.`);
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
        resultEl.innerHTML = `<div style="text-align:center;padding:30px;"><div class="scan-spinner"></div><p style="margin-top:14px;color:var(--muted);">Verifying ${lotId}…</p></div>`;
      }

      let record = null;
      const allRec = typeof allRecords !== 'undefined' ? allRecords : [];
      const demos = typeof DEMO_FALLBACK_RECORDS !== 'undefined' ? DEMO_FALLBACK_RECORDS : [];
      record = [...allRec, ...demos].find(r => r.lot_id && r.lot_id.toLowerCase() === lotId.toLowerCase());

      if (!record) {
        const listing = SELLER_LISTINGS.find(l => l.lotId.toLowerCase() === lotId.toLowerCase());
        if (listing) record = {
          lot_id: listing.lotId, crop_name: listing.crop, origin: listing.origin,
          harvest_date: listing.harvest, quality_grade: listing.grade,
          storage_temperature_c: listing.temp, storage_humidity_pct: listing.humidity,
          farmer_price: listing.askPrice, consumer_price: Math.round(listing.askPrice * 1.42),
          blockchain_verified: listing.verified, metadata_hash: '0xdemo' + listing.lotId,
          blockchain_tx_hash: listing.verified ? '0xtx' + listing.lotId : null,
        };
      }

      setTimeout(() => {
        if (resultEl) {
          if (record) {
            displayTraceabilityProfile(record, resultEl);
          } else {
            resultEl.innerHTML = `<div style="text-align:center;padding:30px;color:var(--muted);"><div style="font-size:40px;margin-bottom:12px;">🔍</div><p>No record found for <strong style="color:var(--green)">${lotId}</strong></p><p style="font-size:11px;margin-top:10px;">Try: DEMO-AGR-0001 &nbsp;|&nbsp; DEMO-AGR-0002 &nbsp;|&nbsp; FARM-LOT-001</p></div>`;
          }
        }
      }, 800);
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
  { type: 'info',    icon: '⛓', title: 'Blockchain Verified',   msg: 'FARM-LOT-006 successfully anchored on Ethereum Mainnet',      time: '3 hours ago' },
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
  if (badge) { badge.textContent = warnings; badge.style.display = warnings > 0 ? 'inline-flex' : 'none'; }
}

/* =========================================================
   MODAL MANAGEMENT
   ========================================================= */

function initModalClose() {
  document.querySelectorAll('.feat-modal').forEach(modal => {
    modal.addEventListener('click', e => { if (e.target === modal) { modal.classList.remove('open'); stopQRCamera(); } });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.feat-modal.open').forEach(m => m.classList.remove('open'));
      closeCameraModal();
      stopQRCamera();
    }
  });

  const closeBatchQR = document.getElementById('closeBatchQRBtn');
  if (closeBatchQR) closeBatchQR.addEventListener('click', () => { const m = document.getElementById('batchQRModal'); if (m) m.classList.remove('open'); });

  const closeOffers = document.getElementById('closeOffersModalBtn');
  if (closeOffers) closeOffers.addEventListener('click', () => { const m = document.getElementById('offersModal'); if (m) m.classList.remove('open'); });
}

/* =========================================================
   MAIN INIT
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initLanguageSystem();
  initVoiceAssistant();
  initCameraScanner();
  initQRScanner();
  renderFarmerDashboard();
  initSellerMarketplace();
  initConsumerVerification();
  renderAlerts();
  initModalClose();

  // Preload voices
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
});
