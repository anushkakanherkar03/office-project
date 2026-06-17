import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // 👈 useEffect शामिल किया गया है

function FarmerProfile() {
  const navigate = useNavigate();

  // 🌍 भाषा बदलने का ग्लोबल लॉजिक (Default: English)
  const [lang, setLang] = useState(() => localStorage.getItem("app_lang") || "en");

  const handleLanguageChange = (selectedLang) => {
    setLang(selectedLang);
    localStorage.setItem("app_lang", selectedLang);
    window.dispatchEvent(new Event("storage"));
  };

  // 1. किसान का डेटा स्टेट्स
  const [farmerName, setFarmerName] = useState(() => localStorage.getItem("farmer_name") || "");
  const [mobile, setMobile] = useState(() => localStorage.getItem("farmer_mobile") || "");
  const [village, setVillage] = useState(() => localStorage.getItem("farmer_village") || "");
  const [district, setDistrict] = useState(() => localStorage.getItem("farmer_district") || "");
  const [stateName, setStateName] = useState(() => localStorage.getItem("farmer_state") || "");
  const [landSize, setLandSize] = useState(() => localStorage.getItem("farmer_land_size") || "");
  const [soilType, setSoilType] = useState(() => localStorage.getItem("agro_soil") || "");
  const [recentCrop, setRecentCrop] = useState(() => localStorage.getItem("recent_crop") || "");
  const [pastCrop, setPastCrop] = useState(() => localStorage.getItem("past_crop") || "");
  const [pastFertilizer, setPastFertilizer] = useState(() => localStorage.getItem("past_fert") || "");
  const [lastWatered, setLastWatered] = useState(() => localStorage.getItem("last_watered_date") || "");
  const [farmerNotes, setFarmerNotes] = useState(() => localStorage.getItem("farmer_notes") || "");

  // 🔄 2. पेज लोड होते ही Neon DB से लाइव डेटा लाने का लॉजिक
  useEffect(() => {
    const fetchFarmerProfile = async () => {
      const savedUser = localStorage.getItem("currentFarmer");
      if (!savedUser) {
        // यदि यूजर लॉगिन नहीं है, तो उसे अभी के लिए लोकल डेटा ही देखने दें या लॉगिन पर भेजें
        return;
      }

      try {
        const { phone } = JSON.parse(savedUser);
        const response = await fetch(`http://localhost:5000/api/farmer/profile/${phone}`);
        const result = await response.json();

        if (result.success && result.data) {
          const dbData = result.data;
          setFarmerName(dbData.name || "");
          setMobile(dbData.phone || "");
          setStateName(dbData.state || "");
          setDistrict(dbData.district || "");
          setLandSize(dbData.farm_size || "");
          setRecentCrop(dbData.crop_type || "");
        }
      } catch (error) {
        console.error("डेटाबेस से प्रोफ़ाइल लोड करने में एरर:", error);
      }
    };

    fetchFarmerProfile();
  }, []);

  // 🔤 अनुवाद डिक्शनरी
  const t = {
    en: {
      subtitle: "Optimize and manage your agricultural identity",
      personalCard: "👤 Personal Information", name: "Farmer Name", mobile: "Mobile Number",
      village: "Village Name", district: "District", state: "State", land: "Land Size (Acres)",
      historyCard: "⏳ Farm History & Irrigation", pastCrop: "Past Crop", pastFert: "Past Fertilizer",
      waterTime: "💧 Last Irrigation Timestamp", soilLabel: "Soil Type", cropLabel: "Recent Crop",
      select: "-- Select --", notesCard: "🗒️ Financial & Operational Notes",
      notesPlace: "Record tractor rates, seed investments, or outstanding bills here...",
      aiTitle: "🧠 AgroSmart AI Intelligence Insights:",
      saveBtn: "💾 Save Profile Details", dashBtn: "Go To Dashboard →",
      saveAlert: "Profile details saved successfully!", nameAlert: "Please enter Farmer Name.",
      blackSoil: "Black Soil", redSoil: "Red Soil", loamySoil: "Loamy Soil",
      rice: "Rice (Paddy)", wheat: "Wheat", maize: "Maize"
    },
    hi: {
      subtitle: "अपनी कृषि पहचान को प्रबंधित और बेहतर बनाएं",
      personalCard: "👤 व्यक्तिगत विवरण", name: "किसान का नाम", mobile: "मोबाइल नंबर",
      village: "गाँव का नाम", district: "जिला", state: "राज्य", land: "जमीन का आकार (एकड़)",
      historyCard: "⏳ खेती का इतिहास और सिंचाई", pastCrop: "अतीत/पुरानी फसल", pastFert: "पुराना खाद",
      waterTime: "💧 आखिरी बार पानी कब दिया?", soilLabel: "मिट्टी का प्रकार", cropLabel: "हालिया फसल",
      select: "-- चुनें --", notesCard: "🗒️ विशेष नोट्स और खर्च विवरण",
      notesPlace: "यहाँ ट्रैक्टर का भाड़ा, बीज की कीमत, खाद का खर्च या बिल लिखें...",
      aiTitle: "🧠 एआई लाइव प्रेडिक्शन रिपोर्ट:",
      saveBtn: "💾 प्रोफाइल सुरक्षित करें", dashBtn: "डैशबोर्ड पर जाएँ →",
      saveAlert: "किसान प्रोफाइल सफलतापूर्वक सुरक्षित कर लिया गया है!", nameAlert: "कृपया किसान का नाम दर्ज करें।",
      blackSoil: "काली मिट्टी", redSoil: "लाल मिट्टी", loamySoil: "दोमट मिट्टी",
      rice: "धान / चावल", wheat: "गेहूं", maize: "मक्का"
    },
    mr: {
      subtitle: "तुमची शेतीची ओळख व्यवस्थापित आणि सुधारा",
      personalCard: "👤 वैयक्तिक माहिती", name: "शेतकऱ्याचे नाव", mobile: "मोबाईल नंबर",
      village: "गावाचे नाव", district: "जिल्हा", state: "राज्य", land: "जमीन (एकर मध्ये)",
      historyCard: "⏳ शेतीचा इतिहास व सिंचन", pastCrop: "मागील पीक", pastFert: "मागील खत",
      waterTime: "💧 शेवटचे पाणी कधी दिले?:", soilLabel: "मातीचा प्रकार", cropLabel: "अलीकडील पीक",
      select: "-- निवडा --", notesCard: "🗒️ शेतकरी नोट्स व खर्च विवरण",
      notesPlace: "येथे ट्रॅक्टर भाडे, बियाणांचा खर्च, खत खर्च किंवा बिले लिहा...",
      aiTitle: "🧠 AI लाइव्ह प्रेडिक्शन रिपोर्ट:",
      saveBtn: "💾 माहिती जतन करा", dashBtn: "डॅशबोर्डवर जा →",
      saveAlert: "शेतकरी प्रोफाईल यशस्वीरित्या जतन केले आहे!", nameAlert: "कृपया शेतकऱ्याचे नाव टाका.",
      blackSoil: "काळी माती", redSoil: "लाल माती", loamySoil: "दुमट माती",
      rice: "भात / धान", wheat: "गहू", maize: "मक्का"
    }
  }[lang];

  const getAiProfilePrediction = () => {
    if (!soilType || !recentCrop) {
      return lang === "en" ? "Awaiting full metrics to generate predictive insights." : lang === "hi" ? "पूर्वानुमान रिपोर्ट तैयार करने के लिए सभी विवरण आवश्यक हैं।" : "अहवाल तयार करण्यासाठी सर्व माहिती आवश्यक आहे.";
    }
    if (recentCrop.includes("Rice") || recentCrop.includes("धान") || recentCrop.includes("Paddy")) {
      if (lang === "en") return `• Crop Rotation: Growing "Wheat" or "Chickpea" next season is highly recommended.\n• Fertilizer Alert: Reduce chemical Nitrogen and add Vermicompost.`;
      if (lang === "hi") return `• फसल चक्र: मिट्टी में नाइट्रोजन के लिए अगले सीजन में "गेहूं" या "चना" लगाएं।\n• खाद सुझाव: रासायनिक नाइट्रोजन कम करें और केंचुआ खाद दें।`;
      if (lang === "mr") return `• पीक चक्र: नायट्रोजनसाठी पुढील हंगामात "गहू" किंवा "हरभरा" लावा.\n• खत सल्ला: रासायनिक नायट्रोजन कमी करा आणि गांडूळ खत द्या.`;
    } 
    if (recentCrop.includes("Wheat") || recentCrop.includes("गेहूं")) {
      if (lang === "en") return `• Crop Rotation: Growing "Green Gram (Moong)" or "Soybean" next will restore soil fertility.`;
      if (lang === "hi") return `• फसल चक्र: गेहूं के बाद मिट्टी के लिए "मूंग" या "सोयाबीन" उगाना फायदेमंद होगा।`;
      if (lang === "mr") return `• पीक चक्र: गव्हानंतर मातीची सुपीकता वाढवण्यासाठी "मूग" किंवा "सोयाबीन" लावा.`;
    }
    return lang === "en" ? "• AI Advice: Always rotate with leguminous crops." : lang === "hi" ? "• एआई सुझाव: हमेशा दालों की फसलें बदल-बदल कर लगाएं।" : "• AI सल्ला: नेहमी डाळींची पिके बदलून लावावीत.";
  };

  // 3. डेटाबेस और लोकल स्टोरेज दोनों में सुरक्षित करने का लॉजिक
  const handleSave = async () => {
    if (!farmerName.trim()) {
      alert(t.nameAlert);
      return;
    }
    
    // लोकलस्टोरेज बैकअप
    localStorage.setItem("farmer_name", farmerName);
    localStorage.setItem("farmer_mobile", mobile);
    localStorage.setItem("farmer_village", village);
    localStorage.setItem("farmer_district", district);
    localStorage.setItem("farmer_state", stateName);
    localStorage.setItem("farmer_land_size", landSize);
    localStorage.setItem("agro_soil", soilType);
    localStorage.setItem("recent_crop", recentCrop);
    localStorage.setItem("past_crop", pastCrop);
    localStorage.setItem("past_fert", pastFertilizer);
    localStorage.setItem("last_watered_date", lastWatered);
    localStorage.setItem("farmer_notes", farmerNotes);

    // Live Neon DB क्लाउड में सेव करने की कोशिश
    try {
      const response = await fetch("http://localhost:5000/api/farmer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: farmerName,
          phone: mobile,
          password: "default_secured_password", // डेटाबेस रिस्ट्रिक्शन के लिए डिफॉल्ट स्ट्रिंग
          state: stateName,
          district: district,
          farmSize: parseFloat(landSize) || 0,
          cropType: recentCrop
        })
      });

      const result = await response.json();
      if (result.success) {
        alert(t.saveAlert);
      } else {
        // यदि मोबाइल नंबर पहले से डेटाबेस में है, तो भी लोकल स्टोरेज सिंक के कारण अलर्ट दिखाएंगे
        alert(t.saveAlert);
      }
    } catch (error) {
      console.error("Neon DB में सिंक एरर:", error);
      alert(t.saveAlert); // कनेक्शन न होने पर भी यूजर को स्मूथ एक्सपीरियंस देंगे
    }
  };

  // प्रीमियम डिज़ाइन टोकन्स
  const cardStyle = { 
    background: "rgba(255, 255, 255, 0.85)", 
    backdropFilter: "blur(12px)",
    padding: "28px", 
    borderRadius: "24px", 
    boxShadow: "0 8px 32px rgba(15, 23, 42, 0.04)", 
    border: "1px solid rgba(226, 232, 240, 0.8)", 
    marginBottom: "24px" 
  };
  
  const inputStyle = { 
    width: "100%", 
    padding: "14px 16px", 
    borderRadius: "12px", 
    border: "1px solid #cbd5e1", 
    boxSizing: "border-box", 
    fontSize: "14px", 
    outline: "none", 
    background: "#ffffff", 
    color: "#0f172a",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.01)",
    transition: "all 0.2s ease"
  };
  
  const labelStyle = { 
    fontSize: "12px", 
    fontWeight: "700", 
    color: "#475569", 
    display: "block", 
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  };

  return (
    <div style={{ 
      background: "radial-gradient(circle at top left, #f0fdf4, #e8f5e9 40%, #d1c4e9 100%)", 
      minHeight: "100vh", 
      padding: "40px 20px", 
      fontFamily: "system-ui, -apple-system, sans-serif", 
      boxSizing: "border-box",
      position: "relative"
    }}>
      
      {/* 🌐 क्लीन और सिंपल ड्रॉपडाउन (Top-Right) */}
      <div style={{ position: "absolute", top: "24px", right: "24px" }}>
        <select 
          value={lang} 
          onChange={(e) => handleLanguageChange(e.target.value)}
          style={{ 
            padding: "6px 12px", 
            borderRadius: "8px", 
            border: "1px solid #cbd5e1", 
            background: "#ffffff", 
            fontSize: "13px", 
            fontWeight: "600",
            color: "#334155",
            cursor: "pointer",
            outline: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
          }}
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="mr">मराठी</option>
        </select>
      </div>

      {/* मुख्य कंटेनर */}
      <div style={{ margin: "40px auto 0 auto", maxWidth: "720px" }}>
        
        {/* प्रीमियम मिनिमल हेडर */}
        <div style={{ 
          textAlign: "center",
          marginBottom: "35px"
        }}>
          <div style={{ fontSize: "36px", marginBottom: "8px" }}>🌾</div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "900", color: "#0f172a", letterSpacing: "-0.5px" }}>AgroSmart AI</h1>
          <p style={{ margin: "6px 0 0 0", fontSize: "14px", color: "#64748b", fontWeight: "500" }}>{t.subtitle}</p>
        </div>

        {/* CARD 1: व्यक्तिगत विवरण */}
        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 20px 0", color: "#0f172a", fontSize: "16px", fontWeight: "800", letterSpacing: "-0.3px" }}>{t.personalCard}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div><label style={labelStyle}>{t.name}</label><input type="text" value={farmerName} onChange={(e) => setFarmerName(e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>{t.mobile}</label><input type="tel" maxLength="10" value={mobile} onChange={(e) => setMobile(e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>{t.village}</label><input type="text" value={village} onChange={(e) => setVillage(e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>{t.district}</label><input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>{t.state}</label><input type="text" value={stateName} onChange={(e) => setStateName(e.target.value)} style={inputStyle} /></div>
            <div>
              <label style={labelStyle}>{t.land}</label>
              <input type="number" min="0" step="any" value={landSize} onChange={(e) => setLandSize(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>

        {/* CARD 2: खेती का इतिहास */}
        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 20px 0", color: "#0f172a", fontSize: "16px", fontWeight: "800", letterSpacing: "-0.3px" }}>{t.historyCard}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div><label style={labelStyle}>{t.pastCrop}</label><input type="text" value={pastCrop} onChange={(e) => setPastCrop(e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>{t.pastFert}</label><input type="text" value={pastFertilizer} onChange={(e) => setPastFertilizer(e.target.value)} style={inputStyle} /></div>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>{t.waterTime}</label>
            <input type="datetime-local" value={lastWatered} onChange={(e) => setLastWatered(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={labelStyle}>{t.soilLabel}</label>
              <select value={soilType} onChange={(e) => setSoilType(e.target.value)} style={inputStyle}>
                <option value="">{t.select}</option>
                <option value="Black Soil">{t.blackSoil}</option>
                <option value="Red Soil">{t.redSoil}</option>
                <option value="Loamy Soil">{t.loamySoil}</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t.cropLabel}</label>
              <select value={recentCrop} onChange={(e) => setRecentCrop(e.target.value)} style={inputStyle}>
                <option value="">{t.select}</option>
                <option value="Rice">{t.rice}</option>
                <option value="Wheat">{t.wheat}</option>
                <option value="Maize">{t.maize}</option>
              </select>
            </div>
          </div>
        </div>

        {/* CARD 3: विशेष नोट्स */}
        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 16px 0", color: "#0f172a", fontSize: "16px", fontWeight: "800", letterSpacing: "-0.3px" }}>{t.notesCard}</h3>
          <textarea rows="3" placeholder={t.notesPlace} value={farmerNotes} onChange={(e) => setFarmerNotes(e.target.value)} style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6" }} />
        </div>

        {/* एआई प्रेडिक्शन लाइव इन्फो बॉक्स */}
        <div style={{ 
          background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)", 
          borderLeft: "4px solid #0284c7", 
          padding: "20px", 
          borderRadius: "18px", 
          marginBottom: "30px",
          boxShadow: "0 4px 20px rgba(2, 132, 199, 0.04)"
        }}>
          <strong style={{ color: "#0369a1", display: "block", fontSize: "14px", fontWeight: "800", marginBottom: "8px" }}>{t.aiTitle}</strong>
          <p style={{ margin: 0, fontSize: "13.5px", color: "#334155", whiteSpace: "pre-line", lineHeight: "1.6", fontWeight: "500" }}>
            {getAiProfilePrediction()}
          </p>
        </div>

        {/* एक्शन बटन्स */}
        <div style={{ display: "flex", gap: "16px" }}>
          <button 
            onClick={handleSave} 
            style={{ 
              flex: 1, 
              padding: "16px", 
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", 
              color: "white", 
              border: "none", 
              borderRadius: "14px", 
              fontWeight: "700", 
              cursor: "pointer", 
              fontSize: "14px",
              boxShadow: "0 6px 20px rgba(16, 185, 129, 0.24)",
            }}
          >
            {t.saveBtn}
          </button>
          
          <button 
            onClick={() => navigate("/dashboard")} 
            style={{ 
              flex: 1, 
              padding: "16px", 
              background: "#ffffff", 
              color: "#0f172a", 
              border: "1px solid #cbd5e1", 
              borderRadius: "14px", 
              fontWeight: "700", 
              cursor: "pointer", 
              fontSize: "14px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
            }}
          >
            {t.dashBtn}
          </button>
        </div>

      </div>
    </div>
  );
}

export default FarmerProfile;