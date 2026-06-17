import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import FarmerProfile from "./pages/FarmerProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. सबसे पहले आपका पुराना सुंदर लॉगिन (Home) पेज खुलेगा */}
        <Route path="/" element={<Home />} />
        
        {/* 2. होम पेज का लॉगिन बटन सीधे यहाँ भेजेगा */}
        <Route path="/profile" element={<FarmerProfile />} />
        
        {/* 3. प्रोफाइल पेज का "Go To Dashboard" बटन यहाँ भेजेगा */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;