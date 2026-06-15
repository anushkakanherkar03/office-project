function Sidebar({ setTab }) {
  return (
    <div style={styles.sidebar}>
      <h2>🌾 AgroSmart</h2>

      <button onClick={() => setTab("dashboard")}>Dashboard</button>
      <button onClick={() => setTab("crop")}>Crop</button>
      <button onClick={() => setTab("weather")}>Weather</button>
      <button onClick={() => setTab("disease")}>Disease</button>
      <button onClick={() => setTab("sos")}>SOS</button>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "200px",
    height: "120vh",
    background: "#1b5e20",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
};

export default Sidebar;