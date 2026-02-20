import { Outlet, useLocation } from "react-router";
import AdminSidebar from "../../components/sidebar/AdminSidebar";
import DealerSidebar from "../../components/sidebar/DealerSidebar";
import CustomerSidebar from "../../components/sidebar/CustomerSidebar";

const DashboardLayout = () => {
  const location = useLocation();

  const getSidebar = () => {
    if (location.pathname.startsWith("/admin"))
      return <AdminSidebar />;

    if (location.pathname.startsWith("/dealer"))
      return <DealerSidebar />;

    return <CustomerSidebar />;
  };

  return (
    <div className="flex">
      {getSidebar()}

      <div className="ml-64 flex-1 bg-gray-100 min-h-screen ">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
