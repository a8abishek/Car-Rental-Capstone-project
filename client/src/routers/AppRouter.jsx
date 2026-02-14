import { createBrowserRouter } from "react-router";
// import
import App from "../App";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "./../pages/dashboard/AdminDashboard";
import DealerDoashboard from "./../pages/dashboard/DealerDoashboard";
import CustomerDashboard from "../pages/dashboard/customerDashboard";
import ProtectedRoute from "./ProtectedRoute";
import About from "../pages/landing_pages/About";
import Car from "../pages/landing_pages/Car";
import Services from "../pages/landing_pages/Services";
import Contacts from "../pages/landing_pages/Contacts";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  /*customer Register & Login */
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  /*Dealer Register & Login */
  {
    path: "/dealer/login",
    element: <Login />,
  },
  {
    path: "/dealer/register",
    element: <Register />,
  },
  /*Admin Login */
  {
    path: "/admin/login",
    element: <Login />,
  },
  /*Dashboard*/
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <CustomerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dealer/dashboard",
    element: (
      <ProtectedRoute>
        <DealerDoashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/car",
    element: <Car />,
  },
  {
    path: "/services",
    element: <Services />,
  },
  {
    path: "contacts",
    element: <Contacts />,
  },
]);

export default AppRouter;
