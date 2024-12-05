import Header from "./parts/Header";
import Footer from "./parts/Footer";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchRegister } from "../redux/features/user/userSlice";

/**
 * Register component for handling user registration.
 * @returns {JSX.Element} The rendered Register component.
 */
function Register() {
  // Initialize dispatch to dispatch actions
  const dispatch = useDispatch();
  
  // Initialize navigate to programmatically navigate
  const navigate = useNavigate();

  // Initialize form handling using react-hook-form
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  /**
   * Handles form submission.
   * Dispatches the fetchRegister action with form data.
   * Sets errors or navigates on successful registration.
   * @param {Object} data - The form data.
   */
  const onSubmit = async (data) => {
    try {
      const response = await dispatch(fetchRegister(data));

      // If there are validation errors from the server
      if (response.payload?.errors) {
        response.payload?.errors.forEach((error) => {
          if (error.path === "username") {
            setError("username", {
              type: "server",
              message: "Too short username",
            });
          }
          if (error.path === "password") {
            setError("password", {
              type: "server",
              message: "Too short password",
            });
          }
        });
        return;
      }
      // If registration is successful, store token and navigate
      if (response.payload && response.payload.token) {
        window.localStorage.setItem("token", response.payload.token);
        navigate("/");
      } else {
        setError("root", { type: "server", message: "User Already Exists" });
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Unexpected error:", error);
      setError("root", {
        type: "server",
        message: "An unexpected error occurred",
      });
    }
  };

  return (
    <div className="container">
      <Header />
      <h3>Register</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="username">
          <b>Username</b>
        </label>
        <input
          className={errors.username ? "error" : ""}
          type="text"
          {...register("username", { required: "Username is required" })}
          placeholder="Enter Username"
        />
        {errors.username && (
          <p className="error-message">{errors.username.message}</p>
        )}

        <label htmlFor="password">
          <b>Password</b>
        </label>
        <input
          className={errors.password ? "error" : ""}
          type="password"
          {...register("password", { required: "Password is required" })}
          placeholder="Enter Password"
        />
        {errors.password && (
          <p className="error-message">{errors.password.message}</p>
        )}

        <button className="btn" disabled={!isValid} type="submit">
          Register
        </button>
      </form>

      {/* Display general error messages */}
      {errors.root && (
        <div className="alert alert-danger">{errors.root.message}</div>
      )}

      <Footer />
    </div>
  );
}

export default Register;
