const API_BASE = "http://localhost:5000/api/auth";

async function request(path, options = {}) {
  try {
    console.log("➡️ API Request:", `${API_BASE}${path}`);

    const response = await fetch(`${API_BASE}${path}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: options.body,
    });

    const text = await response.text();

    let data = {};
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    console.log("⬅️ Status:", response.status);
    console.log("⬅️ Response:", data);

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("❌ API ERROR:", error);
    throw error;
  }
}

export async function signupUser(payload) {
  return await request("/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload) {
  return await request("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchProfile(token) {
  return await request("/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}