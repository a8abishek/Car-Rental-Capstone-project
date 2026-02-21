import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../api/apiFetch";
import {
  User,
  Lock,
  Save,
  Moon,
  Sun,
  Monitor,
  ShieldAlert,
  Car,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { toast } from "react-hot-toast";

function AdminSetting() {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [recentCars, setRecentCars] = useState([]);

  useEffect(() => {
    // 1. Load Profile
    apiFetch("/api/users/me")
      .then((res) => setProfile({ name: res.name, email: res.email }))
      .catch(() => toast.error("Failed to load profile"));

    // 2. Load Recent Approved Cars
    apiFetch("/api/cars/recent-approved")
      .then((res) => setRecentCars(res))
      .catch(() => {
        // Dummy data for visual reference if API fails
        setRecentCars([
          {
            id: 1,
            model: "Tesla Model 3",
            dealer: "EcoDrive Inc",
            date: "2 mins ago",
          },
          {
            id: 2,
            model: "BMW M4",
            dealer: "Premium Motors",
            date: "1 hour ago",
          },
          {
            id: 3,
            model: "Audi Q7",
            dealer: "City Car Hub",
            date: "3 hours ago",
          },
        ]);
      });
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword) {
      return toast.error("Please fill in both password fields");
    }
    try {
      const res = await apiFetch("/api/users/change-password", {
        method: "PUT",
        body: JSON.stringify(passwords),
      });
      toast.success(res.message || "Password updated successfully");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (error) {
      toast.error(error.message || "Failed to change password");
    }
  };

  const toggleTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    localStorage.setItem("theme", selectedTheme);
    const root = document.documentElement;
    selectedTheme === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
    toast.success(
      `${selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)} mode activated`,
    );
  };

  return (
    <div
      className={`p-6 md:p-10 min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-slate-950 text-white" : "bg-[#F8FAFC] text-slate-900"}`}
    >
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tight">
          Admin Preferences
        </h1>
        <p
          className={`${theme === "dark" ? "text-slate-400" : "text-slate-500"} font-medium`}
        >
          Manage system settings and view recent activities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-4 space-y-8">
          {/* THEME SWITCHER */}
          <div
            className={`${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"} p-8 rounded-[2.5rem] border shadow-sm`}
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Monitor className="text-blue-600" size={20} /> Appearance
            </h3>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
              <button
                onClick={() => toggleTheme("light")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${theme === "light" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
              >
                <Sun size={16} /> Light
              </button>
              <button
                onClick={() => toggleTheme("dark")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${theme === "dark" ? "bg-slate-700 text-white shadow-sm" : "text-slate-500"}`}
              >
                <Moon size={16} /> Dark
              </button>
            </div>
          </div>

          {/* RECENT CAR APPROVALS SECTION */}
          <div
            className={`${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"} p-8 rounded-[2.5rem] border shadow-sm`}
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Car className="text-emerald-500" size={20} /> Recent Car
              Approvals
            </h3>
            <div className="space-y-4">
              {recentCars.map((car) => (
                <div
                  key={car.id}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                >
                  <div className="mt-1 bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{car.model}</p>
                    <p className="text-[11px] font-medium opacity-60">
                      Dealer: {car.dealer}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                      <Clock size={10} /> {car.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-8 space-y-8">
          <div
            className={`${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"} p-8 rounded-[2.5rem] border shadow-sm`}
          >
            <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
              <User className="text-blue-600" size={20} /> Personal Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className={`w-full mt-1 px-5 py-3.5 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-semibold ${theme === "dark" ? "bg-slate-800 text-white" : "bg-slate-50"}`}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    Email Identity
                  </label>
                  <input
                    type="text"
                    value={profile.email}
                    disabled
                    className={`w-full mt-1 px-5 py-3.5 border-none rounded-2xl opacity-50 cursor-not-allowed font-medium ${theme === "dark" ? "bg-slate-800 text-slate-400" : "bg-slate-100"}`}
                  />
                </div>
                <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                  <Save size={16} /> Update Name
                </button>
              </div>

              <form
                onSubmit={handlePasswordChange}
                className="space-y-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-8"
              >
                <h4 className="text-sm font-black uppercase text-slate-400 mb-4 flex items-center gap-2">
                  <Lock size={14} /> Change Password
                </h4>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      currentPassword: e.target.value,
                    })
                  }
                  className={`w-full px-5 py-3.5 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-semibold ${theme === "dark" ? "bg-slate-800" : "bg-slate-50"}`}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  className={`w-full px-5 py-3.5 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-semibold ${theme === "dark" ? "bg-slate-800" : "bg-slate-50"}`}
                />
                <button
                  type="submit"
                  className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-bold text-sm transition-all hover:scale-[1.02]"
                >
                  Update Credentials
                </button>
              </form>
            </div>
          </div>

          <div className="border-2 border-dashed border-red-100 dark:border-red-900/30 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-red-500">Danger Zone</h4>
              <p className="text-xs text-slate-400 font-medium">
                Permanently delete your account and all data.
              </p>
            </div>
            <button className="px-8 py-3 bg-red-50 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSetting;
