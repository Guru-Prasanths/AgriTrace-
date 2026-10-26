/* =========================================================
   AgriTrace — Centralized Internationalization (i18n) Engine
   Complete Full-Platform Translation: English, Tamil, Hindi
   Supports Instant Switch, DOM Binding, Fallbacks & Persistence
   ========================================================= */

const I18N_STORAGE_KEY = 'agritrace_lang';
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳', dir: 'ltr' },
];

const TRANSLATIONS = {
  en: {
    // Top Bar & Brand
    brand_sub: 'SMART AGRI NETWORK',
    builder_badge: '👨‍💻 Builder: GURU PRASANTH',
    lead_architect_badge: '★ LEAD ARCHITECT & BUILDER: GURU PRASANTH',
    network_hardhat: 'Hardhat Local',
    network_sepolia: 'Sepolia Testnet',
    wallet_connect: 'Connect Wallet ᝰ.ᐟ',
    wallet_connected: 'Connected',
    clear_text_btn: 'Clear Text',
    clear_text_on: 'Clear Text: ON',
    translate_btn: 'Translate',
    points_badge: '100,000 PTS',
    scan_produce_title: 'Scan Produce with AI Camera',
    scan_qr_title: 'Scan QR Traceability Code',
    voice_assistant_title: 'AgriTrace Voice Assistant',
    voice_assistant_ai: 'Voice AI',
    alerts_title: 'Smart Alerts',

    // Navigation Links
    nav_home: 'Home',
    nav_dashboard: 'Dashboard',
    nav_traceability: 'Trace',
    nav_price: 'Prices',
    nav_iot: 'IoT',
    nav_farmer: 'Farmer',
    nav_seller: 'Seller',
    nav_consumer: 'Verify',

    // Mobile Menu
    m_nav_home: '🏠 Home',
    m_nav_dashboard: '📊 Dashboard',
    m_nav_traceability: '⛓ Traceability',
    m_nav_price: '💰 Price Discovery',
    m_nav_iot: '📡 IoT Monitoring',
    m_nav_farmer: '👨‍🌾 Farmer',
    m_nav_seller: '🛒 Seller',
    m_nav_consumer: '✓ Verify',
    m_clear_text: '👓 Clear Text View (High Readability)',
    m_all_lang: '🌐 Translate Page — All 100+ Languages',
    m_hardhat: '⭐ Hardhat Local Account (100K PTS)',
    m_builder: '👨‍💻 Web Builder: GURU PRASANTH',
    m_camera: '📷 AI Produce Scanner',
    m_qr: '🔲 QR Traceability Scanner',
    m_voice: '🗣️ Voice Assistant',
    status_online: 'Online',
    status_offline: 'Offline',

    // Hero Section
    hero_live_status: 'LIVE AGRICULTURAL INTELLIGENCE',
    hero_network_chain: 'HARDHAT LOCAL • CHAIN 31337',
    hero_h1_from: 'FROM',
    hero_h1_farm: 'FARM',
    hero_h1_to: 'TO',
    hero_h1_market: 'MARKET',
    hero_h1_with: 'WITH',
    hero_h1_complete: 'COMPLETE',
    hero_h1_transparency: 'TRANSPARENCY',
    hero_desc: 'A next-generation agricultural traceability network connecting farmers, logistics, markets and consumers through IoT + Blockchain + Transparent Pricing.',
    hero_btn_explore: 'Explore Traceability',
    hero_btn_dashboard: 'View Live Network',
    tech_iot: 'IoT Cold-Chain Telemetry',
    tech_iot_desc: 'Continuous real-time temp & humidity tracking',
    tech_contract: 'Ethereum Smart Contract',
    tech_contract_desc: 'Immutable provenance verified on-chain',
    tech_price: 'Real-Time Price Index',
    tech_price_desc: 'Decentralized farm-to-retail margin tracking',
    tech_qr: 'Cryptographic QR Verification',
    tech_qr_desc: 'Instant consumer verification of every lot',

    // Dashboard Section
    dash_system_overview: 'SYSTEM OVERVIEW',
    dash_heading: 'AGRITRACE COMMAND CENTER',
    dash_subheading: 'Live telemetry, supply chain provenance, and on-chain price fairness metrics.',
    dash_vol_label: 'TOTAL PRODUCE VOLUME',
    dash_batches_label: 'ACTIVE BATCHES',
    dash_coldchain_label: 'COLD-CHAIN COMPLIANCE',
    dash_fairprice_label: 'FAIR PRICE INDEX',
    dash_data_flow: 'DATA FLOW',
    dash_flow_heading: 'FARM → LOGISTICS → MARKET → CONSUMER',
    dash_flow_desc: 'Transparent provenance recorded at each milestone and verified on the blockchain.',
    flow_harvest: 'Farm Harvest',
    flow_harvest_desc: 'Registered with location, grade & farmer ask price',
    flow_logistics: 'Cold Chain Logistics',
    flow_logistics_desc: 'IoT telemetry streams temperature & humidity',
    flow_market: 'Market Wholesale',
    flow_market_desc: 'Transparent multi-party offers and settlement',
    flow_consumer: 'Consumer Verification',
    flow_consumer_desc: 'Instant QR code provenance lookup',

    // Traceability Section
    trace_label: 'BLOCKCHAIN TRACEABILITY',
    trace_h2_register: 'REGISTER PRODUCE',
    trace_h3_new: 'New Produce Record',
    trace_desc: 'Publish verified produce records directly to the Ethereum blockchain and PostgreSQL off-chain cache.',
    label_lot_id: 'LOT ID',
    label_crop_name: 'CROP NAME',
    label_origin: 'FARM / ORIGIN',
    label_harvest_date: 'HARVEST DATE',
    label_quality_grade: 'QUALITY GRADE',
    label_temp: 'STORAGE TEMPERATURE °C',
    label_humidity: 'STORAGE HUMIDITY %',
    label_farmer_price: 'FARMER PRICE ₹',
    label_consumer_price: 'CONSUMER PRICE ₹',
    placeholder_lot_id: 'Example: LOT011',
    placeholder_crop_name: 'Example: TOMATO',
    placeholder_origin: 'Farm location e.g. Salem, Tamil Nadu',
    placeholder_search_records: '🔍 Filter lot, crop, origin...',
    btn_create_verify: 'CREATE & VERIFY →',
    btn_refresh: '↻ Refresh',
    th_lot_id: 'LOT ID',
    th_crop: 'CROP',
    th_origin: 'ORIGIN',
    th_harvest: 'HARVEST',
    th_price: 'PRICE',
    th_status: 'STATUS',
    th_authenticity: 'AUTHENTICITY',
    th_actions: 'ACTIONS',
    status_verified: 'Verified',
    status_pending: 'Pending',
    status_active: 'Active',
    status_sold: 'Sold',
    status_negotiating: 'Negotiating',
    filter_all: 'All',
    filter_grade_aplus: '⭐ Grade A+',
    filter_verified_only: '✓ Verified Only',
    records_empty: 'No produce records found matching criteria.',

    // Price Discovery Section
    price_label: 'TRANSPARENT PRICE DISCOVERY',
    price_heading: 'FOLLOW THE VALUE CHAIN',
    price_desc: 'Eliminating predatory middleman margins by tracking prices from farm gate to supermarket shelf.',
    price_h3_record: 'Record Market Prices',
    price_h3_dist: 'Price Distribution',
    label_farmer_share: 'FARMER ₹',
    label_trader_share: 'TRADER ₹',
    label_market_share: 'MARKET ₹',
    label_consumer_share: 'CONSUMER ₹',
    btn_record_blockchain: 'RECORD ON BLOCKCHAIN →',
    price_card_farmer: 'Farmer Gate Price',
    price_card_wholesale: 'Wholesale Mandi',
    price_card_retail: 'Retail Consumer Price',
    price_card_farmer_retention: 'Farmer Margin Retention',
    price_expl_1: 'Eliminates predatory middleman markups by making wholesale transaction records immutable.',
    price_expl_2: 'Enables fair remuneration for farmers based on live market demand signals.',

    // IoT Sensor Section
    iot_label: 'IoT COLD-CHAIN MONITORING',
    iot_heading: 'REAL-TIME SENSOR INTELLIGENCE',
    iot_desc: 'Continuous cold chain telemetry streaming directly to the distributed ledger.',
    iot_h3_record: 'Record Sensor Reading',
    iot_h3_status: 'Cold Chain Status',
    label_sensor_temp: 'TEMPERATURE °C',
    label_sensor_humidity: 'HUMIDITY %',
    label_sensor_spoilage: 'SPOILAGE RISK %',
    btn_write_sensor: 'WRITE SENSOR DATA →',
    sensor_ambient_temp: 'Storage Temp',
    sensor_humidity_level: 'Relative Humidity',
    sensor_spoilage_index: 'Spoilage Probability',
    sensor_status_normal: 'Optimal Storage',
    sensor_status_warning: 'Threshold Exceeded',

    // Features Section
    feat_label: 'AGRITRACE TECHNOLOGY STACK',
    feat_heading: 'ONE PLATFORM. COMPLETE VISIBILITY.',
    feat_card_1_title: 'Blockchain Traceability',
    feat_card_1_desc: 'Every produce batch receives an immutable cryptographic identity recorded on Ethereum smart contracts.',
    feat_card_2_title: 'IoT Cold Chain',
    feat_card_2_desc: 'Real-time telemetry sensors monitor temperature and humidity across transport and storage.',
    feat_card_3_title: 'Price Discovery',
    feat_card_3_desc: 'Transparent pricing tracks margins across farmers, distributors, wholesale markets, and retailers.',
    feat_card_4_title: 'QR Traceability',
    feat_card_4_desc: 'Consumers scan batch QR codes to view the full journey, farm of origin, and inspection timestamps.',
    feat_card_5_title: 'Smart Logistics',
    feat_card_5_desc: 'Automated transit event logging with predictive spoilage risk calculations and threshold alarms.',
    feat_card_6_title: 'AI Quality Intelligence',
    feat_card_6_desc: 'Computer-vision assisted produce classification and grading for accurate quality verification.',

    // Solutions CTA Section
    solutions_label: 'THE FUTURE OF AGRICULTURE',
    solutions_heading: 'EVERY CROP. EVERY JOURNEY. EVERY TRANSACTION.',
    solutions_desc: 'Deploy AgriTrace across your agricultural cooperative, retail network, or logistics fleet today.',
    solutions_btn_primary: 'Get Started with AgriTrace',
    solutions_btn_secondary: 'View Documentation',

    // Farmer Dashboard Section
    farmer_label: 'FARMER PORTAL',
    farmer_heading: 'FARMER DASHBOARD',
    farmer_profile_title: 'Farmer Profile',
    farmer_batches_title: 'My Produce Batches',
    farmer_earnings_today: 'Today',
    farmer_earnings_week: 'This Week',
    farmer_earnings_month: 'This Month',
    farmer_earnings_total: 'Total Earnings',
    farmer_btn_offers: 'View Offers',
    farmer_btn_qr: 'QR Code',
    farmer_btn_trace: 'Trace',
    farmer_sold_tag: '✓ SOLD',
    farmer_offers_title: 'Offers for',
    farmer_accept_btn: '✓ Accept',
    farmer_counter_btn: '↺ Counter',
    farmer_decline_btn: '✕ Decline',

    // Seller Marketplace Section
    seller_label: 'LIVE MARKETPLACE',
    seller_heading: 'SELLER MARKETPLACE',
    seller_search_placeholder: '🔍 Search produce, origin, grade, farmer...',
    seller_make_offer: 'Make Offer',
    seller_view_trace: 'View Trace',
    seller_available: 'available',
    seller_harvested: 'Harvested',
    seller_asking: 'Asking',

    // Consumer Section
    consumer_label: 'CONSUMER TRACEABILITY',
    consumer_heading: 'VERIFY YOUR PRODUCE',
    consumer_h3_lookup: 'Scan or Lookup',
    consumer_h3_details: "What You'll See",
    consumer_input_label: 'Enter Lot ID to verify',
    consumer_input_placeholder: 'Enter Lot ID (e.g. DEMO-AGR-0001)',
    consumer_btn_lookup: '🔍 Lookup',
    consumer_quick_demo: 'Or click demo lot:',
    consumer_journey_harvest: 'Harvested at Farm',
    consumer_journey_registered: 'Registered on AgriTrace',
    consumer_journey_blockchain: 'Blockchain Verified',
    consumer_journey_coldchain: 'Cold Chain Monitored',
    consumer_journey_delivered: 'Delivered to Market',

    // Clear Text View & Accessibility Toolbar
    toolbar_clear_text: 'Clear Text',
    toolbar_clear_text_on: 'Clear Text: ON',
    toolbar_text_size: 'Text Size',
    toolbar_text_small: 'Small',
    toolbar_text_default: 'Default',
    toolbar_text_large: 'Large',
    toolbar_translate: 'Translate',
    toolbar_hardhat: '100K PTS',
    toolbar_builder: 'GURU PRASANTH',

    // Voice Assistant UI
    voice_panel_title: 'AgriTrace Voice Assistant',
    voice_panel_sub: 'Ask anything about produce, prices & navigation',
    voice_volume_label: 'Voice Volume',
    voice_state_idle: 'Ready to listen',
    voice_state_listening: '🎤 Listening… speak now',
    voice_state_processing: '⚙️ Processing command…',
    voice_state_speaking: '🔊 Speaking response…',
    voice_state_error: '⚠️ Could not understand command',
    voice_btn_start: 'Start Listening',
    voice_btn_stop: 'Stop Listening',
    voice_btn_stop_speaking: 'Stop Speaking',
    voice_btn_mute: 'Mute',
    voice_btn_unmute: 'Unmute',
    voice_input_placeholder: 'Type command or question (e.g. Tomato prices, Open dashboard)...',
    voice_btn_send: 'Send',
    voice_greeting: 'Welcome to AgriTrace! I can help you with produce traceability, prices, and navigation. Try asking: What is the price of tomatoes?',
    voice_help_response: 'I can help you navigate AgriTrace, inspect produce prices, check cold chain alerts, and control accessibility settings. Say: "Open farmer dashboard", "Show available products", "Search for tomatoes", "Change language to Tamil", "Increase text size", or "Explain traceability".',
    voice_confirm_action: 'Please confirm: Do you want to proceed with this sensitive action?',
    voice_unauthorized_farmer: 'Access denied: You must be authenticated as an authorized farmer to execute this action.',
    voice_speech_unsupported: 'Browser speech recognition is not supported or permission was denied. You can still use the text input below!',
    voice_lang_switched: 'Language changed to English. Voice assistant updated.',

    // Modals
    modal_close: '✕ Close',
    camera_modal_title: 'Camera Produce Scanner',
    camera_btn_identify: '📷 Identify Produce',
    camera_btn_manual: '🌾 Manual Select',
    camera_btn_confirm: '✓ Confirm & Link to Batch',
    camera_btn_change: '↺ Change Produce',
    qr_modal_title: 'QR Traceability Scanner',
    qr_modal_desc: 'Scan batch QR code or enter Lot ID to verify on Ethereum blockchain',
    offers_modal_title: 'Farmer Batch Offers',
    hardhat_modal_title: 'Hardhat Local Environment',
    hardhat_modal_desc: 'Pre-configured developer accounts with 10,000 ETH and 100,000 PTS test credit',
    hardhat_faucet_btn: '🎁 Claim 25,000 PTS Test Credit',
    builder_modal_title: 'Lead Architect & Web Builder',
    builder_modal_role: 'Full-Stack Web3 & Distributed Systems Architect',
    all_lang_modal_title: 'All-Language Universal Translator',
    all_lang_modal_desc: 'Dynamically translate all pages, tables, forms, and charts into your preferred language',
    all_lang_search: '🔍 Search language (e.g. Tamil, Hindi, Spanish, Telugu)...',
    all_lang_label: 'SELECT LANGUAGE FOR FULL-PLATFORM TRANSLATION',

    // Toasts & Alerts
    toast_lang_changed: '🌐 Language changed to English',
    toast_clear_text_on: '👓 Clear Text View Activated: High-contrast, sharp typography for all pages.',
    toast_clear_text_off: '👓 Standard View Restored.',
    toast_text_size_small: 'Text Size: Small (Compact View)',
    toast_text_size_default: 'Text Size: Default',
    toast_text_size_large: 'Text Size: Large (Maximum Readability)',
    toast_voice_muted: '🔇 Voice Assistant Muted',
    toast_voice_unmuted: '🔊 Voice Assistant Unmuted',
    toast_wallet_connected: '✓ Wallet Connected Successfully',
    toast_offer_accepted: '✓ Offer accepted! Blockchain transaction initiated.',
    toast_counter_sent: '✓ Counter offer sent to buyer.',

    // Error messages
    err_metamask_rejected: 'The MetaMask transaction was rejected by user.',
    err_metamask_not_installed: 'MetaMask is not installed. Please open AgriTrace in a Web3 browser.',
    err_wrong_network: 'Please switch MetaMask to Sepolia or Hardhat Local network.',
    err_backend_offline: 'Cannot connect to AgriTrace backend API. Off-chain cache fallback active.',
    err_lot_exists: 'That lot ID already exists on-chain. Please use a unique lot ID.',
    err_not_operator: 'This connected wallet is not authorized as an AgriTrace contract operator.',
    err_db_unavailable: 'Off-chain database is temporarily unreachable. Using verified on-chain data.',
    err_contract_not_configured: 'The AgriTrace smart contract address is not configured. Deploy the contract and update CONTRACT_ADDRESS.',
    err_insufficient_funds: 'The connected wallet does not have enough test ETH.',
    no_records_found: 'No matching produce records found.',
    view_trace: 'View Trace',
    demo_tag: 'DEMO',
    on_chain_immutable_anchor: 'ON-CHAIN IMMUTABLE ANCHOR',
    verified_on_chain: 'VERIFIED ON-CHAIN',
    status_anchored: 'ANCHORED',
    off_chain_only: 'OFF-CHAIN ONLY',
    lot_key: 'LOT KEY (KECCAK-256)',
    creator_wallet: 'CREATOR WALLET',
    metadata_hash: 'METADATA FINGERPRINT (HASH)',
    tx_hash_label: 'TRANSACTION HASH',
    off_chain_metadata: 'OFF-CHAIN POSTGRESQL METADATA',
    rich_farm_data: 'RICH FARM DATA',
    storage_temp: 'STORAGE TEMP',
    storage_humidity: 'STORAGE HUMIDITY',
    record_price: 'Record Price',
    record_sensor: 'Record Sensor',
    lifecycle_timeline: 'FARM-TO-MARKET LIFECYCLE TIMELINE',
    step_harvested: 'HARVESTED',
    step_registered: 'REGISTERED',
    step_anchored: 'BLOCKCHAIN ANCHORED',
    step_price: 'PRICE DISCOVERY',
    step_sensor: 'COLD-CHAIN MONITORED',
    step_verified: 'VERIFIED',
    records_refreshed: 'Records refreshed successfully.',
    loading_trace_data: 'Loading traceability data for {lotId}…',
    no_tx_hash_yet: 'No blockchain transaction hash recorded yet.',

    // Footer
    footer_rights: '© 2026 AgriTrace. Engineered & Built by GURU PRASANTH. All rights reserved.',
    footer_about: 'AgriTrace is a decentralized agriculture provenance network engineered for full transparency from farm gate to consumer retail.',
    footer_col_nav: 'Navigation',
    footer_col_platform: 'Platform Stack',
    footer_col_social: 'Architect Profile',
  },

  ta: {
    // Top Bar & Brand
    brand_sub: 'ஸ்மார்ட் விவசாய நெட்வொர்க்',
    builder_badge: '👨‍💻 உருவாக்கியவர்: குரு பிரசாந்த்',
    lead_architect_badge: '★ தலைமை கட்டிடக்கலைஞர் & உருவாக்கியவர்: குரு பிரசாந்த்',
    network_hardhat: 'ஹார்ட்ஹேட் லோக்கல்',
    network_sepolia: 'செபோலியா டெஸ்ட்நெட்',
    wallet_connect: 'வாலட் இணைக்க ᝰ.ᐟ',
    wallet_connected: 'இணைக்கப்பட்டது',
    clear_text_btn: 'தெளிவான உரை',
    clear_text_on: 'தெளிவான உரை: ஆன்',
    translate_btn: 'மொழிபெயர்',
    points_badge: '100,000 புள்ளிகள்',
    scan_produce_title: 'AI கேமரா மூலம் விளைபொருளை ஸ்கேன் செய்',
    scan_qr_title: 'QR குறியீட்டை ஸ்கேன் செய்',
    voice_assistant_title: 'AgriTrace குரல் உதவியாளர்',
    voice_assistant_ai: 'குரல் AI',
    alerts_title: 'ஸ்மார்ட் எச்சரிக்கைகள்',

    // Navigation Links
    nav_home: 'முகப்பு',
    nav_dashboard: 'டாஷ்போர்டு',
    nav_traceability: 'கண்காணிப்பு',
    nav_price: 'விலைகள்',
    nav_iot: 'IoT',
    nav_farmer: 'விவசாயி',
    nav_seller: 'விற்பனையாளர்',
    nav_consumer: 'சரிபார்க்க',

    // Mobile Menu
    m_nav_home: '🏠 முகப்பு',
    m_nav_dashboard: '📊 டாஷ்போர்டு',
    m_nav_traceability: '⛓ கண்காணிப்பு',
    m_nav_price: '💰 விலை கண்டறிதல்',
    m_nav_iot: '📡 IoT கண்காணிப்பு',
    m_nav_farmer: '👨‍🌾 விவசாயி',
    m_nav_seller: '🛒 விற்பனையாளர்',
    m_nav_consumer: '✓ சரிபார்க்க',
    m_clear_text: '👓 தெளிவான உரை காட்சி (அதிக வாசிப்புத்திறன்)',
    m_all_lang: '🌐 பக்கத்தை மொழிபெயர் — 100+ மொழிகள்',
    m_hardhat: '⭐ ஹார்ட்ஹேட் கணக்கு (100K புள்ளிகள்)',
    m_builder: '👨‍💻 உருவாக்கியவர்: குரு பிரசாந்த்',
    m_camera: '📷 AI பயிர் ஸ்கேனர்',
    m_qr: '🔲 QR கண்காணிப்பு ஸ்கேனர்',
    m_voice: '🗣️ குரல் உதவியாளர்',
    status_online: 'இணைப்பில்',
    status_offline: 'ஆஃப்லைன்',

    // Hero Section
    hero_live_status: 'நேரலை விவசாய நுண்ணறிவு',
    hero_network_chain: 'ஹார்ட்ஹேட் லோக்கல் • செயின் 31337',
    hero_h1_from: 'பண்ணை',
    hero_h1_farm: 'முதல்',
    hero_h1_to: 'சந்தை',
    hero_h1_market: 'வரை',
    hero_h1_with: 'முழு',
    hero_h1_complete: 'வெளிப்படைத்',
    hero_h1_transparency: 'தன்மையுடன்',
    hero_desc: 'IoT + பிளாக்செயின் + வெளிப்படையான விலை நிர்ணயம் மூலம் விவசாயிகள், போக்குவரத்து, சந்தைகள் மற்றும் நுகர்வோரை இணைக்கும் அடுத்த தலைமுறை விவசாய கண்காணிப்பு தளம்.',
    hero_btn_explore: 'கண்காணிப்பை ஆராயுங்கள்',
    hero_btn_dashboard: 'நேரலை நெட்வொர்க் காண்க',
    tech_iot: 'IoT குளிர்பதன தொலைஅளவியல்',
    tech_iot_desc: 'நேரலை வெப்பநிலை & ஈரப்பதம் தொடர் கண்காணிப்பு',
    tech_contract: 'Ethereum ஸ்மார்ட் ஒப்பந்தம்',
    tech_contract_desc: 'மாற்ற முடியாத உண்மைத்தன்மை பிளாக்செயினில் சரிபார்க்கப்பட்டது',
    tech_price: 'நேரலை விலை குறியீடு',
    tech_price_desc: 'பண்ணை முதல் சில்லறை வரையிலான இடைத்தரகர் விலைக் கண்காணிப்பு',
    tech_qr: 'கிரிப்டோகிராஃபிக் QR சரிபார்ப்பு',
    tech_qr_desc: 'ஒவ்வொரு தொகுதியையும் நுகர்வோர் உடனடியாக சரிபார்க்கும் வசதி',

    // Dashboard Section
    dash_system_overview: 'அமைப்பு கண்ணோட்டம்',
    dash_heading: 'AGRITRACE கட்டுப்பாட்டு மையம்',
    dash_subheading: 'நேரலை தொலைஅளவியல், விநியோக சங்கிலி கண்காணிப்பு மற்றும் நியாயமான விலை அளவீடுகள்.',
    dash_vol_label: 'மொத்த விளைபொருள் அளவு',
    dash_batches_label: 'செயலில் உள்ள தொகுதிகள்',
    dash_coldchain_label: 'குளிர்பதன இணக்கம்',
    dash_fairprice_label: 'நியாய விலை குறியீடு',
    dash_data_flow: 'தரவு ஓட்டம்',
    dash_flow_heading: 'பண்ணை → போக்குவரத்து → சந்தை → நுகர்வோர்',
    dash_flow_desc: 'ஒவ்வொரு கட்டத்திலும் மாற்ற முடியாத தகவல்கள் பிளாக்செயினில் பதிவு செய்யப்படுகின்றன.',
    flow_harvest: 'பண்ணை அறுவடை',
    flow_harvest_desc: 'இடம், தரம் மற்றும் விவசாயி கோரும் விலையுடன் பதிவு',
    flow_logistics: 'குளிர்பதன போக்குவரத்து',
    flow_logistics_desc: 'IoT வெப்பநிலை மற்றும் ஈரப்பதத்தை தொடர்ந்து பதிவு செய்கிறது',
    flow_market: 'மொத்த விற்பனை சந்தை',
    flow_market_desc: 'வெளிப்படையான பலதரப்பு சலுகைகள் மற்றும் தீர்வு',
    flow_consumer: 'நுகர்வோர் சரிபார்ப்பு',
    flow_consumer_desc: 'QR குறியீடு மூலம் உடனடி உண்மைத்தன்மை சரிபார்ப்பு',

    // Traceability Section
    trace_label: 'பிளாக்செயின் கண்காணிப்பு',
    trace_h2_register: 'பயிர்களை பதிவு செய்க',
    trace_h3_new: 'புதிய விளைபொருள் பதிவு',
    trace_desc: 'சரிபார்க்கப்பட்ட விளைபொருள் பதிவுகளை நேரடியாக Ethereum பிளாக்செயின் மற்றும் PostgreSQL-ல் பதிவேற்றுக.',
    label_lot_id: 'லாட் எண்',
    label_crop_name: 'பயிர் பெயர்',
    label_origin: 'பண்ணை / இடம்',
    label_harvest_date: 'அறுவடை தேதி',
    label_quality_grade: 'தர வகை',
    label_temp: 'சேமிப்பு வெப்பநிலை °C',
    label_humidity: 'சேமிப்பு ஈரப்பதம் %',
    label_farmer_price: 'விவசாயி விலை ₹',
    label_consumer_price: 'நுகர்வோர் விலை ₹',
    placeholder_lot_id: 'எ.கா: LOT011',
    placeholder_crop_name: 'எ.கா: TOMATO',
    placeholder_origin: 'பண்ணை இடம் எ.கா: சேலம், தமிழ்நாடு',
    placeholder_search_records: '🔍 லாட், பயிர், இடம் வடிகட்டுக...',
    btn_create_verify: 'உருவாக்கி சரிபார் →',
    btn_refresh: '↻ புதுப்பி',
    th_lot_id: 'லாட் எண்',
    th_crop: 'பயிர்',
    th_origin: 'இடம்',
    th_harvest: 'அறுவடை',
    th_price: 'விலை',
    th_status: 'நிலை',
    th_authenticity: 'உண்மைத்தன்மை',
    th_actions: 'செயல்கள்',
    status_verified: 'சரிபார்க்கப்பட்டது',
    status_pending: 'நிலுவையில்',
    status_active: 'செயலில்',
    status_sold: 'விற்கப்பட்டது',
    status_negotiating: 'பேச்சுவார்த்தையில்',
    filter_all: 'அனைத்தும்',
    filter_grade_aplus: '⭐ தரம் A+',
    filter_verified_only: '✓ சரிபார்க்கப்பட்டது மட்டும்',
    records_empty: 'பொருந்தும் விளைபொருள் பதிவுகள் எதுவும் கிடைக்கவில்லை.',

    // Price Discovery Section
    price_label: 'வெளிப்படையான விலை கண்டறிதல்',
    price_heading: 'மதிப்பு சங்கிலியை பின்தொடருங்கள்',
    price_desc: 'பண்ணை வாசல் முதல் சூப்பர் மார்க்கெட் வரை விலைகளைக் கண்காணிப்பதன் மூலம் இடைத்தரகர் சுரண்டலைத் தடுக்கிறது.',
    price_h3_record: 'சந்தை விலைகளை பதிவு செய்க',
    price_h3_dist: 'விலை பகிர்வு',
    label_farmer_share: 'விவசாயி ₹',
    label_trader_share: 'வியாபாரி ₹',
    label_market_share: 'சந்தை ₹',
    label_consumer_share: 'நுகர்வோர் ₹',
    btn_record_blockchain: 'பிளாக்செயினில் பதிவு செய் →',
    price_card_farmer: 'விவசாயி பண்ணை விலை',
    price_card_wholesale: 'மொத்த விற்பனை மண்டி',
    price_card_retail: 'சில்லறை நுகர்வோர் விலை',
    price_card_farmer_retention: 'விவசாயிக்கு கிடைக்கும் பங்கு',
    price_expl_1: 'மொத்த விற்பனைப் பதிவுகளை மாற்ற முடியாததாக்குவதன் மூலம் இடைத்தரகர் கூடுதல் கட்டணங்களைத் தடுக்கிறது.',
    price_expl_2: 'நேரடி சந்தை தேவை சமிக்ஞைகளின் அடிப்படையில் விவசாயிகளுக்கு நியாயமான கூலி கிடைக்க உதவுகிறது.',

    // IoT Sensor Section
    iot_label: 'IoT குளிர்பதன கண்காணிப்பு',
    iot_heading: 'நேரலை சென்சார் நுண்ணறிவு',
    iot_desc: 'குளிர்பதனப் பெட்டகத் தரவுகள் நேரடியாக லெட்ஜரில் சேமிக்கப்படுகின்றன.',
    iot_h3_record: 'சென்சார் அளவீட்டை பதிவு செய்',
    iot_h3_status: 'குளிர்பதன நிலை',
    label_sensor_temp: 'வெப்பநிலை °C',
    label_sensor_humidity: 'ஈரப்பதம் %',
    label_sensor_spoilage: 'கெட்டுப்போகும் ஆபத்து %',
    btn_write_sensor: 'சென்சார் தரவை எழுது →',
    sensor_ambient_temp: 'சேமிப்பு வெப்பநிலை',
    sensor_humidity_level: 'ஒப்பீட்டு ஈரப்பதம்',
    sensor_spoilage_index: 'கெட்டுப்போகும் நிகழ்தகவு',
    sensor_status_normal: 'உகந்த சேமிப்பு',
    sensor_status_warning: 'வரம்பு தாண்டியது',

    // Features Section
    feat_label: 'AGRITRACE தொழில்நுட்ப கட்டமைப்பு',
    feat_heading: 'ஒரே தளம். முழு பார்வை.',
    feat_card_1_title: 'பிளாக்செயின் கண்காணிப்பு',
    feat_card_1_desc: 'ஒவ்வொரு பயிர் தொகுதிக்கும் Ethereum ஸ்மார்ட் ஒப்பந்தங்களில் மாற்ற முடியாத அடையாளம் பதிவு செய்யப்படுகிறது.',
    feat_card_2_title: 'IoT குளிர்பதன சங்கிலி',
    feat_card_2_desc: 'போக்குவரத்து மற்றும் சேமிப்பில் வெப்பநிலை மற்றும் ஈரப்பதத்தை நேரலை சென்சார்கள் கண்காணிக்கின்றன.',
    feat_card_3_title: 'விலை கண்டறிதல்',
    feat_card_3_desc: 'விவசாயிகள், விநியோகஸ்தர்கள் மற்றும் சில்லறை விற்பனையாளர்களிடையே வெளிப்படையான விலை பகிர்வு.',
    feat_card_4_title: 'QR கண்காணிப்பு',
    feat_card_4_desc: 'நுகர்வோர் QR குறியீட்டை ஸ்கேன் செய்து முழு விநியோக பயணத்தையும் பண்ணையின் இருப்பிடத்தையும் பார்க்கலாம்.',
    feat_card_5_title: 'ஸ்மார்ட் லாஜிஸ்டிக்ஸ்',
    feat_card_5_desc: 'பயண நிகழ்வுகள் தானாகப் பதிவு செய்யப்பட்டு கெட்டுப்போகும் ஆபத்து முன்னறிவிக்கப்படுகிறது.',
    feat_card_6_title: 'AI தர நுண்ணறிவு',
    feat_card_6_desc: 'கம்ப்யூட்டர் விஷன் மூலம் பயிர் வகை மற்றும் தரத்தை துல்லியமாக தரம் பிரிக்கும் வசதி.',

    // Solutions CTA Section
    solutions_label: 'விவசாயத்தின் எதிர்காலம்',
    solutions_heading: 'ஒவ்வொரு பயிர். ஒவ்வொரு பயணம். ஒவ்வொரு பரிவர்த்தனை.',
    solutions_desc: 'உங்கள் விவசாய கூட்டுறவு அல்லது விநியோக நெட்வொர்க்கில் AgriTrace-ஐ இப்போதே பயன்படுத்துங்கள்.',
    solutions_btn_primary: 'AgriTrace உடன் தொடங்குக',
    solutions_btn_secondary: 'ஆவணங்களை பார்க்க',

    // Farmer Dashboard Section
    farmer_label: 'விவசாயி தளம்',
    farmer_heading: 'விவசாயி டாஷ்போர்டு',
    farmer_profile_title: 'விவசாயி சுயவிவரம்',
    farmer_batches_title: 'என் விளைபொருள் தொகுதிகள்',
    farmer_earnings_today: 'இன்று',
    farmer_earnings_week: 'இந்த வாரம்',
    farmer_earnings_month: 'இந்த மாதம்',
    farmer_earnings_total: 'மொத்த வருவாய்',
    farmer_btn_offers: 'சலுகைகளை காண்க',
    farmer_btn_qr: 'QR குறியீடு',
    farmer_btn_trace: 'கண்காணி',
    farmer_sold_tag: '✓ விற்கப்பட்டது',
    farmer_offers_title: 'சலுகைகள் —',
    farmer_accept_btn: '✓ ஏற்க',
    farmer_counter_btn: '↺ மாற்று சலுகை',
    farmer_decline_btn: '✕ நிராகரி',

    // Seller Marketplace Section
    seller_label: 'நேரலை சந்தை',
    seller_heading: 'விற்பனையாளர் சந்தை',
    seller_search_placeholder: '🔍 பயிர், இடம், தரம், விவசாயி தேடுங்கள்...',
    seller_make_offer: 'சலுகை வழங்க',
    seller_view_trace: 'விவரம் காண்க',
    seller_available: 'இருப்பில் உள்ளது',
    seller_harvested: 'அறுவடை செய்யப்பட்டது',
    seller_asking: 'கேட்கப்படும் விலை',

    // Consumer Section
    consumer_label: 'நுகர்வோர் கண்காணிப்பு',
    consumer_heading: 'உங்கள் விளைபொருளை சரிபார்க்கவும்',
    consumer_h3_lookup: 'ஸ்கேன் அல்லது தேடல்',
    consumer_h3_details: 'நீங்கள் காண்பவை',
    consumer_input_label: 'சரிபார்க்க லாட் எண்ணை உள்ளிடவும்',
    consumer_input_placeholder: 'லாட் எண் உள்ளிடவும் (எ.கா: DEMO-AGR-0001)',
    consumer_btn_lookup: '🔍 தேடு',
    consumer_quick_demo: 'அல்லது மாதிரி லாட்டை கிளிக் செய்க:',
    consumer_journey_harvest: 'பண்ணையில் அறுவடை செய்யப்பட்டது',
    consumer_journey_registered: 'AgriTrace-ல் பதிவு செய்யப்பட்டது',
    consumer_journey_blockchain: 'பிளாக்செயினில் சரிபார்க்கப்பட்டது',
    consumer_journey_coldchain: 'குளிர்பதனம் கண்காணிக்கப்பட்டது',
    consumer_journey_delivered: 'சந்தைக்கு விநியோகிக்கப்பட்டது',

    // Clear Text View & Accessibility Toolbar
    toolbar_clear_text: 'தெளிவான உரை',
    toolbar_clear_text_on: 'தெளிவான உரை: ஆன்',
    toolbar_text_size: 'எழுத்து அளவு',
    toolbar_text_small: 'சிறிய',
    toolbar_text_default: 'இயல்பு',
    toolbar_text_large: 'பெரிய',
    toolbar_translate: 'மொழிபெயர்',
    toolbar_hardhat: '100K புள்ளிகள்',
    toolbar_builder: 'குரு பிரசாந்த்',

    // Voice Assistant UI
    voice_panel_title: 'AgriTrace குரல் உதவியாளர்',
    voice_panel_sub: 'பயிர், விலைகள் மற்றும் வழிகாட்டலுக்கு கேளுங்கள்',
    voice_volume_label: 'குரல் ஒலி அளவு',
    voice_state_idle: 'கேட்க தயாராக உள்ளது',
    voice_state_listening: '🎤 கேட்கிறது… இப்போது பேசுங்கள்',
    voice_state_processing: '⚙️ கட்டளையை செயலாக்குகிறது…',
    voice_state_speaking: '🔊 பதிலளிக்கிறது…',
    voice_state_error: '⚠️ கட்டளையைப் புரிந்து கொள்ள முடியவில்லை',
    voice_btn_start: 'பேசத் தொடங்கு',
    voice_btn_stop: 'பேசுவதை நிறுத்து',
    voice_btn_stop_speaking: 'பதிலை நிறுத்து',
    voice_btn_mute: 'ஒலியடக்கு',
    voice_btn_unmute: 'ஒலி இயக்கு',
    voice_input_placeholder: 'கட்டளையை தட்டச்சு செய்யவும் (எ.கா: தக்காளி விலை, டாஷ்போர்டு திற)...',
    voice_btn_send: 'அனுப்பு',
    voice_greeting: 'AgriTrace-க்கு வரவேற்கிறோம்! விளைபொருள் கண்காணிப்பு, விலைகள் மற்றும் வழிகாட்டலுக்கு நான் உதவுகிறேன். "தக்காளி விலை என்ன?" என்று கேட்டுப் பாருங்கள்.',
    voice_help_response: 'AgriTrace-ஐ இயக்க, பயிர் விலைகளை அறிய, எச்சரிக்கைகளை சரிபார்க்க நான் உதவுவேன். "விவசாயி டாஷ்போர்டு திற", "கிடைக்கும் தயாரிப்புகளை காட்டு", "தக்காளி தேடு", "மொழியை தமிழுக்கு மாற்று", அல்லது "எழுத்து அளவை அதிகரி" என்று சொல்லுங்கள்.',
    voice_confirm_action: 'தயவுசெய்து உறுதிப்படுத்தவும்: இந்த முக்கியமான செயலை தொடர விரும்புகிறீர்களா?',
    voice_unauthorized_farmer: 'அனுமதி மறுக்கப்பட்டது: இந்த செயலைச் செய்ய நீங்கள் அங்கீகரிக்கப்பட்ட விவசாயியாக இருக்க வேண்டும்.',
    voice_speech_unsupported: 'உங்கள் உலாவியில் குரல் அங்கீகாரம் ஆதரிக்கப்படவில்லை அல்லது அனுமதி மறுக்கப்பட்டது. கீழே உள்ள தட்டச்சு பெட்டியைப் பயன்படுத்தலாம்!',
    voice_lang_switched: 'மொழி தமிழுக்கு மாற்றப்பட்டது. குரல் உதவியாளர் புதுப்பிக்கப்பட்டது.',

    // Modals
    modal_close: '✕ மூடு',
    camera_modal_title: 'கேமரா பயிர் ஸ்கேனர்',
    camera_btn_identify: '📷 பயிரை அடையாளம் காண்க',
    camera_btn_manual: '🌾 கைமுறையாக தேர்ந்தெடு',
    camera_btn_confirm: '✓ உறுதிப்படுத்தி தொகுதிக்கு இணை',
    camera_btn_change: '↺ பயிரை மாற்று',
    qr_modal_title: 'QR கண்காணிப்பு ஸ்கேனர்',
    qr_modal_desc: 'Ethereum பிளாக்செயினில் சரிபார்க்க QR குறியீட்டை ஸ்கேன் செய்யவும் அல்லது லாட் எண்ணை உள்ளிடவும்',
    offers_modal_title: 'விவசாயி தொகுதி சலுகைகள்',
    hardhat_modal_title: 'ஹார்ட்ஹேட் லோக்கல் சூழல்',
    hardhat_modal_desc: '10,000 ETH மற்றும் 100,000 சோதனை புள்ளிகளுடன் முன் கட்டமைக்கப்பட்ட கணக்குகள்',
    hardhat_faucet_btn: '🎁 25,000 சோதனை புள்ளிகளைப் பெறுங்கள்',
    builder_modal_title: 'தலைமை கட்டிடக்கலைஞர் & உருவாக்குநர்',
    builder_modal_role: 'முழு-ஸ்டாக் Web3 & விநியோகிக்கப்பட்ட கணினி கட்டிடக்கலைஞர்',
    all_lang_modal_title: 'அனைத்து மொழி உலகளாவிய மொழிபெயர்ப்பாளர்',
    all_lang_modal_desc: 'அனைத்து பக்கங்கள், அட்டவணைகள், படிவங்களை உங்கள் விருப்ப மொழிக்கு மொழிபெயர்க்கவும்',
    all_lang_search: '🔍 மொழியைத் தேடுங்கள் (எ.கா: தமிழ், இந்தி, ஸ்பானிஷ், தெலுங்கு)...',
    all_lang_label: 'முழு தள மொழிபெயர்ப்பிற்கான மொழியைத் தேர்ந்தெடுக்கவும்',

    // Toasts & Alerts
    toast_lang_changed: '🌐 மொழி தமிழுக்கு மாற்றப்பட்டது',
    toast_clear_text_on: '👓 தெளிவான உரை காட்சி செயல்படுத்தப்பட்டது: அதிக வாசிப்புத்திறன் பயன்முறை.',
    toast_clear_text_off: '👓 இயல்பான காட்சி மீட்டமைக்கப்பட்டது.',
    toast_text_size_small: 'எழுத்து அளவு: சிறியது (சுருக்கமான பார்வை)',
    toast_text_size_default: 'எழுத்து அளவு: இயல்பு',
    toast_text_size_large: 'எழுத்து அளவு: பெரியது (அதிகபட்ச வாசிப்புத்திறன்)',
    toast_voice_muted: '🔇 குரல் உதவியாளர் ஒலியடக்கப்பட்டது',
    toast_voice_unmuted: '🔊 குரல் உதவியாளர் ஒலி இயக்கப்பட்டது',
    toast_wallet_connected: '✓ வாலட் வெற்றிகரமாக இணைக்கப்பட்டது',
    toast_offer_accepted: '✓ சலுகை ஏற்கப்பட்டது! பிளாக்செயின் பரிவர்த்தனை தொடங்கப்பட்டது.',
    toast_counter_sent: '✓ மாற்று சலுகை வாங்குபவருக்கு அனுப்பப்பட்டது.',

    // Error messages
    err_metamask_rejected: 'மெடாமஸ்க் பரிவர்த்தனை பயனரால் நிராகரிக்கப்பட்டது.',
    err_metamask_not_installed: 'MetaMask நிறுவப்படவில்லை. Web3 உலாவியில் AgriTrace-ஐ திறக்கவும்.',
    err_wrong_network: 'MetaMask-ஐ Sepolia அல்லது Hardhat Local நெட்வொர்க்கிற்கு மாற்றவும்.',
    err_backend_offline: 'AgriTrace பின்தள சேவையகத்தை இணைக்க முடியவில்லை.',
    err_lot_exists: 'அந்த லாட் எண் ஏற்கனவே பிளாக்செயினில் உள்ளது. தனித்துவமான லாட் எண்ணைப் பயன்படுத்தவும்.',
    err_not_operator: 'இணைக்கப்பட்ட வாலட் AgriTrace ஆபரேட்டராக அங்கீகரிக்கப்படவில்லை.',
    err_db_unavailable: 'தரவுத்தளம் தற்காலிகமாக கிடைக்கவில்லை. பிளாக்செயின் நேரலை தரவு பயன்படுத்தப்படுகிறது.',
    err_contract_not_configured: 'AgriTrace ஸ்மார்ட் ஒப்பந்த முகவரி கட்டமைக்கப்படவில்லை.',
    err_insufficient_funds: 'இணைக்கப்பட்ட வாலட்டில் போதிய டெஸ்ட் ETH இல்லை.',
    no_records_found: 'பொருந்தும் விளைபொருள் பதிவுகள் எதுவும் கிடைக்கவில்லை.',
    view_trace: 'விவரம் காண்க',
    demo_tag: 'டெமோ',
    on_chain_immutable_anchor: 'பிளாக்செயின் மாற்ற முடியாத பதிவு',
    verified_on_chain: 'பிளாக்செயினில் சரிபார்க்கப்பட்டது',
    status_anchored: 'பதிவு செய்யப்பட்டது',
    off_chain_only: 'ஆஃப்-செயின் மட்டும்',
    lot_key: 'லாட் விசை (KECCAK-256)',
    creator_wallet: 'உருவாக்கிய வாலட்',
    metadata_hash: 'மெட்டாடேட்டா கைரேகை (HASH)',
    tx_hash_label: 'பரிவர்த்தனை ஹேஷ்',
    off_chain_metadata: 'ஆஃப்-செயின் POSTGRESQL மெட்டாடேட்டா',
    rich_farm_data: 'முழு பண்ணை விவரங்கள்',
    storage_temp: 'சேமிப்பு வெப்பநிலை',
    storage_humidity: 'சேமிப்பு ஈரப்பதம்',
    record_price: 'விலையை பதிவு செய்',
    record_sensor: 'சென்சார் பதிவு செய்',
    lifecycle_timeline: 'பண்ணை முதல் சந்தை வரை வாழ்க்கை சுழற்சி காலவரிசை',
    step_harvested: 'அறுவடை செய்யப்பட்டது',
    step_registered: 'பதிவு செய்யப்பட்டது',
    step_anchored: 'பிளாக்செயினில் பதிவு',
    step_price: 'விலை நிர்ணயம்',
    step_sensor: 'குளிர்-சங்கிலி கண்காணிக்கப்பட்டது',
    step_verified: 'சரிபார்க்கப்பட்டது',
    records_refreshed: 'பதிவுகள் வெற்றிகரமாக புதுப்பிக்கப்பட்டன.',
    loading_trace_data: '{lotId} க்கான கண்காணிப்பு தரவு ஏற்றப்படுகிறது…',
    no_tx_hash_yet: 'இதுவரை பிளாக்செயின் பரிவர்த்தனை ஹேஷ் எதுவும் பதிவு செய்யப்படவில்லை.',

    // Footer
    footer_rights: '© 2026 AgriTrace. குரு பிரசாந்த் அவர்களால் உருவாக்கப்பட்டது. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    footer_about: 'AgriTrace என்பது பண்ணை முதல் நுகர்வோர் வரை முழு வெளிப்படைத்தன்மைக்காக உருவாக்கப்பட்ட பரவலாக்கப்பட்ட விவசாய உண்மைத்தன்மை நெட்வொர்க் ஆகும்.',
    footer_col_nav: 'வழிகாட்டல்',
    footer_col_platform: 'தொழில்நுட்ப கட்டமைப்பு',
    footer_col_social: 'உருவாக்குநர் விவரம்',
  },

  hi: {
    // Top Bar & Brand
    brand_sub: 'स्मार्ट कृषि नेटवर्क',
    builder_badge: '👨‍💻 निर्माता: गुरु प्रशांत',
    lead_architect_badge: '★ मुख्य वास्तुकार एवं निर्माता: गुरु प्रशांत',
    network_hardhat: 'हार्डहैट लोकल',
    network_sepolia: 'सेपोलिया टेस्टनेट',
    wallet_connect: 'वॉलेट कनेक्ट करें ᝰ.ᐟ',
    wallet_connected: 'कनेक्टेड',
    clear_text_btn: 'स्पष्ट टेक्स्ट',
    clear_text_on: 'स्पष्ट टेक्स्ट: चालू',
    translate_btn: 'अनुवाद करें',
    points_badge: '100,000 अंक',
    scan_produce_title: 'AI कैमरे से फसल स्कैन करें',
    scan_qr_title: 'QR ट्रेसेबिलिटी कोड स्कैन करें',
    voice_assistant_title: 'AgriTrace वॉयस असिस्टेंट',
    voice_assistant_ai: 'वॉयस AI',
    alerts_title: 'स्मार्ट अलर्ट',

    // Navigation Links
    nav_home: 'होम',
    nav_dashboard: 'डैशबोर्ड',
    nav_traceability: 'ट्रेसेबिलिटी',
    nav_price: 'मूल्य खोज',
    nav_iot: 'IoT',
    nav_farmer: 'किसान',
    nav_seller: 'विक्रेता',
    nav_consumer: 'सत्यापित करें',

    // Mobile Menu
    m_nav_home: '🏠 होम',
    m_nav_dashboard: '📊 डैशबोर्ड',
    m_nav_traceability: '⛓ ट्रेसेबिलिटी',
    m_nav_price: '💰 मूल्य खोज',
    m_nav_iot: '📡 IoT निगरानी',
    m_nav_farmer: '👨‍🌾 किसान',
    m_nav_seller: '🛒 विक्रेता',
    m_nav_consumer: '✓ सत्यापित करें',
    m_clear_text: '👓 क्लियर टेक्स्ट व्यू (उच्च पठनीयता)',
    m_all_lang: '🌐 पृष्ठ अनुवाद करें — 100+ भाषाएं',
    m_hardhat: '⭐ हार्डहैट खाता (100K अंक)',
    m_builder: '👨‍💻 वेब निर्माता: गुरु प्रशांत',
    m_camera: '📷 AI फसल स्कैनर',
    m_qr: '🔲 QR ट्रेसेबिलिटी स्कैनर',
    m_voice: '🗣️ वॉयस असिस्टेंट',
    status_online: 'ऑनलाइन',
    status_offline: 'ऑफ़लाइन',

    // Hero Section
    hero_live_status: 'लाइव कृषि बुद्धिमत्ता',
    hero_network_chain: 'हार्डहैट लोकल • चेन 31337',
    hero_h1_from: 'खेत',
    hero_h1_farm: 'से',
    hero_h1_to: 'बाजार',
    hero_h1_market: 'तक',
    hero_h1_with: 'पूर्ण',
    hero_h1_complete: 'पारदर्शिता',
    hero_h1_transparency: 'के साथ',
    hero_desc: 'IoT + ब्लॉकचेन + पारदर्शी मूल्य निर्धारण के माध्यम से किसानों, रसद, बाजारों और उपभोक्ताओं को जोड़ने वाला अगली पीढ़ी का कृषि ट्रेसेबिलिटी नेटवर्क।',
    hero_btn_explore: 'ट्रेसेबिलिटी देखें',
    hero_btn_dashboard: 'लाइव नेटवर्क देखें',
    tech_iot: 'IoT कोल्ड-चेन टेलीमेट्री',
    tech_iot_desc: 'वास्तविक समय में तापमान और आर्द्रता की निरंतर निगरानी',
    tech_contract: 'Ethereum स्मार्ट अनुबंध',
    tech_contract_desc: 'ऑन-चेन सत्यापित अपरिवर्तनीय प्रमाणिकता',
    tech_price: 'वास्तविक समय मूल्य सूचकांक',
    tech_price_desc: 'खेत से खुदरा तक पारदर्शी मार्जिन ट्रैकिंग',
    tech_qr: 'क्रिप्टोग्राफिक QR सत्यापन',
    tech_qr_desc: 'उपभोक्ताओं द्वारा प्रत्येक लॉट का त्वरित सत्यापन',

    // Dashboard Section
    dash_system_overview: 'सिस्टम अवलोकन',
    dash_heading: 'AGRITRACE कमांड सेंटर',
    dash_subheading: 'लाइव टेलीमेट्री, आपूर्ति श्रृंखला की प्रामाणिकता और ऑन-चेन उचित मूल्य मेट्रिक्स।',
    dash_vol_label: 'कुल उत्पाद मात्रा',
    dash_batches_label: 'सक्रिय लॉट',
    dash_coldchain_label: 'कोल्ड-चेन अनुपालन',
    dash_fairprice_label: 'उचित मूल्य सूचकांक',
    dash_data_flow: 'डेटा प्रवाह',
    dash_flow_heading: 'खेत → रसद → बाजार → उपभोक्ता',
    dash_flow_desc: 'प्रत्येक चरण पर दर्ज की गई जानकारी ब्लॉकचेन पर सत्यापित होती है।',
    flow_harvest: 'खेत कटाई',
    flow_harvest_desc: 'स्थान, ग्रेड और किसान की मांग कीमत के साथ पंजीकृत',
    flow_logistics: 'कोल्ड चेन लॉजिस्टिक्स',
    flow_logistics_desc: 'IoT तापमान और आर्द्रता की निरंतर निगरानी करता है',
    flow_market: 'थोक मंडी',
    flow_market_desc: 'पारदर्शी बहुपक्षीय प्रस्ताव और त्वरित निपटान',
    flow_consumer: 'उपभोक्ता सत्यापन',
    flow_consumer_desc: 'QR कोड द्वारा त्वरित प्रमाणिकता सत्यापन',

    // Traceability Section
    trace_label: 'ब्लॉकचेन ट्रेसेबिलिटी',
    trace_h2_register: 'उपज पंजीकृत करें',
    trace_h3_new: 'नया उपज रिकॉर्ड',
    trace_desc: 'सत्यापित उपज रिकॉर्ड सीधे Ethereum ब्लॉकचेन और PostgreSQL कैश पर दर्ज करें।',
    label_lot_id: 'लॉट आईडी',
    label_crop_name: 'फसल का नाम',
    label_origin: 'खेत / उत्पत्ति स्थान',
    label_harvest_date: 'कटाई की तारीख',
    label_quality_grade: 'गुणवत्ता ग्रेड',
    label_temp: 'भंडारण तापमान °C',
    label_humidity: 'भंडारण आर्द्रता %',
    label_farmer_price: 'किसान मूल्य ₹',
    label_consumer_price: 'उपभोक्ता मूल्य ₹',
    placeholder_lot_id: 'उदा: LOT011',
    placeholder_crop_name: 'उदा: TOMATO',
    placeholder_origin: 'खेत का स्थान उदा: सेलम, तमिलनाडु',
    placeholder_search_records: '🔍 लॉट, फसल, स्थान फ़िल्टर करें...',
    btn_create_verify: 'बनाएं और सत्यापित करें →',
    btn_refresh: '↻ रीफ्रेश',
    th_lot_id: 'लॉट आईडी',
    th_crop: 'फसल',
    th_origin: 'उत्पत्ति स्थान',
    th_harvest: 'कटाई',
    th_price: 'मूल्य',
    th_status: 'स्थिति',
    th_authenticity: 'प्रामाणिकता',
    th_actions: 'कार्रवाई',
    status_verified: 'सत्यापित',
    status_pending: 'लंबित',
    status_active: 'सक्रिय',
    status_sold: 'बिका हुआ',
    status_negotiating: 'बातचीत जारी',
    filter_all: 'सभी',
    filter_grade_aplus: '⭐ ग्रेड A+',
    filter_verified_only: '✓ केवल सत्यापित',
    records_empty: 'कोई मेल खाने वाला उपज रिकॉर्ड नहीं मिला।',

    // Price Discovery Section
    price_label: 'पारदर्शी मूल्य खोज',
    price_heading: 'मूल्य श्रृंखला को ट्रैक करें',
    price_desc: 'खेत से खुदरा तक कीमतों पर नजर रखकर बिचौलियों के अनुचित मुनाफे को समाप्त करना।',
    price_h3_record: 'मंडी कीमतें दर्ज करें',
    price_h3_dist: 'मूल्य वितरण',
    label_farmer_share: 'किसान ₹',
    label_trader_share: 'व्यापारी ₹',
    label_market_share: 'मंडी ₹',
    label_consumer_share: 'उपभोक्ता ₹',
    btn_record_blockchain: 'ब्लॉकचेन पर दर्ज करें →',
    price_card_farmer: 'किसान का खेत मूल्य',
    price_card_wholesale: 'थोक मंडी मूल्य',
    price_card_retail: 'खुदरा उपभोक्ता मूल्य',
    price_card_farmer_retention: 'किसान का लाभांश हिस्सा',
    price_expl_1: 'थोक लेनदेन को अपरिवर्तनीय बनाकर बिचौलियों के अत्यधिक कमीशन को रोकता है।',
    price_expl_2: 'लाइव बाजार मांग के आधार पर किसानों को उचित पारिश्रमिक सुनिश्चित करता है।',

    // IoT Sensor Section
    iot_label: 'IoT कोल्ड-चेन निगरानी',
    iot_heading: 'रीयल-टाइम सेंसर बुद्धिमत्ता',
    iot_desc: 'कोल्ड चेन टेलीमेट्री डेटा सीधे लेज़र पर दर्ज किया जाता है।',
    iot_h3_record: 'सेंसर रीडिंग दर्ज करें',
    iot_h3_status: 'कोल्ड चेन स्थिति',
    label_sensor_temp: 'तापमान °C',
    label_sensor_humidity: 'आर्द्रता %',
    label_sensor_spoilage: 'खराबी का जोखिम %',
    btn_write_sensor: 'सेंसर डेटा लिखें →',
    sensor_ambient_temp: 'भंडारण तापमान',
    sensor_humidity_level: 'सापेक्ष आर्द्रता',
    sensor_spoilage_index: 'खराबी की संभावना',
    sensor_status_normal: 'इष्टतम भंडारण',
    sensor_status_warning: 'सीमा पार हुई',

    // Features Section
    feat_label: 'AGRITRACE तकनीक स्टैक',
    feat_heading: 'एक मंच। पूर्ण दृश्यता।',
    feat_card_1_title: 'ब्लॉकचेन ट्रेसेबिलिटी',
    feat_card_1_desc: 'प्रत्येक फसल लॉट को Ethereum स्मार्ट अनुबंधों पर अपरिवर्तनीय पहचान मिलती है।',
    feat_card_2_title: 'IoT कोल्ड चेन',
    feat_card_2_desc: 'सेंसर परिवहन और भंडारण के दौरान तापमान और आर्द्रता की निरंतर निगरानी करते हैं।',
    feat_card_3_title: 'मूल्य खोज',
    feat_card_3_desc: 'किसानों, वितरकों और खुदरा विक्रेताओं के बीच पारदर्शी मूल्य निर्धारण।',
    feat_card_4_title: 'QR ट्रेसेबिलिटी',
    feat_card_4_desc: 'उपभोक्ता QR कोड स्कैन करके पूरी यात्रा और खेत का विवरण देख सकते हैं।',
    feat_card_5_title: 'स्मार्ट लॉजिस्टिक्स',
    feat_card_5_desc: 'पारगमन घटनाएं स्वचालित रूप से दर्ज होती हैं और खराबी का पूर्वानुमान लगाया जाता है।',
    feat_card_6_title: 'AI गुणवत्ता बुद्धिमत्ता',
    feat_card_6_desc: 'कंप्यूटर विज़न द्वारा उपज का सटीक वर्गीकरण और गुणवत्ता ग्रेडिंग।',

    // Solutions CTA Section
    solutions_label: 'कृषि का भविष्य',
    solutions_heading: 'हर फसल। हर यात्रा। हर लेनदेन।',
    solutions_desc: 'अपनी कृषि सहकारी समिति या आपूर्ति श्रृंखला में आज ही AgriTrace लागू करें।',
    solutions_btn_primary: 'AgriTrace शुरू करें',
    solutions_btn_secondary: 'दस्तावेज़ देखें',

    // Farmer Dashboard Section
    farmer_label: 'किसान पोर्टल',
    farmer_heading: 'किसान डैशबोर्ड',
    farmer_profile_title: 'किसान प्रोफ़ाइल',
    farmer_batches_title: 'मेरे उपज लॉट',
    farmer_earnings_today: 'आज',
    farmer_earnings_week: 'इस सप्ताह',
    farmer_earnings_month: 'इस माह',
    farmer_earnings_total: 'कुल आय',
    farmer_btn_offers: 'ऑफ़र देखें',
    farmer_btn_qr: 'QR कोड',
    farmer_btn_trace: 'ट्रेस करें',
    farmer_sold_tag: '✓ बिक गया',
    farmer_offers_title: 'के लिए ऑफ़र —',
    farmer_accept_btn: '✓ स्वीकार करें',
    farmer_counter_btn: '↺ जवाबी ऑफ़र',
    farmer_decline_btn: '✕ अस्वीकार',

    // Seller Marketplace Section
    seller_label: 'लाइव मार्केटप्लेस',
    seller_heading: 'विक्रेता बाज़ार',
    seller_search_placeholder: '🔍 फसल, उत्पत्ति, ग्रेड, किसान खोजें...',
    seller_make_offer: 'प्रस्ताव दें',
    seller_view_trace: 'विवरण देखें',
    seller_available: 'उपलब्ध',
    seller_harvested: 'कटाई की गई',
    seller_asking: 'मांग मूल्य',

    // Consumer Section
    consumer_label: 'उपभोक्ता ट्रेसेबिलिटी',
    consumer_heading: 'अपनी उपज सत्यापित करें',
    consumer_h3_lookup: 'स्कैन या खोज',
    consumer_h3_details: 'आप क्या देखेंगे',
    consumer_input_label: 'सत्यापन के लिए लॉट आईडी दर्ज करें',
    consumer_input_placeholder: 'लॉट आईडी दर्ज करें (उदा: DEMO-AGR-0001)',
    consumer_btn_lookup: '🔍 खोजें',
    consumer_quick_demo: 'या डेमो लॉट पर क्लिक करें:',
    consumer_journey_harvest: 'खेत पर कटाई की गई',
    consumer_journey_registered: 'AgriTrace पर पंजीकृत',
    consumer_journey_blockchain: 'ब्लॉकचेन सत्यापित',
    consumer_journey_coldchain: 'कोल्ड चेन की निगरानी की गई',
    consumer_journey_delivered: 'बाजार में पहुंचाया गया',

    // Clear Text View & Accessibility Toolbar
    toolbar_clear_text: 'स्पष्ट टेक्स्ट',
    toolbar_clear_text_on: 'स्पष्ट टेक्स्ट: चालू',
    toolbar_text_size: 'टेक्स्ट साइज़',
    toolbar_text_small: 'छोटा',
    toolbar_text_default: 'डिफ़ॉल्ट',
    toolbar_text_large: 'बड़ा',
    toolbar_translate: 'अनुवाद',
    toolbar_hardhat: '100K अंक',
    toolbar_builder: 'गुरु प्रशांत',

    // Voice Assistant UI
    voice_panel_title: 'AgriTrace वॉयस असिस्टेंट',
    voice_panel_sub: 'फसल, कीमतों और नेविगेशन के बारे में कुछ भी पूछें',
    voice_volume_label: 'आवाज़ की मात्रा',
    voice_state_idle: 'सुनने के लिए तैयार',
    voice_state_listening: '🎤 सुन रहा है… अब बोलें',
    voice_state_processing: '⚙️ कमांड प्रोसेस कर रहा है…',
    voice_state_speaking: '🔊 उत्तर दे रहा है…',
    voice_state_error: '⚠️ कमांड समझ नहीं आया',
    voice_btn_start: 'सुनना शुरू करें',
    voice_btn_stop: 'सुनना बंद करें',
    voice_btn_stop_speaking: 'बोलना बंद करें',
    voice_btn_mute: 'म्यूट करें',
    voice_btn_unmute: 'अनम्यूट करें',
    voice_input_placeholder: 'कमांड टाइप करें (उदा: टमाटर की कीमत, डैशबोर्ड खोलो)...',
    voice_btn_send: 'भेजें',
    voice_greeting: 'AgriTrace में आपका स्वागत है! मैं उपज ट्रेसेबिलिटी, कीमतों और नेविगेशन में मदद कर सकता हूं। पूछें: "टमाटर की कीमत क्या है?"',
    voice_help_response: 'मैं आपको AgriTrace नेविगेट करने, फसल की कीमतें जानने और अलर्ट देखने में मदद कर सकता हूं। कहें: "किसान डैशबोर्ड खोलो", "उपलब्ध उत्पाद दिखाएं", "टमाटर खोजें", "भाषा बदलकर तमिल करें", या "टेक्स्ट साइज़ बढ़ाओ"।',
    voice_confirm_action: 'कृपया पुष्टि करें: क्या आप इस संवेदनशील कार्रवाई के साथ आगे बढ़ना चाहते हैं?',
    voice_unauthorized_farmer: 'पहुंच अस्वीकृत: इस कार्रवाई को निष्पादित करने के लिए आपको अधिकृत किसान होना चाहिए।',
    voice_speech_unsupported: 'ब्राउज़र में वॉयस पहचान समर्थित नहीं है या अनुमति अस्वीकार कर दी गई थी। आप नीचे दिए गए इनपुट बॉक्स का उपयोग कर सकते हैं!',
    voice_lang_switched: 'भाषा बदलकर हिंदी कर दी गई। वॉयस असिस्टेंट अपडेट हो गया।',

    // Modals
    modal_close: '✕ बंद करें',
    camera_modal_title: 'कैमरा फसल स्कैनर',
    camera_btn_identify: '📷 फसल पहचानें',
    camera_btn_manual: '🌾 मैन्युअल चुनें',
    camera_btn_confirm: '✓ पुष्टि करें और लॉट से लिंक करें',
    camera_btn_change: '↺ फसल बदलें',
    qr_modal_title: 'QR ट्रेसेबिलिटी स्कैनर',
    qr_modal_desc: 'Ethereum ब्लॉकचेन पर सत्यापन के लिए QR कोड स्कैन करें या लॉट आईडी दर्ज करें',
    offers_modal_title: 'किसान लॉट प्रस्ताव',
    hardhat_modal_title: 'हार्डहैट लोकल वातावरण',
    hardhat_modal_desc: '10,000 ETH और 100,000 टेस्ट अंकों के साथ पूर्व-कॉन्फ़िगर खाते',
    hardhat_faucet_btn: '🎁 25,000 टेस्ट अंक प्राप्त करें',
    builder_modal_title: 'मुख्य वास्तुकार एवं निर्माता',
    builder_modal_role: 'फुल-स्टैक Web3 एवं वितरित सिस्टम वास्तुकार',
    all_lang_modal_title: 'सभी भाषाओं का सार्वभौमिक अनुवादक',
    all_lang_modal_desc: 'सभी पृष्ठों, तालिकाओं और फॉर्मों को अपनी पसंदीदा भाषा में अनुवादित करें',
    all_lang_search: '🔍 भाषा खोजें (उदा: तमिल, हिंदी, स्पेनिश, तेलुगु)...',
    all_lang_label: 'पूर्ण प्लेटफॉर्म अनुवाद के लिए भाषा चुनें',

    // Toasts & Alerts
    toast_lang_changed: '🌐 भाषा बदलकर हिंदी कर दी गई',
    toast_clear_text_on: '👓 क्लियर टेक्स्ट व्यू सक्रिय: सभी पृष्ठों के लिए उच्च पठनीयता मोड।',
    toast_clear_text_off: '👓 मानक दृश्य बहाल किया गया।',
    toast_text_size_small: 'टेक्स्ट साइज़: छोटा (संक्षिप्त दृश्य)',
    toast_text_size_default: 'टेक्स्ट साइज़: डिफ़ॉल्ट',
    toast_text_size_large: 'टेक्स्ट साइज़: बड़ा (अधिकतम पठनीयता)',
    toast_voice_muted: '🔇 वॉयस असिस्टेंट म्यूट किया गया',
    toast_voice_unmuted: '🔊 वॉयस असिस्टेंट अनम्यूट किया गया',
    toast_wallet_connected: '✓ वॉलेट सफलतापूर्वक कनेक्ट हुआ',
    toast_offer_accepted: '✓ प्रस्ताव स्वीकार किया गया! ब्लॉकचेन लेनदेन शुरू हुआ।',
    toast_counter_sent: '✓ खरीदार को जवाबी प्रस्ताव भेजा गया।',

    // Error messages
    err_metamask_rejected: 'उपयोगकर्ता द्वारा मेटामास्क लेनदेन अस्वीकार कर दिया गया।',
    err_metamask_not_installed: 'MetaMask इंस्टॉल नहीं है। कृपया AgriTrace को Web3 ब्राउज़र में खोलें।',
    err_wrong_network: 'कृपया MetaMask को Sepolia या Hardhat Local नेटवर्क पर स्विच करें।',
    err_backend_offline: 'AgriTrace बैकएंड से कनेक्ट नहीं हो सका। ऑन-चेन डेटा सक्रिय है।',
    err_lot_exists: 'वह लॉट आईडी ब्लॉकचेन पर पहले से मौजूद है। कृपया एक अनूठी लॉट आईडी का उपयोग करें।',
    err_not_operator: 'कनेक्टेड वॉलेट AgriTrace ऑपरेटर के रूप में अधिकृत नहीं है।',
    err_db_unavailable: 'डेटाबेस अस्थायी रूप से अनुपलब्ध है। सत्यापित ब्लॉकचेन डेटा का उपयोग हो रहा है।',
    err_contract_not_configured: 'AgriTrace स्मार्ट अनुबंध पता कॉन्फ़िगर नहीं किया गया है।',
    err_insufficient_funds: 'कनेक्टेड वॉलेट में पर्याप्त टेस्ट ETH नहीं है।',
    no_records_found: 'कोई मेल खाते उत्पाद रिकॉर्ड नहीं मिले।',
    view_trace: 'विवरण देखें',
    demo_tag: 'डेमो',
    on_chain_immutable_anchor: 'ऑन-चेन अपरिवर्तनीय एंकर',
    verified_on_chain: 'ऑन-चेन सत्यापित',
    status_anchored: 'एंकर किया गया',
    off_chain_only: 'केवल ऑफ-चेन',
    lot_key: 'लॉट कुंजी (KECCAK-256)',
    creator_wallet: 'निर्माता वॉलेट',
    metadata_hash: 'मेटाडेटा फ़िंगरप्रिंट (HASH)',
    tx_hash_label: 'लेनदेन हैश',
    off_chain_metadata: 'ऑफ-चेन POSTGRESQL मेटाडेटा',
    rich_farm_data: 'समृद्ध खेत डेटा',
    storage_temp: 'भंडारण तापमान',
    storage_humidity: 'भंडारण आर्द्रता',
    record_price: 'मूल्य दर्ज करें',
    record_sensor: 'सेंसर दर्ज करें',
    lifecycle_timeline: 'खेत से बाजार तक जीवन चक्र समयरेखा',
    step_harvested: 'काटा गया',
    step_registered: 'पंजीकृत',
    step_anchored: 'ब्लॉकचेन एंकर किया गया',
    step_price: 'मूल्य खोज',
    step_sensor: 'कोल्ड-चेन मॉनिटर किया गया',
    step_verified: 'सत्यापित',
    records_refreshed: 'रिकॉर्ड सफलतापूर्वक रीफ्रेश किए गए।',
    loading_trace_data: '{lotId} के लिए ट्रेसेबिलिटी डेटा लोड हो रहा है…',
    no_tx_hash_yet: 'अभी तक कोई ब्लॉकचेन लेनदेन हैश दर्ज नहीं किया गया है।',

    // Footer
    footer_rights: '© 2026 AgriTrace. गुरु प्रशांत द्वारा निर्मित। सर्वाधिकार सुरक्षित।',
    footer_about: 'AgriTrace खेत से उपभोक्ता तक पूर्ण पारदर्शिता के लिए निर्मित एक विकेंद्रीकृत कृषि ट्रेसेबिलिटी नेटवर्क है।',
    footer_col_nav: 'नेविगेशन',
    footer_col_platform: 'तकनीकी स्टैक',
    footer_col_social: 'निर्माता प्रोफ़ाइल',
  }
};

