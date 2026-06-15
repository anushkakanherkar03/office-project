import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import FarmerProfile from "./pages/FarmerProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/farmer" element={<FarmerProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;