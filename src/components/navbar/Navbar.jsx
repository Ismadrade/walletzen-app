import './navbar.css';

import { Logout } from "@mui/icons-material";
import { useTheme } from "../../context/useTheme";

export default function Navbar() {
  const { darkMode } = useTheme();

  return (
    <nav 
      className={`
        w-full 
        flex items-center justify-between 
        px-4 py-3 
        ${darkMode ? "bg-gray-900 border-b border-gray-700" : "bg-white border-b border-gray-300"} 
        
      `}
    >
      {/* Logo */}
      <div 
        className={`
          pl-5 
          text-xl 
          font-semibold 
          ${darkMode ? "text-white" : "text-gray-800"} 
          
        `}
      >
        MyApp
      </div>

      {/* Ícone estilizado */}
      <button
        className={`
            flex items-center justify-center
            cursor-pointer
            p-2
            ${darkMode ? "text-white" : "text-gray-800"} 
        `}
        
      >
        <Logout style={{ fontSize: "20px" }} />
      </button>
    </nav>
  );
}

