import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import AppStore from "../../../stores/AppStore";
import { useState } from "react";
export default function UserDeactivatePage() {
  const navigate = useNavigate();

  const [error, setError] = useState<string>("");

  const doDeactivateAccount = () => {
    api(
      "put",
      "/api/user/deactivate/" + AppStore.getState().auth.id,
      "activeUser"
    )
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Could not deactivate the account. Reason: " +
              JSON.stringify(res.data)
          );
        }

        return res.data;
      })
      .catch((error) => {
        setError(error?.message ?? "Could not deactivate the account!");

        setTimeout(() => {
          setError("");
        }, 3500);
      });

    AppStore.dispatch({ type: "auth.reset" });
    navigate("/", { replace: true });
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
          <h1>Are you sure you want to deactivate your account?</h1>
          <div className="d-flex flex-column justify-content-center align-items-center mt-3">
            <p>
              You will not be able to play the quiz, or reactivate the account
              again without contacting the system administrator.
            </p>

            <div className="form-group mb-3">
              <button
                className="btn btn-danger"
                onClick={() => {
                  doDeactivateAccount();
                }}
              >
                Yes, proceed
              </button>
              <button
                className="btn btn-primary ms-3"
                onClick={() => navigate("/profile", { replace: true })}
              >
                No, return
              </button>
            </div>
          </div>
        </div>
        {error && <p className="alert alert-danger">{error}</p>}
      </div>

      {error && <p className="alert alert-danger">{error}</p>}
    </motion.div>
  );
}
