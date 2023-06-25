import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import { motion } from "framer-motion";
import MotionDiv from "../../MotionDiv/MotionDiv";

export default function UserRegisterPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [forename, setForename] = useState<string>("");
  const [surname, setSurname] = useState<string>("");

  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const doRegister = () => {
    api("post", "/api/user/register", "user", {
      email,
      password,
      forename,
      surname,
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
    <MotionDiv>
      <div className="col col-xs-12 col-md-6 offset-md-3 p-5">
        <h1 className="h5 mb-3">Register your account</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            doRegister();
          }}
        >
          <div className="form-group mb-3">
            <div className="input-group">
              <input
                className="form-control"
                type="text"
                placeholder="Email"
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
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group mb-3">
            <div className="input-group">
              <input
                className="form-control"
                type="text"
                placeholder="Forename"
                value={forename}
                onChange={(e) => setForename(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group mb-3">
            <div className="input-group">
              <input
                className="form-control"
                type="text"
                placeholder="Surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group mb-3">
            <button className="btn btn-primary px-5" type="submit">
              <FontAwesomeIcon icon={faUserCircle} /> Register
            </button>
          </div>
        </form>

        {error && <p className="alert alert-danger">{error}</p>}
      </div>
    </MotionDiv>
  );
}
