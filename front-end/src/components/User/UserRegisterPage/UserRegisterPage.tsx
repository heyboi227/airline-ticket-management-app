import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import { motion } from "framer-motion";
import AppStore from "../../../stores/AppStore";

export default function UserRegisterPage() {
  const [username, setUsername] = useState<string>(
    AppStore.getState().auth.identity
  );
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  if (AppStore.getState().auth.role !== "user") {
    return null;
  }

  const doRegister = () => {
    api("put", "/api/user/" + AppStore.getState().auth.id, "user", {
      username,
      email,
      password,
    })
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Could not register your account. Reason: " +
              JSON.stringify(res.data)
          );
        }
      })
      .then(() => {
        navigate("/auth/user/login", {
          replace: true,
        });
      })
      .catch((error) => {
        setError(error?.message ?? "Could not register your account.");

        setTimeout(() => {
          setError("");
        }, 3500);
      });
  };

  return (
    <motion.div
      className="row"
      initial={{
        position: "relative",
        top: 20,
        scale: 0.95,
        opacity: 0,
      }}
      animate={{
        top: 0,
        scale: 1,
        opacity: 1,
      }}
      transition={{
        delay: 0.125,
        duration: 0.75,
      }}
    >
      <div className="col col-xs-12 col-md-6 offset-md-3">
        <h1 className="h5 mb-3">Register your account</h1>

        <div className="form-group mb-3">
          <div className="input-group">
            <input
              className="form-control"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group mb-3">
          <div className="input-group">
            <input
              className="form-control"
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group mb-3">
          <div className="input-group">
            <input
              className="form-control"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group mb-3">
          <button className="btn btn-primary px-5" onClick={() => doRegister()}>
            <FontAwesomeIcon icon={faUserCircle} /> Register
          </button>
        </div>

        {error && <p className="alert alert-danger">{error}</p>}
      </div>
    </motion.div>
  );
}
