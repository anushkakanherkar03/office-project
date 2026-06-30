import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const C = {
  green900: "#1b5e20", green800: "#2e7d32", green700: "#388e3c",
  green600: "#43a047", green100: "#e8f5e9", green50: "#f1f8f2",
  teal: "#00796b", amber: "#f57f17", amber100: "#fff8e1",
  red: "#c62828", red100: "#ffebee", blue: "#1565c0", blue100: "#e3f2fd",
  indigo: "#3949ab", indigo100: "#e8eaf6",
  gray50: "#f8f9fa", gray100: "#f1f3f4", gray200: "#e8eaed",
  gray400: "#9aa0a6", gray600: "#5f6368", gray900: "#202124",
  white: "#ffffff", border: "#e0e0e0",
  shadow: "0 2px 8px rgba(0,0,0,0.06)",
  shadowMd: "0 4px 16px rgba(0,0,0,0.10)",
  shadowLg: "0 8px 28px rgba(0,0,0,0.13)",
};

const S = {
  card: { background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: C.shadow, padding: "28px 32px" },
  label: { fontWeight: 600, fontSize: 12, color: C.gray600, textTransform: "uppercase", letterSpacing: "0.6px", display: "block", marginBottom: 7 },
  select: { width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, color: C.gray900, background: C.white, outline: "none", cursor: "pointer" },
  input: { width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, color: C.gray900, background: C.white, outline: "none", boxSizing: "border-box" },
  btn: { padding: "10px 22px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.15s" },
  btnPrimary: { background: C.green800, color: C.white },
  btnSecondary: { background: C.gray100, color: C.gray900, border: `1px solid ${C.border}` },
  tag: { display: "inline-block", padding: "3px 11px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
};

/* ─────────────────────────────────────────────
   REUSABLE COMPONENTS
───────────────────────────────────────────── */
const Chip = ({ color = C.green800, bg = C.green100, children }) => (
  <span style={{ ...S.tag, background: bg, color }}>{children}</span>
);

const AlertBox = ({ type = "info", children }) => {
  const colors = {
    info:    { bg: C.blue100,  border: C.blue,    color: C.blue },
    success: { bg: C.green100, border: C.green800, color: C.green800 },
    warning: { bg: C.amber100, border: C.amber,    color: C.amber },
    danger:  { bg: C.red100,   border: C.red,      color: C.red },
  };
  const c = colors[type];
  return (
    <div style={{ background: c.bg, borderLeft: `4px solid ${c.border}`, borderRadius: 10, padding: "13px 17px", color: c.color, fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>
      {children}
    </div>
  );
};

/* ─────────────────────────────────────────────
   SCHEME DETAILS DB
───────────────────────────────────────────── */
const SCHEME_DETAILS_DB = {
  1: {
    id: 1, govType: "Central", lastUpdated: "May 2025",
    targetBeneficiaries: "All registered farmers cultivating notified crops on notified areas",
    keyBenefits: ["Financial support if crop fails due to natural calamities, pests, or diseases", "Covers pre-sowing to post-harvest losses including prevented sowing", "Premium as low as 2% for Kharif, 1.5% for Rabi, 5% for commercial crops", "Claim settlement within 60 days of submitting documents", "Losses assessed using satellite imaging and crop-cutting experiments"],
    eligibility: ["Must be a farmer (owner or tenant) in the notified area", "Must be cultivating a notified crop during the season", "Loanee farmers automatically enrolled if KCC crop loan taken", "Non-loanee farmers can voluntarily enrol", "Aadhaar linking is mandatory for enrollment"],
    importantDates: [{ event: "Kharif Enrollment Deadline", date: "July 31" }, { event: "Rabi Enrollment Deadline", date: "December 31" }, { event: "Claim Filing Period", date: "Within 72 hrs of damage occurrence" }, { event: "Claim Settlement", date: "Within 60 days of claim filing" }],
    faqs: [{ q: "What losses does PMFBY cover?", a: "Yield losses due to natural fire, lightning, storm, hailstorm, cyclone, typhoon, flood, landslide, drought, dry spells, pests, and diseases." }, { q: "How is the premium calculated?", a: "Premium is the actuarial rate minus government subsidy. Farmer pays max 2% for Kharif, 1.5% for Rabi and Oilseeds, and 5% for commercial/horticultural crops." }, { q: "How do I check my claim status?", a: "Log in to pmfby.gov.in or call the national helpline 14447. You can also check via your bank if you are a loanee farmer." }, { q: "Can a tenant farmer apply?", a: "Yes. Tenant and sharecropper farmers are eligible if they are cultivating the notified crop on the notified area with supporting documents." }],
    relatedSchemes: [2, 6, 4],
  },
  2: {
    id: 2, govType: "Central", lastUpdated: "April 2025",
    targetBeneficiaries: "Farmers with less than 2 hectares of land, especially small and marginal",
    keyBenefits: ["80% capital subsidy on drip irrigation system installation", "Reduces water usage by up to 50% compared to flood irrigation", "Increases crop yield by 40–50% through precise water delivery", "Applicable to both borewells and canal water sources", "Covers pipes, drippers, emitters, filters, and fertigation units"],
    eligibility: ["Any farmer with valid land records (7/12 extract)", "Farmer must have own or assured water source", "Priority given to SC/ST, small and marginal farmers", "Farmer should not have availed similar scheme in past 7 years for same field", "Must get pre-approval from taluka agriculture office before purchase"],
    importantDates: [{ event: "Application Window", date: "Open throughout the year (MahaDBT portal)" }, { event: "Funds Available", date: "Subject to state budget allocation" }, { event: "Installation Deadline", date: "Within 3 months of pre-approval" }],
    faqs: [{ q: "What is covered under PMKSY subsidy?", a: "Drip laterals, main and sub-main pipes, filters, drippers, emitters, fertigation equipment, and installation charges are covered." }, { q: "Can I choose my own vendor?", a: "You must choose from the state-approved vendor list. Purchasing from non-approved vendors voids subsidy eligibility." }],
    relatedSchemes: [1, 5, 3],
  },
  3: {
    id: 3, govType: "Central", lastUpdated: "March 2025",
    targetBeneficiaries: "Individual farmers, farmer groups, FPOs, and agri-entrepreneurs",
    keyBenefits: ["Capital grants for purchasing tractors, harvesters, and other modern equipment", "Up to 40–50% subsidy on approved machinery for individual farmers", "Custom Hiring Centres (CHC) get 80% subsidy to provide rentable machinery", "Farm-level processing units and storage infrastructure also covered", "Training and capacity building provided at Krishi Vigyan Kendras"],
    eligibility: ["Indian citizen farmer with valid land records", "FPOs and cooperatives also eligible for Custom Hiring Centre grants", "One beneficiary per household per equipment category", "Must register on state Agri Mechanisation DBT portal", "Equipment must be from the approved/empanelled dealer list"],
    importantDates: [{ event: "Application Window", date: "Open (subject to budget availability)" }, { event: "GST Bill Submission", date: "Within 30 days of purchase" }, { event: "Field Verification", date: "Within 15 days of application" }],
    faqs: [{ q: "Which equipment is eligible?", a: "Tractors, rotavators, seed drills, threshers, sprayers, harvesters, and more from the state-approved equipment list." }, { q: "Can I get subsidy on a second-hand machine?", a: "No. Subsidy applies only to brand-new equipment purchased from registered dealers." }],
    relatedSchemes: [2, 5, 8],
  },
  4: {
    id: 4, govType: "Central", lastUpdated: "February 2025",
    targetBeneficiaries: "All farmers across India seeking soil nutrient analysis",
    keyBenefits: ["Free government-lab soil testing across 12 parameters", "Personalised nutrient prescription card for your field", "Reduces fertilizer overuse by 20–30%, saving money", "Includes recommendations for micro-nutrients like Zinc, Boron, Iron", "Results available within 30 days of sample submission"],
    eligibility: ["Any farmer with cultivable land in India", "No land size restriction — even kitchen garden farmers eligible", "One soil health card per 2 hectares per 3 years", "Aadhaar and mobile number required for registration"],
    importantDates: [{ event: "Card Validity", date: "3 years from date of issue" }, { event: "Re-application", date: "After 3 years or if crop changes significantly" }],
    faqs: [{ q: "How do I collect the soil sample correctly?", a: "Collect soil from 5 different spots in the field at 15–20 cm depth, mix them, and submit 500g of the mixed sample." }, { q: "What 12 parameters are tested?", a: "N, P, K, pH, EC, OC, S, Zn, B, Fe, Mn, Cu — macro and micro nutrients plus soil health indicators." }],
    relatedSchemes: [1, 5, 2],
  },
  5: {
    id: 5, govType: "Central", lastUpdated: "June 2025",
    targetBeneficiaries: "All small and marginal farmers (land up to 2 hectares)",
    keyBenefits: ["₹6,000 per year deposited directly to bank account in 3 instalments of ₹2,000", "No deduction, no intermediary — 100% direct benefit transfer", "Can be used freely for seeds, fertilizers, or any farm input", "Benefit continues as long as eligibility criteria are met", "Family (husband and wife) can both receive if they have separate land records"],
    eligibility: ["Farmer families owning cultivable land up to 2 hectares", "Land must be in farmer's name in revenue records", "Excludes institutional landholders and those paying income tax", "Excludes former/current government employees earning ₹10,000+/month pension", "Must have Aadhaar-linked bank account for DBT transfer"],
    importantDates: [{ event: "Instalment 1 (Apr–Jul)", date: "Credited around July each year" }, { event: "Instalment 2 (Aug–Nov)", date: "Credited around November each year" }, { event: "Instalment 3 (Dec–Mar)", date: "Credited around March each year" }],
    faqs: [{ q: "How do I check if I received the payment?", a: "Log in to pmkisan.gov.in → Farmer Corner → Beneficiary Status, or check your bank passbook." }, { q: "My name is not in the list — what do I do?", a: "Visit the Common Service Centre (CSC) in your village or contact the local agriculture office for registration." }],
    relatedSchemes: [6, 1, 4],
  },
  6: {
    id: 6, govType: "Central", lastUpdated: "May 2025",
    targetBeneficiaries: "All farmers requiring short-term credit for agricultural operations",
    keyBenefits: ["Crop loans at just 4% effective interest rate (7% – 3% government subvention)", "Credit limit set based on crop, land area, and scale of finance", "Revolving credit — repay and withdraw again without reapplying", "Covers crop production, post-harvest expenses, and allied activities", "Insurance coverage under PMFBY automatically bundled"],
    eligibility: ["Individual farmers (owner cultivators) with valid land records", "Tenant farmers and sharecroppers with No Objection Certificate from landowner", "Oral lessees and allied/non-farm activity farmers also eligible", "Must have a bank account at a nationalised/cooperative/RRB bank", "No past loan default — CIBIL check may be conducted"],
    importantDates: [{ event: "Card Issuance", date: "Within 14 working days of application" }, { event: "Card Validity", date: "5 years (annual renewal with fresh crop declaration)" }, { event: "Repayment Due", date: "Typically 12 months from disbursement" }],
    faqs: [{ q: "What is the maximum loan amount under KCC?", a: "There is no fixed upper limit. It depends on the scale of finance for your crop, number of seasons, land area, and post-harvest requirements. Typically ₹50,000–₹3,00,000." }, { q: "Can I use KCC for non-farm activities?", a: "Yes, up to 20% of the KCC limit can be used for allied activities like fisheries, animal husbandry, and non-farm income." }],
    relatedSchemes: [5, 1, 2],
  },
  8: {
    id: 8, govType: "Central", lastUpdated: "April 2025",
    targetBeneficiaries: "Farmers seeking better price discovery and wider market access",
    keyBenefits: ["Access buyers from across India — not just your local mandi", "Real-time competitive bidding drives better prices", "Payment directly credited to bank account within 1–3 days", "Reduces post-harvest losses by enabling remote selling", "Quality assaying and grading at the mandi gate"],
    eligibility: ["Any Indian farmer with cultivable land", "Must register at enam.gov.in or nearest APMC sub-centre", "Must have Aadhaar, bank account, and APMC registration", "Farmer must bring produce to nearest e-NAM linked mandi"],
    importantDates: [{ event: "Registration", date: "Open throughout the year" }, { event: "Trading Hours", date: "Typically 8 AM – 5 PM on working days" }],
    faqs: [{ q: "Do I physically have to take my crop to the mandi?", a: "Yes, currently the produce needs to be brought to a linked e-NAM mandi for assaying and grading before bidding begins." }, { q: "Who are the buyers on e-NAM?", a: "Licensed traders, processors, exporters, and FPOs registered on the e-NAM platform across India." }],
    relatedSchemes: [5, 6, 3],
  },
  101: {
    id: 101, govType: "Central", lastUpdated: "June 2025",
    targetBeneficiaries: "Rice-growing farmers in notified areas",
    keyBenefits: ["Free or highly subsidised high-yield hybrid rice seeds", "Includes varieties resistant to blast, brown plant hopper, and flood", "Distribution through government seed corporations and Krishi Kendras", "Linked with NFSM training camps on best practices", "Seed replacement rate (SRR) improvement support"],
    eligibility: ["Farmer cultivating rice in a notified NFSM district", "Must have 7/12 extract showing rice crop", "Priority to farmers who have never received NFSM seeds before"],
    importantDates: [{ event: "Application Deadline", date: "June 30" }, { event: "Seed Distribution", date: "June – July (before Kharif sowing)" }],
    faqs: [{ q: "Which varieties are available under NFSM-Rice?", a: "Swarna, IR64, Rajendra Bhagwati, MTU 1010, and other state-recommended high-yield varieties." }],
    relatedSchemes: [1, 5, 4],
  },
  201: {
    id: 201, govType: "Central", lastUpdated: "March 2025",
    targetBeneficiaries: "Cotton-growing farmers in Maharashtra and other major states",
    keyBenefits: ["Guaranteed MSP (Minimum Support Price) buyback for cotton", "No price risk — price floor protected even if market falls", "Direct payment to bank account within 48 hours of sale", "Closest procurement centre within 50 km of most farms", "No deduction for moisture (within permissible range)"],
    eligibility: ["Must have 7/12 extract with cotton crop entry for current year", "Must register at nearest APMC or CCI sub-centre before selling", "Cotton must meet minimum quality standards (Shankar-6 or equivalent)"],
    importantDates: [{ event: "Season Opens", date: "October (post-harvest)" }, { event: "Registration Deadline", date: "September 30 (before harvest)" }, { event: "Procurement End Date", date: "March 31" }],
    faqs: [{ q: "What is the current MSP for cotton?", a: "The MSP is revised annually by the Cabinet Committee on Economic Affairs (CCEA). Check cotcorp.org.in for the latest season MSP." }],
    relatedSchemes: [1, 5, 6],
  },
};

/* ─────────────────────────────────────────────
   SCHEME MODULE COLORS (BLUE/INDIGO PALETTE)
───────────────────────────────────────────── */
const SC = {
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  secondary: "#4F46E5",
  bg: "#F8FAFC",
  card: "#FFFFFF",
  border: "#E5E7EB",
  text: "#1F2937",
  textMuted: "#6B7280",
  success: "#22C55E",
  successBg: "#F0FDF4",
  error: "#EF4444",
  errorBg: "#FEF2F2",
  warning: "#F59E0B",
  warningBg: "#FFFBEB",
  purple: "#7C3AED",
  purpleBg: "#F5F3FF",
  teal: "#0D9488",
  tealBg: "#F0FDFA",
  shadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
  shadowMd: "0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)",
  shadowLg: "0 10px 15px rgba(0,0,0,0.07), 0 4px 6px rgba(0,0,0,0.05)",
};

/* ─────────────────────────────────────────────
   MULTI-STEP APPLICATION FORM MODAL
───────────────────────────────────────────── */
function ApplicationFormModal({ scheme, onClose }) {
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 6;
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [appId] = useState("APP-2026-" + Math.floor(100000 + Math.random() * 900000));
  const [appDate] = useState(new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }));

  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    // Step 1 - Personal
    fullName: localStorage.getItem("farmer_name") || "",
    fatherName: "",
    dob: "",
    gender: "",
    mobile: localStorage.getItem("farmer_mobile") || "",
    email: localStorage.getItem("farmer_email") || "",
    aadhaar: "",
    pan: "",
    // Step 2 - Address
    state: localStorage.getItem("farmer_state") || "",
    district: localStorage.getItem("farmer_district") || "",
    taluka: "",
    village: localStorage.getItem("farmer_village") || "",
    pincode: "",
    address: "",
    // Step 3 - Farmer
    farmerType: "",
    landOwnership: "",
    landArea: localStorage.getItem("agro_land_area") || "",
    irrigationAvailable: "",
    primaryCrop: localStorage.getItem("recent_crop") || "",
    secondaryCrop: "",
    annualIncome: "",
    // Step 4 - Bank
    accountHolder: localStorage.getItem("farmer_name") || "",
    bankName: "",
    branch: "",
    ifsc: "",
    accountNumber: "",
    // Step 5 - Docs
    docAadhaar: null,
    docLandRecord: null,
    docPassbook: null,
    docPhoto: null,
    docAadhaarPreview: null,
    docLandRecordPreview: null,
    docPassbookPreview: null,
    docPhotoPreview: null,
    // Step 6
    declaration: false,
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setErr = (k, v) => setErrors(p => ({ ...p, [k]: v }));
  const clearErr = (k) => setErrors(p => { const n = { ...p }; delete n[k]; return n; });

  const validate = (step) => {
    const errs = {};
    if (step === 1) {
      if (!form.fullName.trim()) errs.fullName = "Full name is required";
      if (!form.fatherName.trim()) errs.fatherName = "Father's / Husband's name is required";
      if (!form.dob) errs.dob = "Date of birth is required";
      if (!form.gender) errs.gender = "Gender is required";
      if (!form.mobile.match(/^[6-9]\d{9}$/)) errs.mobile = "Enter a valid 10-digit mobile number";
      if (form.email && !form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Enter a valid email address";
      if (!form.aadhaar.replace(/\s/g,"").match(/^\d{12}$/)) errs.aadhaar = "Aadhaar must be 12 digits";
    }
    if (step === 2) {
      if (!form.state.trim()) errs.state = "State is required";
      if (!form.district.trim()) errs.district = "District is required";
      if (!form.village.trim()) errs.village = "Village is required";
      if (!form.pincode.match(/^\d{6}$/)) errs.pincode = "Enter valid 6-digit PIN code";
      if (!form.address.trim()) errs.address = "Full address is required";
    }
    if (step === 3) {
      if (!form.farmerType) errs.farmerType = "Farmer type is required";
      if (!form.landOwnership) errs.landOwnership = "Land ownership is required";
      if (!form.landArea) errs.landArea = "Land area is required";
      if (!form.irrigationAvailable) errs.irrigationAvailable = "Please select irrigation availability";
      if (!form.primaryCrop.trim()) errs.primaryCrop = "Primary crop is required";
    }
    if (step === 4) {
      if (!form.accountHolder.trim()) errs.accountHolder = "Account holder name is required";
      if (!form.bankName.trim()) errs.bankName = "Bank name is required";
      if (!form.ifsc.match(/^[A-Z]{4}0[A-Z0-9]{6}$/)) errs.ifsc = "Enter valid IFSC (e.g. SBIN0001234)";
      if (!form.accountNumber.match(/^\d{9,18}$/)) errs.accountNumber = "Enter valid account number";
    }
    if (step === 6) {
      if (!form.declaration) errs.declaration = "You must accept the declaration to submit";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => { if (validate(step)) setStep(s => Math.min(s + 1, TOTAL_STEPS)); };
  const back = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = () => {
    if (!validate(6)) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 2000);
  };

  const handleFileUpload = (field, previewField, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { set(field, file); set(previewField, e.target.result); };
    reader.readAsDataURL(file);
  };

  const steps = [
    { n: 1, label: "Personal", icon: "👤" },
    { n: 2, label: "Address", icon: "🏠" },
    { n: 3, label: "Farm", icon: "🌾" },
    { n: 4, label: "Bank", icon: "🏦" },
    { n: 5, label: "Documents", icon: "📄" },
    { n: 6, label: "Review", icon: "✅" },
  ];

  const inp = (key, type="text", placeholder="", opts={}) => ({
    type, value: form[key] || "",
    onChange: e => { set(key, type === "number" ? e.target.value : e.target.value); clearErr(key); },
    placeholder,
    style: { ...fS.input, ...(errors[key] ? { borderColor: SC.error } : {}), ...(opts.style || {}) },
    maxLength: opts.maxLength,
  });

  const fS = {
    input: { width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${SC.border}`, fontSize: 14, color: SC.text, background: "#FAFAFA", outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.15s" },
    label: { fontWeight: 600, fontSize: 12, color: SC.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 },
    err: { fontSize: 11, color: SC.error, marginTop: 4, display: "block" },
    sel: { width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${SC.border}`, fontSize: 14, color: SC.text, background: "#FAFAFA", outline: "none", cursor: "pointer", fontFamily: "inherit" },
    section: { marginBottom: 0 },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
    field: { marginBottom: 18 },
  };

  const Field = ({ label, name, children, required }) => (
    <div style={fS.field}>
      <label style={fS.label}>{label}{required && <span style={{ color: SC.error }}> *</span>}</label>
      {children}
      {errors[name] && <span style={fS.err}>⚠ {errors[name]}</span>}
    </div>
  );

  const Sel = ({ name, options, placeholder }) => (
    <select value={form[name] || ""} onChange={e => { set(name, e.target.value); clearErr(name); }}
      style={{ ...fS.sel, ...(errors[name] ? { borderColor: SC.error } : {}) }}>
      <option value="">{placeholder || "-- Select --"}</option>
      {options.map(o => <option key={o.v || o} value={o.v || o}>{o.l || o}</option>)}
    </select>
  );

  const DocUpload = ({ label, field, preview }) => (
    <div style={{ border: `2px dashed ${form[preview] ? SC.success : SC.border}`, borderRadius: 12, padding: 16, textAlign: "center", background: form[preview] ? SC.successBg : "#FAFAFA", transition: "all 0.2s" }}>
      {form[preview] ? (
        <div>
          <img src={form[preview]} alt={label} style={{ maxHeight: 80, maxWidth: "100%", borderRadius: 8, marginBottom: 8 }} />
          <div style={{ fontSize: 12, color: SC.success, fontWeight: 600 }}>✓ {label} uploaded</div>
          <label style={{ fontSize: 11, color: SC.primary, cursor: "pointer", textDecoration: "underline", display: "block", marginTop: 4 }}>
            Change
            <input type="file" accept="image/*,.pdf" onChange={e => handleFileUpload(field, preview, e.target.files[0])} style={{ display: "none" }} />
          </label>
        </div>
      ) : (
        <label style={{ cursor: "pointer", display: "block" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📎</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: SC.text, marginBottom: 4 }}>{label}</div>
          <div style={{ fontSize: 11, color: SC.textMuted, marginBottom: 10 }}>JPG, PNG or PDF (demo only)</div>
          <div style={{ display: "inline-block", padding: "6px 16px", background: SC.primary, color: "#fff", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Browse File</div>
          <input type="file" accept="image/*,.pdf" onChange={e => handleFileUpload(field, preview, e.target.files[0])} style={{ display: "none" }} />
        </label>
      )}
    </div>
  );

  const ReceiptContent = () => (
    <div id="scheme-receipt" style={{ background: SC.card, borderRadius: 16, padding: "32px 36px", maxWidth: 600, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 28, paddingBottom: 24, borderBottom: `2px dashed ${SC.border}` }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, background: `linear-gradient(135deg, ${SC.primary}, ${SC.secondary})`, borderRadius: 16, marginBottom: 14 }}>
          <span style={{ fontSize: 28 }}>🏛️</span>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: SC.textMuted, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4 }}>Government of India — Ministry of Agriculture</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: SC.text, marginBottom: 4 }}>Application Receipt</div>
        <div style={{ fontSize: 14, color: SC.textMuted }}>{scheme.name}</div>
      </div>
      <div style={{ background: `linear-gradient(135deg, ${SC.primary}10, ${SC.secondary}10)`, borderRadius: 12, padding: "16px 20px", marginBottom: 20, border: `1px solid ${SC.primary}20` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: SC.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Application ID</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: SC.primary, fontFamily: "monospace" }}>{appId}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: SC.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Status</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: SC.warningBg, color: SC.warning, padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 700, border: `1px solid ${SC.warning}40` }}>
              ⏳ Pending Verification
            </div>
          </div>
        </div>
      </div>
      {[
        ["Applicant Name", form.fullName],
        ["Mobile Number", form.mobile],
        ["Aadhaar Number", form.aadhaar ? "XXXX-XXXX-" + form.aadhaar.replace(/\s/g,"").slice(-4) : "—"],
        ["State / District", `${form.state || "—"} / ${form.district || "—"}`],
        ["Primary Crop", form.primaryCrop || "—"],
        ["Total Land Area", form.landArea ? `${form.landArea} acres` : "—"],
        ["Bank Account", form.accountNumber ? "XXXX" + form.accountNumber.slice(-4) : "—"],
        ["Submission Date", appDate],
      ].map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${SC.border}`, alignItems: "center" }}>
          <span style={{ fontSize: 13, color: SC.textMuted }}>{k}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: SC.text }}>{v}</span>
        </div>
      ))}
      <div style={{ marginTop: 24, padding: "14px 18px", background: SC.successBg, borderRadius: 10, border: `1px solid ${SC.success}40`, fontSize: 12, color: "#166534", lineHeight: 1.6 }}>
        ✅ This is a demo receipt generated by AgroSmart. Please visit the official government portal to complete your actual application.
      </div>
    </div>
  );

  const headerGrad = `linear-gradient(135deg, ${SC.primary} 0%, ${SC.secondary} 100%)`;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "flex-start", justifyContent: "center", background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", overflowY: "auto", padding: "20px 16px" }}>
      <div style={{ width: "100%", maxWidth: 780, background: SC.card, borderRadius: 20, boxShadow: "0 25px 60px rgba(0,0,0,0.25)", overflow: "hidden", marginBottom: 24 }}>

        {/* Header */}
        <div style={{ background: headerGrad, padding: "22px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "0.8px", textTransform: "uppercase" }}>
                  🏛️ Demo Application Form
                </div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>{scheme.name}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 5 }}>Government of India — Ministry of Agriculture & Farmers' Welfare</div>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8, color: "#fff", width: 36, height: 36, cursor: "pointer", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>

          {!submitted && (
            <div style={{ marginTop: 20 }}>
              {/* Progress bar */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, position: "relative" }}>
                <div style={{ position: "absolute", top: 16, left: "5%", right: "5%", height: 2, background: "rgba(255,255,255,0.2)", zIndex: 0 }} />
                <div style={{ position: "absolute", top: 16, left: "5%", height: 2, background: "rgba(255,255,255,0.8)", zIndex: 1, width: `${((step - 1) / (TOTAL_STEPS - 1)) * 90}%`, transition: "width 0.4s ease" }} />
                {steps.map(s => (
                  <div key={s.n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative", zIndex: 2 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: s.n < step ? SC.success : s.n === step ? "#fff" : "rgba(255,255,255,0.2)", border: s.n === step ? `3px solid rgba(255,255,255,0.5)` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: s.n < step ? 14 : 13, transition: "all 0.3s", boxShadow: s.n === step ? "0 0 0 4px rgba(255,255,255,0.15)" : "none" }}>
                      {s.n < step ? "✓" : <span style={{ fontSize: 13 }}>{s.icon}</span>}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: s.n <= step ? "#fff" : "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        {!submitted && (
          <div style={{ background: "#FFFBEB", borderBottom: `1px solid #FDE68A`, padding: "10px 28px", fontSize: 12, color: "#92400E" }}>
            ⚠️ <strong>Demo Only:</strong> This form is for practice purposes. Your application will NOT be submitted to any government authority.
          </div>
        )}

        {/* Content */}
        <div style={{ padding: "28px 32px" }}>

          {/* ── SUCCESS / RECEIPT ── */}
          {submitted && (
            <div>
              <div style={{ textAlign: "center", padding: "8px 0 24px" }}>
                <div style={{ width: 72, height: 72, background: SC.successBg, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 36 }}>✅</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: SC.text, marginBottom: 6 }}>Application Submitted Successfully!</div>
                <div style={{ fontSize: 14, color: SC.textMuted, marginBottom: 20 }}>Your demo application has been recorded. Keep the Application ID safe.</div>
                <div style={{ display: "inline-block", background: `${SC.primary}10`, border: `2px solid ${SC.primary}30`, borderRadius: 12, padding: "12px 24px", marginBottom: 24 }}>
                  <div style={{ fontSize: 11, color: SC.primary, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Application ID</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: SC.primary, fontFamily: "monospace" }}>{appId}</div>
                  <div style={{ fontSize: 12, color: SC.textMuted, marginTop: 4 }}>Submitted: {appDate} · Status: <span style={{ color: SC.warning, fontWeight: 600 }}>Pending Verification</span></div>
                </div>
              </div>
              <ReceiptContent />
              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
                <button onClick={() => window.print()} style={{ padding: "11px 22px", background: SC.primary, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>🖨️ Print Receipt</button>
                <button onClick={onClose} style={{ padding: "11px 22px", background: SC.bg, color: SC.text, border: `1px solid ${SC.border}`, borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Close</button>
              </div>
            </div>
          )}

          {/* ── STEP 1: PERSONAL ── */}
          {!submitted && step === 1 && (
            <div>
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: SC.text, marginBottom: 4 }}>👤 Personal Information</div>
                <div style={{ fontSize: 13, color: SC.textMuted }}>Your basic personal details as per government records</div>
              </div>
              <div style={fS.grid2}>
                <Field label="Full Name" name="fullName" required>
                  <input {...inp("fullName", "text", "As per Aadhaar card")} />
                </Field>
                <Field label="Father's / Husband's Name" name="fatherName" required>
                  <input {...inp("fatherName", "text", "As per land records")} />
                </Field>
                <Field label="Date of Birth" name="dob" required>
                  <input {...inp("dob", "date")} />
                </Field>
                <Field label="Gender" name="gender" required>
                  <Sel name="gender" options={["Male", "Female", "Other"]} placeholder="-- Select Gender --" />
                </Field>
                <Field label="Mobile Number" name="mobile" required>
                  <input {...inp("mobile", "tel", "10-digit mobile number")} maxLength={10} />
                </Field>
                <Field label="Email Address" name="email">
                  <input {...inp("email", "email", "your@email.com")} />
                </Field>
                <Field label="Aadhaar Number" name="aadhaar" required>
                  <input {...inp("aadhaar", "text", "12-digit Aadhaar number")} maxLength={14}
                    onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0,12); set("aadhaar", v); clearErr("aadhaar"); }} />
                </Field>
                <Field label="PAN Number" name="pan">
                  <input {...inp("pan", "text", "Optional")} maxLength={10}
                    onChange={e => { set("pan", e.target.value.toUpperCase()); clearErr("pan"); }} />
                </Field>
              </div>
            </div>
          )}

          {/* ── STEP 2: ADDRESS ── */}
          {!submitted && step === 2 && (
            <div>
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: SC.text, marginBottom: 4 }}>🏠 Address Details</div>
                <div style={{ fontSize: 13, color: SC.textMuted }}>Your current residential and farm address</div>
              </div>
              <div style={fS.grid2}>
                <Field label="State" name="state" required>
                  <Sel name="state" options={["Maharashtra","Uttar Pradesh","Punjab","Haryana","Madhya Pradesh","Rajasthan","Gujarat","Karnataka","Andhra Pradesh","Tamil Nadu","Bihar","West Bengal","Other"]} />
                </Field>
                <Field label="District" name="district" required>
                  <input {...inp("district", "text", "Your district")} />
                </Field>
                <Field label="Taluka / Block" name="taluka">
                  <input {...inp("taluka", "text", "Your taluka")} />
                </Field>
                <Field label="Village / Gram Panchayat" name="village" required>
                  <input {...inp("village", "text", "Your village")} />
                </Field>
                <Field label="PIN Code" name="pincode" required>
                  <input {...inp("pincode", "text", "6-digit PIN code")} maxLength={6}
                    onChange={e => { const v = e.target.value.replace(/\D/g,"").slice(0,6); set("pincode",v); clearErr("pincode"); }} />
                </Field>
              </div>
              <Field label="Full Address" name="address" required>
                <textarea value={form.address} onChange={e => { set("address", e.target.value); clearErr("address"); }} placeholder="House no., Street, Locality" rows={3}
                  style={{ ...fS.input, resize: "vertical", lineHeight: 1.6, ...(errors.address ? { borderColor: SC.error } : {}) }} />
              </Field>
            </div>
          )}

          {/* ── STEP 3: FARMER DETAILS ── */}
          {!submitted && step === 3 && (
            <div>
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: SC.text, marginBottom: 4 }}>🌾 Farm Information</div>
                <div style={{ fontSize: 13, color: SC.textMuted }}>Details about your farm holdings and cultivation</div>
              </div>
              <div style={fS.grid2}>
                <Field label="Farmer Category" name="farmerType" required>
                  <Sel name="farmerType" options={[{v:"Small",l:"Small (1–2 Ha)"},{v:"Marginal",l:"Marginal (< 1 Ha)"},{v:"Medium",l:"Medium (2–10 Ha)"},{v:"Large",l:"Large (> 10 Ha)"}]} />
                </Field>
                <Field label="Land Ownership" name="landOwnership" required>
                  <Sel name="landOwnership" options={["Own","Lease","Joint Family","Inherited"]} />
                </Field>
                <Field label="Total Land Area (Acres)" name="landArea" required>
                  <input {...inp("landArea", "number", "e.g. 2.5")} />
                </Field>
                <Field label="Irrigation Available" name="irrigationAvailable" required>
                  <Sel name="irrigationAvailable" options={[{v:"Yes",l:"Yes — Irrigated"},{v:"No",l:"No — Rain-fed only"}]} />
                </Field>
                <Field label="Primary Crop" name="primaryCrop" required>
                  <input {...inp("primaryCrop", "text", "e.g. Rice, Wheat, Cotton")} />
                </Field>
                <Field label="Secondary Crop" name="secondaryCrop">
                  <input {...inp("secondaryCrop", "text", "Optional")} />
                </Field>
                <Field label="Annual Farm Income (₹)" name="annualIncome">
                  <input {...inp("annualIncome", "number", "e.g. 120000")} />
                </Field>
              </div>
            </div>
          )}

          {/* ── STEP 4: BANK ── */}
          {!submitted && step === 4 && (
            <div>
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: SC.text, marginBottom: 4 }}>🏦 Bank Details</div>
                <div style={{ fontSize: 13, color: SC.textMuted }}>For Direct Benefit Transfer (DBT) of subsidies</div>
              </div>
              <div style={fS.grid2}>
                <Field label="Account Holder Name" name="accountHolder" required>
                  <input {...inp("accountHolder", "text", "As per bank records")} />
                </Field>
                <Field label="Bank Name" name="bankName" required>
                  <Sel name="bankName" options={["State Bank of India","Punjab National Bank","Bank of Baroda","Canara Bank","Union Bank of India","Maharashtra Gramin Bank","District Co-operative Bank","Bank of Maharashtra","HDFC Bank","ICICI Bank","Other"]} />
                </Field>
                <Field label="Branch Name" name="branch">
                  <input {...inp("branch", "text", "Branch location")} />
                </Field>
                <Field label="IFSC Code" name="ifsc" required>
                  <input {...inp("ifsc", "text", "e.g. SBIN0001234")} maxLength={11}
                    onChange={e => { set("ifsc", e.target.value.toUpperCase()); clearErr("ifsc"); }} />
                </Field>
                <Field label="Account Number" name="accountNumber" required>
                  <input {...inp("accountNumber", "text", "Your bank account number")} />
                </Field>
              </div>
              <div style={{ background: `${SC.primary}08`, border: `1px solid ${SC.primary}20`, borderRadius: 12, padding: "14px 18px", fontSize: 13, color: SC.primary, lineHeight: 1.6 }}>
                🔒 Your bank details are used only for DBT credit and are protected under government data privacy guidelines.
              </div>
            </div>
          )}

          {/* ── STEP 5: DOCUMENTS ── */}
          {!submitted && step === 5 && (
            <div>
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: SC.text, marginBottom: 4 }}>📄 Document Upload</div>
                <div style={{ fontSize: 13, color: SC.textMuted }}>Upload scanned copies (demo only — not stored permanently)</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 12, color: SC.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Aadhaar Card *</div>
                  <DocUpload label="Aadhaar Card" field="docAadhaar" preview="docAadhaarPreview" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 12, color: SC.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Land Record (7/12) *</div>
                  <DocUpload label="Land Record" field="docLandRecord" preview="docLandRecordPreview" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 12, color: SC.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Bank Passbook *</div>
                  <DocUpload label="Bank Passbook" field="docPassbook" preview="docPassbookPreview" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 12, color: SC.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Passport Size Photo</div>
                  <DocUpload label="Passport Photo" field="docPhoto" preview="docPhotoPreview" />
                </div>
              </div>
              <div style={{ marginTop: 16, background: "#FFFBEB", border: `1px solid #FDE68A`, borderRadius: 10, padding: "12px 16px", fontSize: 12, color: "#92400E" }}>
                💡 <strong>Demo Note:</strong> Files are previewed temporarily in your browser and are not uploaded to any server.
              </div>
            </div>
          )}

          {/* ── STEP 6: REVIEW + DECLARATION ── */}
          {!submitted && step === 6 && (
            <div>
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: SC.text, marginBottom: 4 }}>✅ Review & Submit</div>
                <div style={{ fontSize: 13, color: SC.textMuted }}>Review your information before final submission</div>
              </div>

              {[
                { title: "Personal Details", icon: "👤", rows: [["Full Name", form.fullName],["Father's Name", form.fatherName],["Date of Birth", form.dob],["Gender", form.gender],["Mobile", form.mobile],["Aadhaar", form.aadhaar ? "XXXX-XXXX-"+form.aadhaar.slice(-4) : "—"]] },
                { title: "Address", icon: "🏠", rows: [["State / District", `${form.state} / ${form.district}`],["Village", form.village],["PIN Code", form.pincode]] },
                { title: "Farm Details", icon: "🌾", rows: [["Farmer Category", form.farmerType],["Land Area", `${form.landArea} acres`],["Primary Crop", form.primaryCrop],["Irrigation", form.irrigationAvailable]] },
                { title: "Bank Details", icon: "🏦", rows: [["Bank", form.bankName],["IFSC", form.ifsc],["Account", form.accountNumber ? "XXXX"+form.accountNumber.slice(-4) : "—"]] },
              ].map(sec => (
                <div key={sec.title} style={{ border: `1px solid ${SC.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
                  <div style={{ background: `${SC.primary}0A`, padding: "10px 16px", fontWeight: 700, fontSize: 13, color: SC.primary, display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${SC.border}` }}>
                    {sec.icon} {sec.title}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                    {sec.rows.map(([k, v], i) => (
                      <div key={k} style={{ padding: "10px 16px", background: i % 4 < 2 ? "#FAFAFA" : "#fff", borderBottom: `1px solid ${SC.border}` }}>
                        <div style={{ fontSize: 11, color: SC.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>{k}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: SC.text, marginTop: 2 }}>{v || "—"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 20, padding: "18px 20px", background: `${SC.primary}06`, border: `2px solid ${SC.primary}20`, borderRadius: 12 }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                  <input type="checkbox" checked={form.declaration} onChange={e => { set("declaration", e.target.checked); clearErr("declaration"); }}
                    style={{ width: 18, height: 18, accentColor: SC.primary, marginTop: 2, flexShrink: 0, cursor: "pointer" }} />
                  <div style={{ fontSize: 13, color: SC.text, lineHeight: 1.6 }}>
                    I hereby declare that all the information provided in this application is true, correct and complete to the best of my knowledge and belief. I understand that any false information may result in rejection of application and legal action.
                  </div>
                </label>
                {errors.declaration && <div style={{ fontSize: 11, color: SC.error, marginTop: 8 }}>⚠ {errors.declaration}</div>}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {!submitted && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28, paddingTop: 20, borderTop: `1px solid ${SC.border}` }}>
              <button onClick={step === 1 ? onClose : back}
                style={{ padding: "11px 22px", background: SC.bg, color: SC.text, border: `1.5px solid ${SC.border}`, borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                {step === 1 ? "✕ Cancel" : "← Back"}
              </button>
              <div style={{ fontSize: 12, color: SC.textMuted }}>Step {step} of {TOTAL_STEPS}</div>
              {step < TOTAL_STEPS ? (
                <button onClick={next}
                  style={{ padding: "11px 28px", background: `linear-gradient(135deg, ${SC.primary}, ${SC.secondary})`, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: `0 4px 12px ${SC.primary}40` }}>
                  Next →
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={submitting}
                  style={{ padding: "11px 28px", background: submitting ? SC.textMuted : `linear-gradient(135deg, ${SC.success}, #15803D)`, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: submitting ? "not-allowed" : "pointer", boxShadow: submitting ? "none" : "0 4px 12px rgba(34,197,94,0.4)", display: "flex", alignItems: "center", gap: 8, minWidth: 140, justifyContent: "center" }}>
                  {submitting ? (
                    <><span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Submitting...</>
                  ) : "🚀 Submit Application"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCHEME DETAIL PAGE (BLUE THEME)
───────────────────────────────────────────── */
function SchemeDetailPage({ scheme, allSchemes, onBack, onSchemeSelect, savedSchemes, onToggleSave }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState(false);
  const detail = SCHEME_DETAILS_DB[scheme.id];
  const isSaved = savedSchemes.includes(scheme.id);
  const relatedIds = detail?.relatedSchemes || [];
  const relatedList = allSchemes.filter(s => relatedIds.includes(s.id)).slice(0, 3);

  const handleShare = () => { navigator.clipboard?.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const sS = {
    section: { background: SC.card, borderRadius: 16, border: `1px solid ${SC.border}`, padding: "24px 28px", marginBottom: 16, boxShadow: SC.shadow },
    heading: { fontSize: 13, fontWeight: 800, color: SC.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8, textTransform: "uppercase", letterSpacing: "0.5px" },
    iconBox: (bg) => ({ width: 30, height: 30, borderRadius: 8, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }),
  };

  const catColors = {
    "Crop Insurance": { bg: "#EFF6FF", accent: SC.primary },
    "Irrigation": { bg: "#F0FDFA", accent: SC.teal },
    "Mechanization": { bg: SC.purpleBg, accent: SC.purple },
    "Soil": { bg: "#FFF7ED", accent: "#EA580C" },
    "Income Support": { bg: SC.successBg, accent: SC.success },
    "Credit": { bg: "#FEFCE8", accent: "#CA8A04" },
    "Market": { bg: "#F0F9FF", accent: "#0284C7" },
  };
  const cat = catColors[scheme.category] || { bg: "#F8FAFC", accent: SC.primary };

  return (
    <>
      {showForm && <ApplicationFormModal scheme={scheme} onClose={() => setShowForm(false)} />}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 0" }}>
        <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: SC.card, border: `1px solid ${SC.border}`, borderRadius: 10, fontSize: 13, fontWeight: 600, color: SC.text, cursor: "pointer", marginBottom: 20, boxShadow: SC.shadow }}>
          ← Back to Schemes
        </button>

        {/* Hero */}
        <div style={{ background: `linear-gradient(135deg, ${SC.primary} 0%, ${SC.secondary} 100%)`, borderRadius: 20, padding: "32px 36px", color: "#fff", marginBottom: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -60, top: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ position: "absolute", right: 60, bottom: -80, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,0.18)", color: "#fff", padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>🏛️ Central Government</span>
                {scheme.status && <span style={{ background: "rgba(34,197,94,0.25)", color: "#BBF7D0", padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>✅ {scheme.status}</span>}
                {scheme.deadline && scheme.deadline !== "Open" && <span style={{ background: "rgba(245,158,11,0.25)", color: "#FDE68A", padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>⏰ Deadline: {scheme.deadline}</span>}
              </div>
              <h1 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 800, lineHeight: 1.3 }}>{scheme.name}</h1>
              <p style={{ margin: 0, opacity: 0.88, fontSize: 14, lineHeight: 1.6, maxWidth: 520 }}>{scheme.desc}</p>
              {detail?.lastUpdated && <div style={{ marginTop: 12, fontSize: 12, opacity: 0.6 }}>🗓️ Last updated: {detail.lastUpdated}</div>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => onToggleSave(scheme.id)} style={{ padding: "8px 16px", background: isSaved ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
                {isSaved ? "★ Saved" : "☆ Save"}
              </button>
              <button onClick={handleShare} style={{ padding: "8px 16px", background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
                {copied ? "✓ Copied!" : "🔗 Share"}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Action Panel */}
        <div style={{ borderRadius: 16, border: `2px solid ${SC.primary}`, boxShadow: `0 4px 20px ${SC.primary}15`, marginBottom: 16, overflow: "hidden" }}>
          <div style={{ background: `linear-gradient(90deg, ${SC.primary}, ${SC.secondary})`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20 }}>⚡</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: "#fff" }}>Quick Actions</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>Prepare your application or visit the official portal</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "#F0F4FF" }}>
            <div style={{ padding: "16px 20px", borderRight: `1px solid ${SC.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: SC.primary, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>💰 Key Benefits</div>
              {(detail?.keyBenefits || []).slice(0, 3).map((b, i) => (
                <div key={i} style={{ fontSize: 12, color: SC.text, lineHeight: 1.45, marginBottom: 6, display: "flex", gap: 6 }}>
                  <span style={{ color: SC.primary, fontWeight: 800, flexShrink: 0 }}>✓</span>{b}
                </div>
              ))}
            </div>
            <div style={{ padding: "16px 20px", borderRight: `1px solid ${SC.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#0D9488", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>✅ Eligibility</div>
              {(detail?.eligibility || []).slice(0, 3).map((e, i) => (
                <div key={i} style={{ fontSize: 12, color: SC.text, lineHeight: 1.45, marginBottom: 6, display: "flex", gap: 6 }}>
                  <span style={{ color: "#0D9488", fontWeight: 800, flexShrink: 0 }}>›</span>{e}
                </div>
              ))}
            </div>
            <div style={{ padding: "16px 20px" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: SC.secondary, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>📄 Documents</div>
              {(scheme.docs || []).slice(0, 4).map((d, i) => (
                <div key={i} style={{ fontSize: 12, color: SC.text, lineHeight: 1.45, marginBottom: 6, display: "flex", gap: 6 }}>
                  <span style={{ color: SC.secondary, fontWeight: 800, flexShrink: 0 }}>□</span>{d}
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: SC.card, padding: "16px 24px", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", borderTop: `1px solid ${SC.border}` }}>
            <button onClick={() => setShowForm(true)} style={{ padding: "12px 22px", background: `linear-gradient(135deg, ${SC.primary}, ${SC.secondary})`, color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 4px 14px ${SC.primary}40` }}>
              <span style={{ fontSize: 16 }}>📋</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 800, lineHeight: 1.1 }}>Apply Now (Demo)</div>
                <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 400 }}>Multi-step application form</div>
              </div>
            </button>
            <a href={scheme.url} target="_blank" rel="noopener noreferrer" style={{ padding: "12px 22px", background: SC.bg, color: SC.primary, border: `1.5px solid ${SC.primary}30`, borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <span style={{ fontSize: 16 }}>🌐</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 800, lineHeight: 1.1 }}>Official Portal ↗</div>
                <div style={{ fontSize: 11, opacity: 0.65, fontWeight: 400 }}>Submit on government site</div>
              </div>
            </a>
            <div style={{ flex: 1, minWidth: 140, fontSize: 12, color: SC.textMuted, lineHeight: 1.5, borderLeft: `2px solid ${SC.border}`, paddingLeft: 14 }}>
              <strong>Recommended:</strong><br />Use demo form to prepare → then apply on official portal
            </div>
          </div>
        </div>

        {/* Beneficiaries */}
        {detail?.targetBeneficiaries && (
          <div style={{ ...sS.section, background: "#EFF6FF", border: `1px solid ${SC.primary}20` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 24 }}>👥</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: SC.primary, textTransform: "uppercase", letterSpacing: "0.5px" }}>Target Beneficiaries</div>
                <div style={{ fontSize: 14, color: SC.text, marginTop: 3 }}>{detail.targetBeneficiaries}</div>
              </div>
            </div>
          </div>
        )}

        {/* Benefits + Eligibility */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          {detail?.keyBenefits && (
            <div style={sS.section}>
              <div style={sS.heading}>
                <div style={sS.iconBox("#DBEAFE")}>💰</div> Key Benefits
              </div>
              {detail.keyBenefits.map((b, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < detail.keyBenefits.length - 1 ? `1px solid ${SC.border}` : "none" }}>
                  <span style={{ color: SC.primary, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 13, color: SC.text, lineHeight: 1.5 }}>{b}</span>
                </div>
              ))}
            </div>
          )}
          {detail?.eligibility && (
            <div style={sS.section}>
              <div style={sS.heading}>
                <div style={sS.iconBox("#D1FAE5")}>✅</div> Eligibility Criteria
              </div>
              {detail.eligibility.map((e, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < detail.eligibility.length - 1 ? `1px solid ${SC.border}` : "none" }}>
                  <span style={{ color: SC.teal, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>›</span>
                  <span style={{ fontSize: 13, color: SC.text, lineHeight: 1.5 }}>{e}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Documents */}
        {scheme.docs && scheme.docs.length > 0 && (
          <div style={sS.section}>
            <div style={sS.heading}><div style={sS.iconBox("#EDE9FE")}>📄</div> Required Documents</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
              {scheme.docs.map((doc, i) => (
                <div key={i} style={{ background: SC.bg, border: `1px solid ${SC.border}`, borderRadius: 10, padding: "11px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 26, height: 26, background: "#EDE9FE", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>📋</div>
                  <span style={{ fontSize: 13, color: SC.text, fontWeight: 500 }}>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Process */}
        {scheme.process && scheme.process.length > 0 && (
          <div style={sS.section}>
            <div style={sS.heading}><div style={sS.iconBox("#DBEAFE")}>🛠️</div> Application Process</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {scheme.process.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 16, position: "relative", paddingBottom: i < scheme.process.length - 1 ? 20 : 0 }}>
                  {i < scheme.process.length - 1 && <div style={{ position: "absolute", left: 17, top: 36, bottom: 0, width: 2, background: `${SC.primary}20` }} />}
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${SC.primary}, ${SC.secondary})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0, zIndex: 1, boxShadow: `0 2px 8px ${SC.primary}30` }}>{i + 1}</div>
                  <div style={{ background: SC.bg, border: `1px solid ${SC.border}`, borderRadius: 12, padding: "11px 16px", flex: 1 }}>
                    <span style={{ fontSize: 13, color: SC.text, lineHeight: 1.5 }}>{s}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Important Dates */}
        {detail?.importantDates && detail.importantDates.length > 0 && (
          <div style={sS.section}>
            <div style={sS.heading}><div style={sS.iconBox("#FEE2E2")}>🗓️</div> Important Dates</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 12 }}>
              {detail.importantDates.map((item, i) => (
                <div key={i} style={{ background: "#FEF2F2", border: `1px solid #FECACA`, borderRadius: 12, padding: "14px 18px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: SC.error, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 6 }}>{item.event}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: SC.text }}>{item.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs */}
        {detail?.faqs && detail.faqs.length > 0 && (
          <div style={sS.section}>
            <div style={sS.heading}><div style={sS.iconBox("#EFF6FF")}>❓</div> Frequently Asked Questions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {detail.faqs.map((faq, i) => (
                <div key={i} style={{ border: `1px solid ${SC.border}`, borderRadius: 12, overflow: "hidden" }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: "100%", background: openFaq === i ? "#EFF6FF" : SC.bg, border: "none", padding: "14px 18px", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: SC.text }}>{faq.q}</span>
                    <span style={{ fontSize: 18, color: SC.primary, flexShrink: 0, transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "14px 18px", background: SC.card, borderTop: `1px solid ${SC.border}`, fontSize: 13, color: SC.textMuted, lineHeight: 1.65 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Schemes */}
        {relatedList.length > 0 && (
          <div style={sS.section}>
            <div style={sS.heading}><div style={sS.iconBox("#FEF3C7")}>🔗</div> Related Schemes</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
              {relatedList.map(rel => (
                <div key={rel.id} onClick={() => onSchemeSelect(rel)} style={{ background: SC.bg, border: `1px solid ${SC.border}`, borderRadius: 12, padding: "16px", cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = SC.primary; e.currentTarget.style.background = "#EFF6FF"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = SC.border; e.currentTarget.style.background = SC.bg; }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: SC.primary, marginBottom: 6 }}>{rel.name}</div>
                  <div style={{ fontSize: 12, color: SC.textMuted, lineHeight: 1.4 }}>{rel.desc.slice(0, 70)}…</div>
                  <div style={{ fontSize: 12, color: SC.primary, marginTop: 8, fontWeight: 600 }}>View details →</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ background: `linear-gradient(135deg, ${SC.primary}, ${SC.secondary})`, borderRadius: 20, padding: "32px 36px", textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Ready to Apply?</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 24 }}>Use the demo form to prepare, then submit on the official government portal.</div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setShowForm(true)} style={{ padding: "13px 28px", background: "#fff", color: SC.primary, border: "none", borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
              📋 Apply Now (Demo)
            </button>
            <a href={scheme.url} target="_blank" rel="noopener noreferrer" style={{ padding: "13px 22px", background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              🌐 Official Portal ↗
            </a>
            <button onClick={onBack} style={{ padding: "13px 22px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
              ← Back to List
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   SCHEME LIST PAGE (BLUE THEME)
───────────────────────────────────────────── */
function SchemeListPage({ schemes, onSchemeSelect, savedSchemes, onToggleSave }) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterState, setFilterState] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [formScheme, setFormScheme] = useState(null);

  const categories = [...new Set(schemes.map(s => s.category).filter(Boolean))];

  const filtered = schemes.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || s.category === filterCat;
    const matchSaved = filterState !== "saved" || savedSchemes.includes(s.id);
    return matchSearch && matchCat && matchSaved;
  });
  const displaySchemes = activeTab === "all" ? filtered : filtered.filter(s => s.tier === activeTab);

  const tabs = [
    { id: "all", label: "All Schemes", count: filtered.length },
    { id: "crop", label: "Crop-Specific", count: filtered.filter(s => s.tier === "crop").length },
    { id: "famous", label: "Flagship", count: filtered.filter(s => s.tier === "famous").length },
  ];

  const catIcon = { "Crop Insurance": "🛡️", "Irrigation": "💧", "Mechanization": "⚙️", "Soil": "🌱", "Income Support": "💰", "Credit": "🏦", "Market": "📊", "Seeds": "🌾" };
  const catColor = { "Crop Insurance": { bg: "#EFF6FF", text: "#2563EB" }, "Irrigation": { bg: "#F0FDFA", text: "#0D9488" }, "Mechanization": { bg: "#F5F3FF", text: "#7C3AED" }, "Soil": { bg: "#FFF7ED", text: "#EA580C" }, "Income Support": { bg: "#F0FDF4", text: "#16A34A" }, "Credit": { bg: "#FEFCE8", text: "#CA8A04" }, "Market": { bg: "#F0F9FF", text: "#0284C7" }, "Seeds": { bg: "#FDF4FF", text: "#9333EA" } };

  return (
    <>
      {formScheme && <ApplicationFormModal scheme={formScheme} onClose={() => setFormScheme(null)} />}

      <div style={{ background: SC.bg, minHeight: "100%" }}>
        {/* Header Banner */}
        <div style={{ background: `linear-gradient(135deg, ${SC.primary} 0%, ${SC.secondary} 100%)`, padding: "28px 32px", marginBottom: 0 }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8 }}>Government of India</div>
            <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800, color: "#fff" }}>🏛️ Government Schemes & Subsidies</h2>
            <p style={{ margin: "0 0 20px", fontSize: 14, color: "rgba(255,255,255,0.8)" }}>Discover and apply for agricultural welfare schemes tailored for farmers</p>

            {/* Search */}
            <div style={{ position: "relative", maxWidth: 480 }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "rgba(255,255,255,0.5)" }}>🔍</span>
              <input type="text" placeholder="Search schemes by name or benefit..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", padding: "12px 14px 12px 44px", borderRadius: 12, border: "none", background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", backdropFilter: "blur(4px)" }}
              />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={{ background: SC.card, borderBottom: `1px solid ${SC.border}`, padding: "14px 32px", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", boxShadow: SC.shadow }}>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${SC.border}`, fontSize: 13, color: SC.text, background: SC.card, cursor: "pointer", fontFamily: "inherit" }}>
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{catIcon[c] || "📋"} {c}</option>)}
          </select>
          <select value={filterState} onChange={e => setFilterState(e.target.value)} style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${SC.border}`, fontSize: 13, color: SC.text, background: SC.card, cursor: "pointer", fontFamily: "inherit" }}>
            <option value="all">All Schemes</option>
            <option value="saved">⭐ Saved Only</option>
          </select>
          {savedSchemes.length > 0 && (
            <div style={{ fontSize: 13, color: SC.primary, fontWeight: 600, background: "#EFF6FF", padding: "6px 14px", borderRadius: 20, border: `1px solid ${SC.primary}30` }}>
              ★ {savedSchemes.length} saved
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ background: SC.card, borderBottom: `1px solid ${SC.border}`, padding: "0 32px", display: "flex", gap: 0 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ padding: "14px 20px", border: "none", background: "transparent", fontWeight: activeTab === tab.id ? 700 : 500, fontSize: 14, color: activeTab === tab.id ? SC.primary : SC.textMuted, cursor: "pointer", borderBottom: activeTab === tab.id ? `3px solid ${SC.primary}` : "3px solid transparent", transition: "all 0.2s" }}>
              {tab.label} <span style={{ fontSize: 11, opacity: 0.7 }}>({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Scheme Cards */}
        <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 14, maxWidth: 940, margin: "0 auto" }}>
          {displaySchemes.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 24px", color: SC.textMuted }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: SC.text }}>No schemes found</div>
              <div style={{ fontSize: 13 }}>Try different search terms or clear filters</div>
            </div>
          )}

          {displaySchemes.map(sch => {
            const isSaved = savedSchemes.includes(sch.id);
            const detail = SCHEME_DETAILS_DB[sch.id];
            const cc = catColor[sch.category] || { bg: "#F8FAFC", text: SC.primary };

            return (
              <div key={sch.id} style={{ background: SC.card, border: `1px solid ${SC.border}`, borderRadius: 16, overflow: "hidden", boxShadow: SC.shadow, transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = SC.shadowLg; e.currentTarget.style.borderColor = SC.primary + "40"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = SC.shadow; e.currentTarget.style.borderColor = SC.border; }}>

                <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ flex: 1, cursor: "pointer" }} onClick={() => onSchemeSelect(sch)}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 10 }}>
                      <div style={{ width: 48, height: 48, background: `linear-gradient(135deg, ${SC.primary}15, ${SC.secondary}15)`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, border: `1px solid ${SC.primary}20` }}>
                        {catIcon[sch.category] || "🏛️"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 5 }}>
                          <span style={{ fontWeight: 800, fontSize: 15, color: SC.text }}>{sch.name}</span>
                          {sch.category && (
                            <span style={{ background: cc.bg, color: cc.text, padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{catIcon[sch.category]} {sch.category}</span>
                          )}
                          {sch.status && <span style={{ background: SC.successBg, color: "#16A34A", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>✅ {sch.status}</span>}
                          {sch.deadline && sch.deadline !== "Open" && <span style={{ background: "#FEF2F2", color: SC.error, padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>⏰ {sch.deadline}</span>}
                          {detail?.govType && <span style={{ background: "#F0F4FF", color: SC.secondary, padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>🏛️ {detail.govType}</span>}
                        </div>
                        <p style={{ margin: 0, fontSize: 13, color: SC.textMuted, lineHeight: 1.55 }}>{sch.desc}</p>
                      </div>
                    </div>

                    {detail?.keyBenefits && (
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                        {detail.keyBenefits.slice(0, 2).map((b, i) => (
                          <div key={i} style={{ background: SC.bg, border: `1px solid ${SC.border}`, borderRadius: 8, padding: "3px 10px", fontSize: 11, color: SC.textMuted }}>
                            ✓ {b.slice(0, 55)}{b.length > 55 ? "…" : ""}
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ marginTop: 12, fontSize: 12, fontWeight: 700, color: SC.primary }}>View full details →</div>
                  </div>

                  <button onClick={() => savedSchemes.includes(sch.id) ? onToggleSave(sch.id) : onToggleSave(sch.id)}
                    style={{ padding: "8px 12px", background: isSaved ? "#FFFBEB" : SC.bg, color: isSaved ? SC.warning : SC.textMuted, border: `1px solid ${isSaved ? "#FDE68A" : SC.border}`, borderRadius: 10, fontSize: 18, cursor: "pointer", flexShrink: 0 }}>
                    {isSaved ? "★" : "☆"}
                  </button>
                </div>

                {/* Action Footer */}
                <div style={{ background: SC.bg, borderTop: `1px solid ${SC.border}`, padding: "12px 24px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <button onClick={() => setFormScheme(sch)}
                    style={{ padding: "9px 18px", background: `linear-gradient(135deg, ${SC.primary}, ${SC.secondary})`, color: "#fff", border: "none", borderRadius: 9, fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: `0 2px 10px ${SC.primary}30` }}>
                    <span style={{ fontSize: 13 }}>📋</span> Apply Now (Demo)
                  </button>
                  <a href={sch.url} target="_blank" rel="noopener noreferrer"
                    style={{ padding: "9px 16px", background: SC.card, color: SC.primary, border: `1px solid ${SC.primary}30`, borderRadius: 9, fontWeight: 700, fontSize: 12, cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13 }}>🌐</span> Official Portal
                  </a>
                  <div style={{ fontSize: 11, color: SC.textMuted, flex: 1, textAlign: "right" }}>
                    <span style={{ color: SC.primary, cursor: "pointer", fontWeight: 600 }} onClick={() => onSchemeSelect(sch)}>View details & eligibility →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────────── */
function Dashboard() {
  const [activeModule, setActiveModule] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherForecast, setWeatherForecast] = useState(null);
  const [weatherAlert, setWeatherAlert] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(false);

  const videoRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isSosAlertEnabled, setIsSosAlertEnabled] = useState(true);

  const [soilType, setSoilType] = useState(() => localStorage.getItem("agro_soil") || "");
  const [profileCrop, setProfileCrop] = useState(() => localStorage.getItem("recent_crop") || "");
  const [soilPh, setSoilPh] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isSoilCameraActive, setIsSoilCameraActive] = useState(false);
  const soilVideoRef = useRef(null);
  const soilStreamRef = useRef(null);

  const [waterLevel, setWaterLevel] = useState("");
  const [waterSource, setWaterSource] = useState("");
  const [moistureLevel, setMoistureLevel] = useState("");
  const [waterTableDepth, setWaterTableDepth] = useState("");
  const [irrigationMethod, setIrrigationMethod] = useState("");

  const [cropSeason, setCropSeason] = useState("");
  const [cropMonth, setCropMonth] = useState("");
  const [date, setDate] = useState("");
  const [cropStage, setCropStage] = useState("");
  const [farmSize, setFarmSize] = useState("1");
  const [farmUnit, setFarmUnit] = useState("acres");

  const [selectedDiseaseCrop, setSelectedDiseaseCrop] = useState("");
  const [diseaseType, setDiseaseType] = useState("");
  const [diseaseSeverity, setDiseaseSeverity] = useState("");
  const [diseasePhoto, setDiseasePhoto] = useState(null);
  const [diseasePhotoBase64, setDiseasePhotoBase64] = useState(null);
  const [diseaseDiagnosticResult, setDiseaseDiagnosticResult] = useState(null);
  const [diseaseLoading, setDiseaseLoading] = useState(false);

  const [selectedScheme, setSelectedScheme] = useState(null);
  const [savedSchemes, setSavedSchemes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("saved_schemes") || "[]"); } catch { return []; }
  });

  const [marketPrices, setMarketPrices] = useState(null);
  const [marketLoading, setMarketLoading] = useState(false);

  const [langCode, setLangCode] = useState(() => localStorage.getItem("app_lang") || "en");

  useEffect(() => {
    const sync = () => { setLangCode(localStorage.getItem("app_lang") || "en"); setSoilType(localStorage.getItem("agro_soil") || ""); setProfileCrop(localStorage.getItem("recent_crop") || ""); };
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [activeModule]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
  }, []);

  useEffect(() => { localStorage.setItem("saved_schemes", JSON.stringify(savedSchemes)); }, [savedSchemes]);

  const handleToggleSave = (id) => setSavedSchemes(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const translations = {
    en: {
      logout: "Logout", dashboardTitle: "Dashboard", welcomeBack: "Welcome back!",
      farmOverview: "Your farm at a glance",
      weather: "Weather", soil: "Soil Diagnostics", water: "Hydrology",
      season: "Season Matrix", crop: "AI Crop Guide", fertilizer: "Fertilizer Planner",
      disease: "Disease Lab", market: "Market Prices", scheme: "Gov Schemes", sosSettings: "Settings",
      rainHigh: "⚠️ Heavy rain expected. Stop spraying and field operations.",
      rainMed: "Light rain possible. Monitor soil wetness.",
      rainLow: "Clear skies. Good conditions for field work.",
      blackSoil: "Black Regur Soil", redSoil: "Red Siliceous Loam", claySoil: "Heavy Clay",
      loamySoil: "Rich Organic Loam", sandySoil: "Sandy Soil", greySoil: "Grey Alluvial",
      borewell: "Deep Borewell", river: "Perennial River", canal: "State Canal",
      pond: "Farm Pond / Tank", graywater: "Recycled Wastewater",
      low: "Depleted", medium: "Optimal", high: "Surplus",
      summer: "Zaid / Summer", winter: "Rabi / Winter", monsoon: "Kharif / Monsoon",
      drip: "Drip Irrigation", sprinkler: "Sprinkler", flood: "Flood Irrigation", furrow: "Furrow Irrigation",
      seeds: "Sowing Stage", germination: "Germination", tillering: "Tillering", bloom: "Flowering", maturity: "Harvest Ready",
      whyHeading: "💡 AI Strategic Reasoning:", cropSurety: "✅ Best match for your soil, season & water",
      allModules: "All Modules", back: "← Back",
      modulesDesc: {
        weather: "Live conditions & 5-day forecast", soil: "Soil type & pH analysis",
        water: "Irrigation & water planning", season: "Crop season & sowing date",
        crop: "AI-powered crop recommendation", fertilizer: "Stage-wise fertilizer doses",
        disease: "AI vision disease detection", market: "Live APMC mandi prices",
        scheme: "Government schemes & subsidies",
      },
    },
    hi: {
      logout: "लॉगआउट", dashboardTitle: "डैशबोर्ड", welcomeBack: "वापस स्वागत है!",
      farmOverview: "आपके खेत की आज की स्थिति",
      weather: "मौसम", soil: "मिट्टी जाँच", water: "जल प्रबंधन",
      season: "सीजन", crop: "एआई फसल अनुशंसा", fertilizer: "खाद योजना",
      disease: "रोग लैब", market: "मंडी भाव", scheme: "सरकारी योजनाएं", sosSettings: "सेटिंग्स",
      rainHigh: "⚠️ भारी वर्षा की संभावना। छिड़काव तुरंत रोकें।",
      rainMed: "हल्की बूंदाबांदी संभव।", rainLow: "मौसम साफ है।",
      blackSoil: "काली रेगुर मिट्टी", redSoil: "लाल दोमट", claySoil: "चिकनी मिट्टी",
      loamySoil: "दोमट मिट्टी", sandySoil: "रेतीली मिट्टी", greySoil: "धूसर मिट्टी",
      borewell: "बोरवेल", river: "नदी", canal: "नहर", pond: "तालाब", graywater: "पुनः चक्रित जल",
      low: "न्यूनतम", medium: "संतुलित", high: "प्रचुर",
      summer: "जायद / ग्रीष्म", winter: "रबी / शीत", monsoon: "खरीफ / मानसून",
      drip: "ड्रिप सिंचाई", sprinkler: "स्प्रिंकलर", flood: "बाढ़ सिंचाई", furrow: "सरी सिंचाई",
      seeds: "बुवाई", germination: "अंकुरण", tillering: "कल्ले फूटना", bloom: "फूल आना", maturity: "कटाई अवस्था",
      whyHeading: "💡 एआई तर्क:", cropSurety: "✅ आपकी मिट्टी, मौसम और पानी के लिए सर्वश्रेष्ठ",
      allModules: "सभी मॉड्यूल", back: "← वापस",
      modulesDesc: {
        weather: "लाइव मौसम और 5 दिन का पूर्वानुमान", soil: "मिट्टी प्रकार और pH विश्लेषण",
        water: "सिंचाई और जल योजना", season: "फसल सीजन और बुवाई तारीख",
        crop: "एआई द्वारा फसल सुझाव", fertilizer: "अवस्थावार खाद की मात्रा",
        disease: "एआई द्वारा रोग पहचान", market: "लाइव मंडी भाव",
        scheme: "सरकारी योजनाएं और सब्सिडी",
      },
    },
    mr: {
      logout: "लॉगआऊट", dashboardTitle: "डॅशबोर्ड", welcomeBack: "पुन्हा स्वागत आहे!",
      farmOverview: "आजचा शेतीचा आढावा",
      weather: "हवामान", soil: "माती तपासणी", water: "पाणी व्यवस्थापन",
      season: "हंगाम", crop: "एआय पीक शिफारस", fertilizer: "खत योजना",
      disease: "रोग ओळख", market: "बाजारभाव", scheme: "शासकीय योजना", sosSettings: "सेटिंग्स",
      rainHigh: "⚠️ मुसळधार पाऊस येणार. फवारणी थांबवा.",
      rainMed: "हलका पाऊस शक्य.", rainLow: "हवामान शेतीसाठी अनुकूल आहे.",
      blackSoil: "काळी माती", redSoil: "लाल माती", claySoil: "चिकणमाती",
      loamySoil: "लोम माती", sandySoil: "वाळूची माती", greySoil: "करडी माती",
      borewell: "बोअरवेल", river: "नदी", canal: "कालवा", pond: "शेततळे", graywater: "पुनर्वापर केलेले पाणी",
      low: "किमान", medium: "संतुलित", high: "भरपूर",
      summer: "उन्हाळा / जायद", winter: "हिवाळा / रब्बी", monsoon: "पावसाळा / खरीप",
      drip: "ठिबक सिंचन", sprinkler: "तुषार सिंचन", flood: "मोकळे पाणी", furrow: "वरंबा सिंचन",
      seeds: "पेरणी", germination: "उगवण", tillering: "फुटवे", bloom: "फुले", maturity: "काढणी",
      whyHeading: "💡 एआय धोरणात्मक तर्क:", cropSurety: "✅ तुमच्या माती, हंगाम आणि पाण्यासाठी सर्वोत्तम",
      allModules: "सर्व मॉड्यूल", back: "← मागे",
      modulesDesc: {
        weather: "लाइव्ह हवामान व ५ दिवसांचा अंदाज", soil: "माती प्रकार व pH विश्लेषण",
        water: "सिंचन व पाणी नियोजन", season: "पीक हंगाम व पेरणी तारीख",
        crop: "एआय पीक शिफारस", fertilizer: "अवस्थानुसार खत मात्रा",
        disease: "एआय द्वारे रोग ओळख", market: "लाइव्ह बाजारभाव",
        scheme: "शासकीय योजना व अनुदान",
      },
    },
  };
  const t = translations[langCode] || translations.en;

  const modulesConfig = [
    { id: "weather",    label: t.weather,    icon: "🌦️", desc: t.modulesDesc.weather,    gradient: "linear-gradient(135deg, #1565c0 0%, #0288d1 100%)" },
    { id: "soil",       label: t.soil,       icon: "🌍", desc: t.modulesDesc.soil,       gradient: "linear-gradient(135deg, #5d4037 0%, #8d6e63 100%)" },
    { id: "water",      label: t.water,      icon: "💧", desc: t.modulesDesc.water,      gradient: "linear-gradient(135deg, #00796b 0%, #26a69a 100%)" },
    { id: "season",     label: t.season,     icon: "🌤️", desc: t.modulesDesc.season,     gradient: "linear-gradient(135deg, #f57f17 0%, #ffb300 100%)" },
    { id: "crop",       label: t.crop,       icon: "🌱", desc: t.modulesDesc.crop,       gradient: "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)" },
    { id: "fertilizer", label: t.fertilizer, icon: "🧪", desc: t.modulesDesc.fertilizer, gradient: "linear-gradient(135deg, #6a1b9a 0%, #ab47bc 100%)" },
    { id: "disease",    label: t.disease,    icon: "🦠", desc: t.modulesDesc.disease,    gradient: "linear-gradient(135deg, #c62828 0%, #ef5350 100%)" },
    { id: "market",     label: t.market,     icon: "📈", desc: t.modulesDesc.market,     gradient: "linear-gradient(135deg, #e65100 0%, #ff7043 100%)" },
    { id: "scheme",     label: t.scheme,     icon: "🏛️", desc: t.modulesDesc.scheme,     gradient: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)" },
  ];

  const OWM_KEY = "31483dbb2fffb11541576b4c1c683a0a";

  const getWeather = async () => {
    if (!navigator.geolocation) return;
    setWeatherLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude: lat, longitude: lon } = pos.coords;
      try {
        const [fcRes, curRes] = await Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OWM_KEY}&units=metric&cnt=16`),
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OWM_KEY}&units=metric`),
        ]);
        const current = await curRes.json();
        const forecast = await fcRes.json();
        const rainProb = current.clouds?.all ?? 45;
        const rainVolume = current.rain?.["1h"] ?? 0;
        const windSpeed = Math.round((current.wind?.speed ?? 5) * 3.6);
        let predMsg = t.rainLow;
        setWeatherAlert("");
        if (isSosAlertEnabled && (rainProb > 70 || rainVolume > 1.0 || windSpeed > 30)) {
          predMsg = t.rainHigh;
          setWeatherAlert("🚨 SOS: High-risk weather detected. Suspend all field operations immediately!");
        } else if (rainProb > 30) {
          predMsg = t.rainMed;
        }
        setWeather({ city: current.name, temp: Math.round(current.main.temp), feels: Math.round(current.main.feels_like), humidity: current.main.humidity, wind: windSpeed, description: current.weather?.[0]?.description ?? "", rainProbability: rainProb, precipitationVol: rainVolume, predictionMessage: predMsg, icon: current.weather?.[0]?.icon });
        const dayMap = {};
        (forecast.list || []).forEach(item => {
          const d = item.dt_txt.split(" ")[0];
          if (!dayMap[d]) dayMap[d] = { temps: [], rain: 0, desc: item.weather?.[0]?.description ?? "", icon: item.weather?.[0]?.icon };
          dayMap[d].temps.push(item.main.temp);
          dayMap[d].rain += item.rain?.["3h"] ?? 0;
        });
        const days = Object.entries(dayMap).slice(1, 3).map(([d, v]) => ({ date: d, min: Math.round(Math.min(...v.temps)), max: Math.round(Math.max(...v.temps)), rain: Math.round(v.rain * 10) / 10, desc: v.desc, icon: v.icon }));
        setWeatherForecast(days);
      } catch (e) { console.error(e); }
      finally { setWeatherLoading(false); }
    });
  };

  const getSmartCropRecommendation = () => {
    const activeSeason = cropSeason || "Monsoon";
    const getLiveWaterDemand = () => {
      if (weather) { const r = weather.rainProbability ?? 0; if (r > 60) return "High"; if (r > 30) return "Medium"; return "Low"; }
      if (waterLevel) { const lv = waterLevel.toLowerCase(); if (lv.includes("high") || lv.includes("surplus")) return "High"; if (lv.includes("med")) return "Medium"; if (lv.includes("low") || lv.includes("dep")) return "Low"; }
      return null;
    };
    const liveWaterDemand = getLiveWaterDemand();
    const liveTemp = weather?.temp ?? null;
    const cropsDataset = [
      { id: "rice", name: "Rice / Paddy", idealSeasons: ["Monsoon"], idealSoils: ["Black Alluvial Soil", "Clay Soil", "Black Regur Soil", "Heavy Clay"], waterDemand: "High", idealIrrigation: ["Controlled Flood", "Automated Drip"], idealWaterSources: ["River", "Canal", "Farm Pond / Tank"], minTemp: 22, maxTemp: 35, minPh: 5.5, maxPh: 7.0, baseMandiPrice: 2450, priceTrend: "UP (+8%)", why: "Clay and heavy regur matrices optimally capture monsoon rainfall.", betterThan: "Rice safely outperforms Cotton or Maize here.", diseaseSchemes: ["NFSM-Rice", "PMFBY"] },
      { id: "cotton", name: "Cotton", idealSeasons: ["Monsoon"], idealSoils: ["Black Alluvial Soil", "Loamy Soil", "Black Regur Soil"], waterDemand: "Medium", idealIrrigation: ["Automated Drip", "Furrow"], idealWaterSources: ["Borewell", "Canal", "River"], minTemp: 21, maxTemp: 37, minPh: 6.0, maxPh: 8.0, baseMandiPrice: 7200, priceTrend: "UP (+12%)", why: "Deep taproot leverages cation exchange in rich black alluvial horizons.", betterThan: "Cotton beats Sugarcane or Rice here.", diseaseSchemes: ["CCI Buyback", "PMFBY"] },
      { id: "wheat", name: "Wheat", idealSeasons: ["Winter"], idealSoils: ["Black Alluvial Soil", "Loamy Soil", "Black Regur Soil"], waterDemand: "Medium", idealIrrigation: ["Overhead Sprinkler", "Furrow"], idealWaterSources: ["Canal", "Borewell", "River"], minTemp: 10, maxTemp: 25, minPh: 6.0, maxPh: 7.5, baseMandiPrice: 2550, priceTrend: "UP (+5%)", why: "Cool Rabi temperatures accelerate tillering cycles.", betterThan: "Wheat over pulses — your soil supports intensive nutrient uptake.", diseaseSchemes: ["NFSM-Wheat", "PMFBY"] },
      { id: "soybean", name: "Soybean", idealSeasons: ["Monsoon"], idealSoils: ["Black Alluvial Soil", "Loamy Soil"], waterDemand: "Medium", idealIrrigation: ["Automated Drip", "Overhead Sprinkler"], idealWaterSources: ["Borewell", "Canal", "River"], minTemp: 20, maxTemp: 32, minPh: 6.0, maxPh: 7.0, baseMandiPrice: 6100, priceTrend: "STABLE (+2%)", why: "Nitrogen-fixing root nodules improve soil health.", betterThan: "Soybean improves soil nitrogen.", diseaseSchemes: ["PMFBY", "MSP Procurement"] },
      { id: "groundnut", name: "Groundnut", idealSeasons: ["Summer", "Monsoon"], idealSoils: ["Sandy Soil", "Red Loamy Soil", "Loamy Soil"], waterDemand: "Low", idealIrrigation: ["Automated Drip", "Furrow"], idealWaterSources: ["Borewell", "Farm Pond / Tank"], minTemp: 25, maxTemp: 38, minPh: 5.5, maxPh: 7.0, baseMandiPrice: 5500, priceTrend: "UP (+6%)", why: "Sandy and red loamy soils allow easy pod penetration.", betterThan: "Groundnut outperforms rice or wheat in sandy soils.", diseaseSchemes: ["PMFBY", "MSP Procurement"] },
      { id: "maize", name: "Maize / Corn", idealSeasons: ["Monsoon", "Summer"], idealSoils: ["Loamy Soil", "Red Loamy Soil", "Sandy Soil"], waterDemand: "Medium", idealIrrigation: ["Furrow", "Overhead Sprinkler", "Automated Drip"], idealWaterSources: ["Canal", "Borewell", "River"], minTemp: 18, maxTemp: 35, minPh: 5.8, maxPh: 7.5, baseMandiPrice: 1950, priceTrend: "STABLE (+3%)", why: "Maize thrives in loamy and red soils with good drainage.", betterThan: "Maize outperforms soybean in red or loamy soils.", diseaseSchemes: ["PMFBY", "NFSM-Maize"] },
    ];
    const scored = cropsDataset.map(crop => {
      let score = 0; const reasons = [];
      if (crop.idealSeasons.includes(activeSeason)) { score += 30; reasons.push(`✅ Season: ${activeSeason}`); } else reasons.push(`❌ Season mismatch`);
      if (soilType) { if (crop.idealSoils.includes(soilType)) { score += 25; reasons.push(`✅ Soil: ${soilType}`); } else reasons.push(`❌ Soil mismatch`); }
      if (soilPh) { const ph = parseFloat(soilPh); if (ph >= crop.minPh && ph <= crop.maxPh) { score += 20; reasons.push(`✅ pH ${ph} in range`); } else reasons.push(`❌ pH outside range`); }
      if (liveWaterDemand) { if (liveWaterDemand === crop.waterDemand) { score += 20; reasons.push(`✅ Water demand match`); } else reasons.push(`❌ Water mismatch`); }
      if (liveTemp !== null) { if (liveTemp >= crop.minTemp && liveTemp <= crop.maxTemp) { score += 15; reasons.push(`✅ Temp ${liveTemp}°C OK`); } else reasons.push(`❌ Temp outside range`); }
      if (irrigationMethod && crop.idealIrrigation?.includes(irrigationMethod)) { score += 10; reasons.push(`✅ Irrigation OK`); }
      if (waterSource && crop.idealWaterSources?.includes(waterSource)) { score += 10; reasons.push(`✅ Water source OK`); }
      return { ...crop, totalAIScore: score, reasons };
    });
    scored.sort((a, b) => b.totalAIScore - a.totalAIScore);
    const top = scored[0]; const alts = scored.slice(1, 3);
    const scoreLabel = top.totalAIScore >= 90 ? "⭐ Excellent" : top.totalAIScore >= 60 ? "✅ Good" : "⚠️ Best Available";
    return { name: top.name, details: top.why, why: top.betterThan, id: top.id, score: top.totalAIScore, scoreLabel, reasons: top.reasons, diseaseSchemes: top.diseaseSchemes, marketTimeline: { past: "5-year record: Stable and resilient mandi prices across Maharashtra APMCs.", current: `Maharashtra APMC: ₹${top.baseMandiPrice.toLocaleString()} – ₹${Math.round(top.baseMandiPrice * 1.25).toLocaleString()} / Quintal`, future: `Forward outlook: [${top.priceTrend}]` }, alternatives: alts.map(a => ({ name: a.name, why: a.betterThan, score: a.totalAIScore })) };
  };

  const getFertilizerPlan = () => {
    const rawSize = parseFloat(farmSize) || 1;
    const unitToAcres = { acres: 1, guntha: 1 / 40, hectares: 2.47105 };
    const acres = rawSize * (unitToAcres[farmUnit] || 1);
    const ph = parseFloat(soilPh) || 6.5;
    const isSaturated = moistureLevel?.toLowerCase().includes("saturat") || moistureLevel?.toLowerCase().includes("waterlog");
    const isAcidic = ph < 6.0; const isAlkaline = ph > 7.5;
    const phFactor = isAlkaline ? 1.20 : isAcidic ? 1.10 : 1.0;
    const nFactor = isSaturated ? 0.80 : 1.0;
    const znFactor = ph > 7.0 ? 1.25 : 1.0;
    const base = [
      { name: "Urea (46% N)", baseDose: 50, unit: "kg/acre", adjustFactor: nFactor, adjustReason: isSaturated ? "Waterlogged soil leaches nitrogen — reduced 20%" : null, benefit: "Rapid leaf growth, deep green chlorophyll, tillering boost.", danger: "Overdose causes lodging, soft stems, and pest attraction.", bestFor: ["seeds", "germination", "tillering"], color: "#e8f5e9", borderColor: C.green800 },
      { name: "DAP 18:46:0", baseDose: 50, unit: "kg/acre", adjustFactor: phFactor, adjustReason: isAlkaline ? `pH ${ph.toFixed(1)} alkaline — phosphorus lockout, dose +20%` : isAcidic ? `pH ${ph.toFixed(1)} acidic — dose +10%` : null, benefit: "Strong root architecture, early seedling establishment.", danger: "Locks out zinc and iron in alkaline soils.", bestFor: ["seeds", "germination"], color: "#e3f2fd", borderColor: C.blue },
      { name: "MOP (60% K₂O)", baseDose: 28, unit: "kg/acre", adjustFactor: 1.0, adjustReason: null, benefit: "Boosts disease resistance, grain weight, and fruit quality.", danger: "Can burn roots in dry soil — apply with irrigation.", bestFor: ["tillering", "bloom", "maturity"], color: "#fff8e1", borderColor: C.amber },
      { name: "Zinc Sulphate (ZnSO₄)", baseDose: 10, unit: "kg/acre", adjustFactor: znFactor, adjustReason: ph > 7.0 ? `pH ${ph.toFixed(1)} reduces zinc uptake — dose +25%` : null, benefit: "Prevents yellowing, essential for enzyme activation.", danger: "Toxic in excess — use precise measured doses only.", bestFor: ["seeds", "germination", "tillering"], color: "#fce4ec", borderColor: "#c2185b" },
      { name: "SSP (Single Super Phosphate 16% P)", baseDose: 60, unit: "kg/acre", adjustFactor: phFactor, adjustReason: null, benefit: "Supplies both phosphorus and sulphur — improves root depth.", danger: "Absorbs moisture — store in dry conditions only.", bestFor: ["seeds", "germination", "bloom"], color: "#e8eaf6", borderColor: "#3949ab" },
      { name: "Boron (Borax 10.5%)", baseDose: 3, unit: "kg/acre", adjustFactor: 1.0, adjustReason: null, benefit: "Reduces flower drop, improves pollination and fruit set.", danger: "Extremely narrow safe range — even slight overdose is toxic.", bestFor: ["bloom", "maturity"], color: "#f3e5f5", borderColor: "#7b1fa2" },
    ];
    return base.map(f => ({ ...f, totalDose: `${Math.round(f.baseDose * f.adjustFactor * acres)} kg`, recommended: !cropStage || f.bestFor.includes(cropStage) }));
  };

  const executeDiseaseDiagnosticVision = async () => {
    if (!selectedDiseaseCrop) { alert("Please select a crop first."); return; }
    if (!diseasePhotoBase64 && !diseasePhoto) { alert("Please upload or capture a photo."); return; }
    setDiseaseLoading(true); setDiseaseDiagnosticResult(null);
    if (diseasePhotoBase64) {
      try {
        const prompt = `You are an expert agricultural plant pathologist. Analyze this image of a ${selectedDiseaseCrop} plant.${diseaseType ? ` The farmer suspects it might be a ${diseaseType} issue.` : ""}${diseaseSeverity ? ` Observed severity: ${diseaseSeverity}.` : ""} Provide a detailed diagnosis in this exact JSON format (respond ONLY with valid JSON, no extra text): {"diseaseName":"Name","confidence":"High/Medium/Low","severity":"Mild/Moderate/Severe","symptoms":"Description","cause":"Causal organism","immediateAction":"What to do NOW","organicCure":"Organic treatment","chemicalCure":"Chemical with dosage","preventionTip":"Prevention","relatedScheme":"Scheme if applicable"}`;
        const base64Data = diseasePhotoBase64.split(",")[1];
        const mediaType = diseasePhotoBase64.split(";")[0].split(":")[1] || "image/jpeg";
        const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: [{ type: "image", source: { type: "base64", media_type: mediaType, data: base64Data } }, { type: "text", text: prompt }] }] }) });
        const data = await res.json();
        const raw = data.content?.map(i => i.text || "").join("") || "";
        setDiseaseDiagnosticResult(JSON.parse(raw.replace(/```json|```/g, "").trim()));
      } catch (err) {
        setDiseaseDiagnosticResult({ diseaseName: "Leaf Blight / General Infection", confidence: "Low", severity: diseaseSeverity || "Moderate", symptoms: "Irregular necrotic lesions, leaf tip drying.", cause: "Fungal or bacterial — photo required for accurate diagnosis.", immediateAction: "Isolate affected area. Stop overhead irrigation.", organicCure: "Neem oil emulsion 10,000 PPM @ 3ml/Liter.", chemicalCure: "Mancozeb 75 WP @ 2g/Liter", preventionTip: "Crop rotation every 2 years. Balanced fertilization.", relatedScheme: "PMFBY" });
      }
    }
    setDiseaseLoading(false);
  };

  const handleFileUpload = (e) => { const file = e.target.files[0]; if (!file) return; setUploadedImage(URL.createObjectURL(file)); setSoilType("Black Alluvial Soil"); };
  const startSoilCamera = async () => { try { const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); soilStreamRef.current = stream; setIsSoilCameraActive(true); setTimeout(() => { if (soilVideoRef.current) soilVideoRef.current.srcObject = stream; }, 100); } catch { alert("Camera not accessible."); } };
  const captureSoilPhoto = () => { if (!soilVideoRef.current) return; const canvas = document.createElement("canvas"); canvas.width = soilVideoRef.current.videoWidth; canvas.height = soilVideoRef.current.videoHeight; canvas.getContext("2d").drawImage(soilVideoRef.current, 0, 0); setUploadedImage(canvas.toDataURL("image/jpeg", 0.85)); setSoilType("Black Alluvial Soil"); stopSoilCamera(); };
  const stopSoilCamera = () => { if (soilStreamRef.current) soilStreamRef.current.getTracks().forEach(t => t.stop()); setIsSoilCameraActive(false); };
  const handleDiseaseFileUpload = (e) => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = (ev) => { setDiseasePhoto(ev.target.result); setDiseasePhotoBase64(ev.target.result); }; reader.readAsDataURL(file); };
  const startCamera = async () => { try { const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); cameraStreamRef.current = stream; setIsCameraActive(true); setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 100); } catch { alert("Camera not accessible."); } };
  const capturePhoto = () => { if (!videoRef.current) return; const canvas = document.createElement("canvas"); canvas.width = videoRef.current.videoWidth; canvas.height = videoRef.current.videoHeight; canvas.getContext("2d").drawImage(videoRef.current, 0, 0); const dataUrl = canvas.toDataURL("image/jpeg", 0.85); setDiseasePhoto(dataUrl); setDiseasePhotoBase64(dataUrl); stopCamera(); };
  const stopCamera = () => { if (cameraStreamRef.current) cameraStreamRef.current.getTracks().forEach(t => t.stop()); setIsCameraActive(false); };

  const fetchMarketPrices = async () => {
    const cropRec = getSmartCropRecommendation();
    setMarketLoading(true);
    const commodityMap = { rice: "Rice", cotton: "Cotton", wheat: "Wheat", soybean: "Soyabean", groundnut: "Groundnut", maize: "Maize" };
    const commodity = commodityMap[cropRec.id] || "Rice";
    const API_KEY = "579b464db66ec23bdd0000019afa4a5e7fa44e71f8b09f40b03a3c9e";
    try {
      const res = await fetch(`https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&format=json&filters[state]=Maharashtra&filters[commodity]=${commodity}&limit=10`);
      const data = await res.json();
      if (data.records && data.records.length > 0) setMarketPrices(data.records.map(r => ({ market: r.market, district: r.district, commodity: r.commodity, variety: r.variety, min: r.min_price, max: r.max_price, modal: r.modal_price, date: r.arrival_date })));
      else setMarketPrices("fallback");
    } catch { setMarketPrices("fallback"); }
    setMarketLoading(false);
  };

  const getFarmingSchemesDataset = () => {
    const cropRec = getSmartCropRecommendation();
    const isRice = cropRec.id === "rice";
    const isCotton = cropRec.id === "cotton";
    const cropSpecific = [];
    if (isRice) cropSpecific.push({ id: 101, tier: "crop", category: "Seeds", url: "https://agriwelfare.gov.in/", name: "🌟 NFSM-Rice Seed Subsidy", desc: "Free distribution of high-yield hybrid rice seeds at government centres.", docs: ["Aadhaar Card", "7/12 Extract", "Bank Passbook"], process: ["Visit nearest Krishi Kendra", "Show 7/12 and Aadhaar", "Biometric verification", "Collect subsidised seeds"], status: "Active", deadline: "June 30" });
    if (isCotton) cropSpecific.push({ id: 201, tier: "crop", category: "Market", url: "https://cotcorp.org.in/", name: "🌟 CCI Cotton Direct Buyback", desc: "Sell cotton at guaranteed MSP through CCI procurement centres.", docs: ["7/12 with Cotton crop entry", "Bank Passbook", "Aadhaar"], process: ["Register at APMC sub-centre", "Bring cotton to CCI ginning mill", "Weigh and moisture check", "Payment in 48 hrs"], status: "Active", deadline: "March 31" });
    return [...cropSpecific,
      { id: 1, tier: "famous", category: "Crop Insurance", url: "https://pmfby.gov.in/", name: "🏛️ PM Fasal Bima Yojana (PMFBY)", desc: "100% financial protection against crop loss from weather events.", docs: ["7/12 & 8A Extract", "Aadhaar Card", "Bank Passbook", "Sowing Declaration"], process: ["Open pmfby.gov.in → Farmer Corner", "Verify OTP with Aadhaar", "Enter land and crop details", "Pay premium (2%) and download receipt"], status: "Active", deadline: "July 31" },
      { id: 2, tier: "famous", category: "Irrigation", url: "https://www.myscheme.gov.in/schemes/pmksypdmc", name: "🏛️ PM Krishi Sinchayee Yojana (PMKSY)", desc: "80% capital subsidy for drip and sprinkler irrigation systems.", docs: ["7/12 & 8A", "Borewell/well proof", "Dealer quotation", "Aadhaar + Bank Passbook"], process: ["Contact taluka Krishi office or MahaDBT", "Upload drip kit quotation", "Field geo-tagging by officer", "Subsidy credited post installation"], status: "Active", deadline: "Open" },
      { id: 5, tier: "famous", category: "Income Support", url: "https://pmkisan.gov.in/", name: "🏛️ PM Kisan Samman Nidhi", desc: "₹6,000 per year direct to farmer bank account in 3 installments.", docs: ["Aadhaar", "Bank Passbook", "Land Records", "Mobile Number"], process: ["Visit pmkisan.gov.in → New Farmer Registration", "Enter Aadhaar and bank details", "Village-level verification", "₹2,000 every 4 months auto-credited"], status: "Active", deadline: "Open" },
      { id: 6, tier: "famous", category: "Credit", url: "https://www.nabard.org/", name: "🏛️ Kisan Credit Card (KCC)", desc: "Crop loan at just 4% interest — instant approval at your bank.", docs: ["Aadhaar", "Land Records", "Bank Account", "Passport Photo"], process: ["Visit nearest nationalised bank", "Fill KCC application form", "Land and crop verification", "Card issued within 14 days"], status: "Active", deadline: "Open" },
      { id: 4, tier: "famous", category: "Soil", url: "https://soilhealth.dac.gov.in/", name: "🏛️ Soil Health Card Scheme (SHCS)", desc: "Free government lab soil testing with nutrient prescription card.", docs: ["Aadhaar", "Mobile Number", "Field khasra number"], process: ["Contact village Krishi Sevak", "Collect soil from 5 spots", "Submit to Soil Testing Lab", "Download 12-nutrient report card"], status: "Active", deadline: "Open" },
      { id: 3, tier: "general", category: "Mechanization", url: "https://rkvy.da.gov.in/", name: "🏛️ Rashtriya Krishi Vikas Yojana (RKVY)", desc: "Direct grants for tractor, rotavator, and modern farm machinery.", docs: ["Aadhaar", "Bank Passbook", "Land Records", "Machinery quotation"], process: ["Register on state Agri Mechanisation DBT portal", "Select equipment from approved list", "Receive pre-approval letter", "Purchase and upload GST bill"], status: "Active", deadline: "Open" },
      { id: 8, tier: "general", category: "Market", url: "https://enam.gov.in/", name: "🏛️ National Agriculture Market (e-NAM)", desc: "Sell produce directly on unified online mandi for better price discovery.", docs: ["Aadhaar", "Bank Account", "Mobile Number", "APMC Registration"], process: ["Register at enam.gov.in", "Link bank and APMC ID", "List produce quality grade", "Receive bids and payment digitally"], status: "Active", deadline: "Open" },
    ];
  };

  const closeModule = () => { stopCamera(); stopSoilCamera(); setActiveModule(null); setSelectedScheme(null); };
  const cropData = getSmartCropRecommendation();
  const schemesList = getFarmingSchemesDataset();
  const fertList = getFertilizerPlan();
  const seasonMonths = { Monsoon: ["June", "July", "August", "September"], Winter: ["October", "November", "December", "January", "February"], Summer: ["March", "April", "May"] };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f0f4f1" }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width: 230, minWidth: 230, background: C.green900, height: "100vh", overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column", position: "sticky", top: 0, flexShrink: 0 }}>
        <div style={{ padding: "22px 18px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.12)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌾</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: C.white, letterSpacing: "-0.3px" }}>AgroSmart AI</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>Smart Farming</div>
            </div>
          </div>
        </div>
        <div style={{ padding: "12px 10px", flex: 1 }}>
          <NavItem icon="🏠" label={t.dashboardTitle} active={!activeModule} onClick={() => { closeModule(); setActiveModule(null); }} />
          <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "1px", padding: "14px 10px 6px" }}>MODULES</div>
          {modulesConfig.map(mod => (
            <NavItem key={mod.id} icon={mod.icon} label={mod.label} active={activeModule === mod.id}
              onClick={() => { setActiveModule(mod.id); setSelectedScheme(null); if (mod.id === "weather") getWeather(); if (mod.id === "market") fetchMarketPrices(); }} />
          ))}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 8, paddingTop: 8 }}>
            <NavItem icon="⚙️" label={t.sosSettings} active={activeModule === "settings"} onClick={() => setActiveModule("settings")} />
          </div>
        </div>
        <div style={{ padding: "14px 12px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px", marginBottom: 10, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Language</div>
            <select value={langCode} onChange={e => { setLangCode(e.target.value); localStorage.setItem("app_lang", e.target.value); }}
              style={{ width: "100%", padding: "7px 8px", fontSize: 12, borderRadius: 7, border: "none", background: "rgba(255,255,255,0.9)", fontWeight: 600, cursor: "pointer" }}>
              <option value="en">🇬🇧 English</option>
              <option value="hi">🇮🇳 हिंदी</option>
              <option value="mr">🌾 मराठी</option>
            </select>
          </div>
          <button onClick={() => { localStorage.removeItem("isLoggedIn"); localStorage.removeItem("userEmail"); window.location.href = "/"; }}
            style={{ width: "100%", padding: "8px 10px", fontSize: 12, fontWeight: 600, borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "rgba(255,255,255,0.7)", cursor: "pointer" }}>
            {t.logout} →
          </button>
        </div>
      </div>

      {/* ── MAIN AREA ── */}
      <div style={{ flex: 1, overflowY: "auto", height: "100vh" }}>
        {weatherAlert && isSosAlertEnabled && (
          <div style={{ background: "#b71c1c", color: C.white, padding: "11px 28px", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 10 }}>
            🚨 {weatherAlert}
          </div>
        )}

        {/* ── DASHBOARD HOME ── */}
        {!activeModule ? (
          <div style={{ padding: "28px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: C.green900 }}>{t.welcomeBack} 👋</h1>
                <p style={{ margin: "4px 0 0", color: C.gray600, fontSize: 14 }}>{t.farmOverview}</p>
              </div>
              {weather && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.white, borderRadius: 14, padding: "10px 20px", boxShadow: C.shadow, border: `1px solid ${C.border}` }}>
                  {weather.icon && <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="" style={{ width: 38, height: 38 }} />}
                  <div><div style={{ fontWeight: 800, fontSize: 20, color: C.gray900, lineHeight: 1 }}>{weather.temp}°C</div><div style={{ fontSize: 11, color: C.gray400, marginTop: 2 }}>{weather.city}</div></div>
                </div>
              )}
            </div>
            <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 28, background: `linear-gradient(120deg, rgba(11,42,17,0.93) 0%, rgba(27,94,32,0.62) 55%, rgba(27,94,32,0.3) 100%)`, position: "relative", minHeight: 200, boxShadow: C.shadowLg }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=70')", backgroundSize: "cover", backgroundPosition: "center", zIndex: 0 }} />
              <div style={{ position: "relative", zIndex: 1, padding: "36px 40px", maxWidth: 520 }}>
                <div style={{ color: "#a5d6a7", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }}>AI FARMING ASSISTANT</div>
                <h2 style={{ color: C.white, fontSize: 28, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.25 }}><span>Smart Decisions for</span><br /><span style={{ color: "#aed581" }}>Better Yields</span></h2>
                <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 14, margin: "0 0 22px", lineHeight: 1.6 }}>AI-powered insights from soil to harvest — tailored for your farm.</p>
                <button onClick={() => setActiveModule("crop")} style={{ ...S.btn, background: C.green700, color: C.white, fontSize: 14, padding: "12px 26px", boxShadow: "0 4px 16px rgba(46,125,50,0.45)" }}>
                  Get Crop Recommendation →
                </button>
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.gray900, marginBottom: 16 }}>{t.allModules}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {modulesConfig.map(mod => (
                <ModuleCard key={mod.id} mod={mod} onClick={() => { setActiveModule(mod.id); setSelectedScheme(null); if (mod.id === "weather") getWeather(); if (mod.id === "market") fetchMarketPrices(); }} />
              ))}
            </div>
          </div>
        ) : (
          <div style={{ padding: activeModule === "scheme" ? "0" : "24px 32px", maxWidth: activeModule === "scheme" ? "100%" : 1020, margin: "0 auto" }}>
            {activeModule !== "scheme" && (
              <button onClick={closeModule} style={{ ...S.btn, ...S.btnSecondary, marginBottom: 22, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                {t.back}
              </button>
            )}

            {activeModule !== "scheme" && activeModule !== "settings" && (() => {
              const mod = modulesConfig.find(m => m.id === activeModule);
              if (!mod) return null;
              return (
                <div style={{ background: C.white, borderRadius: 20, border: `1px solid ${C.gray200}`, boxShadow: C.shadowMd, overflow: "hidden", marginBottom: 0 }}>
                  <div style={{ background: mod.gradient, padding: "24px 32px", display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 52, height: 52, background: "rgba(255,255,255,0.18)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{mod.icon}</div>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: C.white }}>{mod.label}</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>{mod.desc}</div>
                    </div>
                  </div>
                  <div style={{ padding: "28px 32px" }}>
                    {/* ── WEATHER ── */}
                    {activeModule === "weather" && (
                      <div>
                        <button onClick={getWeather} style={{ ...S.btn, ...S.btnPrimary, marginBottom: 24 }}>
                          {weatherLoading ? "⏳ Syncing..." : "🔄 Refresh Weather"}
                        </button>
                        {weatherLoading && <AlertBox type="info">Fetching live weather data...</AlertBox>}
                        {weather && (
                          <div>
                            <div style={{ background: `linear-gradient(135deg, ${C.green900} 0%, ${C.green800} 100%)`, borderRadius: 16, padding: "24px 28px", color: C.white, marginBottom: 20 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                  <div style={{ fontSize: 12, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Current Conditions</div>
                                  <div style={{ fontSize: 54, fontWeight: 800, lineHeight: 1 }}>{weather.temp}°C</div>
                                  <div style={{ fontSize: 14, opacity: 0.85, marginTop: 6, textTransform: "capitalize" }}>{weather.description}</div>
                                </div>
                                {weather.icon && <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="" style={{ width: 72, height: 72 }} />}
                              </div>
                              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 20 }}>
                                {[{ label: "Feels Like", value: `${weather.feels}°C` }, { label: "Humidity", value: `${weather.humidity}%` }, { label: "Wind", value: `${weather.wind} km/h` }, { label: "Rain Chance", value: `${weather.rainProbability}%` }].map(item => (
                                  <div key={item.label} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px 12px" }}>
                                    <div style={{ fontSize: 11, opacity: 0.65 }}>{item.label}</div>
                                    <div style={{ fontSize: 17, fontWeight: 700, marginTop: 3 }}>{item.value}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <AlertBox type={weather.rainProbability > 70 ? "danger" : weather.rainProbability > 30 ? "warning" : "success"}>
                              🤖 AI Prediction: {weather.predictionMessage}
                            </AlertBox>
                            {weatherForecast && weatherForecast.length > 0 && (
                              <div style={{ marginTop: 20 }}>
                                <div style={{ fontWeight: 700, fontSize: 13, color: C.gray600, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>Next 2 Days Forecast</div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                  {weatherForecast.map((d, i) => (
                                    <div key={i} style={{ background: C.blue100, border: `1px solid #bbdefb`, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                                      {d.icon && <img src={`https://openweathermap.org/img/wn/${d.icon}.png`} alt="" style={{ width: 40 }} />}
                                      <div>
                                        <div style={{ fontSize: 12, color: C.blue }}>{new Date(d.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</div>
                                        <div style={{ fontWeight: 700, fontSize: 16 }}>{d.min}° – {d.max}°C</div>
                                        <div style={{ fontSize: 12, color: C.blue, textTransform: "capitalize" }}>{d.desc} · Rain: {d.rain}mm</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {/* ── SOIL ── */}
                    {activeModule === "soil" && (
                      <div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
                          <div>
                            <label style={S.label}>Soil Type</label>
                            <select value={soilType} onChange={e => setSoilType(e.target.value)} style={{ ...S.select, marginBottom: 18 }}>
                              <option value="">-- Select Soil --</option>
                              <option value="Black Alluvial Soil">{t.blackSoil}</option>
                              <option value="Red Loamy Soil">{t.redSoil}</option>
                              <option value="Clay Soil">{t.claySoil}</option>
                              <option value="Loamy Soil">{t.loamySoil}</option>
                              <option value="Sandy Soil">{t.sandySoil}</option>
                              <option value="Grey Alluvial Soil">{t.greySoil}</option>
                            </select>
                            <label style={S.label}>pH (Optional)</label>
                            <input type="number" step="0.1" min="0" max="14" placeholder="e.g. 6.5" value={soilPh} onChange={e => setSoilPh(e.target.value)} style={S.input} />
                            {soilPh && (
                              <div style={{ marginTop: 14 }}>
                                <AlertBox type={parseFloat(soilPh) < 6 ? "warning" : parseFloat(soilPh) > 7.5 ? "warning" : "success"}>
                                  pH {soilPh} — {parseFloat(soilPh) < 6 ? "Acidic soil. Add lime to raise pH." : parseFloat(soilPh) > 7.5 ? "Alkaline soil. Add sulfur or organic matter." : "Optimal pH range for most crops."}
                                </AlertBox>
                              </div>
                            )}
                          </div>
                          <div style={{ background: C.gray50, borderRadius: 14, border: `2px dashed ${C.border}`, padding: 24, textAlign: "center" }}>
                            <div style={{ fontSize: 34, marginBottom: 8 }}>📷</div>
                            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16, color: C.gray900 }}>Soil Photo Input</div>
                            {!isSoilCameraActive ? (
                              <>
                                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                                  <button type="button" onClick={startSoilCamera} style={{ ...S.btn, ...S.btnPrimary, fontSize: 13 }}>📸 Capture</button>
                                  <label style={{ ...S.btn, ...S.btnSecondary, fontSize: 13, cursor: "pointer" }}>📁 Gallery<input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} /></label>
                                </div>
                                {uploadedImage && (<div style={{ marginTop: 16 }}><img src={uploadedImage} alt="Soil" style={{ maxWidth: 140, borderRadius: 10, border: `2px solid ${C.green100}` }} /><div style={{ fontSize: 12, color: C.green800, marginTop: 8, fontWeight: 600 }}>✓ Photo captured</div></div>)}
                              </>
                            ) : (
                              <div><video ref={soilVideoRef} autoPlay playsInline style={{ width: "100%", borderRadius: 10, maxHeight: 220 }} /><div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 12 }}><button onClick={captureSoilPhoto} style={{ ...S.btn, ...S.btnPrimary }}>📸 Capture</button><button onClick={stopSoilCamera} style={{ ...S.btn, ...S.btnSecondary }}>✕</button></div></div>
                            )}
                          </div>
                        </div>
                        {soilType && (<div style={{ marginTop: 20 }}><AlertBox type="success">Active Soil: <strong>{soilType}</strong> — This will influence crop recommendation and fertilizer dosing.</AlertBox></div>)}
                      </div>
                    )}
                    {/* ── WATER ── */}
                    {activeModule === "water" && (
                      <div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                          {[
                            { label: "Water Capacity Level", value: waterLevel, setter: setWaterLevel, options: [["", "-- Select Level --"], ["Low", t.low], ["Medium", t.medium], ["High", t.high]] },
                            { label: "Water Source", value: waterSource, setter: setWaterSource, options: [["", "-- Select Source --"], ["Borewell", t.borewell], ["River", t.river], ["Canal", t.canal], ["Farm Pond / Tank", t.pond], ["Recycled Water", t.graywater]] },
                            { label: "Groundwater Table Depth", value: waterTableDepth, setter: setWaterTableDepth, options: [["", "--"], ["Critical (<15m)", "Very Low (<15m)"], ["Optimal (15-50m)", "Medium (15-50m)"], ["Abundant (>50m)", "High (>50m)"]] },
                            { label: "Soil Moisture", value: moistureLevel, setter: setMoistureLevel, options: [["", "--"], ["Arid (< 20 cb)", "Dry (<20 cb)"], ["Field Capacity (20-60 cb)", "Optimal (20-60 cb)"], ["Saturated (> 60 cb)", "Waterlogged (>60 cb)"]] },
                            { label: "Irrigation Method", value: irrigationMethod, setter: setIrrigationMethod, options: [["", "--"], ["Automated Drip", t.drip], ["Overhead Sprinkler", t.sprinkler], ["Controlled Flood", t.flood], ["Furrow", t.furrow]] },
                          ].map(field => (
                            <div key={field.label}><label style={S.label}>{field.label}</label><select value={field.value} onChange={e => field.setter(e.target.value)} style={S.select}>{field.options.map(([val, label]) => <option key={val} value={val}>{label}</option>)}</select></div>
                          ))}
                        </div>
                        {waterSource && irrigationMethod && (<div style={{ marginTop: 24 }}><AlertBox type="info">💡 Using {waterSource} with {irrigationMethod} is optimal for your selected soil moisture level.</AlertBox></div>)}
                      </div>
                    )}
                    {/* ── SEASON ── */}
                    {activeModule === "season" && (
                      <div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                          <div>
                            <label style={S.label}>Crop Season</label>
                            <select value={cropSeason} onChange={e => { setCropSeason(e.target.value); setCropMonth(""); }} style={{ ...S.select, marginBottom: 18 }}>
                              <option value="">-- Select Season --</option>
                              <option value="Summer">{t.summer}</option>
                              <option value="Winter">{t.winter}</option>
                              <option value="Monsoon">{t.monsoon}</option>
                            </select>
                            {cropSeason && (<><label style={S.label}>Sowing Month</label><select value={cropMonth} onChange={e => setCropMonth(e.target.value)} style={{ ...S.select, marginBottom: 18 }}><option value="">-- Select Month --</option>{(seasonMonths[cropSeason] || []).map(m => <option key={m} value={m}>{m}</option>)}</select></>)}
                            <label style={S.label}>Sowing / Planting Date</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={S.input} />
                          </div>
                          <div>
                            {cropSeason && (
                              <div style={{ background: C.green100, borderRadius: 14, padding: "22px 24px", border: `1px solid #a5d6a7` }}>
                                <div style={{ fontWeight: 700, fontSize: 16, color: C.green900, marginBottom: 14 }}>
                                  {cropSeason === "Monsoon" ? "☔ Kharif Season" : cropSeason === "Winter" ? "❄️ Rabi Season" : "☀️ Zaid Season"}
                                </div>
                                <div style={{ fontSize: 14, color: C.green800, lineHeight: 2 }}>
                                  <strong>Sowing Window:</strong> {(seasonMonths[cropSeason] || []).join(" – ")}<br />
                                  <strong>Ideal Crops:</strong> {cropSeason === "Monsoon" ? "Rice, Cotton, Soybean, Maize" : cropSeason === "Winter" ? "Wheat, Gram, Mustard, Peas" : "Watermelon, Groundnut, Sunflower"}<br />
                                  {cropMonth && <><strong>Selected Month:</strong> {cropMonth}<br /></>}
                                  {date && <><strong>Sowing Date:</strong> {new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</>}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        {cropSeason && date && (<div style={{ marginTop: 20 }}><AlertBox type="success">✅ Season: {cropSeason}{cropMonth ? `, Month: ${cropMonth}` : ""}, Sowing: {date}. Crop recommendation updated.</AlertBox></div>)}
                      </div>
                    )}
                    {/* ── CROP ── */}
                    {activeModule === "crop" && (
                      <div>
                        <div style={{ background: `linear-gradient(135deg, ${C.green900}, ${C.green800})`, borderRadius: 16, padding: "24px 28px", color: C.white, marginBottom: 16 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", opacity: 0.65, marginBottom: 6 }}>🎯 AI Top Pick</div>
                          <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 10 }}>{cropData.name}</div>
                          <p style={{ margin: 0, opacity: 0.88, lineHeight: 1.6, fontSize: 14 }}>{cropData.details}</p>
                          <div style={{ marginTop: 14 }}><Chip color={C.green100} bg="rgba(255,255,255,0.15)">{t.cropSurety}</Chip></div>
                        </div>
                        {cropData.reasons && cropData.reasons.length > 0 && (
                          <div style={{ background: C.gray50, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 20px", marginBottom: 18 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                              <div style={{ fontWeight: 700, fontSize: 14, color: C.gray900 }}>📊 AI Score: {cropData.score}/130</div>
                              <Chip color={cropData.score >= 90 ? C.green800 : cropData.score >= 60 ? C.amber : C.red} bg={cropData.score >= 90 ? C.green100 : cropData.score >= 60 ? C.amber100 : C.red100}>{cropData.scoreLabel}</Chip>
                            </div>
                            <div style={{ background: C.gray200, borderRadius: 6, height: 8, marginBottom: 14 }}>
                              <div style={{ background: cropData.score >= 90 ? C.green800 : cropData.score >= 60 ? C.amber : C.red, borderRadius: 6, height: 8, width: `${Math.round((cropData.score / 130) * 100)}%`, transition: "width 0.5s" }} />
                            </div>
                            {cropData.reasons.map((r, i) => (<div key={i} style={{ fontSize: 12, color: r.startsWith("✅") ? C.green800 : r.startsWith("⚠️") ? C.amber : C.red, fontWeight: 500 }}>{r}</div>))}
                          </div>
                        )}
                        <div style={{ background: C.green50, borderLeft: `4px solid ${C.green800}`, borderRadius: 10, padding: "16px 20px", marginBottom: 22 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: C.green900, marginBottom: 8 }}>{t.whyHeading}</div>
                          <p style={{ margin: 0, fontSize: 14, color: C.green900, lineHeight: 1.65 }}>{cropData.why}</p>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: C.gray900, marginBottom: 12 }}>📊 Alternative Crops</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          {cropData.alternatives.map((alt, i) => (
                            <div key={i} style={{ background: C.gray50, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 18px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                <div style={{ fontWeight: 700, fontSize: 14, color: "#e65100" }}>🔁 {alt.name}</div>
                                <Chip color={C.gray600} bg={C.gray200}>Score: {alt.score}/130</Chip>
                              </div>
                              <p style={{ margin: 0, fontSize: 13, color: C.gray600, lineHeight: 1.55 }}>{alt.why}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* ── FERTILIZER ── */}
                    {activeModule === "fertilizer" && (
                      <div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                          <div>
                            <label style={S.label}>Crop Growth Stage</label>
                            <select value={cropStage} onChange={e => setCropStage(e.target.value)} style={S.select}>
                              <option value="">-- Select Stage --</option>
                              <option value="seeds">{t.seeds}</option>
                              <option value="germination">{t.germination}</option>
                              <option value="tillering">{t.tillering}</option>
                              <option value="bloom">{t.bloom}</option>
                              <option value="maturity">{t.maturity}</option>
                            </select>
                          </div>
                          <div>
                            <label style={S.label}>Farm Size</label>
                            <div style={{ display: "flex", gap: 8 }}>
                              <input type="number" min="0.1" step="0.5" value={farmSize} onChange={e => setFarmSize(e.target.value)} style={{ ...S.input, flex: 1 }} placeholder="e.g. 2.5" />
                              <select value={farmUnit} onChange={e => setFarmUnit(e.target.value)} style={{ ...S.select, width: 120 }}>
                                <option value="acres">Acres</option>
                                <option value="guntha">Guntha</option>
                                <option value="hectares">Hectares</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        {cropStage ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            {fertList.map((f, i) => (
                              <div key={i} style={{ background: f.color, borderLeft: `4px solid ${f.borderColor}`, borderRadius: 12, padding: "18px 20px", opacity: f.recommended ? 1 : 0.45, border: `1px solid ${f.borderColor}20` }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                                  <div style={{ fontWeight: 700, fontSize: 15, color: C.gray900 }}>🧪 {f.name}</div>
                                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                                    {!f.recommended && <Chip color={C.gray600} bg={C.gray200}>Not for this stage</Chip>}
                                    <div style={{ background: f.borderColor, color: C.white, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{f.totalDose}</div>
                                  </div>
                                </div>
                                {f.adjustReason && (<div style={{ background: "rgba(245,127,23,0.1)", border: `1px solid ${C.amber}`, borderRadius: 8, padding: "6px 12px", marginBottom: 10, fontSize: 12, color: C.amber, fontWeight: 600 }}>🔧 {f.adjustReason}</div>)}
                                <div style={{ fontSize: 13, marginBottom: 8 }}><span style={{ color: C.green800, fontWeight: 600 }}>✅ Benefit: </span>{f.benefit}</div>
                                <div style={{ fontSize: 13 }}><span style={{ color: C.red, fontWeight: 600 }}>⚠️ Risk: </span>{f.danger}</div>
                                <div style={{ fontSize: 11, color: C.gray600, marginTop: 8 }}>Best at: {f.bestFor.join(", ")}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <AlertBox type="info">Select crop growth stage above to see doses for {farmSize} {farmUnit}.</AlertBox>
                        )}
                      </div>
                    )}
                    {/* ── DISEASE ── */}
                    {activeModule === "disease" && (
                      <div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div>
                              <label style={S.label}>Crop Type</label>
                              <select value={selectedDiseaseCrop} onChange={e => setSelectedDiseaseCrop(e.target.value)} style={S.select}>
                                <option value="">-- Select Crop --</option>
                                <option value="Rice (Paddy)">Rice (Paddy)</option>
                                <option value="Wheat">Wheat</option>
                                <option value="Cotton">Cotton</option>
                                <option value="Soybean">Soybean</option>
                                <option value="Maize">Maize</option>
                                <option value="Sugarcane">Sugarcane</option>
                              </select>
                            </div>
                            <div>
                              <label style={S.label}>Disease Type (Suspected)</label>
                              <select value={diseaseType} onChange={e => setDiseaseType(e.target.value)} style={S.select}>
                                <option value="">-- Select Type --</option>
                                <option value="Fungal">🍄 Fungal Infection</option>
                                <option value="Bacterial">🦠 Bacterial Infection</option>
                                <option value="Viral">🧬 Viral Disease</option>
                                <option value="Pest">🐛 Pest / Insect Damage</option>
                                <option value="Nutrient Deficiency">🌿 Nutrient Deficiency</option>
                                <option value="Water Stress">💧 Water Stress</option>
                              </select>
                            </div>
                            <div>
                              <label style={S.label}>Observed Severity</label>
                              <div style={{ display: "flex", gap: 10 }}>
                                {[["Mild", "Mild"], ["Moderate", "Moderate"], ["Severe", "Severe"]].map(([val, label]) => (
                                  <button key={val} type="button" onClick={() => setDiseaseSeverity(val)}
                                    style={{ ...S.btn, flex: 1, fontSize: 13, padding: "8px 0", background: diseaseSeverity === val ? (val === "Mild" ? C.green800 : val === "Moderate" ? C.amber : C.red) : C.gray100, color: diseaseSeverity === val ? C.white : C.gray900, border: `1px solid ${C.border}` }}>
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <button onClick={executeDiseaseDiagnosticVision} disabled={diseaseLoading} style={{ ...S.btn, ...S.btnPrimary, fontSize: 15, padding: "12px" }}>
                              {diseaseLoading ? "🔬 Analysing..." : "🔬 Run AI Diagnosis"}
                            </button>
                            <button type="button" onClick={() => { setDiseasePhoto(null); setDiseasePhotoBase64(null); setSelectedDiseaseCrop(""); setDiseaseType(""); setDiseaseSeverity(""); setDiseaseDiagnosticResult(null); }} style={{ ...S.btn, ...S.btnSecondary }}>Reset Lab</button>
                          </div>
                          <div>
                            <label style={S.label}>Leaf / Plant Photo</label>
                            <div style={{ background: C.gray50, borderRadius: 14, border: `2px dashed ${C.border}`, padding: 20, textAlign: "center", minHeight: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                              {!isCameraActive ? (
                                <>{diseasePhoto ? <img src={diseasePhoto} alt="Leaf" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 10, marginBottom: 12 }} /> : <div style={{ fontSize: 44, color: C.gray400, marginBottom: 16 }}>📷</div>}
                                  <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                                    <button type="button" onClick={startCamera} style={{ ...S.btn, background: C.green800, color: C.white, fontSize: 13 }}>📸 Capture Photo</button>
                                    <label style={{ ...S.btn, ...S.btnSecondary, fontSize: 13, cursor: "pointer" }}>📁 Upload Photo<input type="file" accept="image/*" onChange={handleDiseaseFileUpload} style={{ display: "none" }} /></label>
                                  </div>
                                  {diseasePhoto && <div style={{ marginTop: 10, fontSize: 12, color: C.green800, fontWeight: 600 }}>✓ Photo ready for AI analysis</div>}
                                </>
                              ) : (
                                <div style={{ width: "100%" }}>
                                  <video ref={videoRef} autoPlay playsInline style={{ width: "100%", borderRadius: 10, maxHeight: 220 }} />
                                  <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 12 }}>
                                    <button onClick={capturePhoto} style={{ ...S.btn, background: C.green800, color: C.white }}>📸</button>
                                    <button onClick={stopCamera} style={{ ...S.btn, ...S.btnSecondary }}>✕</button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {diseaseLoading && <AlertBox type="info">🔬 AI is analysing the leaf image — please wait...</AlertBox>}
                        {diseaseDiagnosticResult && (
                          <div style={{ background: "#fff8f8", border: `1.5px solid #ffcdd2`, borderRadius: 16, padding: "24px 28px", marginTop: 8 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                              <div>
                                <div style={{ fontSize: 11, color: C.red, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700 }}>🚨 Diagnosis Report</div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: C.red, marginTop: 4 }}>{diseaseDiagnosticResult.diseaseName}</div>
                              </div>
                              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {diseaseDiagnosticResult.confidence && <Chip color={C.blue} bg={C.blue100}>Confidence: {diseaseDiagnosticResult.confidence}</Chip>}
                                {diseaseDiagnosticResult.severity && <Chip color={C.red} bg={C.red100}>Severity: {diseaseDiagnosticResult.severity}</Chip>}
                              </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                              {[
                                { icon: "🔍", label: "Symptoms", value: diseaseDiagnosticResult.symptoms, color: "#5d4037" },
                                { icon: "🧬", label: "Cause", value: diseaseDiagnosticResult.cause, color: "#4a148c" },
                                { icon: "⚡", label: "Immediate Action", value: diseaseDiagnosticResult.immediateAction, color: C.red },
                                { icon: "🌿", label: "Organic Cure", value: diseaseDiagnosticResult.organicCure, color: C.green800 },
                                { icon: "🧪", label: "Chemical Cure", value: diseaseDiagnosticResult.chemicalCure, color: C.blue },
                                { icon: "🛡️", label: "Prevention", value: diseaseDiagnosticResult.preventionTip, color: C.teal },
                              ].map(item => (
                                <div key={item.label} style={{ background: C.white, borderRadius: 12, padding: "14px 16px", border: `1px solid ${C.gray200}` }}>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: item.color, marginBottom: 6 }}>{item.icon} {item.label}</div>
                                  <div style={{ fontSize: 13, color: C.gray900, lineHeight: 1.55 }}>{item.value}</div>
                                </div>
                              ))}
                            </div>
                            {diseaseDiagnosticResult.relatedScheme && (<div style={{ marginTop: 16 }}><AlertBox type="warning">🏛️ Related Scheme: <strong>{diseaseDiagnosticResult.relatedScheme}</strong></AlertBox></div>)}
                          </div>
                        )}
                      </div>
                    )}
                    {/* ── MARKET ── */}
                    {activeModule === "market" && (
                      <div>
                        {marketLoading && <AlertBox type="info">Fetching live APMC data from data.gov.in...</AlertBox>}
                        <div style={{ background: `linear-gradient(135deg, ${C.green900}, ${C.green800})`, borderRadius: 16, padding: "22px 26px", color: C.white, marginBottom: 20 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", opacity: 0.7, marginBottom: 6 }}>🎯 AI-Recommended Crop — Live Price</div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
                            <div><div style={{ fontSize: 24, fontWeight: 800 }}>{cropData.name}</div><div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>{cropData.marketTimeline.current}</div></div>
                            <Chip color={C.green100} bg="rgba(255,255,255,0.15)">{cropData.marketTimeline.future}</Chip>
                          </div>
                        </div>
                        <button onClick={fetchMarketPrices} style={{ ...S.btn, ...S.btnPrimary, marginBottom: 24 }}>
                          {marketLoading ? "Fetching..." : "🔄 Refresh Prices"}
                        </button>
                        {marketPrices && marketPrices !== "fallback" && Array.isArray(marketPrices) && (
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: C.gray600, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>Live APMC Records — {cropData.name}</div>
                            <div style={{ overflowX: "auto", borderRadius: 12, border: `1px solid ${C.border}` }}>
                              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                                <thead><tr style={{ background: C.green900, color: C.white }}>{["Market", "District", "Variety", "Min ₹", "Max ₹", "Modal ₹", "Date"].map(h => (<th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, fontSize: 12 }}>{h}</th>))}</tr></thead>
                                <tbody>{marketPrices.map((r, i) => (<tr key={i} style={{ background: i % 2 === 0 ? C.white : C.gray50 }}><td style={{ padding: "10px 14px", fontWeight: 600, color: C.green800 }}>{r.market}</td><td style={{ padding: "10px 14px" }}>{r.district}</td><td style={{ padding: "10px 14px" }}>{r.variety}</td><td style={{ padding: "10px 14px", color: C.red }}>₹{r.min}</td><td style={{ padding: "10px 14px", color: C.green800 }}>₹{r.max}</td><td style={{ padding: "10px 14px", fontWeight: 700, color: C.amber }}>₹{r.modal}</td><td style={{ padding: "10px 14px", color: C.gray600 }}>{r.date}</td></tr>))}</tbody>
                              </table>
                            </div>
                          </div>
                        )}
                        {(marketPrices === "fallback" || !marketPrices) && !marketLoading && (
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            {[{ crop: "Rice (Grade A)", market: "Pune APMC", price: "₹2,450 – ₹2,800" }, { crop: "Cotton (Shankar-6)", market: "Akola APMC", price: "₹7,000 – ₹7,800" }, { crop: "Wheat (Lokwan)", market: "Nashik APMC", price: "₹2,500 – ₹2,800" }, { crop: "Soybean", market: "Latur APMC", price: "₹5,800 – ₹6,400" }, { crop: "Onion", market: "Lasalgaon APMC", price: "₹1,600 – ₹2,200" }, { crop: "Garlic", market: "Pune APMC", price: "₹20,000 – ₹24,000" }].map((item, i) => (
                              <div key={i} style={{ background: C.gray50, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 18px" }}>
                                <div style={{ fontWeight: 700, color: C.green800, fontSize: 14 }}>{item.crop}</div>
                                <div style={{ fontSize: 12, color: C.gray600, marginTop: 2 }}>{item.market}</div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: C.amber, marginTop: 6 }}>{item.price} <span style={{ fontSize: 11, color: C.gray400 }}>/Quintal</span></div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ── SCHEMES MODULE (full-width, blue theme) ── */}
            {activeModule === "scheme" && (
              <div>
                {!selectedScheme ? (
                  <div>
                    <div style={{ background: SC.bg, padding: "12px 32px", borderBottom: `1px solid ${SC.border}` }}>
                      <button onClick={closeModule} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", background: SC.card, border: `1px solid ${SC.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: SC.text, cursor: "pointer" }}>
                        ← Dashboard
                      </button>
                    </div>
                    <SchemeListPage
                      schemes={schemesList}
                      onSchemeSelect={setSelectedScheme}
                      savedSchemes={savedSchemes}
                      onToggleSave={handleToggleSave}
                    />
                  </div>
                ) : (
                  <div style={{ background: SC.bg, minHeight: "100%" }}>
                    <div style={{ padding: "12px 32px", borderBottom: `1px solid ${SC.border}`, background: SC.card }}>
                      <button onClick={closeModule} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", background: SC.bg, border: `1px solid ${SC.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: SC.text, cursor: "pointer" }}>
                        ← Dashboard
                      </button>
                    </div>
                    <div style={{ padding: "0 32px" }}>
                      <SchemeDetailPage
                        scheme={selectedScheme}
                        allSchemes={schemesList}
                        onBack={() => setSelectedScheme(null)}
                        onSchemeSelect={setSelectedScheme}
                        savedSchemes={savedSchemes}
                        onToggleSave={handleToggleSave}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── SETTINGS ── */}
            {activeModule === "settings" && (
              <div style={{ background: C.white, borderRadius: 20, border: `1px solid ${C.gray200}`, boxShadow: C.shadowMd, overflow: "hidden" }}>
                <div style={{ background: "linear-gradient(135deg, #37474f, #546e7a)", padding: "24px 32px", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 52, height: 52, background: "rgba(255,255,255,0.18)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>⚙️</div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: C.white }}>{t.sosSettings}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>AI notifications and alert preferences</div>
                  </div>
                </div>
                <div style={{ padding: "28px 32px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.gray50, borderRadius: 14, padding: "20px 24px", border: `1px solid ${C.border}` }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: C.gray900 }}>Automated SOS Weather Alerts</div>
                      <div style={{ fontSize: 13, color: C.gray600, marginTop: 4 }}>Background monitoring — auto-alerts on extreme weather conditions.</div>
                    </div>
                    <button type="button" onClick={() => setIsSosAlertEnabled(!isSosAlertEnabled)} style={{ ...S.btn, background: isSosAlertEnabled ? C.green800 : C.red, color: C.white, minWidth: 120 }}>
                      {isSosAlertEnabled ? "🟢 ACTIVE" : "🔴 MUTED"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAV ITEM
───────────────────────────────────────────── */
function NavItem({ icon, label, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", margin: "1px 0", borderRadius: 9, cursor: "pointer", background: active ? "rgba(255,255,255,0.16)" : hovered ? "rgba(255,255,255,0.07)" : "transparent", color: active ? "#ffffff" : "rgba(255,255,255,0.80)", fontSize: 13.5, fontWeight: active ? 700 : 500, transition: "background 0.12s", borderLeft: active ? "3px solid rgba(255,255,255,0.55)" : "3px solid transparent" }}>
      <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MODULE CARD
───────────────────────────────────────────── */
function ModuleCard({ mod, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #e0e0e0", overflow: "hidden", cursor: "pointer", transition: "all 0.2s ease", boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.13)" : "0 2px 8px rgba(0,0,0,0.06)", transform: hovered ? "translateY(-4px)" : "translateY(0)" }}>
      <div style={{ height: 6, background: mod.gradient }} />
      <div style={{ padding: "18px 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: mod.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 2px 8px rgba(0,0,0,0.15)", flexShrink: 0 }}>{mod.icon}</div>
          <div style={{ fontWeight: 700, fontSize: 14.5, color: "#202124", lineHeight: 1.2 }}>{mod.label}</div>
        </div>
        <div style={{ fontSize: 12.5, color: "#9aa0a6", lineHeight: 1.5 }}>{mod.desc}</div>
        <div style={{ marginTop: 14, fontSize: 12, fontWeight: 600, color: "#2e7d32" }}>{hovered ? "Open →" : "Explore"}</div>
      </div>
    </div>
  );
}

export default Dashboard;