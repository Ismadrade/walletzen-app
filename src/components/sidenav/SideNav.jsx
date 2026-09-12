import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/useTheme";
import { useAuth } from "../../auth/useAuth";
import { useMe } from "../../user/useMe";
import {
  Dashboard,
  MonetizationOn,
  Logout,
  DarkMode,
  KeyboardArrowLeft,
  KeyboardArrowRight
} from "@mui/icons-material";

function initialsOf(name) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

export default function Sidebar() {
  // começa recolhido em telas estreitas, para o conteúdo não ficar espremido
  const [open, setOpen] = useState(() => window.matchMedia("(min-width: 768px)").matches);
  const { darkMode, toggleDark } = useTheme();
  const { claims, logout } = useAuth();
  const { me } = useMe();

  const toggleSidebar = () => setOpen(!open);

  // `me` vem do wz-user; o token cobre o caso de login sem cadastro (usuário seed).
  const displayName = me?.name ?? claims?.name ?? claims?.preferred_username ?? "Usuário";
  const displayEmail = me?.email ?? claims?.email ?? "";

  return (
    <div
      className={`
        ${open ? "w-64" : "w-20"}
        ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"}
        relative
        h-auto
        shadow-lg
        p-4
        flex flex-col
        transition-all
        duration-300
      `}
    >

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-500 text-white font-bold px-3 py-2 rounded-lg shrink-0">
          {initialsOf(displayName)}
        </div>

        {open && (
          <div className="min-w-0">
            <h2 className="font-semibold text-lg truncate" title={displayName}>{displayName}</h2>
            <p className="text-sm opacity-70 truncate" title={displayEmail}>{displayEmail}</p>
          </div>
        )}
      </div>

      {/* Collapse button — preso à borda direita da barra, não à viewport */}
      <button
        onClick={toggleSidebar}
        aria-label={open ? "Recolher menu" : "Expandir menu"}
        className="
          absolute
          top-6
          -right-3
          z-50
          bg-indigo-500
          text-white
          p-[0px]
          rounded-full
          shadow-lg
          hover:bg-gray-800
          transition-all
          duration-300
        "
      >
        {open ? (
          <KeyboardArrowLeft className="text-base" />
        ) : (
          <KeyboardArrowRight className="text-base" />
        )}
      </button>

      {/* Menu */}
      <nav className="flex flex-col gap-2 flex-1">

        <Link to="/dashboard"><MenuItem icon={<Dashboard />} open={open} darkMode={darkMode}>Dashboard</MenuItem></Link>
        <Link to="/financas"><MenuItem icon={<MonetizationOn />} open={open} darkMode={darkMode}>Finanças</MenuItem></Link>

      </nav>

      {/* Logout */}
      <MenuItem icon={<Logout />} open={open} darkMode={darkMode} onClick={logout}>Logout</MenuItem>

      {/* Dark mode toggle */}
      <div
        className={`
          flex items-center justify-between
          mt-6 p-3 rounded-xl
          cursor-pointer
          ${darkMode ? "bg-gray-800" : "bg-gray-100"}
        `}
        onClick={toggleDark}
      >
        <div className="flex items-center gap-3">
          <DarkMode />
          {open && <span>Dark mode</span>}
        </div>

        {open && (
          <div
            className={`w-10 h-5 flex items-center rounded-full
              ${darkMode ? "bg-indigo-500" : "bg-gray-300"}`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow transform duration-300
                ${darkMode ? "translate-x-5" : "translate-x-1"}`}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}

function MenuItem({ icon, children, open, darkMode, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3
        p-3 rounded-xl
        cursor-pointer
        ${darkMode ? "hover:bg-gray-800" : "hover:bg-indigo-100"}
        ${darkMode ? "text-white" : "text-gray-700"}
        `}
    >
      {icon}
      {open && <span className="text-sm">{children}</span>}
    </div>
  );
}
