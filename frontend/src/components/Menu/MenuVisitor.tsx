import { useState } from "react";
import Logo from "../../static/png/logo-no-background.png";
import { Link, useNavigate } from "react-router-dom";
import AppStore from "../../stores/AppStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-regular-svg-icons";

export default function MenuVisitor() {
  const [role, setRole] = useState<
    "visitor" | "user" | "activeUser" | "administrator"
  >(AppStore.getState().auth.role);

  const navigate = useNavigate();

  function doUserLogout() {
    AppStore.dispatch({ type: "auth.reset" });
    navigate("/auth/user/login");
  }

  AppStore.subscribe(() => {
    setRole(AppStore.getState().auth.role);
  });

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-primary px-2">
      <Link className="navbar-brand" to="/">
        <img src={Logo} alt="The logo of Air Soko" width="150"></img>
      </Link>

      {role === "user" && (
        <Link className="navbar-brand" to="/">
          Good day, {AppStore.getState().auth.identity}
        </Link>
      )}

      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div
        className="collapse navbar-collapse d-flex justify-content-end"
        id="navbarNavAltMarkup"
      >
        <div className="navbar-nav">
          <Link className="nav-item nav-link text-light" to="/auth/user/login">
            Login
          </Link>

          <Link
            className="nav-item nav-link text-light"
            to="/auth/user/register"
          >
            Register
          </Link>

          {/* <Link className="nav-item nav-link" to="/auth/administrator/login">
            <FontAwesomeIcon icon={faUser} /> Admin login
          </Link>

          <Link className="nav-item nav-link" to="/contact">
            <FontAwesomeIcon icon={faContactCard} /> Contact
          </Link> */}

          {role === "user" && (
            <div
              className="nav-item nav-link"
              style={{ cursor: "pointer" }}
              onClick={() => doUserLogout()}
            >
              <FontAwesomeIcon icon={faWindowClose} /> Logout
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
