import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
// import
import { apiFetch } from "../../../api/apiFetch";

function UserDirectory() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [page, setPage] = useState(1);
  const usersPerPage = 5;

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
    applyTheme();

    return () => {
      window.removeEventListener("storage", applyTheme);
      window.removeEventListener("themeChanged", applyTheme);
    };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/api/admin/users");
        setAllUsers(data.users || data);
      } catch (error) {
        console.error("Fetch Error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) => {
      const name = user.name || "";
      const email = user.email || "";
      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "All" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [allUsers, searchTerm, roleFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / usersPerPage),
  );
  const startIndex = (page - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage,
  );

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const action = currentStatus === "pending" ? "approve" : "revoke";
      await apiFetch(`/api/admin/${action}/${userId}`, { method: "PUT" });
      setAllUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? { ...u, status: action === "approve" ? "approved" : "pending" }
            : u,
        ),
      );
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div
      className={`p-4 md:p-6 min-h-screen font-sans transition-colors duration-300 ${theme === "dark" ? "bg-[#0f172a] text-white" : "bg-gray-50 text-slate-900"}`}
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2
          className={`text-xl md:text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`}
        >
          User Directory
        </h2>
        <span
          className={`text-xs md:text-sm font-medium ${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}
        >
          Total Users: {filteredUsers.length}
        </span>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div
        className={`p-4 rounded-xl shadow-sm border mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center transition-colors ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search name or email..."
            className={`w-full pl-10 pr-4 py-2 border rounded-lg outline-none transition-all ${theme === "dark" ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-blue-500/50" : "bg-white border-gray-200 focus:ring-2 focus:ring-blue-500"}`}
            value={searchTerm}
            onChange={(e) => {
              setPage(1);
              setSearchTerm(e.target.value);
            }}
          />
        </div>

        <div className="flex gap-2">
          <select
            value={roleFilter}
            onChange={(e) => {
              setPage(1);
              setRoleFilter(e.target.value);
            }}
            className={`flex-1 md:flex-none border p-2 rounded-lg text-sm cursor-pointer transition-all ${theme === "dark" ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-gray-200 hover:border-gray-300"}`}
          >
            <option value="All">All Roles</option>
            <option value="customer">Customer</option>
            <option value="dealer">Dealer</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            className={`flex-1 md:flex-none border p-2 rounded-lg text-sm cursor-pointer transition-all ${theme === "dark" ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-gray-100 hover:border-gray-300"}`}
          >
            <option value="All">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div
        className={`rounded-xl shadow-sm border overflow-hidden transition-colors ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}
      >
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-150">
            <thead
              className={`${theme === "dark" ? "bg-slate-800/50 text-slate-400" : "bg-gray-50 text-gray-500"} text-[10px] md:text-[11px] uppercase font-bold tracking-wider`}
            >
              <tr>
                <th className="p-4">User Info</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody
              className={`divide-y ${theme === "dark" ? "divide-slate-800" : "divide-gray-100"}`}
            >
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center p-20">
                    <Loader2
                      className="animate-spin mx-auto text-blue-500"
                      size={30}
                    />
                    <p className="mt-2 text-gray-400 text-sm">
                      Loading directory...
                    </p>
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center p-20 text-gray-400 text-sm"
                  >
                    No users match your filters.
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className={`transition-colors ${theme === "dark" ? "hover:bg-slate-800/50" : "hover:bg-blue-50/20"}`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 md:w-9 md:h-9 rounded-full shrink-0 flex items-center justify-center font-bold text-xs md:text-sm ${theme === "dark" ? "bg-indigo-900/50 text-indigo-400" : "bg-blue-100 text-blue-700"}`}
                        >
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`text-sm font-semibold truncate ${theme === "dark" ? "text-slate-200" : "text-gray-800"}`}
                          >
                            {user.name}
                          </p>
                          <p className="text-[10px] md:text-xs text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] md:text-xs font-medium px-2 py-1 rounded capitalize ${theme === "dark" ? "bg-slate-800 text-slate-400" : "bg-gray-100 text-gray-600"}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2 md:px-3 py-1 text-[9px] md:text-[10px] font-bold uppercase rounded-full whitespace-nowrap ${user.status === "approved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                      >
                        {user.status === "approved" ? "Active" : "Pending"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() =>
                          handleToggleStatus(user._id, user.status)
                        }
                        className={`p-2 rounded-lg transition-all ${user.status === "pending" ? "text-green-600 hover:bg-green-50" : theme === "dark" ? "text-red-400 hover:bg-red-900/20" : "text-red-400 hover:bg-red-50"}`}
                        title={
                          user.status === "pending"
                            ? "Approve User"
                            : "Revoke User"
                        }
                      >
                        {user.status === "pending" ? (
                          <CheckCircle size={18} />
                        ) : (
                          <XCircle size={18} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION CONTROLS */}
      {!loading && filteredUsers.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 px-2">
          <p
            className={`text-[10px] md:text-xs ${theme === "dark" ? "text-slate-500" : "text-gray-500"} order-2 sm:order-1`}
          >
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + usersPerPage, filteredUsers.length)} of{" "}
            {filteredUsers.length} entries
          </p>
          <div className="flex gap-2 order-1 sm:order-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className={`p-2 border rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed ${theme === "dark" ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800" : "bg-white hover:bg-gray-50"}`}
            >
              <ChevronLeft size={18} />
            </button>
            <div
              className={`flex items-center px-4 py-1 border rounded-lg text-[10px] md:text-xs font-semibold ${theme === "dark" ? "bg-slate-900 border-slate-700 text-slate-300" : "bg-white border-gray-200"}`}
            >
              {page} / {totalPages}
            </div>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className={`p-2 border rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed ${theme === "dark" ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800" : "bg-white hover:bg-gray-50"}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDirectory;
