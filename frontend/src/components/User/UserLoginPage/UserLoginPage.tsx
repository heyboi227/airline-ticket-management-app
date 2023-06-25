import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doLogin } from "../../../helpers/LoginAction";
import MotionDiv from "../../MotionDiv/MotionDiv";

export default function UserLoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  return (
    <MotionDiv>
      <div className="col col-xs-12 col-md-6 offset-md-3 p-5">
        <h1 className="h5 mb-3">Log into your user account</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            doLogin("user", password, setError, navigate, email);
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
            <button className="btn btn-primary px-5" type="submit">
              Log in
            </button>
          </div>
        </form>
        <span>Forgot your password?</span>&nbsp;
        <Link to="/auth/user/forgot-password">Click here.</Link>
        <br />
        <span>
          <small>
            <Link to="/auth/administrator/login">Admin login</Link>
          </small>
        </span>
        {error && <p className="alert alert-danger">{error}</p>}
      </div>
    </MotionDiv>
  );
}
