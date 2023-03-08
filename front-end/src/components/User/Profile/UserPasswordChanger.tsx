import { faSave, faSquareMinus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { api } from "../../../api/api";
import IUser from "../../../models/IUser.model";
import { motion } from "framer-motion";

export interface IUserPasswordChangerProperties {
  user: IUser;
  onPasswordChange: (user: IUser) => void;
}

interface IInputData {
  value: string;
  isValid: boolean;
}

export default function UserPasswordChanger(
  props: IUserPasswordChangerProperties
) {
  const [newPassword, setNewPassword] = useState<IInputData>({
    value: "",
    isValid: true,
  });
  const [confirmNewPassword, setConfirmNewPassword] = useState<IInputData>({
    value: "",
    isValid: true,
  });
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  function reset() {
    setNewPassword({
      value: "",
      isValid: true,
    });

    setConfirmNewPassword({
      value: "",
      isValid: true,
    });
  }

  function newPasswordChanged(e: React.ChangeEvent<HTMLInputElement>) {
    setNewPassword({
      value: e.target.value,
      isValid: true,
    });

    if (!e.target.value.trim().match(/^.{6,32}$/)) {
      setNewPassword({
        value: e.target.value,
        isValid: false,
      });
    }
  }

  function confirmNewPasswordChanged(e: React.ChangeEvent<HTMLInputElement>) {
    setConfirmNewPassword({
      value: e.target.value,
      isValid: true,
    });

    if (!e.target.value.trim().match(/^.{6,32}$/)) {
      setConfirmNewPassword({
        value: e.target.value,
        isValid: false,
      });
    }
  }

  function doSaveDetails() {
    if (!newPassword.isValid || !confirmNewPassword.isValid) {
      setError(
        "The new password is not valid. Must have at least 6 characters, and must have uppercase letters, lowercase letters, digits and at least one symbol."
      );
      setTimeout(() => setError(""), 10000);
      return;
    }

    if (newPassword.value !== confirmNewPassword.value) {
      setError("The passwords in both input fields must match!");
      setTimeout(() => setError(""), 5000);
      return;
    }

    api("put", "/api/user/" + props.user.userId, "activeUser", {
      password: newPassword.value,
    })
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Could not change the password! Reason: " + JSON.stringify(res.data)
          );
        }

        return res.data;
      })
      .then((user) => {
        props.onPasswordChange(user);

        setMessage("The password has been saved!");

        setTimeout(() => setMessage(""), 5000);

        setNewPassword({ value: "", isValid: true });
        setConfirmNewPassword({ value: "", isValid: true });
      })
      .catch((error) => {
        setError(error?.message ?? "Unknown error!");

        setTimeout(() => setError(""), 5000);
      });
  }

  return (
    <motion.div
      className="card"
      initial={{
        position: "relative",
        top: 20,
        scale: 0.75,
        opacity: 0,
      }}
      animate={{
        top: 0,
        scale: 1,
        opacity: 1,
      }}
      transition={{
        delay: 0.125,
      }}
    >
      <div className="card-body">
        <div className="card-title">
          <h2 className="h6">Account password</h2>
        </div>

        <div className="card-text">
          <div className="form-group mb-3">
            <label>New password</label>
            <div className="input-group">
              <input
                type="password"
                className={
                  "form-control" + (!newPassword.isValid ? " is-invalid" : "")
                }
                maxLength={128}
                value={newPassword.value}
                onChange={(e) => newPasswordChanged(e)}
              />
            </div>
          </div>

          <div className="form-group mb-3">
            <label>Confirm new password</label>
            <div className="input-group">
              <input
                type="password"
                className={
                  "form-control" +
                  (!confirmNewPassword.isValid ? " is-invalid" : "")
                }
                maxLength={128}
                value={confirmNewPassword.value}
                onChange={(e) => confirmNewPasswordChanged(e)}
              />
            </div>
          </div>

          <div className="form-group">
            <button className="btn btn-primary" onClick={() => doSaveDetails()}>
              <FontAwesomeIcon icon={faSave} /> Change the password
            </button>{" "}
            <button className="btn btn-secondary" onClick={() => reset()}>
              <FontAwesomeIcon icon={faSquareMinus} /> Clear the fields
            </button>
          </div>

          {error && <div className="mt-3 alert alert-danger">{error}</div>}
          {message && <div className="mt-3 alert alert-success">{message}</div>}
        </div>
      </div>
    </motion.div>
  );
}
