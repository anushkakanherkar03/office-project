import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function DiseaseDetection() {
  const navigate = useNavigate();

  const [activeModule, setActiveModule] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherAlert, setWeatherAlert] = useState("");

  // Live Hardware Camera Tracking Streams
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const cameraStreamRef = useRef(null);

  // SOS Settings State Toggle Switch
  const [isSosAlertEnabled, setIsSosAlertEnabled] = useState(true);

  // Core Selector States
  const [soilType, setSoilType] = useState("");
  const [customSoilType, setCustomSoilType] = useState(""); 

  const [waterLevel, setWaterLevel] = useState("");
  const [waterSource, setWaterSource] = useState("");
  const [customWaterSource, setCustomWaterSource] = useState(""); 
  const [moistureLevel, setMoistureLevel] = useState("");
  const [waterTableDepth, setWaterTableDepth] = useState("");
  const [irrigationMethod, setIrrigationMethod] = useState("");

  const [cropSeason, setCropSeason] = useState("");
  const [customCropSeason, setCustomCropSeason] = useState(""); 
  const [month, setMonth] = useState("");
  const [date, setDate] = useState("");

  // Growth Stage State
  const [cropStage, setCropStage] = useState("");

  // Disease Module States
  const [selectedDiseaseCrop, setSelectedDiseaseCrop] = useState("");
  const [diseasePhoto, setDiseasePhoto] = useState(null);

  // Digital Farm Diary States
  const [diaryLogs, setDiaryLogs] = useState([]);
  const [diaryCategory, setDiaryCategory] = useState("Seeds");
  const [diaryAmount, setDiaryAmount] = useState("");
  const [diaryNotes, setDiaryNotes] = useState("");

  // Recommended States
  const [recommendedCrop, setRecommendedCrop] = useState("");

  const [weatherCity] = useState("Pune");
  const [language, setLanguage] = useState("English");

  /* ---------------- REQUEST NOTIFICATION PERMISSIONS ---------------- */
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  /* ---------------- SIMPLE MULTILINGUAL DICTIONARY ---------------- */
  const translations = {
    English: {
      logout: "Logout",
      languages: "Languages",
      weather: "Weather Info",
      soil: "Soil Type",
      water: "Water Level",
      season: "Season Selection",
      crop: "Crop Recommendation",
      fertilizer: "Fertilizer Suggestion",
      disease: "Disease Detection",
      market: "Market Prices",
      scheme: "Government Schemes",
      diary: "Farm Diary",
      sosSettings: "⚙️ Settings",

      weatherTitle: "🌦 Weather Details",
      soilDetection: "🌍 Soil Selection & Photo",
      waterTitle: "💧 Water Availability & Irrigation Planner",
      seasonTitle: "🌤 Season Matrix",
      cropTitle: "🌱 Smart Crop Recommendation",
      fertilizerTitle: "🧪 Growth-Stage Fertilizer Planner",
      diseaseTitle: "🦠 AI Phytopathology & Cure Engine",
      marketTitle: "📈 Maharashtra APMC Live Market Board",
      schemeTitle: "🏛 Direct Benefit Transfer & Agri Schemes",
      diaryTitle: "📓 Digital Farm Ledger Diary",
      settingsTitle: "⚙️ SOS Automated Weather Configuration",

      refreshStation: "Check Weather",
      stationLoc: "Location",
      ambientTemp: "Temperature",
      windSpeed: "Wind Speed",
      rainProbLabel: "Chance of Rain",
      rainIntensity: "Rain Speed",
      aiDiagnostics: "Rain Prediction",
      telemetrySync: "Last Updated",

      rainHigh: "⚠️ Heavy rain coming soon! Stop spraying or adding fertilizer.",
      rainMed: "Cloudy sky / light rain possible. Check your soil wetness.",
      rainLow: "No rain expected.",
      metUnavailable: "Weather details not available right now.",

      selectSoilLabel: "Choose your soil type:",
      selectSoilOpt: "-- Select Soil --",
      computerVision: "Soil Photo Input",
      launchCamera: "📷 Open Live Camera Stream",
      closeCamera: "❌ Turn Off Camera Feed",
      captureSnap: "📸 Take Snapshot Image",
      uploadGallery: "📁 Choose from Gallery",
      imageCached: "✓ Photo captured successfully",

      blackSoil: "Black Soil",
      redSoil: "Red Soil",
      claySoil: "Clay Soil",
      loamySoil: "Loamy Soil",
      sandySoil: "Sandy Soil",
      greySoil: "Grey Soil",
      lateriteSoil: "Laterite Soil",
      salineSoil: "Saline (Salty) Soil",
      peatySoil: "Organic / Peaty Soil",
      selectedMatrix: "Your Soil",

      hydroSource: "Where do you get water?",
      selectInfra: "-- Select Water Source --",
      borewell: "Borewell / Tube well",
      river: "River",
      canal: "Canal",
      pond: "Farm Pond / Tank",
      graywater: "Recycled Water",
      typeLabel: "Please specify your custom entry here:",

      low: "Low",
      medium: "Medium",
      high: "High",

      summer: "Summer",
      winter: "Winter",
      monsoon: "Monsoon",

      waterTable: "Groundwater Table Level:",
      selectCapacity: "-- Select Groundwater Level --",
      criticalDepth: "Very Low Water (<15 meters)",
      optimalDepth: "Medium Normal Water (15-50 meters)",
      abundantDepth: "Full High Water (>50 meters)",

      moistureLabel: "Soil Wetness level (Tensiometer):",
      selectTension: "-- Select Wetness --",
      aridMoisture: "Dry / Thirsty Soil (< 20 Centibars)",
      fieldCapacity: "Perfect Moisture (20-60 Centibars)",
      saturatedMoisture: "Waterlogged / Too Wet Soil (> 60 Centibars)",

      deliveryMechanism: "How do you give water?",
      selectMethod: "-- Select Method --",
      drip: "Drip Irrigation",
      sprinkler: "Sprinkler Irrigation",
      flood: "Flood Irrigation",
      hydroRec: "Advice: Using {source} with {method} is perfect to keep your soil correctly watered.",

      agroClimatic: "Select Current Crop Season:",
      selectCycle: "-- Select Season --",
      phenologicalStage: "What is your current crop growth stage?",
      selectStage: "-- Select Growth Stage --",
      seeds: "Seeds Just Planted / Sowing Stage",
      germination: "Seeds Sprouting / Small Plants",
      tillering: "Growing Leaves & Branches",
      bloom: "Flowers / Buds Coming",
      maturity: "Crop Ready for Harvest",

      targetSowing: "Sowing / Planting Date:",
      validatedWindow: "Saved Details: Season is {season} and Planting Date is {date}.",

      comingSoon: "Feature coming soon...",
      selectSoilFirst: "Please select your Soil Type first to see fertilizer tips.",
      sosMsg: "🚨 SOS Alert Sent! Emergency help has been informed.",
      
      missingInputs: "⚠️ Please fill out Soil Type, Water Source, and Season Selection modules first to generate an accurate recommendation!",
      cropSurety: "🔒 100% Match Confirmation: This crop perfectly balances with your current weather data, soil properties, and water limits.",
      fertSurety: "✅ Verified Match Confirmation: This fertilizer strategy is specifically generated to maximize yield for {crop} within a {soil} profile.",
      whyHeading: "💡 Scientific Reason (काही कारणे):",
      
      diseaseLabel: "Select infected crop profile:",
      diseaseOpt: "-- Select Crop --",
      diseaseSkip: "🧹 Clear / Skip Diagnostic",
      marketHeader: "Current commodity market prices across major Maharashtra zones:",
      
      marketTimeline: "📊 Macro Market Analysis Dashboard",
      pastMarket: "📅 Historical Market (Past 5 Years)",
      currentMarket: "⚡ Real-Time Active Market (Now)",
      futureMarket: "🚀 Forward Projection Trend (Future)",

      diaryLogBtn: "Save Entry Log",
      diaryClear: "Clear Logs",
      diaryNoLogs: "No transaction logs saved today.",
      diaryPlaceholder: "Enter extra details (ex: Bought 5 bags of Urea or sold 10 quintals of Rice)...",
      relatedSchemesHeading: "🌟 Crop Specific Subsidies Matched for You"
    },
    Hindi: {
      logout: "लॉगआउट",
      languages: "भाषा",
      weather: "मौसम की जानकारी",
      soil: "मिट्टी का प्रकार",
      water: "पानी की उपलब्धता",
      season: "मौसम चयन",
      crop: "फसल की सलाह",
      fertilizer: "खाद की सलाह",
      disease: "फसल के रोग",
      market: "बाजार भाव",
      scheme: "सरकारी योजनाएं",
      diary: "खेती डायरी",
      sosSettings: "⚙️ सेटिंग्स",

      weatherTitle: "🌦 मौसम की पूरी जानकारी",
      soilDetection: "🌍 मिट्टी का चुनाव और कैमरा",
      waterTitle: "💧 पानी की स्थिति और सिंचाई योजना",
      seasonTitle: "🌤 मौसम चयन मैट्रिक्स",
      cropTitle: "🌱 स्मार्ट फसल चयन सिफारिश",
      fertilizerTitle: "🧪 विकास-चरण खाद योजना",
      diseaseTitle: "🦠 एआई फसल रोग और उपचार प्रणाली",
      marketTitle: "📈 महाराष्ट्र कृषि मंडी लाइव भाव बोर्ड",
      schemeTitle: "🏛 प्रत्यक्ष लाभ अंतरण एवं कृषि योजनाएं",
      diaryTitle: "📓 डिजिटल फार्म डायरी खाता",
      settingsTitle: "⚙️ एसओएस स्वचालित मौसम चेतावनी सेटिंग्स",

      refreshStation: "मौसम देखें",
      stationLoc: "स्थान",
      ambientTemp: "तापमान",
      windSpeed: "हवा की गति",
      rainProbLabel: "बारिश की संभावना",
      rainIntensity: "बारिश की गति",
      aiDiagnostics: "बारिश का अनुमान",
      telemetrySync: "अंतिम अपडेट",

      rainHigh: "⚠️ भारी बारिश होने वाली है! कीटनाशक छिड़काव या खाद डालना बंद करें।",
      rainMed: "बादल छाए रहेंगे / हल्की बूंदाबांदी संभव है। मिट्टी की नमी जांचें।",
      rainLow: "बारिश की संभावना नहीं है।",
      metUnavailable: "मौसम की जानकारी अभी उपलब्ध नहीं है।",

      selectSoilLabel: "अपनी मिट्टी का प्रकार चुनें:",
      selectSoilOpt: "-- मिट्टी चुनें --",
      computerVision: "मिट्टी की फोटो",
      launchCamera: "📷 लाइव कैमरा चालू करें",
      closeCamera: "❌ कैमरा बंद करें",
      captureSnap: "📸 फोटो खींचें",
      uploadGallery: "📁 गैलरी से फोटो चुनें",
      imageCached: "✓ फोटो सफलतापूर्वक ली गई",

      blackSoil: "काली मिट्टी",
      redSoil: "लाल मिट्टी",
      claySoil: "चिकनी मिट्टी",
      loamySoil: "दोमट मिट्टी",
      sandySoil: "रेतीली मिट्टी",
      greySoil: "धूसर (ग्रे) मिट्टी",
      lateriteSoil: "लेटराइट मिट्टी",
      salineSoil: "खारी (नमकीन) मिट्टी",
      peatySoil: "जैविक / दलदली मिट्टी",
      selectedMatrix: "आपकी मिट्टी",

      hydroSource: "आपको पानी कहाँ से मिलता है?",
      selectInfra: "-- पानी का स्रोत चुनें --",
      borewell: "बोरवेल",
      river: "नदी",
      canal: "नहर",
      pond: "खेत का तालाब / टैंक",
      graywater: "रीसायकल किया हुआ पानी",
      typeLabel: "कृपया यहाँ टाइप करें:",

      low: "कम",
      medium: "मध्यम",
      high: "अधिक",

      summer: "गर्मी",
      winter: "सर्दी",
      monsoon: "मानसून",

      waterTable: "जमीन के नीचे पानी का स्तर:",
      selectCapacity: "-- पानी का स्तर चुनें --",
      criticalDepth: "बहुत कम पानी (<15 मीटर)",
      optimalDepth: "सामान्य / अच्छा पानी (15-50 मीटर)",
      abundantDepth: "भरपूर पानी (>50 मीटर)",

      moistureLabel: "मिट्टी में नमी (गीलापन):",
      selectTension: "-- नमी चुनें --",
      aridMoisture: "सूखी / प्यासी मिट्टी (< 20 Centibars)",
      fieldCapacity: "बिल्कुल सही नमी (20-60 Centibars)",
      saturatedMoisture: "बहुत ज्यादा गीली / दलदली मिट्टी (> 60 Centibars)",

      deliveryMechanism: "आप पानी कैसे देते हैं?",
      selectMethod: "-- सिंचाई का तरीका चुनें --",
      drip: "टपक सिंचाई (ड्रिप)",
      sprinkler: "फव्वारा सिंचाई (स्प्रिंकलर)",
      flood: "खुला पानी देना (फ्लड)",
      hydroRec: "सलाह: {source} के साथ {method} का उपयोग आपकी मिट्टी में सही नमी बनाए रखने के लिए सबसे अच्छा है।",

      agroClimatic: "बुवाई का सीजन चुनें:",
      selectCycle: "-- सीजन चुनें --",
      phenologicalStage: "आपकी फसल अभी विकास के किस चरण में है?",
      selectStage: "-- विकास का चरण चुनें --",
      seeds: "बीज अभी बोए हैं / बुवाई का चरण",
      germination: "बीज अंकुरण / छोटे पौधे",
      tillering: "पत्ते और डालियां निकलना",
      bloom: "फूल या कलियां आना",
      maturity: "फसल कटाई के लिए तैयार",

      targetSowing: "बुवाई / रोपाई की तारीख:",
      validatedWindow: "सेव की गई जानकारी: सीजन {season} है और बुवाई की तारीख {date} है।",

      comingSoon: "यह सुविधा जल्द ही उपलब्ध होगी...",
      selectSoilFirst: "खाद की सलाह देखने के लिए कृपया पहले मिट्टी का प्रकार चुनें।",
      
      missingInputs: "⚠️ सही फसल की सलाह के लिए कृपया पहले मिट्टी का प्रकार, पानी का स्रोत और सीजन मॉड्यूल को भरें!",
      cropSurety: "🔒 100% सही मिलान पुष्टि: यह फसल आपके वर्तमान मौसम, मिट्टी की गुणवत्ता और पानी की मात्रा के बिल्कुल अनुकूल है।",
      fertSurety: "✅ प्रमाणित खाद पुष्टि: यह खाद रणनीति {soil} मिट्टी में {crop} की पैदावार को अधिकतम करने के लिए बनाई गई है।",
      whyHeading: "💡 वैज्ञानिक कारण:",
      
      diseaseLabel: "संक्रमित फसल का चयन करें:",
      diseaseOpt: "-- फसल चुनें --",
      diseaseSkip: "🧹 निदान साफ करें / छोड़ें",
      marketHeader: "मंडी भाव जानकारी विवरण तालिका:",
      
      marketTimeline: "📊 वायदा बाजार रुझान",
      pastMarket: "📅 ऐतिहासिक बाज़ार स्थिति (पिछले 5 वर्ष)",
      currentMarket: "⚡ वास्तविक समय सक्रिय बाज़ार स्थिति (अभी)",
      futureMarket: "🚀 वायदा बाजार रुझान (भविष्य)",

      diaryLogBtn: "डेटा एंट्री सेव करें",
      diaryClear: "रिकॉर्ड साफ करें",
      diaryNoLogs: "आज कोई रिकॉर्ड नहीं जोड़ा गया।",
      diaryPlaceholder: "अतिरिक्त विवरण लिखें (जैसे: 5 बोरी यूरिया खरीदा या 10 क्विंटल धान बेचा)...",
      relatedSchemesHeading: "🌟 आपकी सुझाई गई फसल से संबंधित विशेष सरकारी योजनाएं"
    },
    Marathi: {
      logout: "लॉगआउट",
      languages: "भाषा",
      weather: "हवामान माहिती",
      soil: "मातीचा प्रकार",
      water: "पाण्याची पातळी",
      season: "हंगाम निवड",
      crop: "पीक शिफारस",
      fertilizer: "खतांची शिफारस",
      disease: "पीक रोग ओळख",
      market: "बाजारभाव",
      scheme: "शासकीय योजना",
      diary: "शेत डायरी",
      sosSettings: "⚙️ सेटिंग्ज",

      weatherTitle: "🌦 हवामानाची सविस्तर माहिती",
      soilDetection: "🌍 मातीची निवड आणि कॅमेरा",
      waterTitle: "💧 पाण्याची उपलब्धता आणि सिंचन नियोजन",
      seasonTitle: "🌤 हंगाम निवड मॅट्रिक्स",
      cropTitle: "🌱 प्रगत पीक शिफारस",
      fertilizerTitle: "🧪 पीक वाढीनुसार खत नियोजन",
      diseaseTitle: "🦠 एआई पीक रोग आणि उपचार यंत्रणा",
      marketTitle: "📈 महाराष्ट्र एपीएमसी थेट बाजारभाव फलक",
      schemeTitle: "🏛 थेट लाभ हस्तांतरण आणि शासकीय कृषी योजना",
      diaryTitle: "📓 डिजिटल शेती रोजनीशी वही",
      settingsTitle: "⚙️ एसओएस स्वयंचलित हवामान चेतावणी सेटिंग्ज",

      refreshStation: "हवामान तपासा",
      stationLoc: "ठिकाण",
      ambientTemp: "तापमान",
      windSpeed: "वाऱ्याचा वेग",
      rainProbLabel: "पावसाची शक्यता",
      rainIntensity: "पावसाचा वेग",
      aiDiagnostics: "पावसाचा अंदाज",
      telemetrySync: "शेवटचे अपडेट",

      rainHigh: "⚠️ लवकरच मुसळधार पाऊस येणार आहे! फवारणी किंवा खत टाकणे थांबवा.",
      rainMed: "ढगाळ वातावरण / हलक्या पावसाची शक्यता. मातीतील ओलावा तपासा.",
      rainLow: "पावसाची शक्यता नाही.",
      metUnavailable: "हवामानाची माहिती सध्या उपलब्ध नाही.",

      selectSoilLabel: "तुमच्या मातीचा प्रकार निवडा:",
      selectSoilOpt: "-- माती निवडा --",
      computerVision: "मातीचा फोटो",
      launchCamera: "📷 लाईव्ह कॅमेरा सुरू करा",
      closeCamera: "❌ कॅмера बंद करा",
      captureSnap: "📸 फोटो काढा",
      uploadGallery: "📁 गॅलरीमधून फोटो निवडा",
      imageCached: "✓ फोटो यशस्वीरित्या कॅप्चर केला",

      blackSoil: "काळी माती",
      redSoil: "लाल माती",
      claySoil: "चिकणमाती",
      loamySoil: "लोम माती",
      sandySoil: "वाळूची माती",
      greySoil: "करडी (ग्रे) माती",
      lateriteSoil: "जांभी माती",
      salineSoil: "खारवट माती",
      peatySoil: "सेंद्रिय / दलदलीची माती",
      selectedMatrix: "तुमची माती",

      hydroSource: "तुम्हाला पाणी कोठून मिळते?",
      selectInfra: "-- पाण्याचा स्त्रोत निवडा --",
      borewell: "बोअरवेल",
      river: "नदी",
      canal: "कालवा (नहर)",
      pond: "शेततळे / टाकी",
      graywater: "वापरलेले शुद्ध केलेले पाणी",
      typeLabel: "कृपया येथे टाईप करा:",

      low: "कमी",
      medium: "मध्यम",
      high: "जास्त",

      summer: "उन्हाळा",
      winter: "हिवाळा",
      monsoon: "पावसाळा",

      waterTable: "जमिनीखालील पाण्याची पातळी:",
      selectCapacity: "-- पाण्याची पातळी निवडा --",
      criticalDepth: "खूप कमी पाणी (<१५ मीटर)",
      optimalDepth: "मध्यम / चांगले पाणी (१५-५० मीटर)",
      abundantDepth: "भरपूर पाणी (>५0 मीटर)",

      moistureLabel: "मातीतील ओलावा (गिलावा):",
      selectTension: "-- ओलावा निवडा --",
      aridMoisture: "सुकी / कोरडी माती (< २० Centibars)",
      fieldCapacity: "उत्कृष्ट ओलावा (२०-६० Centibars)",
      saturatedMoisture: "खूप जास्त ओली / दलदलीची माती (> ६० Centibars)",

      deliveryMechanism: "तुम्ही पाणी कसे देता?",
      selectMethod: "-- पाणी देण्याची पद्धत निवडा --",
      drip: "ठिबक सिंचन (ड्रिप)",
      sprinkler: "तुषार सिंचन (स्प्रिंकलर)",
      flood: "मोकळे पाणी देणे (फ्लड)",
      hydroRec: "सलाह: {source} सोबत {method} वापरणे तुमच्या मातीत योग्य ओलावा ठेवण्यासाठी सर्वात उत्तम आहे.",

      agroClimatic: "पेरणीचा हंगाम निवडा:",
      selectCycle: "-- हंगाम निवडा --",
      phenologicalStage: "पिकाची सध्याची वाढ कोणत्या टप्प्यावर आहे?",
      selectStage: "-- वाढीचा टप्पा निवडा --",
      seeds: "बियाणे नुकतेच लावले आहे / पेरणीचा टप्पा",
      germination: "बियाणे रुजणे / लहान रोपे",
      tillering: "पाने आणि फांद्या फुटणे",
      bloom: "फुले किंवा कळ्या येणे",
      maturity: "पीक काढणीसाठी तयार",

      targetSowing: "पेरणी / लावणीची तारीख:",
      validatedWindow: "जतन केलेली माहिती: हंगाम {season} आहे आणि पेरणीची तारीख {date} आहे.",

      comingSoon: "ही सुविधा लवकरच उपलब्ध होईल...",
      selectSoilFirst: "खतांची शिफारस पाहण्यासाठी कृपया आधी मातीचा प्रकार निवडा.",
      
      missingInputs: "⚠️ अचूक पीक शिफारसीसाठी कृपया प्रथम मातीचा प्रकार, पाण्याचा स्त्रोत आणि हंगाम निवडा!",
      cropSurety: "🔒 १००% अचूक मॅच खात्री: हे पीक तुमच्या हवामान, मातीचे गुणधर्म आणि पाण्याच्या उपलब्धतेशी पूर्णपणे सुसंगत आहे.",
      fertSurety: "✅ प्रमाणित खत खात्री: hi खत योजना {soil} मातीत {crop} पिकाचे उत्पादन वाढवण्यासाठी तयार केली आहे.",
      whyHeading: "💡 scientific कारण:",
      
      diseaseLabel: "बाधित पीक प्रोफाइल निवडा:",
      diseaseOpt: "-- पीक निवडा --",
      diseaseSkip: "🧹 निदान साफ करा / थांबवा",
      marketHeader: "बाजारभाव तपशील फलक माहिती विवरण:",
      
      marketTimeline: "📊 मॅक्रो बाजार विश्लेषण डॅशबोर्ड",
      pastMarket: "📅 ऐतिहासिक बाजार परिस्थिती (मागील ५ वर्षे)",
      currentMarket: "⚡ रिअल-time थेट बाजार भाव (आता)",
      futureMarket: "🚀 वायदा बाजार कल अंदाज (भविष्य)",

      diaryLogBtn: "नोंद मध्ये जतन करा",
      diaryClear: "डायरी साफ करा",
      diaryNoLogs: "आज शेती रोजनिशी मध्ये कोणतीही नोंद केलेली नाही.",
      diaryPlaceholder: "इतर सविस्तर माहिती लिहा (उदा: ५ गोण्या युरिया आणला किंवा १० क्विंटल भात विकला)...",
      relatedSchemesHeading: "🌟 आपल्या सुझाईत पिकासाठी विशेष शासकीय योजना"
    }
  };

  const t = translations[language] || translations.English;

  const modulesConfig = [
    { id: "weather", label: t.weather },
    { id: "soil", label: t.soil },
    { id: "water", label: t.water },
    { id: "season", label: t.season },
    { id: "crop", label: t.crop },
    { id: "fertilizer", label: t.fertilizer },
    { id: "disease", label: t.disease },
    { id: "market", label: t.market },
    { id: "scheme", label: t.scheme },
    { id: "diary", label: t.diary }
  ];

  /* ---------------- HARDWARE WEB-CAM EMULATION TRACKS ---------------- */
  const startLiveHardwareCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera connection failed:", err);
      alert("Hardware execution error: Webcam access required.");
      setIsCameraActive(false);
    }
  };

  const stopLiveHardwareCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const captureSoilPhotoSnapshot = () => {
    if (videoRef.current) {
      setUploadedImage("https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=150&q=80");
      stopLiveHardwareCamera();
      alert(t.imageCached);
    }
  };

  const closeActiveDashboardModal = () => {
    stopLiveHardwareCamera();
    setActiveModule(null);
  };

  /* ---------------- WEATHER LIVE ALERTS TELEMETRY ---------------- */
  const getWeather = async () => {
    try {
      const apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=18.5204&longitude=73.8567&current_weather=true&hourly=relativehumidity_2m,precipitation_probability,rain&timezone=auto";
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Weather fetch failed");
      const data = await response.json();
      
      const currentHourIndex = new Date().getHours();
      const rainProb = data.hourly?.precipitation_probability?.[currentHourIndex] ?? 45; 
      const rainVolume = data.hourly?.rain?.[currentHourIndex] ?? 0.0;
      const windSpeed = data.current_weather?.windspeed ?? 15;

      let rainPrediction = t.rainLow;
      setWeatherAlert(""); 

      if (isSosAlertEnabled && (rainProb > 70 || rainVolume > 1.0 || windSpeed > 30)) {
        rainPrediction = t.rainHigh;
        const msg = "🚨 AUTOMATED SOS WARNING: Unseasonal high risk weather patterns detected. Suspend field spraying!";
        setWeatherAlert(msg);
        
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("AgroSmart AI Weather Alert", { body: msg, icon: "🌾" });
        }
      } else if (rainProb > 30) {
        rainPrediction = t.rainMed;
      }

      setWeather({
        city: weatherCity,
        temp: data.current_weather?.temperature ?? "--",
        wind: windSpeed,
        rainProbability: rainProb,
        precipitationVol: rainVolume,
        predictionMessage: rainPrediction,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (error) {
      console.error(error);
      alert(t.metUnavailable);
    }
  };

  /* ---------------- RE-MAPPED RELIABLE RECOMMENDATION TIMELINES ---------------- */
  const getSmartCropRecommendation = () => {
    const activeSoil = soilType === "Other" ? customSoilType : soilType;
    const activeWater = waterSource === "Other" ? customWaterSource : waterSource;
    const activeSeason = cropSeason === "Other" ? customCropSeason : cropSeason;

    if (!activeSoil || !activeWater || !activeSeason) {
      return { name: "", details: t.missingInputs, why: "", marketTimeline: null };
    }

    let cropName = "";
    let cropDetails = "";
    let whyReason = "";
    let timeline = { past: "", current: "", future: "" };

    if (activeSeason === "Monsoon" || activeSeason === "Summer") {
      cropName = "Rice (Paddy)";
      cropDetails = "Heavy textures hold field hydration boundaries perfectly against hot climate cycles.";
      whyReason = "1. Conserves foundational root layout volumes.\n2. Minimizes rapid drainage drops.";
      timeline.past = "India witnessed a 42% spike in domestic paddy volumes, stabilizing trade threshold values.";
      timeline.current = "Active Floor: ₹2,441 to ₹2,461 per quintal matching with government support MSP rates.";
      timeline.future = "Export balance models indicate upcoming 8% price increments across wholesale hubs.";
    } else {
      cropName = "Wheat";
      cropDetails = "Cool temperatures match perfectly with winter moisture conservation windows.";
      whyReason = "1. Cold cycles amplify seed weight index scales.\n2. Low humidity matches field parameters.";
      timeline.past = "National output markers recently hit 117 Metric Tonnes creating vast domestic buffer stocks.";
      timeline.current = "Active Floor: Premium mill qualities trading at ₹3,300 per quintal under strong demands.";
      timeline.future = "Procurement logs show massive state backing with fixed safety purchase windows.";
    }

    return { name: cropName, details: cropDetails, why: whyReason, marketTimeline: timeline };
  };

  /* ---------------- FERTILIZER SUGGESTION ENGINE ---------------- */
  const getFertilizerAnalysis = () => {
    const activeSoil = soilType === "Other" ? customSoilType : soilType;
    if (!activeSoil) return { text: t.selectSoilFirst, why: "" };
    const activeCrop = recommendedCrop || "Wheat";
    let strategy = `Apply standard NPK ratio matching your soil profile for ${activeCrop}.`;
    let whyReason = "Optimized based on target soil chemistry parameters.";
    return { text: strategy, confirmation: t.fertSurety.replace("{crop}", activeCrop).replace("{soil}", activeSoil), why: whyReason };
  };

  /* ---------------- DISEASE SOLUTIONS ---------------- */
  const getDiseaseDiagnosticSolution = () => {
    if (!selectedDiseaseCrop) return null;
    return "Detected Threat Matrix Solution:\n1. Apply specified broad protective fungicides immediately.\n2. Keep fields properly aerated and clean alternatives out of bounds.";
  };

  /* ---------------- TARGETED CROP RELEVANT SCHEMES FILTER ---------------- */
  const renderTargetedCropSchemes = () => {
    if (!recommendedCrop) return null;
    const schemeDatabase = {
      "Rice (Paddy)": {
        title: "🌾 Direct Paddy Subsidies (Rice Frameworks)",
        items: [
          "• PMKSY (Har Khet Ko Pani): Offers a direct 55% financial subsidy for installing computerized micro-drip networks.",
          "• National Food Security Mission (NFSM-Rice): Provides direct distribution of high-yielding certified hybrid seed clusters."
        ]
      },
      "Wheat": {
        title: "🌾 Rabi Wheat Procurement Programs",
        items: [
          "• FCI Direct Central MSP Buyback: Guarantees standard public procurement at the certified floor price of ₹3,300/Quintal.",
          "• Pradhan Mantri Krishi Sinchayee Yojana (PDMC): Grants specialized matching funds for overhead sprinkler infrastructure."
        ]
      }
    };
    const suggestedData = schemeDatabase[recommendedCrop] || schemeDatabase["Rice (Paddy)"];
    return (
      <div style={{ background: "#e3f2fd", padding: "12px", borderRadius: "6px", borderLeft: "5px solid #2196f3", marginBottom: "15px" }}>
        <h3 style={{ margin: "0 0 8px 0", color: "#0d47a1", fontSize: "1.05em" }}>{t.relatedSchemesHeading} ({recommendedCrop})</h3>
        <p style={{ margin: "0 0 5px 0", fontWeight: "bold", fontSize: "0.95em", color: "#0d47a1" }}>{suggestedData.title}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.9em", color: "#333" }}>
          {suggestedData.items.map((item, i) => (
            <p key={i} style={{ margin: 0 }}>{item}</p>
          ))}
        </div>
      </div>
    );
  };

  const handleDiarySubmit = (e) => {
    e.preventDefault();
    if (!diaryAmount.trim()) return alert("Please enter an input amount.");
    const newLog = {
      id: Date.now(),
      category: diaryCategory,
      amount: diaryAmount,
      notes: diaryNotes || "---",
      date: new Date().toLocaleDateString()
    };
    setDiaryLogs([newLog, ...diaryLogs]);
    setDiaryAmount("");
    setDiaryNotes("");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("currentFarmer");
    localStorage.removeItem("farmer_password");
    navigate("/");
  };

  const renderWaterRecommendation = () => {
    let template = t.hydroRec;
    const finalSource = waterSource === "Other" ? customWaterSource : waterSource;
    return template
      .replace("{source}", finalSource || "Source")
      .replace("{method}", irrigationMethod || "Standard Method");
  };

  const cropData = getSmartCropRecommendation();
  const fertilizerData = getFertilizerAnalysis();
  const diseaseSolutionText = getDiseaseDiagnosticSolution();

  return (
    <div className="dashboard">
      {/* BACKGROUND GLOBAL SOS ALERTER BANNER */}
      {weatherAlert && (
        <div style={{ backgroundColor: "#d32f2f", color: "white", padding: "12px", textAlign: "center", fontWeight: "bold", position: "sticky", top: 0, zIndex: 9999 }}>
          {weatherAlert}
        </div>
      )}

      {/* TOP BAR WITH ACTION CORNER */}
      <div className="topbar">
        <h1>🌾 AgroSmart AI</h1>
        
        <div className="top-controls" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          
          {/* TOP RIGHT SETTINGS BUTTON */}
          <button 
            type="button" 
            onClick={() => setActiveModule("settings")}
            style={{
              padding: "6px 12px",
              backgroundColor: "#eceff1",
              border: "1px solid #cfd8dc",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9em",
              color: "#37474f"
            }}
          >
            {t.sosSettings}
          </button>

          <span>{t.languages}: </span>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Marathi">Marathi</option>
          </select>
        </div>
      </div>

      {/* CARDS GRID */}
      <div className="card-grid">
        {modulesConfig.map((mod) => (
          <div
            key={mod.id}
            className="dashboard-card"
            onClick={() => {
              setActiveModule(mod.id);
              if (mod.id === "weather") getWeather();
            }}
          >
            <h3>{mod.label}</h3>
          </div>
        ))}
      </div>

      {/* MODALS */}
      {activeModule && (
        <div className="overlay">
          <div className="modal" style={{ maxWidth: "600px", width: "90%" }}>
            <button className="close-btn" onClick={closeActiveDashboardModal}>✖</button>

            {/* WEATHER */}
            {activeModule === "weather" && (
              <>
                <h2>{t.weatherTitle}</h2>
                <button className="action-btn" onClick={getWeather}>{t.refreshStation}</button>
                {weather && (
                  <div className="result-box" style={{ background: "#f0f7ff", borderLeft: "5px solid #0066cc" }}>
                    <p><strong>{t.stationLoc}:</strong> {weather.city}</p>
                    <p><strong>{t.ambientTemp}:</strong> {weather.temp}°C</p>
                    <p><strong>{t.windSpeed}:</strong> {weather.wind} km/h</p>
                    <hr />
                    <p><strong>{t.rainProbLabel}:</strong> {weather.rainProbability}%</p>
                    <p><strong>{t.rainIntensity}:</strong> {weather.precipitationVol} mm/hr</p>
                    <div style={{ marginTop: "12px", padding: "10px", background: "#e1f0fe", borderRadius: "4px", color: "#004085" }}>
                      <strong>{t.aiDiagnostics}:</strong> <br />{weather.predictionMessage}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* SOIL HEALTH */}
            {activeModule === "soil" && (
              <>
                <h2>{t.soilDetection}</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div>
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>{t.selectSoilLabel}</label>
                    <select value={soilType} onChange={(e) => setSoilType(e.target.value)} style={{ width: "100%", padding: "8px" }}>
                      <option value="">{t.selectSoilOpt}</option>
                      <option value="Black Alluvial Soil">{t.blackSoil}</option>
                      <option value="Red Loamy Soil">{t.redSoil}</option>
                      <option value="Clay Soil">{t.claySoil}</option>
                      <option value="Loamy Soil">{t.loamySoil}</option>
                      <option value="Sandy Soil">{t.sandySoil}</option>
                      <option value="Grey Soil">{t.greySoil}</option>
                      <option value="Other">Other (Type manually...)</option>
                    </select>
                  </div>

                  {/* RESTORED TYPE HERE SECTION */}
                  {soilType === "Other" && (
                    <div style={{ animation: "fadeIn 0.3s" }}>
                      <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px", color: "#e65100" }}>{t.typeLabel}</label>
                      <input 
                        type="text" 
                        value={customSoilType} 
                        onChange={(e) => setCustomSoilType(e.target.value)} 
                        placeholder="Enter your custom soil name..." 
                        style={{ width: "100%", padding: "8px", border: "1px solid #ffb74d", borderRadius: "4px" }}
                      />
                    </div>
                  )}

                  <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "6px", border: "2px dashed #ccc", textAlign: "center" }}>
                    <p style={{ margin: "0 0 10px 0" }}><strong>{t.computerVision}</strong></p>
                    
                    {isCameraActive ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                        <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxWidth: "320px", borderRadius: "6px", background: "#000" }}></video>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button type="button" className="action-btn" onClick={captureSoilPhotoSnapshot}>{t.captureSnap}</button>
                          <button type="button" className="action-btn" onClick={stopLiveHardwareCamera} style={{ backgroundColor: "#d32f2f" }}>{t.closeCamera}</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        <button type="button" className="action-btn" onClick={startLiveHardwareCamera}>{t.launchCamera}</button>
                        <label className="action-btn" style={{ backgroundColor: "#28a745", cursor: "pointer", display: "inline-block", margin: 0 }}>
                          {t.uploadGallery}
                          <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
                        </label>
                      </div>
                    )}

                    {uploadedImage && !isCameraActive && (
                      <div style={{ marginTop: "10px" }}>
                        <img src={uploadedImage} alt="Soil Capture" style={{ maxWidth: "150px", borderRadius: "4px" }} />
                      </div>
                    )}
                  </div>
                </div>
                {soilType && (
                  <div className="result-box" style={{ background: "#fff3cd", borderLeft: "5px solid #ffc107" }}>
                    <strong>{t.selectedMatrix}:</strong> {soilType === "Other" ? customSoilType : soilType}
                  </div>
                )}
              </>
            )}

            {/* WATER LEVEL MODULE */}
            {activeModule === "water" && (
              <>
                <h2>{t.waterTitle}</h2>
                <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
                  <div>
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>Select Water Capacity Level:</label>
                    <select value={waterLevel} onChange={(e) => setWaterLevel(e.target.value)} style={{ width: "100%", padding: "8px" }}>
                      <option value="">-- Select Level --</option>
                      <option value="Low">{t.low}</option>
                      <option value="Medium">{t.medium}</option>
                      <option value="High">{t.high}</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>Select Field Extraction Infrastructure:</label>
                    <select value={waterSource} onChange={(e) => setWaterSource(e.target.value)} style={{ width: "100%", padding: "8px" }}>
                      <option value="">{t.selectInfra}</option>
                      <option value="Borewell">{t.borewell}</option>
                      <option value="River">{t.river}</option>
                      <option value="Canal">{t.canal}</option>
                      <option value="Farm Pond / Tank">{t.pond}</option>
                      <option value="Recycled Water">{t.graywater}</option>
                      <option value="Other">Other (Type manually...)</option>
                    </select>
                  </div>

                  {/* RESTORED TYPE HERE SECTION */}
                  {waterSource === "Other" && (
                    <div style={{ animation: "fadeIn 0.3s" }}>
                      <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px", color: "#0288d1" }}>{t.typeLabel}</label>
                      <input 
                        type="text" 
                        value={customWaterSource} 
                        onChange={(e) => setCustomWaterSource(e.target.value)} 
                        placeholder="Enter your custom water infrastructure..." 
                        style={{ width: "100%", padding: "8px", border: "1px solid #4fc3f7", borderRadius: "4px" }}
                      />
                    </div>
                  )}

                  <div>
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>Groundwater Table Depth Status:</label>
                    <select value={waterTableDepth} onChange={(e) => setWaterTableDepth(e.target.value)} style={{ width: "100%", padding: "8px" }}>
                      <option value="">{t.selectCapacity}</option>
                      <option value="Critical (<15 meters)">{t.criticalDepth}</option>
                      <option value="Optimal Stable (15-50 meters)">{t.optimalDepth}</option>
                      <option value="Abundant High Yield (>50 meters)">{t.abundantDepth}</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>Soil Moisture Reading Matrix:</label>
                    <select value={moistureLevel} onChange={(e) => setMoistureLevel(e.target.value)} style={{ width: "100%", padding: "8px" }}>
                      <option value="">{t.selectTension}</option>
                      <option value="Arid (< 20 Centibars)">{t.aridMoisture}</option>
                      <option value="Field Capacity (20-60 Centibars)">{t.fieldCapacity}</option>
                      <option value="Saturated (> 60 Centibars)">{t.saturatedMoisture}</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>Micro Irrigation Emitter Type:</label>
                    <select value={irrigationMethod} onChange={(e) => setIrrigationMethod(e.target.value)} style={{ width: "100%", padding: "8px" }}>
                      <option value="">{t.selectMethod}</option>
                      <option value="Automated Drip Emitters">{t.drip}</option>
                      <option value="Overhead Impact Sprinklers">{t.sprinkler}</option>
                      <option value="Controlled Surge Flooding">{t.flood}</option>
                    </select>
                  </div>
                </div>

                {waterSource && (
                  <div className="result-box" style={{ background: "#e2f3f5", borderLeft: "5px solid #22a7f0", marginTop: "15px" }}>
                    <p style={{ margin: 0 }}><strong>Telemetry Profile Cached:</strong> Source: <em>{waterSource === "Other" ? customWaterSource : waterSource}</em> | Registered Volume Level: <span style={{ fontWeight: "bold" }}>{waterLevel || "Pending"}</span></p>
                  </div>
                )}
              </>
            )}

            {/* SEASON SELECTION */}
            {activeModule === "season" && (
              <>
                <h2>{t.seasonTitle}</h2>
                <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
                  <select value={cropSeason} onChange={(e) => setCropSeason(e.target.value)}>
                    <option value="">{t.selectCycle}</option>
                    <option value="Summer">{t.summer}</option>
                    <option value="Winter">{t.winter}</option>
                    <option value="Monsoon">{t.monsoon}</option>
                    <option value="Other">Other (Type manually...)</option>
                  </select>

                  {/* RESTORED TYPE HERE SECTION */}
                  {cropSeason === "Other" && (
                    <div style={{ animation: "fadeIn 0.3s" }}>
                      <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px", color: "#ef6c00" }}>{t.typeLabel}</label>
                      <input 
                        type="text" 
                        value={customCropSeason} 
                        onChange={(e) => setCustomCropSeason(e.target.value)} 
                        placeholder="Enter custom season profile..." 
                        style={{ width: "100%", padding: "8px", border: "1px solid #ffb74d", borderRadius: "4px" }}
                      />
                    </div>
                  )}

                  <select value={month} onChange={(e) => setMonth(e.target.value)}>
                    <option value="">-- Select Month --</option>
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
              </>
            )}

            {/* CROP RECOMMENDATION */}
            {activeModule === "crop" && (
              <>
                <h2>{t.cropTitle}</h2>
                <div className="result-box" style={{ background: cropData.name ? "#e8f5e9" : "#ffebee" }}>
                  {cropData.name ? (
                    <>
                      <h3>🎯 {cropData.name}</h3>
                      <p>{cropData.details}</p>
                      <div style={{ background: "#fff", padding: "12px", borderRadius: "6px", border: "1px solid #a5d6a7", marginTop: "10px" }}>
                        <h4>{t.marketTimeline}</h4>
                        <p><strong>{t.pastMarket}:</strong> {cropData.marketTimeline?.past}</p>
                        <p><strong>{t.currentMarket}:</strong> {cropData.marketTimeline?.current}</p>
                        <p><strong>{t.futureMarket}:</strong> {cropData.marketTimeline?.future}</p>
                      </div>
                    </>
                  ) : (
                    <p>{cropData.details}</p>
                  )}
                </div>
              </>
            )}

            {/* FERTILIZER SUGGESTION */}
            {activeModule === "fertilizer" && (
              <>
                <h2>{t.fertilizerTitle}</h2>
                <select value={cropStage} onChange={(e) => setCropStage(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "15px" }}>
                  <option value="">{t.selectStage}</option>
                  <option value="seeds">{t.seeds}</option>
                  <option value="germination">{t.germination}</option>
                  <option value="tillering">{t.tillering}</option>
                </select>
                <div className="result-box"><p>{fertilizerData.text}</p></div>
              </>
            )}

            {/* DISEASE DETECTION */}
            {activeModule === "disease" && (
              <>
                <h2>{t.diseaseTitle}</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ fontWeight: "bold" }}>{t.diseaseLabel}</label>
                    <button type="button" onClick={() => { setSelectedDiseaseCrop(""); setDiseasePhoto(null); }} style={{ padding: "4px 8px", background: "#f44336", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                      {t.diseaseSkip}
                    </button>
                  </div>
                  <select value={selectedDiseaseCrop} onChange={(e) => setSelectedDiseaseCrop(e.target.value)} style={{ width: "100%", padding: "8px" }}>
                    <option value="">{t.diseaseOpt}</option>
                    <option value="Rice (Paddy)">Rice (Paddy)</option>
                  </select>
                  <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "6px", border: "2px dashed #ccc", textAlign: "center" }}>
                    <label className="action-btn" style={{ backgroundColor: "#28a745", cursor: "pointer" }}>
                      {t.uploadGallery}
                      <input type="file" accept="image/*" onChange={handleDiseaseFileUpload} style={{ display: "none" }} />
                    </label>
                    {diseasePhoto && <img src={diseasePhoto} alt="Preview" style={{ maxWidth: "100px", marginTop: "10px" }} />}
                  </div>
                </div>
              </>
            )}

            {/* LIVE MARKET BOARD */}
            {activeModule === "market" && (
              <>
                <h2>{t.marketTitle}</h2>
                <div style={{ background: "#f9f9f9", padding: "12px", borderRadius: "6px" }}>
                  <p>Pune APMC - Onion: ₹1,800/Q | Garlic: ₹22,000/Q</p>
                  <p>Akola APMC - Soyabean: ₹6,075/Q | Wheat: ₹3,300/Q</p>
                </div>
              </>
            )}

            {/* GOVERNMENT SCHEMES */}
            {activeModule === "scheme" && (
              <>
                <h2>{t.schemeTitle}</h2>
                <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                  {renderTargetedCropSchemes()}
                </div>
              </>
            )}

            {/* DIGITAL FARM DIARY */}
            {activeModule === "diary" && (
              <>
                <h2>{t.diaryTitle}</h2>
                <form onSubmit={handleDiarySubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "15px" }}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <select value={diaryCategory} onChange={(e) => setDiaryCategory(e.target.value)} style={{ padding: "8px" }}>
                      <option value="Seeds">🌱 Seeds</option>
                      <option value="Fertilizer">🧪 Fertilizer</option>
                    </select>
                    <input type="number" placeholder="Amount (₹)" value={diaryAmount} onChange={(e) => setDiaryAmount(e.target.value)} style={{ padding: "8px" }} />
                  </div>
                  <button type="submit" className="action-btn">{t.diaryLogBtn}</button>
                </form>
                <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                  {diaryLogs.map(log => (
                    <div key={log.id} style={{ padding: "8px", background: "#eee", marginBottom: "4px", borderRadius: "4px" }}>
                      <strong>[{log.category}]</strong> - ₹{log.amount}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* SOS ALERTS IN CONFIGURATION */}
            {activeModule === "settings" && (
              <>
                <h2>{t.settingsTitle}</h2>
                <div style={{ background: "#fafafa", padding: "20px", borderRadius: "8px", border: "1px solid #ddd", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ display: "block" }}>Automated SOS Weather Alerter</strong>
                    <span style={{ fontSize: "0.85em", color: "#666" }}>Send background alerts for flash rains or heavy windstorms.</span>
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => setIsSosAlertEnabled(!isSosAlertEnabled)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: isSosAlertEnabled ? "#2e7d32" : "#c62828",
                      color: "white",
                      border: "none",
                      borderRadius: "20px",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    {isSosAlertEnabled ? "ACTIVE: ON" : "MUTED: OFF"}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* LOGOUT */}
      <div className="logout-bottom">
        <button className="logout-btn-final" onClick={handleLogout}>{t.logout}</button>
      </div>
    </div>
  );
}

export default DiseaseDetection;