function getStoredLanguage() {
  try {
    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
      return localStorage.getItem(I18N_STORAGE_KEY) || 'en';
    }
  } catch (e) {}
  return 'en';
}

function setStoredLanguage(lang) {
  try {
    if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
      localStorage.setItem(I18N_STORAGE_KEY, lang);
    }
  } catch (e) {}
}

let currentLanguage = getStoredLanguage();
if (!TRANSLATIONS[currentLanguage]) currentLanguage = 'en';

/**
 * Get translation string by key with fallback and parameter interpolation
 * Example: t('toast_farmer_offer_accepted', { price: 80, lotId: 'LOT-1' })
 */
function t(key, params = {}) {
  const langDict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  let text = langDict[key] !== undefined ? langDict[key] : (TRANSLATIONS.en[key] !== undefined ? TRANSLATIONS.en[key] : key);
  
  if (typeof text === 'string' && Object.keys(params).length > 0) {
    Object.entries(params).forEach(([paramKey, val]) => {
      text = text.replace(new RegExp(`{${paramKey}}`, 'g'), String(val));
    });
  }
  return text;
}

/**
 * Apply translation across the entire DOM without reloading
 */
function applyTranslations(lang = currentLanguage) {
  if (TRANSLATIONS[lang]) {
    currentLanguage = lang;
    setStoredLanguage(lang);
  } else {
    lang = currentLanguage;
  }

  if (typeof document === 'undefined') return;

  document.documentElement.lang = lang;
  const isDevanagariOrTamil = lang === 'ta' || lang === 'hi';
  if (document.body) {
    document.body.classList.toggle('lang-indic', isDevanagariOrTamil);
  }

  // 1. data-i18n elements (textContent or innerHTML)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (val && val !== key) {
      if (el.getAttribute('data-i18n-html') === 'true') {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    }
  });

  // 2. data-i18n-placeholder (input, textarea)
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = t(key);
    if (val && val !== key) {
      el.setAttribute('placeholder', val);
    }
  });

  // 3. data-i18n-title (buttons, pills, tooltips)
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const val = t(key);
    if (val && val !== key) {
      el.setAttribute('title', val);
      el.setAttribute('aria-label', val);
    }
  });

  // 4. Update language switcher UI elements
  updateLanguageSwitcherUI(lang);

  // 5. Fire global event so dynamic dashboards re-render immediately in selected language
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('agritrace:languageChanged', { detail: { language: lang } }));
  }
}

