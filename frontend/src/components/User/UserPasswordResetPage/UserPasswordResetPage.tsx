import { motion } from "framer-motion";
import { useState } from "react";
import { api } from "../../../api/api";

export default function UserPasswordResetPage() {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSent, setIsSent] = useState<boolean>(false);

  const doSendPasswordResetLink = () => {
    api("post", "/api/user/reset-password", "user", {
      email,
    })
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Could not send the link. Reason: " + JSON.stringify(res.data)
          );
        }

        return res.data;
      })
      .catch((error) => {
        setError(error?.message ?? "Could not send the link!");

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
      <div className="d-flex flex-column justify-content-center align-items-center">
        <div className="d-flex flex-column justify-content-center align-items-center mt-5">
          <h1>Reset your password</h1>
          {isSent && (
            <div className="d-flex flex-column justify-content-center align-items-center mt-3">
              <p>
                Thank you. You will recieve a mail containing the password reset
                link shortly.
              </p>
            </div>
          )}
          {!isSent && (
            <div className="d-flex flex-column justify-content-center align-items-center mt-3">
              <p>
                Please enter your email below in order to recieve a password
                reset link.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  doSendPasswordResetLink();
                  setIsSent(true);
                }}
              >
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
                  <button className="btn btn-primary px-5" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        {error && <p className="alert alert-danger">{error}</p>}
      </div>
    </motion.div>
  );
}
