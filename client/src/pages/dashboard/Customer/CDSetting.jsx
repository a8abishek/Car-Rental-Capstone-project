import React, { useEffect, useState } from "react";
import {
  User,
  Lock,
  Save,
  Moon,
  Sun,
  Heart,
  Mail,
  KeyRound,
  Headphones,
  Car,
  BadgeCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";
// import
import { apiFetch } from "../../../api/apiFetch";

function Setting() {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [stats, setStats] = useState({ savedCount: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch Customer specific data
    apiFetch("/api/users/me").then((res) => {
      setProfile({ name: res.name, email: res.email });
      setStats({ savedCount: res.savedCars?.length || 0 });
    });
  }, []);

  //Update Profile
  const handleUpdateProfile = async () => {
    if (!profile.name) return toast.error("Name is required");
    setLoading(true);
    try {
      const res = await apiFetch("/api/users/update-profile", {
        method: "PUT",
        body: JSON.stringify({ name: profile.name }),
      });
      toast.success(res.message || "Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };
  // Change Password
  const handleChangePassword = async () => {
    if (!passwords.currentPassword || !passwords.newPassword)
      return toast.error("Fill all fields");
    setLoading(true);
    try {
      const res = await apiFetch("/api/users/change-password", {
        method: "PUT",
        body: JSON.stringify(passwords),
      });
      toast.success(res.message || "Security password updated!");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (error) {
      toast.error(error.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  //THEME TOGGLE WITH INSTANT SIDEBAR UPDATE
  const toggleTheme = (mode) => {
    setTheme(mode);
    localStorage.setItem("theme", mode);

    // Toggle HTML class for Tailwind dark mode
    document.documentElement.classList.toggle("dark", mode === "dark");

    // DISPATCH CUSTOM EVENT: This tells the Sidebar and Navbar to update instantly
    window.dispatchEvent(new Event("themeChanged"));
  };

  return (
    <div
      className={`min-h-screen p-4 lg:p-10 transition-all duration-500 ${
        theme === "dark"
          ? "bg-[#0b1120] text-white"
          : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-indigo-500 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                Customer Hub
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter">
              My Settings
            </h1>
          </div>

          {/* Theme Switcher */}
          <div className="flex w-full md:w-auto bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
            <button
              onClick={() => toggleTheme("light")}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                theme === "light"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-400"
              }`}
            >
              <Sun size={14} strokeWidth={3} /> LIGHT
            </button>
            <button
              onClick={() => toggleTheme("dark")}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                theme === "dark"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "text-slate-500 hover:text-slate-400"
              }`}
            >
              <Moon size={14} strokeWidth={3} /> DARK
            </button>
          </div>
        </div>

        {/* CUSTOMER STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
          <StatCard
            icon={<Heart />}
            label="Saved Favorites"
            value={`${stats.savedCount} Cars`}
            color="rose"
            theme={theme}
          />
          <StatCard
            icon={<Car />}
            label="Account Status"
            value="Verified Customer"
            color="indigo"
            theme={theme}
            isVerified={true}
          />
        </div>

        {/* --- FORMS SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* PERSONAL PROFILE CARD */}
          <div
            className={`p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border transition-all duration-300 ${
              theme === "dark"
                ? "bg-[#111827] border-slate-800 shadow-2xl"
                : "bg-white border-slate-100 shadow-xl shadow-slate-200/50"
            }`}
          >
            <div className="flex items-center gap-5 mb-10">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <User size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight">
                  Profile info
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Personal Details
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="group">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block tracking-widest">
                  Full Name
                </label>
                <input
                  className={`w-full px-6 py-4 md:py-5 rounded-2xl border-2 outline-none transition-all font-bold ${
                    theme === "dark"
                      ? "bg-slate-900/50 border-slate-800 focus:border-indigo-500 text-white"
                      : "bg-slate-50 border-slate-50 focus:bg-white focus:border-indigo-500 text-slate-800"
                  }`}
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
              </div>

              <div className="group">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block tracking-widest">
                  Email Address
                </label>
                <div
                  className={`px-6 py-4 md:py-5 rounded-2xl border-2 flex items-center gap-3 font-bold transition-all cursor-no-drop overflow-hidden ${
                    theme === "dark"
                      ? "bg-black/20 border-slate-800 text-slate-500"
                      : "bg-slate-100 border-transparent text-slate-400"
                  }`}
                >
                  <Mail size={18} strokeWidth={2.5} className="shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </div>
              </div>

              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="w-full py-4 md:py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] md:tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
              >
                <Save size={18} strokeWidth={3} />{" "}
                {loading ? "SAVING..." : "SAVE PROFILE"}
              </button>
            </div>
          </div>

          {/* SECURITY CARD */}
          <div
            className={`p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border transition-all duration-300 ${
              theme === "dark"
                ? "bg-[#111827] border-slate-800 shadow-2xl"
                : "bg-white border-slate-100 shadow-xl shadow-slate-200/50"
            }`}
          >
            <div className="flex items-center gap-5 mb-10">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                <Lock size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight">Security</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Access Control
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block tracking-widest">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-6 py-4 md:py-5 rounded-2xl border-2 outline-none transition-all font-bold ${
                    theme === "dark"
                      ? "bg-slate-900/50 border-slate-800 focus:border-rose-500 text-white"
                      : "bg-slate-50 border-slate-50 focus:bg-white focus:border-rose-500 text-slate-800"
                  }`}
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      currentPassword: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block tracking-widest">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Create new password"
                  className={`w-full px-6 py-4 md:py-5 rounded-2xl border-2 outline-none transition-all font-bold ${
                    theme === "dark"
                      ? "bg-slate-900/50 border-slate-800 focus:border-rose-500 text-white"
                      : "bg-slate-50 border-slate-50 focus:bg-white focus:border-rose-500 text-slate-800"
                  }`}
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                />
              </div>

              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="w-full py-4 md:py-5 bg-slate-900 dark:bg-white dark:text-slate-900 rounded-3xl font-black uppercase text-xs tracking-[0.2em] md:tracking-[0.3em] transition-all active:scale-95 flex items-center justify-center gap-3 mt-4 shadow-xl"
              >
                <KeyRound size={18} strokeWidth={3} />{" "}
                {loading ? "UPDATING..." : "CHANGE PASSWORD"}
              </button>
            </div>
          </div>
        </div>

        {/* --- CUSTOMER SUPPORT FOOTER --- */}
        <div className="mt-12 md:mt-16 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300">
          <div className="flex items-center gap-4 md:gap-6 flex-col md:flex-row text-center md:text-left">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 shrink-0">
              <Headphones size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-lg md:text-xl font-black dark:text-white">
                Need any help?
              </h4>
              <p className="text-slate-500 text-sm font-bold">
                Our support team is available 24/7 for you.
              </p>
            </div>
          </div>
          <button className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-lg active:scale-95">
            Open Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon, label, value, color, theme, isVerified }) => {
  const colorMap = {
    rose: "text-rose-600 bg-rose-50 dark:bg-rose-500/10",
    indigo: "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10",
  };

  return (
    <div
      className={`p-6 md:p-8 rounded-[2.5rem] border flex items-center gap-4 md:gap-7 transition-all duration-300 ${
        theme === "dark"
          ? "bg-[#111827] border-slate-800"
          : "bg-white border-slate-100 shadow-sm"
      }`}
    >
      <div
        className={`w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-[1.25rem] flex items-center justify-center ${colorMap[color]}`}
      >
        {React.cloneElement(icon, { size: 28, strokeWidth: 2.5 })}
      </div>
      <div className="min-w-0">
        <p className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">
          {label}
        </p>
        <div className="flex items-center gap-2">
          <p className="text-xl md:text-2xl font-black tracking-tight truncate">
            {value}
          </p>
          {isVerified && (
            <BadgeCheck
              size={22}
              className="text-blue-500 shrink-0"
              fill="currentColor"
              fillOpacity={0.1}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Setting;
