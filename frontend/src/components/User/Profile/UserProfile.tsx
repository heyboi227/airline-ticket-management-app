import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../api/api";
import User from "../../../models/User.model";
import AppStore from "../../../stores/AppStore";
import UserDetailsEditor from "./UserDetailsEditor";
import UserPasswordChanger from "./UserPasswordChanger";
import { faAddressBook } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function UserProfile() {
  const [user, setUser] = useState<User>();

  function loadUserData() {
    api("get", "/api/user/" + AppStore.getState().auth.id, "user")
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Coudl not fetch this data. Reason: " + JSON.stringify(res.data)
          );
        }

        return res.data;
      })
      .then((user) => {
        setUser(user);
      })
      .catch(() => {});
  }

  useEffect(loadUserData, []);

  if (AppStore.getState().auth.role !== "user") {
    return null;
  }

  return (
    <>
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
          <div className="card-title mb-3">
            <h1 className="h5">My profile</h1>
          </div>
          <div className="card-text">
            <div className="row mb-4">
              <div className="col col-12 col-lg-6">
                {user && (
                  <UserDetailsEditor
                    user={user}
                    onDataChanged={(user) => setUser(user)}
                  />
                )}
                <div className="form-group">
                  <button className="btn btn-primary">
                    <FontAwesomeIcon icon={faAddressBook} /> Manage addresses
                  </button>
                </div>
              </div>

              <div className="col col-12 col-lg-6">
                {user && (
                  <UserPasswordChanger
                    user={user}
                    onPasswordChange={(user) => setUser(user)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div>
        <motion.div
          className="btn-danger"
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
          <Link className="btn btn-sm btn-danger" to="/deactivate">
            Deactivate account
          </Link>
        </motion.div>
      </div>
    </>
  );
}