/**
 * Update active state on language switchers
 */
function updateLanguageSwitcherUI(lang) {
  if (typeof document === 'undefined') return;
  const switcher = document.getElementById('langSwitcher');
  if (switcher) {
    switcher.innerHTML = SUPPORTED_LANGUAGES.map(l => `
      <button type="button" class="lang-opt ${l.code === lang ? 'active' : ''}" data-lang="${l.code}" title="${l.name}">
        <span>${l.flag}</span>
        <strong>${l.native}</strong>
      </button>
    `).join('');

    switcher.querySelectorAll('.lang-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        setLanguage(btn.dataset.lang);
      });
    });
  }

  // Update modal language items if open
  document.querySelectorAll('.all-lang-item').forEach(item => {
    item.classList.toggle('active', item.dataset.code === lang);
  });
}

/**
 * Switch language and notify
 */
function setLanguage(lang) {
  const norm = lang === 'zh-CN' ? 'zh' : lang;
  if (!TRANSLATIONS[norm]) {
    // If language is not one of our core dictionaries, default gracefully
    currentLanguage = 'en';
  } else {
    currentLanguage = norm;
  }

  applyTranslations(currentLanguage);

  if (typeof showToast === 'function') {
    showToast(t('toast_lang_changed'), 'success');
  }

  // Sync with Voice Assistant voice engine
  if (typeof updateVoiceAssistantLanguage === 'function') {
    updateVoiceAssistantLanguage(currentLanguage);
  }
}

