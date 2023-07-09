import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import User from "../../../models/User.model";
import "./AdminList.scss";

interface AdminUserRowProperties {
  user: User;
  loadUsers: () => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

function AdminUserRow(props: AdminUserRowProperties) {
  const [editPasswordVisible, setEditPasswordVisible] =
    useState<boolean>(false);
  const [editForenameVisible, setEditForenameVisible] =
    useState<boolean>(false);
  const [editSurnameVisible, setEditSurnameVisible] = useState<boolean>(false);

  const [newPassword, setNewPassword] = useState<string>("");

  const [newForename, setNewForename] = useState<string>(props.user.forename);
  const [newSurname, setNewSurname] = useState<string>(props.user.surname);

  const activeSideClass = props.user.isActive ? " btn-primary" : " btn-light";
  const inactiveSideClass = !props.user.isActive
    ? " btn-primary"
    : " btn-light";

  function doToggleUserActiveState() {
    api("put", "/api/user/" + props.user.userId, "administrator", {
      isActive: !props.user.isActive,
    })
      .then((res) => {
        if (res.status === "error") {
          return props.setErrorMessage(res.data + "");
        }

        props.loadUsers();
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  function doChangePassword() {
    api("put", "/api/user/" + props.user.userId, "administrator", {
      password: newPassword,
    })
      .then((res) => {
        if (res.status === "error") {
          return props.setErrorMessage(res.data + "");
        }

        props.loadUsers();
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  function doEditForename() {
    api("put", "/api/user/" + props.user.userId, "administrator", {
      forename: newForename,
    })
      .then((res) => {
        if (res.status === "error") {
          return props.setErrorMessage(res.data + "");
        }

        props.loadUsers();
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  function doEditSurname() {
    api("put", "/api/user/" + props.user.userId, "administrator", {
      surname: newSurname,
    })
      .then((res) => {
        if (res.status === "error") {
          return props.setErrorMessage(res.data + "");
        }

        props.loadUsers();
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  return (
    <>
      <tr>
        <td>{props.user.userId}</td>
        <td>{props.user.email}</td>
        <td>
          {!editForenameVisible && (
            <div className="row">
              <span className="col col-4">{props.user.forename}</span>
              <div className="col col-4">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setEditForenameVisible(true)}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
          {editForenameVisible && (
            <div>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={newForename}
                  onChange={(e) => setNewForename(e.target.value)}
                />
              </div>

              {newForename !== props.user.forename && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => doEditForename()}
                >
                  Edit
                </button>
              )}

              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setNewForename(props.user.forename);
                  setEditForenameVisible(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </td>
        <td>
          {!editSurnameVisible && (
            <div className="row">
              <span className="col col-4">{props.user.surname}</span>
              <div className="col col-4">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setEditSurnameVisible(true)}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
          {editSurnameVisible && (
            <div>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={newSurname}
                  onChange={(e) => setNewSurname(e.target.value)}
                />
              </div>

              {newSurname !== props.user.forename && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => doEditSurname()}
                >
                  Edit
                </button>
              )}

              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setNewSurname(props.user.forename);
                  setEditSurnameVisible(false);
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

export default function AdminUserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function loadUsers() {
    api("get", "/api/user", "administrator")
      .then((res) => {
        if (res.status === "error") {
          return setErrorMessage(res.data + "");
        }

        setUsers(res.data);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  useEffect(loadUsers, []);

  return (
    <div>
      {errorMessage && <p className="alert aler-danger">{errorMessage}</p>}
      {!errorMessage && (
        <table className="table table-sm table-hover user-list">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>First name</th>
              <th>Last name</th>
              <th>Status</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <AdminUserRow
                key={"user" + user.userId}
                user={user}
                loadUsers={loadUsers}
                setErrorMessage={setErrorMessage}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
