import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
  CarFront,
} from "lucide-react";
import toast from "react-hot-toast";
// import
import { apiFetch } from "../../api/apiFetch";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  //Role Detection
  const role = location.pathname.includes("/dealer")
    ? "dealer"
    : location.pathname.includes("/admin")
      ? "admin"
      : "customer";

  // Prevent Admin Register
  useEffect(() => {
    if (role === "admin") {
      navigate("/admin/login");
    }
  }, [role, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ ...data, role }),
      });

      toast.success("Registered successfully");
      navigate(role === "dealer" ? "/dealer/login" : "/login");
    } catch (error) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative min-h-screen w-full flex items-center justify-center font-sans overflow-hidden ${
        loading ? "cursor-wait" : "cursor-default"
      }`}
    >
      {/*Background*/}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-1000 scale-105"
        style={{
          backgroundImage:
            "url('https://images.turo.com/media/vehicle/images/cpq_uryfQjGnl5aZA3uBYw.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-linear-to-t from-white/40 via-transparent to-transparent"></div>
      </div>

      {/*Navbar */}
      <div className="absolute top-0 w-full flex justify-between items-center px-8 py-6 z-20">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="flex items-center space-x-1">
            <div className="bg-blue-600 p-1.5 rounded-md">
              <CarFront color="white" />
            </div>
            <p className="font-bold text-xl">
              Car<span className="text-blue-600">Rental</span>
            </p>
          </div>
        </div>
        <div className="flex gap-6 text-sm font-semibold text-slate-700">
          <button
            onClick={() => navigate("/")}
            className="hover:text-[#1d4ed8] transition-colors"
          >
            Home
          </button>
          <button className="bg-white/80 hover:bg-white px-5 py-2 rounded-full border border-slate-200 backdrop-blur-md transition-all shadow-sm">
            Help Center
          </button>
        </div>
      </div>

      {/*Register Card*/}
      <div className="relative z-10 w-full max-w-105 bg-white rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-10 mx-4 border border-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight text-center">
            {role === "dealer" ? "Dealer Register" : "Create Account"}
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Join CarRental today.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 ml-1 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative group">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1d4ed8] transition-colors"
                size={18}
              />
              <input
                type="text"
                disabled={loading}
                placeholder="John Doe"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#1d4ed8] focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm disabled:opacity-60"
                {...register("name", { required: "Name is required" })}
              />
            </div>
            {/*error message */}
            {errors.name && (
              <p className="text-red-500 text-[10px] font-bold ml-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 ml-1 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1d4ed8] transition-colors"
                size={18}
              />
              <input
                type="email"
                disabled={loading}
                placeholder="name@gmail.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#1d4ed8] focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm disabled:opacity-60"
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {/*error message */}
            {errors.email && (
              <p className="text-red-500 text-[10px] font-bold ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 ml-1 uppercase tracking-wider">
              Password
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1d4ed8] transition-colors"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                disabled={loading}
                placeholder="*********"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-[#1d4ed8] focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm disabled:opacity-60"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
              />
              {/*show/hide password btn */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/*error message */}
            {errors.password && (
              <p className="text-red-500 text-[10px] font-bold ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit btn */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1d4ed8] hover:bg-blue-700 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4 group disabled:opacity-70 disabled:cursor-wait"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                Register
                <UserPlus
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </form>

        {/* Login Redirect Section */}
        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm font-medium cursor-pointer">
            Already have an account?{" "}
            <span
              onClick={() =>
                navigate(role === "dealer" ? "/dealer/login" : "/login")
              }
              className="text-[#1d4ed8] font-bold hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
