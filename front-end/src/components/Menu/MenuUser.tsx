import {
  faContactCard,
  faListAlt,
  faRectangleList,
  faUser,
  faWindowClose,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import AppStore from "../../stores/AppStore";

export default function MenuUser() {
  const navigate = useNavigate();

  function doUserLogout() {
    AppStore.dispatch({ type: "auth.reset" });
    navigate("/auth/user/login");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <Link className="navbar-brand" to="/">
        Hi, {AppStore.getState().auth.identity}
      </Link>

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

      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <Link className="nav-item nav-link" to="/quiz">
            <FontAwesomeIcon icon={faListAlt} /> Play!
          </Link>

          <Link className="nav-item nav-link" to="/contact">
            <FontAwesomeIcon icon={faContactCard} /> Contact
          </Link>

          <Link className="nav-item nav-link" to="/profile">
            <FontAwesomeIcon icon={faUser} /> My profile
          </Link>

          <Link className="nav-item nav-link" to="/my-scores">
            <FontAwesomeIcon icon={faRectangleList} /> My scores
          </Link>

          <Link className="nav-item nav-link" to="/high-scores">
            <FontAwesomeIcon icon={faRectangleList} /> High scores
          </Link>

          <div
            className="nav-item nav-link"
            style={{ cursor: "pointer" }}
            onClick={() => doUserLogout()}
          >
            <FontAwesomeIcon icon={faWindowClose} /> Logout
          </div>
        </div>
      </div>
    </nav>
  );
}
