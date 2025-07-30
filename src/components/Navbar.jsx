import React from "react";
import { BsBagCheckFill } from "react-icons/bs";
import { ImStatsDots } from "react-icons/im";
import { Link } from "react-router-dom";
import { IoBagHandleOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";

const Navbar = React.memo(() => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="w-screen h-20 bg-white fixed z-50 flex justify-center shadow-md shadow-blue-200">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 flex items-center">
          <Link to="/dashboard" className="flex">
            <BsBagCheckFill className="pr-2 m-auto" />
            <span className="hidden sm:inline">JobTracker</span>
            <span className="sm:hidden">JT</span>
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          <Link
            to="/dashboard"
            className="text-sm sm:text-base lg:text-lg font-medium text-blue-600 border py-2 px-2 sm:px-4 rounded-lg transition-colors duration-150 hover:bg-blue-50 active:bg-blue-600 focus:bg-blue-600 focus:text-white flex"
          >
            <ImStatsDots className="w-4 h-4 m-auto mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Dashboard</span>
            <span className="sm:hidden">Dash</span>
          </Link>
          <Link
            to="/jobs"
            className="text-sm sm:text-base lg:text-lg font-medium text-blue-600 border py-2 px-2 sm:px-4 rounded-lg transition-colors duration-150 hover:bg-blue-50 active:bg-blue-600 focus:bg-blue-600 focus:text-white flex"
          >
            <IoBagHandleOutline className="w-4 h-4 sm:w-5 sm:h-5 m-auto mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Jobs</span>
            <span className="sm:hidden">Jobs</span>
          </Link>
          <Link
            to="/add-job"
            className="text-sm sm:text-base lg:text-lg font-medium text-blue-600 border py-2 px-2 sm:px-4 rounded-lg transition-colors duration-150 hover:bg-blue-50 active:bg-blue-600 focus:bg-blue-600 focus:text-white flex"
          >
            <IoBagHandleOutline className="w-4 h-4 sm:w-5 sm:h-5 m-auto mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Add Job</span>
            <span className="sm:hidden">Add</span>
          </Link>
          <div className="flex items-center">
            <span className="text-xs sm:text-sm text-gray-600 mr-2 hidden sm:inline">
              Welcome, {user?.name}
            </span>
            <span className="text-xs text-gray-600 mr-2 sm:hidden">
              {user?.name}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm sm:text-base lg:text-lg font-medium text-red-600 border border-red-200 py-2 px-2 sm:px-4 rounded-lg transition-colors duration-150 hover:bg-red-50 active:bg-red-600 focus:bg-red-600 focus:text-white flex"
          >
            <IoLogOutOutline className="w-4 h-4 sm:w-5 sm:h-5 m-auto mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
            <span className="sm:hidden">Out</span>
          </button>
        </div>
      </div>
    </header>
  );
});

export default Navbar;
