import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SideNav from "./components/sidenav/SideNav";
import Navbar from "./components/navbar/Navbar";
import PageHeader from "./components/pageheader/PageHeader";
import Dashboard from "./pages/Dashboard";
import Financas from "./pages/Financas";

export default function App() {
  return (
    <Router>
      {/* fundo/cor base explícitos: sem isso o conteúdo depende do tema do browser */}
      <div className="flex min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <SideNav />

        <div className="flex-1 flex flex-col min-h-screen">
          <Navbar />
          <main className="p-10">
            <PageHeader />
            <Routes>
              <Route path="/" element={<Navigate to="/financas" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/financas" element={<Financas />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
