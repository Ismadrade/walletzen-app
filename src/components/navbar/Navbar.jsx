import './navbar.css';

import { KeyboardArrowLeft } from "@mui/icons-material";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-300">
      {/* Logo */}
      <div className="text-xl font-semibold text-gray-800">
        MyApp
      </div>

      {/* Ícone estilizado */}
      <button
        className="
          flex items-center justify-center 
          bg-white border border-gray-300
          rounded-full 
          hover:bg-gray-200 transition
          p-2
        "
      >
        <KeyboardArrowLeft style={{ fontSize: "20px" }} />
      </button>
    </nav>
  );
}

