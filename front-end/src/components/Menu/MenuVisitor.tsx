import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SubmitUsernameAction from "../../helpers/SubmitUsernameAction";
import AppStore from "../../stores/AppStore";
import { api } from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faContactCard,
  faListAlt,
  faUser,
  faWindowClose,
} from "@fortawesome/free-regular-svg-icons";
import React from "react";

export default function MenuVisitor() {
  const [role, setRole] = useState<
    "visitor" | "user" | "activeUser" | "administrator"
  >(AppStore.getState().auth.role);
  const [username, setUsername] = useState<string>("");
  const [showUsernameSubmitDialog, setShowUsernameSubmitDialog] =
    useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  function doUserLogout() {
    AppStore.dispatch({ type: "auth.reset" });
    navigate("/auth/user/login");
  }

  AppStore.subscribe(() => {
    setRole(AppStore.getState().auth.role);
  });

  const doAddUser = () => {
    api("post", "/api/user", "user", { username })
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Could not add your account. Reason: " + JSON.stringify(res.data)
          );
        }
      })
      .then(() => {
        api("post", "/api/auth/user/login", "user", { username })
          .then((res) => {
            if (res.status !== "ok") {
              throw new Error(
                "Could not login. Reason: " + JSON.stringify(res.data)
              );
            }

            return res.data;
          })
          .then((data) => {
            AppStore.dispatch({
              type: "auth.update",
              key: "authToken",
              value: data?.authToken,
            });
            AppStore.dispatch({
              type: "auth.update",
              key: "refreshToken",
              value: data?.refreshToken,
            });
            AppStore.dispatch({
              type: "auth.update",
              key: "identity",
              value: username,
            });
            AppStore.dispatch({
              type: "auth.update",
              key: "id",
              value: +data?.id,
            });
            AppStore.dispatch({
              type: "auth.update",
              key: "role",
              value: "user",
            });
            window.location.reload();
          });
      })
      .then(() => {
        navigate("/quiz", {
          replace: true,
        });
      })
      .catch((error) => {
        setError(error?.message ?? "Could not add your account.");

        setTimeout(() => {
          setError("");
        }, 3500);
      });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <Link className="navbar-brand" to="/">
        Home page
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

      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <Link
            className="nav-item nav-link"
            to="#"
            onClick={() => setShowUsernameSubmitDialog(true)}
          >
            <FontAwesomeIcon icon={faListAlt} /> Play!
          </Link>

          {showUsernameSubmitDialog && (
            <SubmitUsernameAction
              title="Enter your username"
              message="Please enter your username in order to start playing."
              username={username}
              setUsername={setUsername}
              onSubmit={() => {
                setShowUsernameSubmitDialog(false);
                doAddUser();
              }}
              onCancel={() => setShowUsernameSubmitDialog(false)}
            />
          )}

          <Link className="nav-item nav-link" to="/auth/user/login">
            <FontAwesomeIcon icon={faUser} /> User login
          </Link>

          {role === "user" && (
            <Link className="nav-item nav-link" to="/auth/user/register">
              <FontAwesomeIcon icon={faUser} /> Register an account
            </Link>
          )}

          <Link className="nav-item nav-link" to="/auth/administrator/login">
            <FontAwesomeIcon icon={faUser} /> Admin login
          </Link>

          <Link className="nav-item nav-link" to="/contact">
            <FontAwesomeIcon icon={faContactCard} /> Contact
          </Link>

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
      {error && <p className="alert alert-danger">{error}</p>}
    </nav>
  );
}
