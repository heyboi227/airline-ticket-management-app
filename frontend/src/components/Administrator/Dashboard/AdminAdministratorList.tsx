import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import Administrator from "../../../models/Administrator.model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import "./AdminAdministratorList.sass";

interface AdminAdministratorRowProperties {
  administrator: Administrator;
  loadAdministrators: () => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

function AdminAdministratorRow(props: AdminAdministratorRowProperties) {
  const [editPasswordVisible, setEditPasswordVisible] =
    useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");

  const activeSideClass = props.administrator.isActive
    ? " btn-primary"
    : " btn-light";
  const inactiveSideClass = !props.administrator.isActive
    ? " btn-primary"
    : " btn-light";

  function doToggleAdministratorActiveState() {
    api(
      "put",
      "/api/administrator/" + props.administrator.administratorId,
      "administrator",
      {
        isActive: !props.administrator.isActive,
      }
    )
      .then((res) => {
        if (res.status === "error") {
          return props.setErrorMessage(res.data + "");
        }

        props.loadAdministrators();
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  function doChangePassword() {
    api(
      "put",
      "/api/administrator/" + props.administrator.administratorId,
      "administrator",
      {
        password: newPassword,
      }
    )
      .then((res) => {
        if (res.status === "error") {
          return props.setErrorMessage(res.data + "");
        }

        props.loadAdministrators();
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  function changePassword(e: React.ChangeEvent<HTMLInputElement>) {
    setNewPassword(e.target.value);
  }

  return (
    <tr>
      <td>{props.administrator.administratorId}</td>
      <td>{props.administrator.username}</td>
      <td>
        <div
          className="btn-group"
          onClick={() => {
            doToggleAdministratorActiveState();
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
              onChange={(e) => changePassword(e)}
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
  );
}

export default function AdminAdministratorList() {
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function loadAdministrators() {
    api("get", "/api/administrator", "administrator")
      .then((res) => {
        if (res.status === "error") {
          return setErrorMessage(res.data + "");
        }

        setAdministrators(res.data);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  useEffect(loadAdministrators, []);

  return (
    <div>
      {errorMessage && <p className="alert aler-danger">{errorMessage}</p>}
      {!errorMessage && (
        <table className="table table-sm table-hover admin-list">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Status</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {administrators.map((admin) => (
              <AdminAdministratorRow
                key={"administrator" + admin.administratorId}
                administrator={admin}
                loadAdministrators={loadAdministrators}
                setErrorMessage={setErrorMessage}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
