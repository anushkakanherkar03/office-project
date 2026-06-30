import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS
   Palette: Field Green #3A7D44 | Wheat Gold #C8922A | Sky #4A90A4
            Soil Dark #2C1A0E | Page Cream #FEFCF8 | Card White #FFFFFF
   Signature: warm "farm gate nameplate" header with lift-card profile
───────────────────────────────────────────────────────────────────────────── */

const G = {
  green: "#3A7D44",
  greenDark: "#2A5E32",
  greenLight: "#E8F5EB",
  gold: "#C8922A",
  goldLight: "#FDF3E0",
  sky: "#4A90A4",
  skyLight: "#E4F2F6",
  soil: "#2C1A0E",
  cream: "#FEFCF8",
  white: "#FFFFFF",
  textDark: "#1A1A1A",
  textMid: "#555555",
  textLight: "#888888",
  border: "#DDDDDD",
  borderLight: "#EEEEEE",
  red: "#C0392B",
  redLight: "#FDECEA",
  orange: "#E67E22",
  orangeLight: "#FEF0E0",
};

const S = {
  page: {
    background: G.cream,
    minHeight: "100vh",
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    color: G.textDark,
    paddingBottom: 60,
  },
  header: {
    background: `linear-gradient(135deg, ${G.soil} 0%, #4A2E1A 60%, #3A7D44 100%)`,
    padding: "28px 20px 80px",
    position: "relative",
    overflow: "hidden",
  },
  headerPattern: {
    position: "absolute", inset: 0, opacity: 0.06,
    backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
    backgroundSize: "12px 12px",
    pointerEvents: "none",
  },
  headerTop: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 1,
  },
  appName: {
    color: G.white, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em",
    textTransform: "uppercase", opacity: 0.7,
  },
  backBtn: {
    background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
    color: G.white, padding: "8px 16px", borderRadius: 8, fontSize: 13,
    fontWeight: 600, cursor: "pointer",
  },
  body: { maxWidth: 680, margin: "0 auto", padding: "0 16px" },
  profileLift: {
    background: G.white,
    borderRadius: 20,
    boxShadow: "0 4px 24px rgba(44,26,14,0.10)",
    marginTop: -56,
    padding: "24px 24px 28px",
    position: "relative",
    border: `1px solid ${G.borderLight}`,
  },
  card: {
    background: G.white,
    borderRadius: 20,
    boxShadow: "0 2px 12px rgba(44,26,14,0.06)",
    border: `1px solid ${G.borderLight}`,
    overflow: "hidden",
    marginTop: 20,
  },
  cardHead: {
    padding: "18px 24px 16px",
    borderBottom: `1px solid ${G.borderLight}`,
    display: "flex", alignItems: "center", gap: 12,
  },
  cardHeadIcon: {
    width: 40, height: 40, borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20, flexShrink: 0,
  },
  cardHeadTitle: { fontSize: 18, fontWeight: 700, color: G.textDark },
  cardHeadSub: { fontSize: 13, color: G.textLight, marginTop: 2 },
  cardBody: { padding: "22px 24px 26px" },
  fieldGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px" },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: {
    fontSize: 12, fontWeight: 700, color: G.textMid,
    textTransform: "uppercase", letterSpacing: "0.07em",
  },
  input: {
    padding: "13px 14px", borderRadius: 10, fontSize: 15,
    border: `1.5px solid ${G.border}`, background: G.white,
    color: G.textDark, outline: "none", fontFamily: "inherit",
    transition: "border-color 0.15s, box-shadow 0.15s",
    width: "100%", boxSizing: "border-box",
  },
  inputReadonly: { background: "#F8F9FA", color: G.textMid, cursor: "default" },
  select: {
    padding: "13px 14px", borderRadius: 10, fontSize: 15,
    border: `1.5px solid ${G.border}`, background: G.white,
    color: G.textDark, outline: "none", fontFamily: "inherit",
    width: "100%", boxSizing: "border-box", cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
  },
  textarea: {
    padding: "13px 14px", borderRadius: 10, fontSize: 15,
    border: `1.5px solid ${G.border}`, background: G.white,
    color: G.textDark, outline: "none", fontFamily: "inherit",
    resize: "vertical", minHeight: 90, width: "100%", boxSizing: "border-box",
  },
  btnPrimary: {
    background: G.green, color: G.white,
    border: "none", borderRadius: 12, padding: "14px 28px",
    fontSize: 15, fontWeight: 700, cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 8,
    fontFamily: "inherit", transition: "background 0.15s",
  },
  btnSecondary: {
    background: G.white, color: G.green,
    border: `2px solid ${G.green}`, borderRadius: 12, padding: "13px 28px",
    fontSize: 15, fontWeight: 700, cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 8,
    fontFamily: "inherit",
  },
  btnGold: {
    background: G.gold, color: G.white,
    border: "none", borderRadius: 12, padding: "14px 28px",
    fontSize: 15, fontWeight: 700, cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 8,
    fontFamily: "inherit",
  },
  btnDanger: {
    background: G.redLight, color: G.red,
    border: `1.5px solid #FCCCC8`, borderRadius: 10, padding: "9px 16px",
    fontSize: 13, fontWeight: 600, cursor: "pointer",
    fontFamily: "inherit", display: "inline-flex", alignItems: "center",
  },
  btnRow: { display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" },
  avatarWrap: { position: "relative", display: "inline-block", marginBottom: 16 },
  avatar: {
    width: 88, height: 88, borderRadius: "50%",
    background: `linear-gradient(135deg, ${G.green}, ${G.gold})`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 36, border: `4px solid ${G.white}`,
    boxShadow: "0 2px 12px rgba(44,26,14,0.15)",
    overflow: "hidden", cursor: "pointer",
  },
  avatarBadge: {
    position: "absolute", bottom: 2, right: 2,
    width: 26, height: 26, borderRadius: "50%",
    background: G.gold, border: `2px solid ${G.white}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, cursor: "pointer",
  },
  farmerName: { fontSize: 22, fontWeight: 800, color: G.textDark, marginBottom: 4 },
  farmerMeta: { fontSize: 14, color: G.textMid, lineHeight: 1.6 },
  progressWrap: { marginTop: 18 },
  progressLabel: {
    display: "flex", justifyContent: "space-between",
    fontSize: 12, fontWeight: 600, color: G.textMid, marginBottom: 6,
  },
  progressBg: { height: 8, background: "#EBEBEB", borderRadius: 4, overflow: "hidden" },
  progressFill: {
    height: "100%", borderRadius: 4,
    background: `linear-gradient(90deg, ${G.green}, ${G.gold})`,
    transition: "width 0.7s ease",
  },
  pill: {
    display: "inline-block", padding: "4px 12px",
    borderRadius: 20, fontSize: 12, fontWeight: 600, marginRight: 6, marginTop: 8,
  },
  tileGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 },
  tile: {
    background: G.greenLight, borderRadius: 12,
    padding: "14px 16px", borderLeft: `4px solid ${G.green}`,
  },
  tileGold: { background: G.goldLight, borderLeft: `4px solid ${G.gold}` },
  tileSky: { background: G.skyLight, borderLeft: `4px solid ${G.sky}` },
  tileOrange: { background: G.orangeLight, borderLeft: `4px solid ${G.orange}` },
  tileLabel: { fontSize: 11, fontWeight: 700, color: G.textLight, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 },
  tileValue: { fontSize: 14, color: G.textDark, lineHeight: 1.55, fontWeight: 500 },
  divider: { height: 1, background: G.borderLight, margin: "20px 0" },
  resultBox: { borderRadius: 12, padding: "16px 18px", marginBottom: 12 },
  resultLabel: { fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 },
  resultText: { fontSize: 15, lineHeight: 1.65, color: G.textDark },
  uploadZone: {
    border: `2px dashed ${G.border}`, borderRadius: 14,
    padding: "36px 20px", textAlign: "center", cursor: "pointer",
    transition: "border-color 0.15s, background 0.15s",
  },
  uploadZoneActive: { borderColor: G.green, background: G.greenLight },
  imgGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 14, marginTop: 18 },
  imgCard: {
    borderRadius: 14, overflow: "hidden", border: `1px solid ${G.borderLight}`,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)", background: G.white,
  },
  imgThumb: { width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" },
  imgMeta: { padding: "10px 12px" },
  imgName: { fontSize: 12, fontWeight: 600, color: G.textDark, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  imgDate: { fontSize: 11, color: G.textLight, marginBottom: 8 },
  toast: {
    position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
    background: G.soil, color: G.white, padding: "13px 22px",
    borderRadius: 12, fontSize: 14, fontWeight: 600,
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)", zIndex: 9999,
    display: "flex", alignItems: "center", gap: 10,
    whiteSpace: "nowrap", maxWidth: "90vw",
  },
  spinnerWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "36px 0" },
  empty: { textAlign: "center", padding: "36px 0", color: G.textLight },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyText: { fontSize: 14 },
};

const GLOBAL_CSS = `
  @keyframes fp_spin { to { transform: rotate(360deg); } }
  @keyframes fp_slidein { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  .fp-animate { animation: fp_slidein 0.35s ease; }
  .fp-spinner { width:44px; height:44px; border-radius:50%; border:4px solid #E8F5EB; border-top-color:#3A7D44; animation:fp_spin 0.85s linear infinite; }
  .fp-input:focus { border-color: #3A7D44 !important; box-shadow: 0 0 0 3px rgba(58,125,68,0.12) !important; background: #fff !important; }
  .fp-btn-green:hover { background: #2A5E32 !important; }
  .fp-btn-gold:hover  { background: #A87420 !important; }
  @media (max-width: 540px) {
    .fp-field-grid { grid-template-columns: 1fr !important; }
    .fp-tile-grid  { grid-template-columns: 1fr !important; }
    .fp-img-grid   { grid-template-columns: 1fr 1fr !important; }
    .fp-btn-row    { flex-direction: column !important; }
    .fp-btn-row button { width:100% !important; justify-content:center !important; }
    .fp-card-body  { padding: 18px 16px 20px !important; }
    .fp-card-head  { padding: 16px !important; }
  }
`;

function calcCompletion(f) {
  const req = ["farmerName","mobile","village","district","stateName","landSize"];
  const opt = ["email","pastCrop","farmerNotes"];
  return Math.round(
    (req.filter(k => f[k]).length / req.length) * 80 +
    (opt.filter(k => f[k]).length / opt.length) * 20
  );
}

async function callClaude(userMsg, systemMsg, messages) {
  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    system: systemMsg,
    messages: messages || [{ role: "user", content: userMsg }],
  };
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const code = res.status;
    if (code === 529) throw new Error("busy");
    if (code === 401 || code === 403) throw new Error("auth");
    throw new Error(err?.error?.message || `error_${code}`);
  }
  const data = await res.json();
  return data.content.map(b => b.type === "text" ? b.text : "").join("");
}

function parseJSON(raw) {
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

/* ── Small UI pieces ── */

function FocusInput({ value, onChange, readOnly, type = "text", placeholder }) {
  const [f, setF] = useState(false);
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      readOnly={readOnly} placeholder={placeholder} className="fp-input"
      style={{ ...S.input, ...(f && !readOnly ? { borderColor: G.green, boxShadow: "0 0 0 3px rgba(58,125,68,0.12)" } : {}), ...(readOnly ? S.inputReadonly : {}) }}
      onFocus={() => setF(true)} onBlur={() => setF(false)} />
  );
}

function Field({ label, children, full }) {
  return (
    <div style={{ ...S.field, ...(full ? { gridColumn: "1 / -1" } : {}) }}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

function SectionCard({ icon, iconBg, title, subtitle, children }) {
  return (
    <div style={S.card} className="fp-animate">
      <div style={S.cardHead} className="fp-card-head">
        <div style={{ ...S.cardHeadIcon, background: iconBg }}>{icon}</div>
        <div>
          <div style={S.cardHeadTitle}>{title}</div>
          {subtitle && <div style={S.cardHeadSub}>{subtitle}</div>}
        </div>
      </div>
      <div style={S.cardBody} className="fp-card-body">{children}</div>
    </div>
  );
}

function Tile({ label, value, variant }) {
  const extra = variant === "gold" ? S.tileGold : variant === "sky" ? S.tileSky : variant === "orange" ? S.tileOrange : {};
  return (
    <div style={{ ...S.tile, ...extra }}>
      <div style={S.tileLabel}>{label}</div>
      <div style={S.tileValue}>{value || "—"}</div>
    </div>
  );
}

function ResultBox({ label, text, bg, color }) {
  if (!text) return null;
  return (
    <div style={{ ...S.resultBox, background: bg || G.greenLight }}>
      <div style={{ ...S.resultLabel, color: color || G.greenDark }}>{label}</div>
      <div style={S.resultText}>{text}</div>
    </div>
  );
}

function Spinner({ label }) {
  return (
    <div style={S.spinnerWrap}>
      <div className="fp-spinner" />
      <p style={{ fontSize: 15, color: G.textMid, fontWeight: 500 }}>{label || "Please wait…"}</p>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  const bg = toast.type === "error" ? G.red : toast.type === "warn" ? G.orange : G.soil;
  const icon = toast.type === "error" ? "❌" : toast.type === "warn" ? "⚠️" : "✅";
  return <div style={{ ...S.toast, background: bg }}>{icon} {toast.msg}</div>;
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════════════════════════════ */
export default function FarmerProfile() {
  const navigate = useNavigate();
  const photoRef = useRef();
  const galleryRef = useRef();
  const probImgRef = useRef();

  const [lang, setLang] = useState(() => localStorage.getItem("app_lang") || "en");

  /* profile */
  const [farmerName, setFarmerName]   = useState(() => localStorage.getItem("farmer_name") || "");
  const [mobile, setMobile]           = useState(() => localStorage.getItem("farmer_mobile") || "");
  const [email, setEmail]             = useState(() => localStorage.getItem("farmer_email") || "");
  const [village, setVillage]         = useState(() => localStorage.getItem("farmer_village") || "");
  const [district, setDistrict]       = useState(() => localStorage.getItem("farmer_district") || "");
  const [stateName, setStateName]     = useState(() => localStorage.getItem("farmer_state") || "");
  const [landSize, setLandSize]       = useState(() => localStorage.getItem("farmer_land_size") || "");
  const [landUnit, setLandUnit]       = useState(() => localStorage.getItem("farmer_land_unit") || "Acres");
  const [pastCrop, setPastCrop]       = useState(() => localStorage.getItem("past_crop") || "");
  const [pastFert, setPastFert]       = useState(() => localStorage.getItem("past_fert") || "");
  const [lastWatered, setLastWatered] = useState(() => localStorage.getItem("last_watered_date") || "");
  const [farmerNotes, setFarmerNotes] = useState(() => localStorage.getItem("farmer_notes") || "");
  const [profilePhoto, setProfilePhoto] = useState(() => localStorage.getItem("farmer_photo") || "");
  const [editMode, setEditMode]       = useState(false);
  const [saving, setSaving]           = useState(false);

  /* crop info */
  const [cropInput, setCropInput]     = useState(() => localStorage.getItem("current_crop") || "");
  const [cropData, setCropData]       = useState(() => {
    try { return JSON.parse(localStorage.getItem("crop_data") || "null"); } catch { return null; }
  });
  const [cropLoading, setCropLoading] = useState(false);

  /* problem assistant */
  const [probCrop, setProbCrop]       = useState("");
  const [probDesc, setProbDesc]       = useState("");
  const [probImage, setProbImage]     = useState(null);
  const [probResult, setProbResult]   = useState(null);
  const [probLoading, setProbLoading] = useState(false);

  /* gallery */
  const [gallery, setGallery]         = useState(() => {
    try { return JSON.parse(localStorage.getItem("crop_images") || "[]"); } catch { return []; }
  });
  const [dragOver, setDragOver]       = useState(false);

  /* toast */
  const [toast, setToast]             = useState(null);
  const toastTimer                    = useRef();

  const showToast = (msg, type = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  const completion = calcCompletion({ farmerName, mobile, email, village, district, stateName, landSize, pastCrop, farmerNotes });

  /* load backend */
  useEffect(() => {
    (async () => {
      try {
        const saved = localStorage.getItem("currentFarmer");
        if (!saved) return;
        const currentFarmer = JSON.parse(saved);
        const identifier = currentFarmer.identifier || currentFarmer.phone;
        if (!identifier) return;
        const res = await fetch(`http://localhost:5000/api/farmer/profile/${encodeURIComponent(identifier)}`);
        if (!res.ok) return;
        const result = await res.json();
        if (result.success && result.data) {
          const d = result.data;
          if (d.name)      setFarmerName(d.name);
          if (d.phone)     setMobile(d.phone);
          if (d.state)     setStateName(d.state);
          if (d.district)  setDistrict(d.district);
          if (d.farm_size) setLandSize(d.farm_size);
        }
      } catch { /* offline */ }
    })();
  }, []);

  const handleLang = l => {
    setLang(l);
    localStorage.setItem("app_lang", l);
    window.dispatchEvent(new Event("storage"));
  };

  const handleSave = async () => {
  try {
    setSaving(true);
    const saved = localStorage.getItem("currentFarmer");
    const currentFarmer = saved ? JSON.parse(saved) : null;
    const loginIdentifier = currentFarmer?.identifier || currentFarmer?.phone || "";

    const response = await fetch(
      `http://localhost:5000/api/farmer/profile/${encodeURIComponent(loginIdentifier || mobile)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: farmerName,
          phone: mobile,
          password: localStorage.getItem("farmer_password") || "",
          identifier: loginIdentifier,
          email,
          village,
          district,
          state: stateName,
          farmSize: landSize,
          landUnit,
          pastCrop,
          pastFert,
          lastWatered,
          farmerNotes,
          profilePhoto,
        }),
      }
    );

    const result = await response.json();

    if (result.success) {
      if (result.data?.phone || result.data?.email) {
        localStorage.setItem(
          "currentFarmer",
          JSON.stringify({
            identifier: result.data.email || result.data.phone || loginIdentifier || mobile,
            phone: result.data.phone || mobile,
          })
        );
      }
      localStorage.setItem("farmer_name", farmerName);
      localStorage.setItem("farmer_mobile", mobile);
      localStorage.setItem("farmer_email", email);
      localStorage.setItem("farmer_village", village);
      localStorage.setItem("farmer_district", district);
      localStorage.setItem("farmer_state", stateName);
      localStorage.setItem("farmer_land_size", landSize);
      localStorage.setItem("past_crop", pastCrop);
      localStorage.setItem("farmer_notes", farmerNotes);
      showToast("Profile saved successfully");
      setEditMode(false);
    } else {
      showToast(result.message || "Save failed", "error");
    }
  } catch (error) {
    console.error(error);
    showToast("Failed to save profile", "error");
  } finally {
    setSaving(false);
  }
};
  /* profile photo */
  const handleProfilePhoto = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("Please select a valid image file (JPG or PNG)", "error"); return; }
    if (file.size > 5 * 1024 * 1024) { showToast("Photo is too large. Please use an image under 5 MB", "error"); return; }
    const reader = new FileReader();
    reader.onload = ev => { setProfilePhoto(ev.target.result); localStorage.setItem("farmer_photo", ev.target.result); showToast("Profile photo updated"); };
    reader.onerror = () => showToast("Could not read the image. Please try again", "error");
    reader.readAsDataURL(file);
  };

  /* crop info AI */
  const handleGetCropInfo = async () => {
    const name = cropInput.trim();
    if (!name) { showToast("Please enter a crop name first", "warn"); return; }
    setCropLoading(true); setCropData(null);
    try {
      const raw = await callClaude(
        `Crop: ${name}`,
        `You are a farming expert helping Indian farmers. For the given crop, return ONLY a valid JSON object with these exact keys (plain simple language):
cropName, scientificName, category, overview, suitableSoil, waterRequirement, fertilizerTips, npk, sowingSeason, harvestTime, expectedYield, commonDiseases, commonPests, preventionTips, organicTips, storageTips.
Each value: 1-2 short sentences. No markdown. Only JSON.`
      );
      const parsed = parseJSON(raw);
      setCropData(parsed);
      localStorage.setItem("current_crop", name);
      localStorage.setItem("crop_data", JSON.stringify(parsed));
      showToast(`Crop information loaded for ${name}`);
    } catch (err) {
      if (err.message === "busy")  showToast("AI service is busy. Please try again in a moment", "warn");
      else if (err.message === "auth") showToast("AI service connection failed. Please check your API key", "error");
      else showToast("Could not load crop information. Please check your internet connection", "error");
    } finally { setCropLoading(false); }
  };

  /* problem image */
  const handleProblemImage = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("Please select a valid image file", "error"); return; }
    if (file.size > 10 * 1024 * 1024) { showToast("Image is too large. Please use an image under 10 MB", "error"); return; }
    const reader = new FileReader();
    reader.onload = ev => setProbImage({ src: ev.target.result, name: file.name, type: file.type });
    reader.onerror = () => showToast("Could not read the image. Please try again", "error");
    reader.readAsDataURL(file);
  };

  /* diagnose */
  const handleDiagnose = async () => {
    if (!probCrop.trim()) { showToast("Please enter the crop name", "warn"); return; }
    if (!probDesc.trim()) { showToast("Please describe the problem you are seeing", "warn"); return; }
    setProbLoading(true); setProbResult(null);
    try {
      const SYSTEM = `You are a friendly farming expert helping Indian farmers solve crop problems. Use simple, plain language. Return ONLY a valid JSON object with keys:
whatIsTheProblem, whyItHappens, howToSolveIt, fertilizerRecommendation, pesticideRecommendation, organicSolution, preventionTips.
2-3 short sentences each. No markdown. Only JSON.`;

      let raw;
      if (probImage) {
        raw = await callClaude(null, SYSTEM, [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: probImage.type, data: probImage.src.split(",")[1] } },
            { type: "text", text: `Crop: ${probCrop}\nProblem: ${probDesc}` },
          ],
        }]);
      } else {
        raw = await callClaude(`Crop: ${probCrop}\nProblem: ${probDesc}`, SYSTEM);
      }
      setProbResult(parseJSON(raw));
      showToast("AI diagnosis completed successfully");
    } catch (err) {
      if (err.message === "busy")  showToast("AI service is busy. Please wait a moment and try again", "warn");
      else if (err.message === "auth") showToast("AI service connection failed. Please check your API key", "error");
      else showToast("Diagnosis failed. Please check your internet connection and try again", "error");
    } finally { setProbLoading(false); }
  };

  /* gallery upload */
  const handleGalleryFiles = files => {
    const valid = ["image/jpeg", "image/png", "image/webp"];
    Array.from(files).forEach(file => {
      if (!valid.includes(file.type)) { showToast(`"${file.name}" is not a valid image format`, "error"); return; }
      if (file.size > 10 * 1024 * 1024) { showToast(`"${file.name}" is too large (max 10 MB)`, "error"); return; }
      const reader = new FileReader();
      reader.onload = ev => {
        setGallery(prev => {
          const updated = [{ src: ev.target.result, name: file.name, crop: probCrop || cropInput || "Unknown", date: new Date().toLocaleDateString("en-IN"), id: Date.now() + Math.random() }, ...prev];
          try { localStorage.setItem("crop_images", JSON.stringify(updated)); } catch { showToast("Storage is full. Please delete some images first", "warn"); }
          return updated;
        });
        showToast("Image uploaded successfully");
      };
      reader.onerror = () => showToast(`Could not read "${file.name}"`, "error");
      reader.readAsDataURL(file);
    });
  };

  const deleteImage = id => {
    setGallery(prev => {
      const updated = prev.filter(img => img.id !== id);
      try { localStorage.setItem("crop_images", JSON.stringify(updated)); } catch {}
      return updated;
    });
    showToast("Image deleted");
  };

  /* ── RENDER ── */
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={S.page}>

        {/* Header */}
        <div style={S.header}>
          <div style={S.headerPattern} />
          <div style={S.headerTop}>
            <span style={S.appName}>🌾 KisanAI — Farmer Profile</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {[["en","EN"],["hi","हिं"],["mr","मर"]].map(([l, lbl]) => (
                <button key={l} onClick={() => handleLang(l)} style={{
                  padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 700,
                  border: "none", cursor: "pointer",
                  background: lang === l ? G.gold : "rgba(255,255,255,0.12)",
                  color: lang === l ? G.white : "rgba(255,255,255,0.7)",
                }}>{lbl}</button>
              ))}
              <button style={S.backBtn} onClick={() => navigate("/dashboard")}>← Dashboard</button>
            </div>
          </div>
        </div>

        <div style={S.body}>

          {/* ══ SECTION 1 — FARMER INFORMATION ══ */}
          <div style={S.profileLift} className="fp-animate">
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
              <div style={S.avatarWrap}>
                <div style={S.avatar} onClick={() => photoRef.current?.click()}>
                  {profilePhoto ? <img src={profilePhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "👨‍🌾"}
                </div>
                <div style={S.avatarBadge} onClick={() => photoRef.current?.click()}>📷</div>
                <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleProfilePhoto} />
              </div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={S.farmerName}>{farmerName || "Your Name"}</div>
                <div style={S.farmerMeta}>
                  {mobile && <>{mobile}<br /></>}
                  {[village, district, stateName].filter(Boolean).join(", ")}
                </div>
                {landSize && (
                  <span style={{ ...S.pill, background: G.goldLight, color: G.gold, border: `1px solid #F0D08A` }}>
                    🌾 {landSize} {landUnit}
                  </span>
                )}
              </div>
              <button className="fp-btn-green" style={S.btnPrimary}
                onClick={editMode ? handleSave : () => setEditMode(true)} disabled={saving}>
                {saving ? "⏳ Saving…" : editMode ? "💾 Save Changes" : "✏️ Edit Profile"}
              </button>
            </div>

            <div style={S.progressWrap}>
              <div style={S.progressLabel}>
                <span>Profile Completion</span>
                <span style={{ color: G.green, fontWeight: 800 }}>{completion}%</span>
              </div>
              <div style={S.progressBg}><div style={{ ...S.progressFill, width: `${completion}%` }} /></div>
            </div>

            <div style={S.divider} />
            <div style={{ fontWeight: 700, fontSize: 13, color: G.textLight, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>Personal Information</div>

            <div className="fp-field-grid" style={S.fieldGrid}>
              <Field label="Full Name"><FocusInput value={farmerName} onChange={setFarmerName} readOnly={!editMode} placeholder="Your full name" /></Field>
              <Field label="Mobile Number"><FocusInput value={mobile} onChange={setMobile} readOnly={!editMode} type="tel" placeholder="10-digit number" /></Field>
              <Field label="Email Address" full><FocusInput value={email} onChange={setEmail} readOnly={!editMode} type="email" placeholder="your@email.com (optional)" /></Field>
              <Field label="Village"><FocusInput value={village} onChange={setVillage} readOnly={!editMode} placeholder="Village name" /></Field>
              <Field label="District"><FocusInput value={district} onChange={setDistrict} readOnly={!editMode} placeholder="District name" /></Field>
              <Field label="State" full><FocusInput value={stateName} onChange={setStateName} readOnly={!editMode} placeholder="State name" /></Field>
              <Field label="Land Area"><FocusInput value={landSize} onChange={setLandSize} readOnly={!editMode} type="number" placeholder="e.g. 5" /></Field>
              <Field label="Land Unit">
                <select value={landUnit} onChange={e => setLandUnit(e.target.value)} disabled={!editMode}
                  style={{ ...S.select, ...(editMode ? {} : S.inputReadonly) }}>
                  <option>Acres</option><option>Guntha</option><option>Hectares</option>
                </select>
              </Field>
            </div>

            <div style={{ ...S.divider, marginTop: 22 }} />
            <div style={{ fontWeight: 700, fontSize: 13, color: G.textLight, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>Farm History</div>

            <div className="fp-field-grid" style={S.fieldGrid}>
              <Field label="Past Crop"><FocusInput value={pastCrop} onChange={setPastCrop} readOnly={!editMode} placeholder="e.g. Wheat" /></Field>
              <Field label="Past Fertilizer"><FocusInput value={pastFert} onChange={setPastFert} readOnly={!editMode} placeholder="e.g. DAP" /></Field>
              <Field label="Last Irrigation" full>
                <input type="datetime-local" value={lastWatered} onChange={e => setLastWatered(e.target.value)}
                  readOnly={!editMode} style={{ ...S.input, ...(editMode ? {} : S.inputReadonly) }} />
              </Field>
              <Field label="Notes" full>
                <textarea value={farmerNotes} onChange={e => setFarmerNotes(e.target.value)}
                  readOnly={!editMode} rows={3} placeholder="Any notes about your farm…"
                  style={{ ...S.textarea, ...(editMode ? {} : S.inputReadonly) }} />
              </Field>
            </div>

            {editMode && (
              <div className="fp-btn-row" style={S.btnRow}>
                <button className="fp-btn-green" style={S.btnPrimary} onClick={handleSave} disabled={saving}>
                  {saving ? "⏳ Saving…" : "💾 Save Changes"}
                </button>
                <button style={S.btnSecondary} onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            )}
          </div>

          {/* ══ SECTION 2 — MY CROP ══ */}
          <SectionCard icon="🌱" iconBg={G.greenLight} title="My Crop"
            subtitle="Enter your crop name — AI will show you all the information you need">

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input className="fp-input" style={{ ...S.input, flex: 1, minWidth: 200 }}
                placeholder="Type any crop: Cotton, Tomato, Rose, Banana, Dragon Fruit…"
                value={cropInput} onChange={e => setCropInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleGetCropInfo()} />
              <button className="fp-btn-green" style={{ ...S.btnPrimary, flexShrink: 0 }}
                onClick={handleGetCropInfo} disabled={cropLoading}>
                {cropLoading ? "⏳ Loading…" : "🔍 Get Information"}
              </button>
            </div>

            {cropLoading && <Spinner label="AI is finding information about your crop. Please wait…" />}

            {!cropLoading && !cropData && (
              <div style={S.empty}>
                <div style={S.emptyIcon}>🌾</div>
                <div style={S.emptyText}>Enter a crop name above and tap "Get Information"</div>
              </div>
            )}

            {!cropLoading && cropData && (
              <div className="fp-animate">
                <div style={{ marginTop: 20, padding: "16px 18px", background: G.greenLight, borderRadius: 12, borderLeft: `4px solid ${G.green}` }}>
                  <div style={{ fontWeight: 800, fontSize: 17, color: G.greenDark }}>{cropData.cropName}</div>
                  <div style={{ fontSize: 13, color: G.textMid, fontStyle: "italic", marginBottom: 6 }}>{cropData.scientificName} · {cropData.category}</div>
                  <div style={{ fontSize: 14, color: G.textDark, lineHeight: 1.6 }}>{cropData.overview}</div>
                </div>

                <div className="fp-tile-grid" style={S.tileGrid}>
                  <Tile label="🌍 Suitable Soil" value={cropData.suitableSoil} />
                  <Tile label="💧 Water Requirement" value={cropData.waterRequirement} variant="sky" />
                  <Tile label="📅 Sowing Season" value={cropData.sowingSeason} variant="gold" />
                  <Tile label="⏳ Harvest Time" value={cropData.harvestTime} variant="gold" />
                  <Tile label="🌿 Fertilizer Tips" value={cropData.fertilizerTips} />
                  <Tile label="🧪 NPK Fertilizer" value={cropData.npk} />
                  <Tile label="📦 Expected Yield" value={cropData.expectedYield} variant="sky" />
                  <Tile label="🏠 Storage Tips" value={cropData.storageTips} variant="sky" />
                </div>

                <div style={S.divider} />
                <div style={{ fontWeight: 700, color: G.textMid, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>⚠️ Diseases, Pests & Protection</div>
                <div className="fp-tile-grid" style={S.tileGrid}>
                  <Tile label="🦠 Common Diseases" value={cropData.commonDiseases} variant="orange" />
                  <Tile label="🐛 Common Pests" value={cropData.commonPests} variant="orange" />
                  <Tile label="🛡️ Prevention Tips" value={cropData.preventionTips} />
                  <Tile label="🌿 Organic / Natural Tips" value={cropData.organicTips} />
                </div>
              </div>
            )}
          </SectionCard>

          {/* ══ SECTION 3 — CROP PROBLEM ASSISTANT ══ */}
          <SectionCard icon="🤖" iconBg={G.goldLight} title="Crop Problem Assistant"
            subtitle="Tell us what is wrong — AI will diagnose and tell you exactly what to do">

            {/* Image upload */}
            <div
              style={{ ...S.uploadZone, ...(dragOver ? S.uploadZoneActive : {}), marginBottom: 18 }}
              onClick={() => probImgRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleProblemImage({ target: { files: e.dataTransfer.files } }); }}
            >
              {probImage ? (
                <div>
                  <img src={probImage.src} alt="Crop" style={{ maxHeight: 160, borderRadius: 10, objectFit: "contain" }} />
                  <div style={{ fontSize: 13, color: G.textMid, marginTop: 8 }}>📎 {probImage.name}</div>
                  <button style={{ ...S.btnDanger, marginTop: 10 }} onClick={e => { e.stopPropagation(); setProbImage(null); }}>Remove Image</button>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: G.textDark, marginBottom: 4 }}>Upload Photo of the Problem (Optional)</div>
                  <div style={{ fontSize: 13, color: G.textLight }}>Tap to choose or drag an image here · JPG, PNG up to 10 MB</div>
                </>
              )}
              <input ref={probImgRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={handleProblemImage} />
            </div>

            <div className="fp-field-grid" style={{ ...S.fieldGrid, marginBottom: 14 }}>
              <Field label="Crop Name">
                <FocusInput value={probCrop} onChange={setProbCrop} placeholder="e.g. Cotton, Tomato, Onion…" />
              </Field>
            </div>

            <Field label="Describe the Problem">
              <textarea value={probDesc} onChange={e => setProbDesc(e.target.value)} rows={4}
                placeholder="What are you seeing? Example: Leaves are turning yellow and falling. Fruit is dropping early. White spots on leaves…"
                style={S.textarea} />
            </Field>

            <div style={{ marginTop: 16 }}>
              <button className="fp-btn-gold" style={{ ...S.btnGold, width: "100%", justifyContent: "center", fontSize: 16 }}
                onClick={handleDiagnose} disabled={probLoading}>
                {probLoading ? "⏳ AI is Analyzing Your Problem…" : "🔬 Diagnose My Crop Problem"}
              </button>
            </div>

            {probLoading && <Spinner label="AI is analyzing your crop problem. This may take a few seconds…" />}

            {!probLoading && !probResult && (
              <div style={{ ...S.empty, paddingTop: 24 }}>
                <div style={S.emptyIcon}>🔍</div>
                <div style={S.emptyText}>Your diagnosis result will appear here</div>
              </div>
            )}

            {!probLoading && probResult && (
              <div className="fp-animate" style={{ marginTop: 24 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: G.textDark, marginBottom: 14 }}>🩺 AI Diagnosis Result</div>
                <ResultBox label="🔎 What is the Problem?" text={probResult.whatIsTheProblem} bg={G.goldLight} color={G.gold} />
                <ResultBox label="❓ Why Does This Happen?" text={probResult.whyItHappens} bg={G.orangeLight} color={G.orange} />
                <ResultBox label="✅ How to Solve It" text={probResult.howToSolveIt} bg={G.greenLight} color={G.greenDark} />
                <ResultBox label="🧪 Fertilizer to Use" text={probResult.fertilizerRecommendation} bg={G.goldLight} color={G.gold} />
                <ResultBox label="💊 Pesticide / Medicine" text={probResult.pesticideRecommendation} bg={G.redLight} color={G.red} />
                <ResultBox label="🌿 Organic / Natural Solution" text={probResult.organicSolution} bg={G.greenLight} color={G.greenDark} />
                <ResultBox label="🛡️ How to Prevent Next Time" text={probResult.preventionTips} bg={G.skyLight} color={G.sky} />
              </div>
            )}
          </SectionCard>

          {/* ══ SECTION 4 — MY UPLOADED CROP IMAGES ══ */}
          <SectionCard icon="📷" iconBg={G.skyLight} title="My Uploaded Crop Images"
            subtitle="Keep a photo record of your crops and fields">

            <div
              style={{ ...S.uploadZone, ...(dragOver ? S.uploadZoneActive : {}) }}
              onClick={() => galleryRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleGalleryFiles(e.dataTransfer.files); }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>📤</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: G.textDark, marginBottom: 4 }}>Upload Crop Photos</div>
              <div style={{ fontSize: 13, color: G.textLight }}>Drag & drop or tap to choose · JPG, PNG, WEBP · Max 10 MB each</div>
              <input ref={galleryRef} type="file" accept="image/jpeg,image/png,image/webp" multiple style={{ display: "none" }} onChange={e => handleGalleryFiles(e.target.files)} />
            </div>

            {gallery.length === 0 ? (
              <div style={{ ...S.empty, paddingTop: 28 }}>
                <div style={S.emptyIcon}>🖼️</div>
                <div style={S.emptyText}>No images yet. Tap above to upload your first crop photo.</div>
              </div>
            ) : (
              <div className="fp-img-grid" style={S.imgGrid}>
                {gallery.map(img => (
                  <div key={img.id} style={S.imgCard}>
                    <img src={img.src} alt={img.name} style={S.imgThumb} onClick={() => window.open(img.src, "_blank")} />
                    <div style={S.imgMeta}>
                      <div style={S.imgName} title={img.name}>{img.name}</div>
                      <div style={S.imgDate}>📅 {img.date}</div>
                      {img.crop && img.crop !== "Unknown" && (
                        <div style={{ fontSize: 11, color: G.green, fontWeight: 600, marginBottom: 8 }}>🌿 {img.crop}</div>
                      )}
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={{ ...S.btnDanger, flex: 1, padding: "7px 0", justifyContent: "center", fontSize: 12 }}
                          onClick={() => window.open(img.src, "_blank")}>👁 View</button>
                        <button style={{ ...S.btnDanger, flex: 1, padding: "7px 0", justifyContent: "center", fontSize: 12 }}
                          onClick={() => deleteImage(img.id)}>🗑 Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

        </div>
      </div>
      <Toast toast={toast} />
    </>
  );
}