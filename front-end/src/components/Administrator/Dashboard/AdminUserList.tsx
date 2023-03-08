import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import "./AdminUserList.sass";
import IUser from "../../../models/IUser.model";

interface IAdminUserRowProperties {
  user: IUser;
}

export default function AdminUserList() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function loadUsers() {
    api("get", "/api/user", "administrator").then((res) => {
      if (res.status === "error") {
        return setErrorMessage(res.data + "");
      }

      setUsers(res.data);
    });
  }

  useEffect(loadUsers, []);

  function AdminUserRow(props: IAdminUserRowProperties) {
    const [editPasswordVisible, setEditPasswordVisible] =
      useState<boolean>(false);
    const [editUsernameVisible, setEditUsernameVisible] =
      useState<boolean>(false);
    const [newPassword, setNewPassword] = useState<string>("");
    const [newUsername, setNewUsername] = useState<string>(props.user.username);

    const activeSideClass = props.user.isActive ? " btn-primary" : " btn-light";
    const inactiveSideClass = !props.user.isActive
      ? " btn-primary"
      : " btn-light";

    function doToggleUserActiveState() {
      api("put", "/api/user/" + props.user.userId, "administrator", {
        isActive: !props.user.isActive,
      }).then((res) => {
        if (res.status === "error") {
          return setErrorMessage(res.data + "");
        }

        loadUsers();
      });
    }

    function doChangePassword() {
      api("put", "/api/user/" + props.user.userId, "administrator", {
        password: newPassword,
      }).then((res) => {
        if (res.status === "error") {
          return setErrorMessage(res.data + "");
        }

        loadUsers();
      });
    }

    function doEditUsername() {
      api("put", "/api/user/" + props.user.userId, "administrator", {
        username: newUsername,
      }).then((res) => {
        if (res.status === "error") {
          return setErrorMessage(res.data + "");
        }

        loadUsers();
      });
    }

    return (
      <>
        <tr>
          <td>{props.user.userId}</td>
          <td>{props.user.email}</td>
          <td>
            {!editUsernameVisible && (
              <div className="row">
                <span className="col col-9">{props.user.username}</span>
                <div className="col col-3">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setEditUsernameVisible(true)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
            {editUsernameVisible && (
              <div>
                <div className="form-group mb-3">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                </div>

                {newUsername !== props.user.username && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => doEditUsername()}
                  >
                    Edit
                  </button>
                )}

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => {
                    setNewUsername(props.user.username);
                    setEditUsernameVisible(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </td>
          <td>
            <div
              className="btn-group"
              onClick={() => {
                doToggleUserActiveState();
              }}
            >
              <div className={"btn btn-sm" + activeSideClass}>
                <FontAwesomeIcon icon={faSquareCheck} />
              </div>
              <div className={"btn btn-sm" + inactiveSideClass}>
                <FontAwesomeIcon icon={faSquare} />
              </div>
            </div>
          </td>
          <td>
            {!editPasswordVisible && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setEditPasswordVisible(true);
                }}
              >
                Change password
              </button>
            )}
            {editPasswordVisible && (
              <div className="input-group">
                <input
                  type="password"
                  className="form-control form-control-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => doChangePassword()}
                >
                  Save
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    setEditPasswordVisible(false);
                    setNewPassword("");
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </td>
        </tr>
      </>
    );
  }

  return (
    <div>
      {errorMessage && <p className="alert aler-danger">{errorMessage}</p>}
      {!errorMessage && (
        <table className="table table-sm table-hover user-list">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Username</th>
              <th>Status</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <AdminUserRow key={"user" + user.userId} user={user} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
