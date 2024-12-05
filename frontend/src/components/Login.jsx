import Header from "./parts/Header";
import Footer from "./parts/Footer";
import { useForm } from "react-hook-form";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, selectIsAuth } from "../redux/features/user/userSlice";

/**
 * @description The Login component
 * @param {object} props - Component props
 * @return {ReactElement} - The Login component
 */
function Login(props) {
  /**
   * Get the current authentication status from the store
   */
  const isAuth = useSelector(selectIsAuth);

  /**
   * Get the current error message from the store
   */
  const errorMsg = useSelector((state) => state.user.error);

  /**
   * Get the navigate function from the react-router-dom
   */
  const navigate = useNavigate();

  /**
   * Get the dispatch function from the react-redux
   */
  const dispatch = useDispatch();

  /**
   * Create a form using the useForm hook
   */
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    /**
     * The initial values of the form
     */
    defaultValues: {
      username: "",
      password: "",
    },
    /**
     * The mode of the form
     */
    mode: "onChange",
  });

  /**
   * The function to call when the form is submitted
   */
  const onSubmit = async (data) => {
    /**
     * Call the fetchUser action
     */
    const dataUser = await dispatch(fetchUser(data));

    /**
     * If the user is authenticated, store the token and redirect to the home page
     */
    if (dataUser.payload && "token" in dataUser.payload) {
      window.localStorage.setItem("token", dataUser.payload.token);
      navigate("/");
    }

    /**
     * Set the error message if the user is not authenticated
     */
    setError("root", { type: "server", message: errorMsg });
  };

  /**
   * If the user is already authenticated, redirect to the home page
   */
  if (isAuth) {
    return <Navigate to="/" />;
  }

  /**
   * Return the Login component
   */
  return (
    <div className="container">
      <Header />
      <div>
        <h1>Login</h1>
      </div>
      <p>
        * if you are not registered -<Link to="/auth/register">Register</Link>
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register("username", { required: true })} />
        <input type="password" {...register("password", { required: true })} />
        <button className="btn" disabled={!isValid} type="submit">
          Login
        </button>
        {errors.root && <div className="alert alert-danger">{errorMsg}</div>}
      </form>
      <Footer />
    </div>
  );
}


export default Login;
