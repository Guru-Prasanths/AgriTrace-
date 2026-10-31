/**
 * AgriTrace Kaggle Datasets Hub
 * Curated Directory of 105+ Open Agricultural Datasets from Kaggle
 * Engineered for Rural-Friendly Access, Transparency, and Research
 * Author: GURU PRASANTH
 */

const KAGGLE_DATASETS = [
  // =========================================================================
  // CATEGORY 1: AGRICULTURAL PRICES (1 - 28)
  // =========================================================================
  {
    id: 1,
    title: "Agricultural Commodity Prices",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "💹",
    desc: "Historical price data for key agricultural commodities. Useful for tracking market trends, seasonal fluctuations, and price analysis across crop categories.",
    meta: ["📅 Historical", "📈 Price Trends", "🌾 Commodities"],
    url: "https://www.kaggle.com/code/arvindkhoda/price-of-agricultural-commodities-data/input"
  },
  {
    id: 2,
    title: "Daily Market Prices of Commodities in India",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "📉",
    desc: "Day-wise commodity price records across Indian markets. Covers a wide range of agricultural produce and enables time-series analysis at state and national levels.",
    meta: ["🇮🇳 India Markets", "📅 Daily Records", "📊 Time Series"],
    url: "https://www.kaggle.com/code/khandelwalmanas/daily-prices-of-commodity-india-starter-notebook/input"
  },
  {
    id: 3,
    title: "Andhra Pradesh Agricultural Market Data",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "🏛️",
    desc: "Mandi price arrivals, minimum, maximum, and modal prices across agricultural market committees (AMCs) throughout Andhra Pradesh.",
    meta: ["🏛️ Mandi Arrivals", "💰 Modal Prices", "📍 Andhra Pradesh"],
    url: "https://www.kaggle.com/datasets/srinivas1/agricultural-market-data-of-andhra-pradesh"
  },
  {
    id: 4,
    title: "Vegetable Market Prices Time Series",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "🥦",
    desc: "Comprehensive daily retail and wholesale price tracking for common household vegetables including onions, potatoes, tomatoes, and cabbage.",
    meta: ["🥬 Daily Retail", "🏪 Wholesale", "📈 Elasticity"],
    url: "https://www.kaggle.com/datasets/robikscube/vegetable-market-prices"
  },
  {
    id: 5,
    title: "Commodity Price Data India",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "🏷️",
    desc: "Multi-year commodity price indices across grains, pulses, commercial crops, and spices recorded by national agricultural intelligence agencies.",
    meta: ["📊 Multi-Year", "🌾 Grains & Pulses", "🇮🇳 National"],
    url: "https://www.kaggle.com/datasets/hkrattanpal/commodity-price-data"
  },
  {
    id: 6,
    title: "Global Food Prices Database (WFP)",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "🌍",
    desc: "World Food Programme official dataset of staple food prices covering hundreds of markets across 90+ developing nations.",
    meta: ["🌐 WFP / UN", "🍚 Staple Foods", "🌎 90+ Nations"],
    url: "https://www.kaggle.com/datasets/jboysen/global-food-prices"
  },
  {
    id: 7,
    title: "UN FAOSTAT Commodity Price Statistics",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "📊",
    desc: "United Nations FAO international agricultural producer price indices, food trade values, and macro-economic commodity deflators.",
    meta: ["🇺🇳 UN FAOSTAT", "📈 Producer Price", "🌐 Global Indices"],
    url: "https://www.kaggle.com/datasets/unitednations/global-food-agriculture-statistics"
  },
  {
    id: 8,
    title: "Onion Price Prediction & Market Fluctuations",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "🧅",
    desc: "Dedicated time series of onion wholesale prices in Lasalgaon and Azadpur mandis with weather correlation and arrival volumes.",
    meta: ["🧅 Onion Mandis", "⚡ Volatility", "📉 Forecasting"],
    url: "https://www.kaggle.com/datasets/saswat12398/onion-price-prediction-data"
  },
  {
    id: 9,
    title: "Tomato Price Trends in Indian Mandis",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "🍅",
    desc: "Daily arrivals and modal prices for hybrid and desi tomatoes across southern and western Indian agricultural markets.",
    meta: ["🍅 Tomato Mandis", "📅 Daily Arrivals", "🔍 Seasonal Peaks"],
    url: "https://www.kaggle.com/datasets/ramkijangid/tomato-price-prediction"
  },
  {
    id: 10,
    title: "Rice Price Prediction Time Series",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "🍚",
    desc: "Export and domestic wholesale price history for Basmati and non-Basmati rice varieties across major rice-producing hubs.",
    meta: ["🍚 Basmati & Paddy", "🚢 Export Quotes", "📈 Econometrics"],
    url: "https://www.kaggle.com/datasets/imtkaggleteam/rice-price-prediction"
  },
  {
    id: 11,
    title: "Wheat Wholesale & Retail Price Dataset",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "🌾",
    desc: "Wheat procurement prices, minimum support prices (MSP), and open market spot prices across Punjab, Haryana, and Madhya Pradesh.",
    meta: ["🌾 Wheat MSP", "🏛️ FCI Procure", "💵 Spot Market"],
    url: "https://www.kaggle.com/datasets/chakradharmattapalli/wheat-price-prediction"
  },
  {
    id: 12,
    title: "Global Retail Sugar Prices",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "🍬",
    desc: "Cross-border retail sugar price records with sugarcane mill gate prices, crushing volumes, and ethanol parity metrics.",
    meta: ["🌱 Cane Parity", "🏪 Retail Sugar", "🌎 Cross-Country"],
    url: "https://www.kaggle.com/datasets/felipemuller5/retail-sugar-prices"
  },
  {
    id: 13,
    title: "Daily Coffee Commodity Prices (ICO)",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "☕",
    desc: "International Coffee Organization composite indicator prices for Arabica and Robusta green bean coffee varieties.",
    meta: ["☕ Arabica & Robusta", "📈 ICO Benchmark", "🌐 Global Futures"],
    url: "https://www.kaggle.com/datasets/psycon/daily-coffee-price"
  },
  {
    id: 14,
    title: "Milk & Dairy Product Prices",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "🥛",
    desc: "Farmgate milk procurement rates based on fat and SNF percentages, packaged retail milk prices, and dairy cooperative indices.",
    meta: ["🥛 Farmgate Milk", "🧈 Fat & SNF", "🏢 Cooperative"],
    url: "https://www.kaggle.com/datasets/aiaiaidontknow/milk-price-dataset"
  },
  {
    id: 15,
    title: "Fish Market Species & Pricing",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "🐟",
    desc: "Biometric and price attributes for commercial fresh and saltwater fish species sold in local and wholesale aquaculture markets.",
    meta: ["🐟 Aquaculture", "⚖️ Biometrics", "🏷️ Species Pricing"],
    url: "https://www.kaggle.com/datasets/aungpyaeap/fish-market"
  },
  {
    id: 16,
    title: "Egg Price Prediction & Market Supply",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "🥚",
    desc: "National Egg Coordination Committee (NECC) wholesale and farm price records correlated with feed prices and seasonal consumption.",
    meta: ["🥚 NECC Rates", "🐥 Poultry Feed", "📅 Daily Quotations"],
    url: "https://www.kaggle.com/datasets/chakradharmattapalli/egg-price-prediction"
  },
  {
    id: 17,
    title: "Agricultural Raw Material Prices 1990-2020",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "🧶",
    desc: "Three decades of monthly price indices for cotton, wool, rubber, timber, and hides tracked by global trade organizations.",
    meta: ["⏳ 30-Year History", "🧶 Cotton & Rubber", "🌐 World Bank"],
    url: "https://www.kaggle.com/datasets/kianwee/agricultural-raw-material-prices-1990-2020"
  },
  {
    id: 18,
    title: "Grain and Oilseed Price Trends",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "🌻",
    desc: "Daily futures and spot pricing for soybean, sunflower, rapeseed, and mustard seeds across major international exchanges.",
    meta: ["🌻 Oilseeds", "📉 Futures & Spot", "🌱 Crushing Margins"],
    url: "https://www.kaggle.com/datasets/sudalairajkumar/daily-commodity-prices"
  },
  {
    id: 19,
    title: "Agricultural Input Prices: Fertilizer & Seeds",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "🧪",
    desc: "Farm expenditure records for Urea, DAP, Potash, hybrid seeds, and tractor diesel fuel across agrarian regions.",
    meta: ["🧪 Urea & DAP", "🚜 Fuel & Seeds", "💰 Input Costs"],
    url: "https://www.kaggle.com/datasets/nitindatta/india-agriculture-data"
  },
  {
    id: 20,
    title: "Potato Daily Mandi Prices & Volatility",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "🥔",
    desc: "Cold storage release volumes, arrivals, and modal price swings for potatoes in Uttar Pradesh, West Bengal, and Punjab.",
    meta: ["🥔 Potato Mandis", "❄️ Cold Storage", "📊 Price Swings"],
    url: "https://www.kaggle.com/datasets/ramkijangid/tomato-price-prediction"
  },
  {
    id: 21,
    title: "Cotton Spot & Futures Prices",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "☁️",
    desc: "Shankar-6 cotton lint prices, raw kapas arrivals, ginning margins, and textile mill consumption trends.",
    meta: ["☁️ Shankar-6 Cotton", "🏭 Ginning Mills", "🏷️ Kapas Rates"],
    url: "https://www.kaggle.com/datasets/prasertk/cotton-production-and-consumption"
  },
  {
    id: 22,
    title: "Spices Commodity Pricing: Cardamom & Pepper",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "🌶️",
    desc: "Spices Board of India auction prices for green cardamom, black pepper, turmeric, and dry ginger from Bodinayakanur and Kochi.",
    meta: ["🌿 Green Cardamom", "🌶️ Black Pepper", "🏛️ Spices Board"],
    url: "https://www.kaggle.com/datasets/srinivas1/agricultural-market-data-of-andhra-pradesh"
  },
  {
    id: 23,
    title: "Pulse and Lentil Wholesale Prices India",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "🥣",
    desc: "Tur/Arhar, Chana, Urad, and Moong dal price patterns comparing domestic mandi arrivals against buffer stock releases.",
    meta: ["🥣 Dal & Pulses", "⚖️ Buffer Stocks", "🏛️ NAFED Rates"],
    url: "https://www.kaggle.com/datasets/hkrattanpal/commodity-price-data"
  },
  {
    id: 24,
    title: "Groundnut & Edible Oil Market Discovery",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "🥜",
    desc: "Groundnut pod auction prices, expeller groundnut oil prices, and de-oiled cake (DOC) export rates in Saurashtra.",
    meta: ["🥜 Groundnut Pods", "🛢️ Edible Oil", "📈 Mill Parity"],
    url: "https://www.kaggle.com/datasets/kianwee/agricultural-raw-material-prices-1990-2020"
  },
  {
    id: 25,
    title: "Corn / Maize Daily Commodity Price Trends",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "🌽",
    desc: "Corn pricing influenced by livestock poultry feed demand, starch industrial manufacturing, and global CBOT benchmark movements.",
    meta: ["🌽 Corn & Maize", "🐔 Poultry Feed", "📈 CBOT Trends"],
    url: "https://www.kaggle.com/datasets/psycon/daily-coffee-price"
  },
  {
    id: 26,
    title: "Tea Auction Prices & Export Metrics",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "🍵",
    desc: "CTC and orthodox black tea auction real-time prices from Kolkata, Siliguri, Guwahati, and Coonoor auction centers.",
    meta: ["🍵 CTC & Orthodox", "🔨 Auction Centers", "🚢 Export Realization"],
    url: "https://www.kaggle.com/datasets/kianwee/agricultural-raw-material-prices-1990-2020"
  },
  {
    id: 27,
    title: "Organic Food Price Premium Dataset",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "🌱",
    desc: "Empirical pricing delta comparing certified organic versus conventional grains, fruits, and vegetables in supermarket chains.",
    meta: ["🌱 Organic Premium", "🏷️ Retail Margins", "🛒 Supermarket Diffs"],
    url: "https://www.kaggle.com/datasets/jboysen/global-food-prices"
  },
  {
    id: 28,
    title: "Fertilizer Price Impact on Agricultural Output",
    category: "agricultural-prices",
    categoryLabel: "Agricultural Prices",
    icon: "⚖️",
    desc: "Econometric datasets tracking government fertilizer subsidy payouts against farmgate produce price transmission.",
    meta: ["⚖️ Subsidies", "📉 Cost Transmission", "🌾 Farm Returns"],
    url: "https://www.kaggle.com/datasets/nitindatta/india-agriculture-data"
  },

  // =========================================================================
  // CATEGORY 2: CROP PRODUCTION & AGRO-ECOLOGY (29 - 56)
  // =========================================================================
  {
    id: 29,
    title: "Crop Production in India (District-wise)",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "🌾",
    desc: "Comprehensive crop production statistics across Indian states and districts covering area under cultivation, volume, and yield metrics.",
    meta: ["🗺️ State-wise", "🌿 Yield Data", "📐 Area & Volume"],
    url: "https://www.kaggle.com/datasets/abhinand05/crop-production-in-india"
  },
  {
    id: 30,
    title: "Indian Agriculture 1997 to 2020",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "🇮🇳",
    desc: "Over two decades of granular crop area, production volume, and crop season breakdown for Kharif, Rabi, and Summer (Zaid) crops.",
    meta: ["📅 1997-2020", "🌱 Kharif & Rabi", "📊 Long-Term Trends"],
    url: "https://www.kaggle.com/datasets/prashant111/indian-agriculture-1997-to-2020"
  },
  {
    id: 31,
    title: "World Cereal & Grain Production Statistics",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "🌎",
    desc: "Global cereal harvest records compiled across continents covering wheat, maize, barley, sorghum, and millet output.",
    meta: ["🌐 Global Cereals", "🌾 Grain Harvest", "📈 International"],
    url: "https://www.kaggle.com/datasets/divyansh22/crop-production-statistics"
  },
  {
    id: 32,
    title: "Crop Recommendation based on Soil & Climate",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "🧪",
    desc: "Machine learning dataset mapping Soil Nitrogen (N), Phosphorus (P), Potassium (K), pH, temperature, humidity, and rainfall to ideal crops.",
    meta: ["🤖 ML Recommendation", "🧪 Soil NPK", "🌧️ Climate Matching"],
    url: "https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset"
  },
  {
    id: 33,
    title: "Crop Yield Prediction using Environmental Data",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "🌿",
    desc: "Predictive model training set combining rainfall totals, mean temperature, pesticide tonnage, and acreage to forecast harvest yields.",
    meta: ["🎯 Yield Forecasting", "🌧️ Rainfall Impact", "📐 Hectare Yield"],
    url: "https://www.kaggle.com/datasets/patelris604/crop-yield-prediction-dataset"
  },
  {
    id: 34,
    title: "Rainfall in India (1901-2015) & Crop Correlation",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "🌧️",
    desc: "115 years of meteorological subdivision monthly rainfall records from the India Meteorological Department (IMD) for drought analysis.",
    meta: ["🌧️ 115 Years IMD", "📉 Monsoon Cycle", "🗺️ Subdivisions"],
    url: "https://www.kaggle.com/datasets/rajanand/rainfall-in-india"
  },
  {
    id: 35,
    title: "Global Agricultural Land Use & Yield (FAO)",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "🚜",
    desc: "FAO statistical surveys tracking arable land area, permanent crop pastures, irrigation coverage, and synthetic fertilizer intensity.",
    meta: ["🇺🇳 UN FAO", "📐 Arable Land", "💧 Irrigation Share"],
    url: "https://www.kaggle.com/datasets/unitednations/global-food-agriculture-statistics"
  },
  {
    id: 36,
    title: "Rice Crop Yield & Nitrogen Soil Chemistry",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "🌾",
    desc: "Field-level experimental trials recording paddy panicle counts, nitrogen fertilizer dosage, water depth, and grain harvest weights.",
    meta: ["🍚 Paddy Panicles", "🧪 Nitrogen Dosing", "⚖️ Field Trials"],
    url: "https://www.kaggle.com/datasets/marshuu/crop-yield"
  },
  {
    id: 37,
    title: "Sugarcane Yield and Sugar Recovery India",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "🎋",
    desc: "State-wise cane production, sucrose sugar recovery percentages, crushing days, and molasses output across Indian cooperative sugar mills.",
    meta: ["🎋 Cane Yield", "🍬 Sucrose Recovery", "🏭 Sugar Mills"],
    url: "https://www.kaggle.com/datasets/prashant111/indian-agriculture-1997-to-2020"
  },
  {
    id: 38,
    title: "Maharashtra District Agriculture Records",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "📍",
    desc: "Agricultural productivity metrics for cotton, soybean, sugarcane, and jowar across Marathwada, Vidarbha, and Western Maharashtra.",
    meta: ["📍 Maharashtra", "🌾 Cotton & Soya", "🌧️ Dryland Farming"],
    url: "https://www.kaggle.com/datasets/abhinand05/crop-production-in-india"
  },
  {
    id: 39,
    title: "Punjab Agricultural Yield & Green Revolution",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "🚜",
    desc: "Historical yield datasets documenting intensive wheat-paddy rotation, groundwater depth changes, and canal irrigation efficiencies.",
    meta: ["🚜 Punjab Green Rev", "🌾 Wheat-Paddy", "💧 Aquifer Depth"],
    url: "https://www.kaggle.com/datasets/prashant111/indian-agriculture-1997-to-2020"
  },
  {
    id: 40,
    title: "Tamil Nadu Agro-Climatic Zone Crop Output",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "🌴",
    desc: "Cauvery delta kuruvai and samba paddy crops, groundnut cultivation in north districts, and tapioca/spices in western hill tracts.",
    meta: ["🌴 Tamil Nadu", "🌊 Delta Samba", "🥜 Groundnut & Millets"],
    url: "https://www.kaggle.com/datasets/abhinand05/crop-production-in-india"
  },
  {
    id: 41,
    title: "Karnataka Kharif & Rabi Season Production",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "⛰️",
    desc: "Ragi, maize, sunflower, and sugarcane harvest yields across northern dry zones, central plains, and coastal Malnad regions.",
    meta: ["⛰️ Karnataka", "🥣 Ragi & Maize", "☀️ Dual Season"],
    url: "https://www.kaggle.com/datasets/abhinand05/crop-production-in-india"
  },
  {
    id: 42,
    title: "Uttar Pradesh Foodgrain Production & Acreage",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "🏞️",
    desc: "Gangetic alluvium soil crop production statistics covering major shares of national wheat, sugarcane, potato, and mustard output.",
    meta: ["🏞️ Gangetic Basin", "🌾 Major Foodgrains", "📐 Highest Acreage"],
    url: "https://www.kaggle.com/datasets/prashant111/indian-agriculture-1997-to-2020"
  },
  {
    id: 43,
    title: "Fertilizer Recommendation for Indian Farms",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "🧪",
    desc: "Expert agricultural agronomy dataset classifying soil type, crop variety, moisture, and temperature to calculate optimal fertilizer blends.",
    meta: ["🧪 Blend Formulas", "🌱 Soil Types", "💡 Agronomy Advice"],
    url: "https://www.kaggle.com/datasets/gdabhishek/fertilizer-prediction"
  },
  {
    id: 44,
    title: "Precision Farming: Soil NPK Nutrients Dataset",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "🔬",
    desc: "Spectrophotometric soil sample lab readings linking micro and macro-nutrient balances with vegetative development and final biomass.",
    meta: ["🔬 Lab Analysis", "🌱 Micro Nutrients", "📈 Biomass Output"],
    url: "https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset"
  },
  {
    id: 45,
    title: "Pesticide Usage vs Crop Losses",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "🧯",
    desc: "Comparative surveys on chemical application rates versus pest-induced pre-harvest losses across pulse and oilseed agricultural zones.",
    meta: ["🧯 Pest Resistance", "🐛 Insect Losses", "📊 Field Surveys"],
    url: "https://www.kaggle.com/datasets/nitindatta/india-agriculture-data"
  },
  {
    id: 46,
    title: "Global Greenhouse Gas Emissions from Agriculture",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "💨",
    desc: "FAO atmospheric emissions data tracking methane from enteric fermentation, nitrous oxide from synthetic fertilizers, and rice paddy gases.",
    meta: ["💨 Methane & N2O", "🌱 Climate Footprint", "🌍 FAO Studies"],
    url: "https://www.kaggle.com/datasets/unitednations/global-food-agriculture-statistics"
  },
  {
    id: 47,
    title: "Organic Farming Land & Output Statistics",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "🌿",
    desc: "Certified organic cultivation acreage, conversion status, bio-fertilizer adoption, and organic export volumes from APEDA registries.",
    meta: ["🌿 APEDA Certified", "📐 Bio-Fertilizer", "🚢 Organic Exports"],
    url: "https://www.kaggle.com/datasets/divyansh22/crop-production-statistics"
  },
  {
    id: 48,
    title: "Seed Variety & Germination Rate Analysis",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "🌰",
    desc: "Laboratory seed testing certificates measuring vigor indices, purity percentages, genetic moisture limits, and field emergence success.",
    meta: ["🌰 Seed Vigor", "🌱 Germination %", "🔬 Lab Quality"],
    url: "https://www.kaggle.com/datasets/patelris604/crop-yield-prediction-dataset"
  },
  {
    id: 49,
    title: "Crop Rotation & Fallow Land Optimization",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "🔄",
    desc: "Multi-year land management trials comparing legume rotational cover crops against continuous mono-cropping soil depletion.",
    meta: ["🔄 Legume Rotation", "🌱 Soil Recovery", "📉 Fallow Land"],
    url: "https://www.kaggle.com/datasets/prashant111/indian-agriculture-1997-to-2020"
  },
  {
    id: 50,
    title: "Irrigation Source Impact: Canal vs Borewell",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "💧",
    desc: "Comparative analysis of surface canal water delivery vs deep electric borewell extraction costs, salinity risks, and crop returns.",
    meta: ["💧 Canal Delivery", "⚡ Borewell Power", "🌱 Salinity Risk"],
    url: "https://www.kaggle.com/datasets/nitindatta/india-agriculture-data"
  },
  {
    id: 51,
    title: "Biofuel Crops: Corn & Soya Biomass Output",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "🔋",
    desc: "Agricultural biomass production figures evaluating energy density, ethanol yields, and food-versus-fuel land diversion ratios.",
    meta: ["🔋 Ethanol Yields", "🌽 Corn Biomass", "🚗 Biofuel Metrics"],
    url: "https://www.kaggle.com/datasets/divyansh22/crop-production-statistics"
  },
  {
    id: 52,
    title: "Drought Severity Index & Farm Yield Vulnerability",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "☀️",
    desc: "Standardized Precipitation Evapotranspiration Index (SPEI) timeseries aligned with historical crop insurance claim payouts.",
    meta: ["☀️ SPEI Index", "🛡️ Crop Insurance", "🌾 Drought Stress"],
    url: "https://www.kaggle.com/datasets/rajanand/rainfall-in-india"
  },
  {
    id: 53,
    title: "Global Coffee & Cocoa Harvest Acreage",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "🍫",
    desc: "Equatorial shade-grown agroforestry harvest records tracking bean yields, fungal rust vulnerability, and fair-trade cooperatives.",
    meta: ["🍫 Cocoa & Coffee", "🌳 Agroforestry", "🤝 Fair Trade"],
    url: "https://www.kaggle.com/datasets/psycon/daily-coffee-price"
  },
  {
    id: 54,
    title: "Sunflower & Mustard Oilseed Cultivation",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "🌼",
    desc: "Agronomic performance of high-oil content hybrid cultivars under rainfed and irrigated settings in central and northern India.",
    meta: ["🌼 Yellow Mustard", "🌻 Sunflower Hybrids", "🛢️ Oil Recovery"],
    url: "https://www.kaggle.com/datasets/prashant111/indian-agriculture-1997-to-2020"
  },
  {
    id: 55,
    title: "Farm Mechanization & Tractor Density Dataset",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "🚜",
    desc: "State-wise counts of agricultural machinery, power tillers, combine harvesters, and custom hiring centers per cultivable hectare.",
    meta: ["🚜 Tractor Density", "⚙️ Combine Harvesters", "🔧 Custom Hiring"],
    url: "https://www.kaggle.com/datasets/nitindatta/india-agriculture-data"
  },
  {
    id: 56,
    title: "Multi-Decade Agricultural Census Metrics",
    category: "crop-production",
    categoryLabel: "Crop Production",
    icon: "📑",
    desc: "Government agricultural census data tracking operational landholding sizes, marginal farmer fragmentation, and tenancy dynamics.",
    meta: ["📑 Landholdings", "👨‍🌾 Smallholder Size", "📊 Census Data"],
    url: "https://www.kaggle.com/datasets/prashant111/indian-agriculture-1997-to-2020"
  },

  // =========================================================================
  // CATEGORY 3: FRUITS & VEGETABLES (57 - 82)
  // =========================================================================
  {
    id: 57,
    title: "Fruits-360: 90K+ Produce Computer Vision Images",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🍎",
    desc: "High-resolution rotating produce photography across 131 distinct fruit and vegetable classes, widely used for visual quality grading.",
    meta: ["🖼️ 90K+ Images", "🤖 CV / ML", "🍇 131 Classes"],
    url: "https://www.kaggle.com/datasets/moltean/fruits"
  },
  {
    id: 58,
    title: "Vegetable Image Dataset: 15 Core Produce Classes",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🥗",
    desc: "21,000 real-world vegetable images evenly distributed across 15 popular culinary varieties for supermarket automated checkout AI.",
    meta: ["🥦 15 Classes", "📸 21K Photos", "🛒 Automated Checkout"],
    url: "https://www.kaggle.com/datasets/misrakahmed/vegetable-image-dataset"
  },
  {
    id: 59,
    title: "PlantVillage Multi-Crop Disease Leaf Dataset",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🍃",
    desc: "54,306 expert-annotated leaf images covering 14 crop species and 26 severe bacterial, fungal, and viral plant diseases.",
    meta: ["🍃 54K Leaves", "🔬 38 Categories", "🦠 Plant Pathologies"],
    url: "https://www.kaggle.com/datasets/arjuntejaswi/plant-village"
  },
  {
    id: 60,
    title: "Fresh vs Rotten Produce Classification",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🥑",
    desc: "Bimodal computer vision dataset distinguishing fresh commercial produce from moldy, bruised, and overripe discard inventory.",
    meta: ["🥑 Fresh vs Rotten", "🤖 Binary Grading", "📦 Post-Harvest AI"],
    url: "https://www.kaggle.com/datasets/sriramr/fruits-fresh-and-rotten-for-classification"
  },
  {
    id: 61,
    title: "Tomato Leaf Disease Detection (10 Classes)",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🍅",
    desc: "Granular tomato crop leaf pathology dataset with labels for Early Blight, Late Blight, Septoria, Spider Mites, and Yellow Leaf Curl Virus.",
    meta: ["🍅 Tomato Blight", "🦠 Leaf Curl Virus", "🎯 10 Disease Types"],
    url: "https://www.kaggle.com/datasets/kaustubhb999/tomatoleaf"
  },
  {
    id: 62,
    title: "Fruit Recognition & Classification Benchmark",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🍌",
    desc: "Standard machine learning benchmarking suite containing various fruit specimens captured under varying natural illumination.",
    meta: ["🍌 Varied Lighting", "🤖 Deep Learning", "🏷️ Benchmark Set"],
    url: "https://www.kaggle.com/datasets/chrisfilo/fruit-recognition"
  },
  {
    id: 63,
    title: "Apple Leaves Disease & Scab Pathology",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🍏",
    desc: "High-detail foliage photos of commercial apple varieties afflicted with apple scab, cedar apple rust, and black rot for orchard scouting.",
    meta: ["🍏 Apple Scab", "🍂 Cedar Rust", "🚜 Orchard Scouting"],
    url: "https://www.kaggle.com/datasets/nirmalsankalana/apple-leaves-disease-dataset"
  },
  {
    id: 64,
    title: "Banana Ripeness & Quality Stage Dataset",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🍌",
    desc: "Chroma and RGB skin image records mapping bananas across the standard 7-stage Von Loesecke commercial ripening color scale.",
    meta: ["🍌 7 Ripening Stages", "🌈 Color Index", "🏪 Retail Grading"],
    url: "https://www.kaggle.com/datasets/l3llff/banana"
  },
  {
    id: 65,
    title: "Mango Cultivar Images & Morphological Features",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🥭",
    desc: "High-resolution photographic collection documenting Indian mango varieties: Alphonso, Kesar, Dasheri, Banganapalli, and Totapuri.",
    meta: ["🥭 Alphonso & Kesar", "📐 Fruit Morphology", "🇮🇳 Heritage Cultivars"],
    url: "https://www.kaggle.com/datasets/thedagger/mango-image-dataset"
  },
  {
    id: 66,
    title: "Grape Disease & Black Rot Detection",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🍇",
    desc: "Vineyard leaf scans identifying Grape Esca (Black Measles), Black Rot, and Isariopsis Leaf Spot to aid precision sprayers.",
    meta: ["🍇 Vineyard Scans", "🍷 Black Measles", "🚜 Spray Targeting"],
    url: "https://www.kaggle.com/datasets/rm1000/grape-disease-dataset-original"
  },
  {
    id: 67,
    title: "Citrus Fruit Detection & Defect Inspection",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🍊",
    desc: "Blemish, canker, scale insect puncture, and mechanical puncture detection dataset for automated optical citrus sorting belts.",
    meta: ["🍊 Citrus Sorting", "🔍 Canker & Scale", "⚙️ Conveyor Vision"],
    url: "https://www.kaggle.com/datasets/dataclusterlabs/citrus-fruit-detection"
  },
  {
    id: 68,
    title: "Potato Late Blight & Early Blight Dataset",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🥔",
    desc: "Foliar disease images documenting Phytophthora infestans (Late Blight) and Alternaria solani (Early Blight) in potato crops.",
    meta: ["🥔 Late Blight", "🌿 Phytophthora", "🔍 Field Diagnostic"],
    url: "https://www.kaggle.com/datasets/arjuntejaswi/plant-village"
  },
  {
    id: 69,
    title: "Vegetable Nutritional Density & Shelf Life",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🥗",
    desc: "Biochemical laboratory measurements of vitamin C, polyphenols, antioxidant capacity, and post-harvest respiration rates in greens.",
    meta: ["🥗 Vitamins & Minerals", "⏳ Shelf-Life Hours", "🔬 Biochemical Lab"],
    url: "https://www.kaggle.com/datasets/niharika41298/nutrition-details-for-most-common-foods-and-products"
  },
  {
    id: 70,
    title: "Tomato Ripeness & Freshness Object Detection",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🍅",
    desc: "Bounding box annotated YOLO dataset detecting green, turning, pink, light red, and fully red tomatoes on the vine for robotic pickers.",
    meta: ["🍅 YOLO Bounding Boxes", "🤖 Robotic Harvesting", "🎨 5 Maturity Levels"],
    url: "https://www.kaggle.com/datasets/enalis/tomato-detection"
  },
  {
    id: 71,
    title: "New Plant Diseases Dataset (87K Images)",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🌿",
    desc: "Enlarged augmentation of PlantVillage with 87,000 RGB images split into train/valid subsets across 38 class labels for edge mobile devices.",
    meta: ["📱 Mobile Edge AI", "🖼️ 87K Augmented", "🔬 38 Plant Classes"],
    url: "https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset"
  },
  {
    id: 72,
    title: "Strawberry Fruit Maturity & Disease Grading",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🍓",
    desc: "Greenhouse strawberry images categorizing fruit into immature white, turning, mature red, and botrytis cinerea grey mold infections.",
    meta: ["🍓 Botrytis Mold", "🏠 Greenhouse Crop", "🎨 Color Grading"],
    url: "https://www.kaggle.com/datasets/moltean/fruits"
  },
  {
    id: 73,
    title: "Onion Neck Rot & Bulb Quality Classification",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🧅",
    desc: "Photographic dataset of stored onion bulbs graded for neck rot, sprouting, skin integrity, and internal decay for sorting machinery.",
    meta: ["🧅 Stored Bulbs", "❄️ Sprouting Check", "🏷️ Mechanical Sorting"],
    url: "https://www.kaggle.com/datasets/misrakahmed/vegetable-image-dataset"
  },
  {
    id: 74,
    title: "Watermelon Sweetness & Brix Level Predictor",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🍉",
    desc: "Acoustic resonance and rind coloration dataset estimating internal soluble sugar content (Brix degrees) without destructive cutting.",
    meta: ["🍉 Non-Destructive", "🔬 Brix Sugar Content", "🔊 Acoustic Echo"],
    url: "https://www.kaggle.com/datasets/moltean/fruits"
  },
  {
    id: 75,
    title: "Chilli & Bell Pepper Bacterial Spot Detection",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🌶️",
    desc: "Capsicum leaf images showing Xanthomonas campestris bacterial lesions versus healthy foliage across varied growth stages.",
    meta: ["🌶️ Capsicum Foliage", "🦠 Xanthomonas", "🎯 Precision Spraying"],
    url: "https://www.kaggle.com/datasets/arjuntejaswi/plant-village"
  },
  {
    id: 76,
    title: "Cauliflower & Broccoli Freshness Grading",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🥦",
    desc: "Curd yellowness, compactness, black rot spotting, and floret wilting evaluations under ambient versus refrigerated transport conditions.",
    meta: ["🥦 Curd Compactness", "❄️ Cold Transport", "🥬 Yellowness Index"],
    url: "https://www.kaggle.com/datasets/misrakahmed/vegetable-image-dataset"
  },
  {
    id: 77,
    title: "Pomegranate Bacterial Blight Leaf Dataset",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🪴",
    desc: "Detailed leaf and fruit skin imagery documenting oily spot disease (Xanthomonas axonopodis pv. punicae) in pomegranate orchards.",
    meta: ["🪴 Oily Spot Disease", "🔬 Orchard Blight", "📸 Macrophotography"],
    url: "https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset"
  },
  {
    id: 78,
    title: "Papaya Ripeness & Fruit Fly Blemish Images",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🥭",
    desc: "Skin color distribution and oriental fruit fly oviposition puncture marks annotated for automated packhouse optical sorting lines.",
    meta: ["🥭 Packhouse Grading", "🪰 Fruit Fly Marks", "🌈 Skin Color Ratio"],
    url: "https://www.kaggle.com/datasets/moltean/fruits"
  },
  {
    id: 79,
    title: "Coconut Palm Wilt & Stem Bleeding Pathology",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🥥",
    desc: "Drone and ground images of coconut fronds capturing root wilt, bud rot, and red palm weevil infestations in coastal plantations.",
    meta: ["🥥 Frond Scans", "🐛 Red Palm Weevil", "🌊 Coastal Groves"],
    url: "https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset"
  },
  {
    id: 80,
    title: "Crop & Weed Detection in Vegetable Fields",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🌿",
    desc: "High-resolution agricultural images with bounding boxes distinguishing invasive broadleaf weeds from vegetable seedlings.",
    meta: ["🌿 Weed Detection", "🎯 Autonomous Hoeing", "📐 Bounding Boxes"],
    url: "https://www.kaggle.com/datasets/ravirajsinh45/crop-and-weed-detection-data-with-bounding-boxes"
  },
  {
    id: 81,
    title: "Mushroom Edibility & Toxicity Attributes",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "🍄",
    desc: "UCI machine learning classic dataset describing 8,124 gilled mushroom specimens based on cap shape, odor, gill spacing, and spore print.",
    meta: ["🍄 Edible vs Poisonous", "🔬 22 Attributes", "🎓 ML Classic"],
    url: "https://www.kaggle.com/datasets/uciml/mushroom-classification"
  },
  {
    id: 82,
    title: "Post-Harvest Produce Weight Loss in Cold Storage",
    category: "fruits-vegetables",
    categoryLabel: "Fruits & Vegetables",
    icon: "❄️",
    desc: "Empirical daily transpiration and weight loss logs for root vegetables stored under controlled atmospheric conditions.",
    meta: ["❄️ Controlled Atmosphere", "⚖️ Transpiration Loss", "📦 Cold Chain"],
    url: "https://www.kaggle.com/datasets/niharika41298/nutrition-details-for-most-common-foods-and-products"
  },

  // =========================================================================
  // CATEGORY 4: IOT, SMART FARMING & SENSOR TELEMETRY (83 - 105)
  // =========================================================================
  {
    id: 83,
    title: "Soil Quality, pH & Moisture Telemetry",
    category: "iot-smart-farming",
    categoryLabel: "IoT & Smart Farming",
    icon: "🌱",
    desc: "Real-time readings from in-situ soil probes measuring volumetric water content (VWC), electrical conductivity (EC), and temperature.",
    meta: ["💧 Soil Moisture (VWC)", "⚡ Electrical Cond.", "📡 In-Situ Probes"],
    url: "https://www.kaggle.com/datasets/girmayhailu/soil-quality-dataset"
  },
  {
    id: 84,
    title: "Sofia Environmental & Greenhouse Sensor Telemetry",
    category: "iot-smart-farming",
    categoryLabel: "IoT & Smart Farming",
    icon: "📡",
    desc: "Microclimate timeseries from dense Internet-of-Things sensor meshes capturing PM10, PM2.5, ambient humidity, and barometric pressure.",
    meta: ["📡 Dense IoT Mesh", "🌡️ Temp & Humidity", "📊 Air Quality Nodes"],
    url: "https://www.kaggle.com/datasets/hmavrodiev/sofia-air-quality-dataset"
  },
  {
    id: 85,
    title: "Weather Impact on Agricultural Food Production",
    category: "iot-smart-farming",
    categoryLabel: "IoT & Smart Farming",
    icon: "🌦️",
    desc: "Longitudinal climate dataset matching solar radiation, degree-days, wind gusts, and vapor pressure deficits against field outputs.",
    meta: ["☀️ Solar Radiation", "💨 Wind & Pressure", "🌾 Climate Coupling"],
    url: "https://www.kaggle.com/datasets/thedevastator/weather-impact-on-food-production"
  },
  {
    id: 86,
    title: "Multi-Farm NDVI Satellite Imagery Data",
    category: "iot-smart-farming",
    categoryLabel: "IoT & Smart Farming",
    icon: "🛰️",
    desc: "Normalized Difference Vegetation Index (NDVI) timeseries derived from Sentinel-2 and Landsat-8 imagery for 3 distinct agricultural farms.",
    meta: ["🛰️ Sentinel-2 / Landsat", "🌿 NDVI Vegetation", "🗺️ Multispectral"],
    url: "https://www.kaggle.com/datasets/jarradantell/ndvi-data-for-3-farms"
  },
  {
    id: 87,
    title: "Agricultural Irrigation Water Quality & Potability",
    category: "iot-smart-farming",
    categoryLabel: "IoT & Smart Farming",
    icon: "💧",
    desc: "Water sample laboratory results measuring Total Dissolved Solids (TDS), hardness, chloramines, sulfate, and heavy metal concentrations.",
    meta: ["💧 TDS & Hardness", "🧪 Water Potability", "🌾 Irrigation Quality"],
    url: "https://www.kaggle.com/datasets/adityakadiwal/water-potability"
  },
  {
    id: 88,
    title: "Global Climate Change & Food Security Indicators",
    category: "iot-smart-farming",
    categoryLabel: "IoT & Smart Farming",
    icon: "🌐",
    desc: "Cross-referenced indices linking global surface temperature anomalies with regional crop vulnerability and food supply shocks.",
    meta: ["🌡️ Temp Anomalies", "📉 Food Security", "🌍 Multi-Country"],
    url: "https://www.kaggle.com/datasets/thedevastator/the-relationship-between-climate-change-and-food"
  },
  {
    id: 89,
    title: "Smart Agriculture IoT Sensor Readings (ESP32/LoRa)",
    category: "iot-smart-farming",
    categoryLabel: "IoT & Smart Farming",
    icon: "📟",
    desc: "Telemetry data transmitted via LoRaWAN gateways from battery-powered ESP32 nodes placed in polyhouses and open orchards.",
    meta: ["📡 LoRaWAN 868MHz", "📟 ESP32 Telemetry", "🔋 Battery Metrics"],
    url: "https://www.kaggle.com/datasets/girmayhailu/soil-quality-dataset"
  },
  {
    id: 90,
    title: "Cold Chain Reefer Van Temperature Monitoring",
    category: "iot-smart-farming",
    categoryLabel: "IoT & Smart Farming",
    icon: "🚚",
    desc: "Continuous GPS and cold chain temperature logger timestamps recording compressor cycle status during long-haul perishables transport.",
    meta: ["🚚 Reefer Logistics", "❄️ Continuous Cold", "📍 GPS Geotagged"],
    url: "https://www.kaggle.com/datasets/hmavrodiev/sofia-air-quality-dataset"
  },
  {
    id: 91,
    title: "Drone Multispectral Imagery for Orchard Monitoring",
    category: "iot-smart-farming",
    categoryLabel: "IoT & Smart Farming",
    icon: "🛸",
    desc: "Calibrated red, green, near-infrared (NIR), and red-edge drone orthomosaics for canopy nitrogen and chlorophyll assessment.",
    meta: ["🛸 UAV Multispectral", "🍃 Chlorophyll Map", "📷 Orthomosaic"],
    url: "https://www.kaggle.com/datasets/jarradantell/ndvi-data-for-3-farms"
  },
  {
    id: 92,
    title: "Automated Hydroponic Nutrient & pH Control Logs",
    category: "iot-smart-farming",
    categoryLabel: "IoT & Smart Farming",
    icon: "🧪",
    desc: "Feedback loop dosing pump telemetry tracking electrical conductivity (EC), dissolved oxygen (DO), and pH in deep water culture (DWC) systems.",
    meta: ["💧 DWC Hydroponics", "🧪 Dosing Actuators", "⚡ Closed-Loop EC"],
    url: "https://www.kaggle.com/datasets/girmayhailu/soil-quality-dataset"
  },
  {
    id: 93,
    title: "Microclimate Greenhouse Temperature & Humidity",
    category: "iot-smart-farming",
    categoryLabel: "IoT & Smart Farming",
    icon: "🏡",
    desc: "Polyhouse ambient readings alongside shade net motor actuation times, exhaust fan cycles, and evaporative cooling pad duty cycles.",
    meta: ["🏡 Polyhouse Climate", "💨 Fan Actuation", "🌡️ Thermal Strat"],
    url: "https://www.kaggle.com/datasets/hmavrodiev/sofia-air-quality-dataset"
  },
  {
    id: 94,
    title: "Smart Drip Irrigation Soil Moisture Forecasts",
    category: "iot-smart-farming",
    categoryLabel: "IoT & Smart Farming",
    icon: "🚰",
    desc: "AI-driven irrigation scheduler logs predicting root zone water depletion and triggering solenoid valves to save 35% farm water.",
    meta: ["🚰 Solenoid Valves", "📉 35% Water Savings", "🤖 Auto Scheduler"],
    url: "https://www.kaggle.com/datasets/thedevastator/weather-impact-on-food-production"
  },
  {
    id: 95,
    title: "Solar Radiation & Evapotranspiration on Farmland",
    category: "iot-smart-farming",
    categoryLabel: "IoT & Smart Farming",
    icon: "☀️",
    desc: "Pyranometer irradiance figures used in the FAO Penman-Monteith equation to calculate reference evapotranspiration (ET0) daily.",
    meta: ["☀️ Pyranometer", "💧 Penman-Monteith", "📐 Daily ET0"],
    url: "https://www.kaggle.com/datasets/rajanand/rainfall-in-india"
  },
  {
    id: 96,
    title: "Cattle Herd Health & GPS Geofence Telemetry",
    category: "iot-smart-farming",
    categoryLabel: "IoT & Smart Farming",
    icon: "🐄",
    desc: "Smart ear tag and collar accelerometer readings tracking cow rumination minutes, body temperature spikes, and pasture geofences.",
    meta: ["🐄 Smart Ear Tags", "📍 Pasture Geofence", "🩺 Rumination AI"],
    url: "https://www.kaggle.com/datasets/aiaiaidontknow/milk-price-dataset"
  },
  {
    id: 97,
    title: "Smart Silo Grain Temperature & Mold Risk Data",
    category: "iot-smart-farming",
    categoryLabel: "IoT & Smart Farming",
    icon: "🏭",
    desc: "Internal thermocouple cable arrays detecting thermal hot spots, CO2 concentration increases, and early grain weevil activity.",
    meta: ["🏭 Silo Cables", "⚠️ Mold Warning", "🌾 Hotspot Detection"],
    url: "https://www.kaggle.com/datasets/divyansh22/crop-production-statistics"
  },
  {
    id: 98,
    title: "Farm Weather Station Real-Time Anemometer Feed",
    category: "iot-smart-farming",
    categoryLabel: "IoT & Smart Farming",
    icon: "🌪️",
    desc: "Hyper-local on-farm weather station feeds providing wind speed, peak gusts, dew point, and barometric trends for drone spray windows.",
    meta: ["🌪️ Ultrasonic Anemometer", "🛸 Spray Window", "💧 Dew Point"],
    url: "https://www.kaggle.com/datasets/thedevastator/weather-impact-on-food-production"
  },
  {
    id: 99,
    title: "Drone Crop Height & Biomass Volumetric Estimation",
    category: "iot-smart-farming",
    categoryLabel: "IoT & Smart Farming",
    icon: "📐",
    desc: "Digital Surface Models (DSM) and Canopy Height Models (CHM) constructed from drone photogrammetry to estimate stand volume.",
    meta: ["📐 Canopy Height (CHM)", "🛸 Photogrammetry", "🌾 Volume Forecast"],
    url: "https://www.kaggle.com/datasets/jarradantell/ndvi-data-for-3-farms"
  },
  {
    id: 100,
    title: "Wireless Sensor Network (WSN) Soil Salinity Logs",
    category: "iot-smart-farming",
    categoryLabel: "IoT & Smart Farming",
    icon: "🧂",
    desc: "Mesh node telemetry tracking salt buildup (ECe) in irrigated arid soils to trigger leaching flushes before root damage occurs.",
    meta: ["🧂 Salinity (ECe)", "📡 WSN Mesh", "💧 Leaching Alerts"],
    url: "https://www.kaggle.com/datasets/girmayhailu/soil-quality-dataset"
  },
  {
    id: 101,
    title: "Frost Prediction & Early Warning Sensor Telemetry",
    category: "iot-smart-farming",
    categoryLabel: "IoT & Smart Farming",
    icon: "❄️",
    desc: "Nighttime leaf wetness sensors, net radiometer readings, and thermal inversion detection triggering vineyard frost fans.",
    meta: ["❄️ Frost Early Alarm", "🍃 Leaf Wetness", "🌪️ Vineyard Fans"],
    url: "https://www.kaggle.com/datasets/thedevastator/weather-impact-on-food-production"
  },
  {
    id: 102,
    title: "RFID & Cold Chain Asset Tracking Logs",
    category: "iot-smart-farming",
    categoryLabel: "IoT & Smart Farming",
    icon: "🏷️",
    desc: "Passive UHF RFID crate checkpoints documenting dwell times in pre-coolers, transport vehicles, and regional distribution centers.",
    meta: ["🏷️ UHF RFID Crates", "🚚 Crate Dwell Time", "📦 Cold Chain Audit"],
    url: "https://www.kaggle.com/datasets/sriramr/fruits-fresh-and-rotten-for-classification"
  },
  {
    id: 103,
    title: "Smart Apiary: Beehive Weight & Acoustic Telemetry",
    category: "iot-smart-farming",
    categoryLabel: "IoT & Smart Farming",
    icon: "🐝",
    desc: "IoT load cell platforms measuring honey production daily and microphone frequency spectra predicting impending colony swarming.",
    meta: ["🐝 Honey Production", "⚖️ Load Cell Scales", "🔊 Acoustic Swarm AI"],
    url: "https://www.kaggle.com/datasets/unitednations/global-food-agriculture-statistics"
  },
  {
    id: 104,
    title: "Farm Borewell Groundwater Level Depletion Timeseries",
    category: "iot-smart-farming",
    categoryLabel: "IoT & Smart Farming",
    icon: "⛏️",
    desc: "Submersible hydrostatic pressure transducers logging water table drawdown during peak irrigation seasons in hard rock aquifers.",
    meta: ["⛏️ Aquifer Drawdown", "💧 Water Table Depth", "📊 Pressure Probe"],
    url: "https://www.kaggle.com/datasets/adityakadiwal/water-potability"
  },
  {
    id: 105,
    title: "Solar-Powered Smart Sprayer Telemetry Logs",
    category: "iot-smart-farming",
    categoryLabel: "IoT & Smart Farming",
    icon: "☀️",
    desc: "Targeted optical nozzle pulse telemetry logging selective herbicide reduction up to 80% on commercial tractor boom sprayers.",
    meta: ["☀️ Solar Sprayer", "🎯 80% Chemical Cut", "🚜 Selective Pulse"],
    url: "https://www.kaggle.com/datasets/ravirajsinh45/crop-and-weed-detection-data-with-bounding-boxes"
  }
];