/**
 * Missing translation audit test
 * Inspects all keys in English and checks completeness in Tamil and Hindi
 */
function auditTranslations() {
  const enKeys = Object.keys(TRANSLATIONS.en);
  const taKeys = Object.keys(TRANSLATIONS.ta);
  const hiKeys = Object.keys(TRANSLATIONS.hi);

  const missingInTamil = enKeys.filter(k => !TRANSLATIONS.ta[k]);
  const missingInHindi = enKeys.filter(k => !TRANSLATIONS.hi[k]);

  const report = {
    totalEnKeys: enKeys.length,
    totalTaKeys: taKeys.length,
    totalHiKeys: hiKeys.length,
    missingInTamil,
    missingInHindi,
    isComplete: missingInTamil.length === 0 && missingInHindi.length === 0
  };

  console.log('--- AGRITRACE TRANSLATION AUDIT ---');
  console.log(`Total Keys: EN=${report.totalEnKeys}, TA=${report.totalTaKeys}, HI=${report.totalHiKeys}`);
  console.log(`Tamil Missing (${missingInTamil.length}):`, missingInTamil);
  console.log(`Hindi Missing (${missingInHindi.length}):`, missingInHindi);
  console.log(`Complete: ${report.isComplete ? '✓ 100% COMPLETE' : '✗ INCOMPLETE'}`);
  return report;
}

// Export to global scope / CommonJS
if (typeof window !== 'undefined') {
  window.TRANSLATIONS = TRANSLATIONS;
  window.t = t;
  window.setLanguage = setLanguage;
  window.applyTranslations = applyTranslations;
  window.auditTranslations = auditTranslations;
  window.SUPPORTED_LANGUAGES = SUPPORTED_LANGUAGES;
  window.getCurrentLanguage = () => currentLanguage;

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      applyTranslations(currentLanguage);
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TRANSLATIONS,
    SUPPORTED_LANGUAGES,
    t,
    setLanguage,
    applyTranslations,
    auditTranslations,
    getCurrentLanguage: () => currentLanguage
  };
}
