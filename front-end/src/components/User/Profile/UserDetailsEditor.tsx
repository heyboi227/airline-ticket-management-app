import { faSave, faSquareMinus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { api } from "../../../api/api";
import IUser from "../../../models/IUser.model";
import { motion } from "framer-motion";
import AppStore from "../../../stores/AppStore";

export interface IUserDetailsEditorProperties {
  user: IUser;
  onDataChanged: (user: IUser) => void;
}

interface IInputData {
  value: string;
  isValid: boolean;
}

export default function UserDetailsEditor(props: IUserDetailsEditorProperties) {
  const [username, setUsername] = useState<IInputData>({
    value: props.user.username,
    isValid: true,
  });
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  function reset() {
    setUsername({
      value: props.user.username,
      isValid: true,
    });
  }

  function usernameChanged(e: React.ChangeEvent<HTMLInputElement>) {
    setUsername({
      value: e.target.value,
      isValid: true,
    });

    if (!e.target.value.trim().match(/^[a-z-]{5,64}$/)) {
      setUsername({
        value: e.target.value,
        isValid: false,
      });
    }
  }

  function doSaveDetails() {
    if (!username.isValid) {
      return;
    }

    api("put", "/api/user/" + props.user.userId, "user", {
      username: username.value,
    })
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Could not edit user data! Reason: " + JSON.stringify(res.data)
          );
        }

        return res.data;
      })
      .then((user) => {
        props.onDataChanged(user);
        AppStore.dispatch({
          type: "auth.update",
          key: "identity",
          value: user.username,
        });

        setMessage("New user data saved!");

        setTimeout(() => setMessage(""), 5000);
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
          <h2 className="h6">Account details</h2>
        </div>

        <div className="card-text">
          <div className="form-group mb-3">
            <label>Username</label>
            <div className="input-group">
              <input
                className={
                  "form-control" + (!username.isValid ? " is-invalid" : "")
                }
                maxLength={32}
                value={username.value}
                onChange={(e) => usernameChanged(e)}
              />
            </div>
          </div>

          <div className="form-group">
            <button className="btn btn-primary" onClick={() => doSaveDetails()}>
              <FontAwesomeIcon icon={faSave} /> Save new details
            </button>{" "}
            <button className="btn btn-secondary" onClick={() => reset()}>
              <FontAwesomeIcon icon={faSquareMinus} /> Reset changes
            </button>
          </div>

          {error && <div className="mt-3 alert alert-danger">{error}</div>}
          {message && <div className="mt-3 alert alert-success">{message}</div>}
        </div>
      </div>
    </motion.div>
  );
}
