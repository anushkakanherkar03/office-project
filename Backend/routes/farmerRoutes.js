const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");

const TABLE_SELECT = `
  SELECT *
  FROM farmers
  WHERE phone = $1 OR email = $1
  LIMIT 1
`;

function normalizeText(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text.length > 0 ? text : null;
}

function normalizeIdentifier(req) {
  return normalizeText(req.params?.identifier || req.body?.identifier || req.body?.phone || req.body?.email);
}

function normalizeLoginIdentifier(value) {
  const text = normalizeText(value);
  if (!text) return null;
  return text.includes("@") ? text.toLowerCase() : text;
}

async function upsertFarmer(req, res) {
  try {
    const identifier = normalizeIdentifier(req);
    const body = req.body || {};

    const name = normalizeText(body.name);
    const phone = normalizeText(body.phone) || (identifier && identifier.includes("@") ? null : identifier);
    const email = normalizeText(body.email) || (identifier && identifier.includes("@") ? identifier : null);
    const state = normalizeText(body.state);
    const district = normalizeText(body.district);
    const village = normalizeText(body.village);
    const farmSizeValue = body.farmSize ?? body.landSize;
    const farmSize = farmSizeValue === undefined || farmSizeValue === null || farmSizeValue === ""
      ? null
      : Number(farmSizeValue);
    const landUnit = normalizeText(body.landUnit) || "Acres";
    const cropType = normalizeText(body.cropType) || normalizeText(body.pastCrop);
    const pastCrop = normalizeText(body.pastCrop);
    const pastFert = normalizeText(body.pastFert);
    const notes = normalizeText(body.farmerNotes) || normalizeText(body.notes);
    const profilePhoto = normalizeText(body.profilePhoto);
    const lastWatered = normalizeText(body.lastWatered);
    const password = normalizeText(body.password);

    if (!name || !state || !district || farmSize === null || Number.isNaN(farmSize) || !cropType) {
      return res.status(400).json({
        success: false,
        message: "Name, state, district, land size, and crop type are required",
      });
    }

    const existing = identifier
      ? await pool.query(TABLE_SELECT, [identifier])
      : { rows: [] };

    const current = existing.rows[0];
    const resolvedPhone = phone || current?.phone || null;
    const resolvedEmail = email || current?.email || null;

    if (!resolvedPhone && !resolvedEmail) {
      return res.status(400).json({
        success: false,
        message: "Phone or email is required to save the farmer profile",
      });
    }

    let resolvedPassword = current?.password || null;
    if (password) {
      resolvedPassword = await bcrypt.hash(password, 12);
    } else if (!current) {
      return res.status(400).json({
        success: false,
        message: "Password is required for the first save",
      });
    }

    let result;

    if (current) {
      result = await pool.query(
        `
        UPDATE farmers
        SET name = $1,
            phone = $2,
            email = $3,
            password = $4,
            state = $5,
            district = $6,
            village = $7,
            farm_size = $8,
            land_unit = $9,
            crop_type = $10,
            past_crop = $11,
            past_fert = $12,
            last_watered = $13,
            notes = $14,
            profile_photo = $15,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $16
        RETURNING *;
        `,
        [
          name,
          resolvedPhone,
          resolvedEmail,
          resolvedPassword,
          state,
          district,
          village,
          farmSize,
          landUnit,
          cropType,
          pastCrop,
          pastFert,
          lastWatered,
          notes,
          profilePhoto,
          current.id,
        ]
      );
    } else {
      result = await pool.query(
        `
        INSERT INTO farmers
        (name, phone, email, password, state, district, village, farm_size, land_unit, crop_type, past_crop, past_fert, last_watered, notes, profile_photo)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *;
        `,
        [
          name,
          resolvedPhone,
          resolvedEmail,
          resolvedPassword,
          state,
          district,
          village,
          farmSize,
          landUnit,
          cropType,
          pastCrop,
          pastFert,
          lastWatered,
          notes,
          profilePhoto,
        ]
      );
    }

    return res.status(current ? 200 : 201).json({
      success: true,
      message: current ? "Farmer profile updated successfully" : "Farmer data saved successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Profile Save Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}

// REGISTER / SAVE FARMER
router.post("/profile", async (req, res) => {
  return upsertFarmer(req, res);
});

router.put("/profile/:identifier", async (req, res) => {
  return upsertFarmer(req, res);
});

router.get("/profile/:identifier", async (req, res) => {
  try {
    const identifier = normalizeIdentifier(req);

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: "Identifier is required",
      });
    }

    const result = await pool.query(TABLE_SELECT, [identifier]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Farmer profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Profile Fetch Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { phone, identifier, password } = req.body;
    const loginIdentifier = normalizeLoginIdentifier(identifier || phone);

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Mobile number/email and password are required",
      });
    }

    const result = await pool.query(
      "SELECT * FROM farmers WHERE phone = $1 OR LOWER(email) = LOWER($1) LIMIT 1",
      [loginIdentifier]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid mobile/email or password",
      });
    }

    const farmer = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, farmer.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid mobile/email or password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Login Error:", err.message);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

module.exports = router;