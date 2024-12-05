import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { selectIsAuth, logout } from "../../redux/features/user/userSlice";

function Header(props) {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onClickLogout = () => {
    dispatch(logout());
    window.localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <header className="header">
        <nav className="header__nav">
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
            <li>
              <NavLink to="/posts/search">Search</NavLink>
            </li>

            {isAuth ? (
              <>
                <li>
                  <NavLink to="/add-post">Create post</NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                </li>
                <li>
                  <a  href="javascript:void(0)"
                  className="logout"
                    onClick={() => {
                      onClickLogout();
                    }}
                  >
                    Logout
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/auth/login">Login</NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default Header;
