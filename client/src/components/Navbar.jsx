import { useEffect, useState } from "react";
import { CarFront, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router";
import { apiFetch } from "../api/apiFetch";

function Navbar() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch user data if token exists (logic from updated version)
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
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between px-10 py-2.5 shadow bg-white sticky top-0 z-50">
      {/* logo + name (Your Original Style) */}
      <Link to="/" className="flex items-center space-x-1">
        <div className="bg-blue-600 p-1.5 rounded-md">
          <CarFront color="white" />
        </div>
        <p className="font-bold text-xl text-slate-900">
          Car<span className="text-blue-600">Rental</span>
        </p>
      </Link>

      {/* menu (Your Original Style: space-x-9, text-md, font-medium) */}
      <div>
        <nav>
          <ul className="flex space-x-9 text-md font-medium">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 px-3 py-2 rounded"
                    : "text-gray-500 px-3 py-2 hover:text-blue-600"
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
                    : "text-gray-500 px-3 py-2 hover:text-blue-600"
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
                    : "text-gray-500 px-3 py-2 hover:text-blue-600"
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
                    : "text-gray-500 px-3 py-2 hover:text-blue-600"
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
                    : "text-gray-500 px-3 py-2 hover:text-blue-600"
                }
              >
                Contacts
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Auth Logic (Your Original Style for Buttons) */}
      <div className="flex items-center">
        {user ? (
          /* LOGGED IN: Profile View */
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 cursor-pointer px-3 py-1.5 hover:bg-gray-50 rounded-md transition"
            >
              <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <p className="text-md font-medium text-gray-700">
                {user.name.split(" ")[0]}
              </p>
              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform ${showDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50">
                <Link
                  to={
                    user.role === "admin"
                      ? "/admin/dashboard"
                      : user.role === "dealer"
                        ? "/dealer/dashboard"
                        : "/dashboard"
                  }
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  onClick={() => setShowDropdown(false)}
                >
                  <LayoutDashboard size={16} /> <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 border-t border-gray-50 mt-1"
                >
                  <LogOut size={16} /> <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex space-x-5">
            <Link to="/login">
              <button className="px-3 py-1.5 text-gray-500 rounded-md text-md font-medium cursor-pointer hover:shadow">
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
    </div>
  );
}

export default Navbar;
