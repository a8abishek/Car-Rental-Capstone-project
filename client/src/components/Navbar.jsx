import { useEffect, useState } from "react";
import {
  CarFront,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router";
import { apiFetch } from "../api/apiFetch";

function Navbar() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();
  //store token
  const token = localStorage.getItem("token");

  useEffect(() => {
    const applyTheme = () => {
      const currentTheme = localStorage.getItem("theme") || "light";
      setTheme(currentTheme);
      if (currentTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    window.addEventListener("storage", applyTheme);
    window.addEventListener("themeChanged", applyTheme);

    applyTheme(); // Run on mount

    return () => {
      window.removeEventListener("storage", applyTheme);
      window.removeEventListener("themeChanged", applyTheme);
    };
  }, []);

  // Fetch user data if token exists
  useEffect(() => {
    if (token) {
      const fetchUser = async () => {
        try {
          const data = await apiFetch("/api/users/me");
          setUser(data);
        } catch (error) {
          console.error("Auth check failed:", error.message);
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setUser(null);
        }
      };
      fetchUser();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    setShowDropdown(false);
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <div
      className={`flex flex-col sticky top-0 z-50 shadow ${theme === "dark" ? "bg-slate-900 border-b border-slate-800 text-white" : "bg-white"}`}
    >
      <div className="flex items-center justify-between lg:px-12 px-4 py-2.5">
        {/* logo + name */}
        <Link to="/" className="flex items-center space-x-1">
          <div className="bg-blue-600 p-1.5 rounded-md">
            <CarFront color="white" />
          </div>
          <p
            className={`font-bold text-xl ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            Car<span className="text-blue-600">Rental</span>
          </p>
        </Link>

        {/* menu - Desktop */}
        <div className="hidden md:block">
          <nav>
            <ul className="flex space-x-6 text-md font-medium">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-600 px-3 py-2 rounded"
                      : `${theme === "dark" ? "text-slate-400" : "text-gray-500"} px-3 py-2 hover:text-blue-600`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-600 px-3 py-2 rounded"
                      : `${theme === "dark" ? "text-slate-400" : "text-gray-500"} px-3 py-2 hover:text-blue-600`
                  }
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/cars"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-600 px-3 py-2 rounded"
                      : `${theme === "dark" ? "text-slate-400" : "text-gray-500"} px-3 py-2 hover:text-blue-600`
                  }
                >
                  Cars
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/services"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-600 px-3 py-2 rounded"
                      : `${theme === "dark" ? "text-slate-400" : "text-gray-500"} px-3 py-2 hover:text-blue-600`
                  }
                >
                  Services
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contacts"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-600 px-3 py-2 rounded"
                      : `${theme === "dark" ? "text-slate-400" : "text-gray-500"} px-3 py-2 hover:text-blue-600`
                  }
                >
                  Contacts
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        {/* Auth Logic + Mobile Toggle */}
        <div className="flex items-center">
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`flex items-center space-x-2 cursor-pointer px-3 py-1.5 rounded-md transition ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-gray-50"}`}
                >
                  <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <p
                    className={`text-md font-medium ${theme === "dark" ? "text-white" : "text-gray-700"}`}
                  >
                    {user.name.split(" ")[0]}
                  </p>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showDropdown && (
                  <div
                    className={`absolute right-0 mt-2 w-48 border rounded-lg shadow-lg py-2 z-50 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}
                  >
                    <Link
                      to={
                        user.role === "admin"
                          ? "/admin/dashboard"
                          : user.role === "dealer"
                            ? "/dealer/dashboard"
                            : "/dashboard"
                      }
                      className={`flex items-center space-x-3 px-4 py-2 text-sm ${theme === "dark" ? "text-slate-300 hover:bg-slate-700" : "text-gray-600 hover:bg-gray-50"}`}
                      onClick={() => setShowDropdown(false)}
                    >
                      <LayoutDashboard size={16} /> <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-500 border-t ${theme === "dark" ? "border-slate-700 hover:bg-red-900/20" : "border-gray-50 hover:bg-red-50"} mt-1`}
                    >
                      <LogOut size={16} /> <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-5">
                <Link to="/login">
                  <button
                    className={`px-3 py-1.5 rounded-md text-md font-medium cursor-pointer hover:shadow ${theme === "dark" ? "text-slate-300" : "text-gray-500"}`}
                  >
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="bg-[#137fec] px-3 py-1.5 text-white rounded-md text-md font-medium cursor-pointer">
                    Register
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            className="md:hidden p-2 ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div
          className={`md:hidden px-12 pb-6 ${theme === "dark" ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}
        >
          <nav className="flex flex-col space-y-4 font-medium">
            <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/about" onClick={() => setIsMenuOpen(false)}>
              About
            </NavLink>
            <NavLink to="/cars" onClick={() => setIsMenuOpen(false)}>
              Cars
            </NavLink>
            <NavLink to="/services" onClick={() => setIsMenuOpen(false)}>
              Services
            </NavLink>
            <NavLink to="/contacts" onClick={() => setIsMenuOpen(false)}>
              Contacts
            </NavLink>
            <hr
              className={
                theme === "dark" ? "border-slate-800" : "border-gray-100"
              }
            />
            {user ? (
              <div className="flex flex-col space-y-4">
                <Link
                  to={
                    user.role === "admin"
                      ? "/admin/dashboard"
                      : user.role === "dealer"
                        ? "/dealer/dashboard"
                        : "/dashboard"
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-red-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-blue-600"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}

export default Navbar;