/**
 * Render all 105+ Kaggle dataset cards into the DOM grid
 */
function initKaggleDatasets() {
  const grid = document.getElementById('kaggleGrid');
  if (!grid) return;

  // Clear any existing fallback cards to ensure all 105+ datasets are fresh and indexed
  grid.innerHTML = '';

  const fragment = document.createDocumentFragment();

  KAGGLE_DATASETS.forEach(item => {
    const card = document.createElement('article');
    card.className = 'kaggle-card';
    card.setAttribute('data-category', item.category);
    card.setAttribute('data-title', item.title);
    card.setAttribute('aria-label', `Dataset: ${item.title}`);

    // Category badge color class
    const catClass = item.category;

    // Build meta tags HTML
    const metaHtml = (item.meta || [])
      .map(tag => `<span class="kaggle-meta-tag">${tag}</span>`)
      .join('');

    card.innerHTML = `
      <div class="kaggle-card-header">
        <div class="kaggle-card-icon">${item.icon || '📊'}</div>
        <span class="kaggle-category-badge ${catClass}">${item.categoryLabel}</span>
      </div>
      <div class="kaggle-card-body">
        <h3 class="kaggle-card-title">${item.title}</h3>
        <p class="kaggle-card-desc">${item.desc}</p>
        <div class="kaggle-card-meta">${metaHtml}</div>
      </div>
      <div class="kaggle-card-footer">
        <div class="kaggle-source-note">Kaggle · External Dataset</div>
        <a
          id="kaggle-link-${item.id}"
          href="${item.url}"
          target="_blank"
          rel="noopener noreferrer"
          class="kaggle-view-btn"
          aria-label="View ${item.title} on Kaggle (opens in new tab)"
        >
          View on Kaggle
          <span class="kaggle-ext-icon">↗</span>
        </a>
      </div>
    `;

    fragment.appendChild(card);
  });

  grid.appendChild(fragment);

  // Update header count indicator if present
  const countBadge = document.getElementById('kaggleCountBadge');
  if (countBadge) {
    countBadge.textContent = `${KAGGLE_DATASETS.length} Datasets`;
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initKaggleDatasets);
} else {
  initKaggleDatasets();
}

// Expose globally
window.KAGGLE_DATASETS = KAGGLE_DATASETS;
window.initKaggleDatasets = initKaggleDatasets;
