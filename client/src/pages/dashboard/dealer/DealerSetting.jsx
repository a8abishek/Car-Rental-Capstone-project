import React, { useEffect, useState } from "react";
import {
  User,
  Lock,
  Save,
  Moon,
  Sun,
  CarFront,
  BarChart3,
  BadgePercent,
  Mail,
  ShieldCheck,
  Settings2,
  KeyRound,
  Headphones,
} from "lucide-react";
import { toast } from "react-hot-toast";
// import
import { apiFetch } from "../../../api/apiFetch";

function DealerSetting() {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [stats, setStats] = useState({ totalCars: 0, bookingCount: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial data load
    apiFetch("/api/users/me").then((res) =>
      setProfile({ name: res.name, email: res.email }),
    );
    apiFetch("/api/cars/dealer/stats")
      .then((res) => setStats(res))
      .catch(() => {});
  }, []);

  // 1. UPDATE PROFILE LOGIC
  const handleUpdateProfile = async () => {
    if (!profile.name) return toast.error("Name cannot be empty");
    setLoading(true);
    try {
      const res = await apiFetch("/api/users/update-profile", {
        method: "PUT",
        body: JSON.stringify({ name: profile.name }),
      });
      toast.success(res.message || "Profile updated!");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  //2. CHANGE PASSWORD LOGIC
  const handleChangePassword = async () => {
    const { currentPassword, newPassword } = passwords;
    if (!currentPassword || !newPassword)
      return toast.error("Fill all password fields");

    setLoading(true);
    try {
      const res = await apiFetch("/api/users/change-password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      toast.success(res.message || "Password changed!");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (error) {
      toast.error(error.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = (mode) => {
    setTheme(mode);
    localStorage.setItem("theme", mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
  };

  return (
    <div
      className={`min-h-screen p-6 lg:p-10 transition-colors duration-300 ${theme === "dark" ? "bg-[#0F172A] text-white" : "bg-[#F8FAFC] text-slate-900"}`}
    >
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-end mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings2 size={16} className="text-blue-600" />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
              System
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            Dealer Settings
          </h1>
        </div>

        <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => toggleTheme("light")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${theme === "light" ? "bg-blue-600 text-white shadow-md" : "text-slate-400"}`}
          >
            <Sun size={14} /> Light
          </button>
          <button
            onClick={() => toggleTheme("dark")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${theme === "dark" ? "bg-blue-600 text-white shadow-md" : "text-slate-400"}`}
          >
            <Moon size={14} /> Dark
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* BUSINESS STATUS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatusCard
            icon={<CarFront size={22} strokeWidth={2.5} />}
            label="Fleet Size"
            value={stats.totalCars}
            color="blue"
            theme={theme}
          />
          <StatusCard
            icon={<BarChart3 size={22} strokeWidth={2.5} />}
            label="Total Trips"
            value={stats.bookingCount}
            color="emerald"
            theme={theme}
          />
          <StatusCard
            icon={<BadgePercent size={22} strokeWidth={2.5} />}
            label="Payout"
            value="70/30"
            color="orange"
            theme={theme}
          />
        </div>

        {/* FORMS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PROFILE CARD */}
          <div
            className={`p-8 rounded-4xl border shadow-sm transition-all ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                <User size={20} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                Identity Details
              </h3>
            </div>

            <div className="space-y-5">
              <div className="group">
                <label className="text-[10px] font-black text-slate-400 ml-1 mb-2 block uppercase tracking-tighter">
                  Business Owner Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className={`w-full px-5 py-3.5 rounded-2xl text-sm font-bold outline-none border-2 transition-all ${theme === "dark" ? "bg-slate-800 border-slate-700 focus:border-blue-600" : "bg-slate-50 border-transparent focus:bg-white focus:border-blue-500"}`}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 ml-1 mb-2 block uppercase tracking-tighter">
                  Registered Email
                </label>
                <div
                  className={`px-5 py-3.5 rounded-2xl text-sm font-medium flex items-center gap-3 border-2 ${theme === "dark" ? "bg-slate-950 border-slate-800 text-slate-500" : "bg-slate-100 border-transparent text-slate-400"}`}
                >
                  <Mail size={16} /> {profile.email}
                </div>
              </div>
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Save size={16} /> {loading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>

          {/* SECURITY CARD */}
          <div
            className={`p-8 rounded-4xl border shadow-sm transition-all ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                <KeyRound size={20} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                Security Access
              </h3>
            </div>

            <div className="space-y-5">
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
                className={`w-full px-5 py-3.5 rounded-2xl text-sm font-bold outline-none border-2 transition-all ${theme === "dark" ? "bg-slate-800 border-slate-700 focus:border-emerald-600" : "bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500"}`}
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                className={`w-full px-5 py-3.5 rounded-2xl text-sm font-bold outline-none border-2 transition-all ${theme === "dark" ? "bg-slate-800 border-slate-700 focus:border-emerald-600" : "bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500"}`}
              />
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Lock size={16} /> {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="relative overflow-hidden p-8 rounded-4xl bg-slate-900 dark:bg-blue-600 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
              <Headphones size={28} />
            </div>
            <div>
              <p className="font-black text-lg tracking-tight">
                Dealer Support
              </p>
              <p className="text-xs text-blue-100 font-medium">
                Need help with payouts or car listings? We are here 24/7.
              </p>
            </div>
          </div>
          <button className="relative z-10 px-10 py-4 bg-white text-slate-900 font-black rounded-2xl text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
            Open Ticket
          </button>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full" />
        </div>
      </div>
    </div>
  );
}

const StatusCard = ({ icon, label, value, color, theme }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-100/50 dark:bg-blue-500/20",
    emerald: "text-emerald-600 bg-emerald-100/50 dark:bg-emerald-500/20",
    orange: "text-orange-600 bg-orange-100/50 dark:bg-orange-500/20",
  };

  return (
    <div
      className={`p-6 rounded-4xl border shadow-sm flex items-center gap-6 transition-all hover:translate-y-1 ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}
    >
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner ${colors[color]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] mb-1">
          {label}
        </p>
        <p className="text-2xl font-black tabular-nums">{value}</p>
      </div>
    </div>
  );
};

export default DealerSetting;
