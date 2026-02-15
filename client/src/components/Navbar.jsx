import { CarFront } from "lucide-react";
import { NavLink, Link } from "react-router";

function Navbar() {
  return (
    <div className="flex items-center justify-between px-10 py-2.5 shadow bg-white">
      {/*logo + name */}
      <div className="flex items-center space-x-1">
        <div className="bg-blue-600 p-1.5 rounded-md">
          <CarFront color="white" />
        </div>
        <p className="font-bold text-xl">
          Car<span className="text-blue-600">Rental</span>
        </p>
      </div>
      {/*menu*/}
      <div>
        <nav>
          <ul className="flex space-x-9 text-md font-medium">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? " text-blue-600 px-3 py-2 rounded"
                    : "text-gray-500 px-3 py-2"
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
                    : "text-gray-500 px-3 py-2"
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
                    : "text-gray-500 px-3 py-2"
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
                    : "text-gray-500 px-3 py-2"
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
                    : "text-gray-500 px-3 py-2"
                }
              >
                Contacts
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      {/*login & register btn*/}
      <div className="flex space-x-5">
        <Link to={"/login"}>
          <button className="px-3 py-1.5 text-gray-500 rounded-md text-md font-medium cursor-pointer hover:shadow">
            Login
          </button>
        </Link>
        <Link to={"/register"}>
          <button className="bg-[#137fec] px-3 py-1.5 text-white rounded-md text-md font-medium cursor-pointer">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
