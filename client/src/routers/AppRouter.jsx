import { createBrowserRouter } from "react-router";
// import
import App from "../App";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminDashboard from "./../pages/dashboard/AdminDashboard";
import DealerDoashboard from "./../pages/dashboard/DealerDoashboard";
import CustomerDashboard from "../pages/dashboard/customerDashboard";
import ProtectedRoute from "./ProtectedRoute";
import About from "../pages/landing_pages/About";
import Car from "../pages/landing_pages/Car";
import Services from "../pages/landing_pages/Services";
import Contacts from "../pages/landing_pages/Contacts";
import DriveEliteLanding from "../pages/dealerLanding";
import CarDetail from "../pages/CarDetail";
import PaymentPage from "../pages/Payment";
import DashboardLayout from "../pages/layouts/DashboardLayout";

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
    <ProtectedRoute role="customer">
      <DashboardLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <CustomerDashboard /> },
  ],
},
  {
  path: "/dealer/dashboard",
  element: (
    <ProtectedRoute role="dealer">
      <DashboardLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <DealerDoashboard /> },
  ],
},

  {
  path: "/admin/dashboard",
  element: (
    <ProtectedRoute role="admin">
      <DashboardLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <AdminDashboard /> },
  ],
},

  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/cars",
    element: <Car />,
  },
  {
    path: "/cars/:id",
    element: <CarDetail />,
  },

  {
    path: "/services",
    element: <Services />,
  },
  {
    path: "/contacts",
    element: <Contacts />,
  },
  {
    path: "/dealer",
    element: <DriveEliteLanding />,
  },
  {
    path : "/payment",
    element : <PaymentPage />
  }
]);

export default AppRouter;
