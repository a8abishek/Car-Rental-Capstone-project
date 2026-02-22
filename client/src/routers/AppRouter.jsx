import { createBrowserRouter } from "react-router";
// import landing page
import App from "../App";
import About from "../pages/landing_pages/About";
import Car from "../pages/landing_pages/Car";
import Services from "../pages/landing_pages/Services";
import Contacts from "../pages/landing_pages/Contacts";

// import auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// import ProtectedRouter
import ProtectedRoute from "./ProtectedRoute";

// dashboards
//1.layer
import DashboardLayout from "../pages/layouts/DashboardLayout";

//2.Admin Dashboard
import AdminDashboard from "./../pages/dashboard/Admin/AdminDashboard";
import Analytics from './../pages/dashboard/Admin/Analytics';
import UserDirectory from './../pages/dashboard/Admin/UserDirectory';
import FleetMananger from './../pages/dashboard/Admin/FleetMananger';
import BookingRequests from './../pages/dashboard/Admin/BookingRequests';
import AdminSetting from './../pages/dashboard/Admin/AdminSetting';

//3.Dealer Dashboard
import DealerDoashboard from "../pages/dashboard/dealer/DealerDoashboard";
import DealerAnalytics from '../pages/dashboard/dealer/DealerAnalytics';
// import DMyFleet from './../pages/dashboard/dealer/DMyFleet';
import DealerSetting from './../pages/dashboard/dealer/DealerSetting';
import DAddCar from './../pages/dashboard/dealer/DAddCar';

//4.Customer Dashboard
import CustomerDashboard from "../pages/dashboard/Customer/CustomerDashboard";
import Mybooking from './../pages/dashboard/Customer/Mybooking';
import  SaveCars from '../pages/dashboard/Customer/SaveCars'
import PaymentHistory from './../pages/dashboard/Customer/PaymentHistory';
import Setting from "../pages/dashboard/Customer/CDSetting";
import Notification from "../pages/dashboard/Customer/Notification";

// import
import DriveEliteLanding from "../pages/dealerLanding";
import CarDetail from "../pages/CarDetail";
import PaymentPage from "../pages/Payment";







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
      {path : "/dashboard",element : <CustomerDashboard />},
      {path : "/dashboard/booking",element : <Mybooking />},
      {path : "/dashboard/wishlist", element : <SaveCars />},
      {path : "/dashboard/payments", element : <PaymentHistory />},
      {path : "/dashboard/settings",element : <Setting />},
      {path : "/dashboard/notification", element : <Notification /> ,}
    ],
  },
  {
  path: "/dealer",
  element: (
    <ProtectedRoute role="dealer">
      <DashboardLayout />
    </ProtectedRoute>
  ),
  children: [
    { path: "dashboard", element: <DealerDoashboard /> },
    { path: "/dealer/bookings", element: <DealerAnalytics /> },
    { path: "/dealer/my-cars", element: <FleetMananger /> },
    { path: "/dealer/add-cars", element: <DAddCar /> },
    { path: "/dealer/settings", element: <DealerSetting /> },

  ],
},

  {
    path: "/admin",
    element: (
      <ProtectedRoute role="admin">
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "analytics", element: <Analytics /> },
      { path: "users", element: <UserDirectory /> },
      { path: "cars", element: <FleetMananger /> },
      { path: "bookings", element: <BookingRequests /> },
      { path: "settings", element: <AdminSetting /> },
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
    path: "/payment",
    element: <PaymentPage />,
  },
]);

export default AppRouter;
