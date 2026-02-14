import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
// import
import { apiFetch } from "../api/apiFetch";

function Register() {
  //track the url
  const location = useLocation();
  //Navigate
  const navigate = useNavigate();

  const role = location.pathname.includes("/dealer") ? "dealer" : "customer";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ ...data, role }),
      });

      toast.success("Registered successfully");

      if (role === "dealer") {
        navigate("/dealer/login");
      } else {
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>{role.toUpperCase()} REGISTER</h2>

      <input
        placeholder="Name"
        {...register("name", { required: "Name required" })}
      />
      {errors.name && <p>{errors.name.message}</p>}

      <input
        placeholder="Email"
        {...register("email", { required: "Email required" })}
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        type="password"
        placeholder="Password"
        {...register("password", {
          required: "Password required",
          minLength: {
            value: 6,
            message: "Minimum 6 characters",
          },
        })}
      />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
