import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideNav from "./components/sidenav/SideNav";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Router>
      <div className="flex">
        <SideNav />

        <div className="flex-1 flex flex-col min-h-screen">
          <Navbar />

          <main className="p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />              
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}