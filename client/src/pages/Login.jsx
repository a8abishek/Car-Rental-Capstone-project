import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
// import
import { apiFetch } from "../api/apiFetch";
function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  const role = location.pathname.includes("/dealer")
    ? "dealer"
    : location.pathname.includes("/admin")
      ? "admin"
      : "customer";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Auto redirect if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "dealer") navigate("/dealer/dashboard");
      else navigate("/dashboard");
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ ...data, role }),
      });

      localStorage.setItem("token", res.token);

      toast.success("Login successful");

      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "dealer") navigate("/dealer/dashboard");
      else navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>{role.toUpperCase()} LOGIN</h2>

      <input
        placeholder="Email"
        {...register("email", { required: "Email required" })}
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        type="password"
        placeholder="Password"
        {...register("password", { required: "Password required" })}
      />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
