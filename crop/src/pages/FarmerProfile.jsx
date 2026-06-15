import { useNavigate } from "react-router-dom";
import { useState } from "react";

function FarmerProfile() {
  const navigate = useNavigate();

  const [farmerName, setFarmerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");

  const handleSave = () => {
    alert("Farmer Profile Saved Successfully");
  };

  return (
    <div className="dashboard">
      <div className="topbar">
        <h1>👨‍🌾 Farmer Profile</h1>
      </div>

      <div className="modal" style={{ margin: "30px auto", maxWidth: "600px" }}>
        <input
          type="text"
          placeholder="Farmer Name"
          value={farmerName}
          onChange={(e) => setFarmerName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <input
          type="text"
          placeholder="Village"
          value={village}
          onChange={(e) => setVillage(e.target.value)}
        />

        <input
          type="text"
          placeholder="District"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        />

        <button onClick={handleSave}>
          Save Profile
        </button>

        <br />
        <br />

        <button onClick={() => navigate("/dashboard")}>
          Back To Dashboard
        </button>
      </div>
    </div>
  );
}

export default FarmerProfile;