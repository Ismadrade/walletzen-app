import './sidenav.css';

import { useState } from "react";
import {
  Dashboard,
  Notifications,
  BarChart,
  Favorite,
  AccountBalanceWallet,
  MonetizationOn,
  Logout,
  Search,
  DarkMode,
  KeyboardArrowLeft,
  KeyboardArrowRight
} from "@mui/icons-material";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => setOpen(!open);
  const toggleDark = () => setDarkMode(!darkMode);

  return (
    <div
      className={`
        ${open ? "w-64" : "w-20"}
        ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"}
        h-screen  
        shadow-lg 
        p-4 
        flex flex-col 
        transition-all 
        duration-300 
      `}
    >

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-500 text-white font-bold px-3 py-2 rounded-lg">
          CL
        </div>

        {open && (
          <div>
            <h2 className="font-semibold text-lg">Codinglab</h2>
            <p className="text-sm opacity-70">Web developer</p>
          </div>
        )}

        {/* Collapse button */}
        <button
          onClick={toggleSidebar}
          className={`
            absolute
            top-6
            z-50
            bg-indigo-500 
            text-white 
            p-[0px]
            rounded-full 
            shadow-lg 
            hover:bg-gray-800
            transition-all 
            duration-300
            ${open ? "left-[240px]" : "left-[68px]"}
          `}
        >
          {open ? (
            <KeyboardArrowLeft className="text-base" />
          ) : (
            <KeyboardArrowRight className="text-base" />
          )}
        </button>


      </div>

      {/* Search */}
      <div
        className={`
          flex items-center gap-3 
          p-3 rounded-xl mb-6
          ${darkMode ? "bg-gray-800" : "bg-gray-100"}
        `}
      >
        <Search className="opacity-70" />
        {open && <input className="bg-transparent outline-none" placeholder="Search..." />}
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2 flex-1">

        <MenuItem icon={<Dashboard />} open={open} darkMode={darkMode}>Dashboard</MenuItem>
        <MenuItem icon={<MonetizationOn />} open={open} darkMode={darkMode}>Revenue</MenuItem>
        <MenuItem icon={<Notifications />} open={open} darkMode={darkMode}>Notifications</MenuItem>
        <MenuItem icon={<BarChart />} open={open} darkMode={darkMode}>Analytics</MenuItem>
        <MenuItem icon={<Favorite />} open={open} darkMode={darkMode}>Likes</MenuItem>
        <MenuItem icon={<AccountBalanceWallet />} open={open} darkMode={darkMode}>Wallets</MenuItem>

      </nav>

      {/* Logout */}
      <MenuItem icon={<Logout />} open={open} darkMode={darkMode}>Logout</MenuItem>

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

function MenuItem({ icon, children, open, darkMode }) {
  return (
    <div
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

