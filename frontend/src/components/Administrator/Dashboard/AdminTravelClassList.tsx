import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import ITravelClass from "../../../models/ITravelClass.model";
import "./AdminList.scss";

interface IAdminTravelClassRowProperties {
  travelClass: ITravelClass;
  loadTravelClass: () => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

function AdminTravelClassRow(props: IAdminTravelClassRowProperties) {
  const [editTravelClassNameVisible, setEditTravelClassNameVisible] =
    useState<boolean>(false);
  const [editTravelClassSubnameVisible, setEditTravelClassSubnameVisible] =
    useState<boolean>(false);

  const [newTravelClassName, setNewTravelClassName] = useState<string>(
    props.travelClass.travelClassName
  );
  const [newTravelClassSubname, setNewTravelClassSubname] = useState<string>(
    props.travelClass.travelClassSubname
  );

  function doEditTravelClassName() {
    api(
      "put",
      "/api/travelClass/" + props.travelClass.travelClassId,
      "administrator",
      {
        travelClassName: newTravelClassName,
      }
    )
      .then((res) => {
        if (res.status === "error") {
          return props.setErrorMessage(res.data + "");
        }

        props.loadTravelClass();
        setEditTravelClassNameVisible(false);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  function doEditTravelClassSubname() {
    api(
      "put",
      "/api/travelClass/" + props.travelClass.travelClassId,
      "administrator",
      {
        travelClassSubname: newTravelClassSubname,
      }
    )
      .then((res) => {
        if (res.status === "error") {
          return props.setErrorMessage(res.data + "");
        }

        props.loadTravelClass();
        setEditTravelClassSubnameVisible(false);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  return (
    <>
      <tr>
        <td>{props.travelClass.travelClassId}</td>
        <td>
          {!editTravelClassNameVisible && (
            <div className="row">
              <span className="col col-4">
                {props.travelClass.travelClassName}
              </span>
              <div className="col col-4">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setEditTravelClassNameVisible(true)}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
          {editTravelClassNameVisible && (
            <div>
              <div className="form-group mb-3">
                <select
                  className="form-select form-select-sm"
                  value={newTravelClassName}
                  onChange={(e) => setNewTravelClassName(e.target.value)}
                >
                  <option key={"Business"} value={"Business"}>
                    Business
                  </option>
                  <option key={"Economy"} value={"Economy"}>
                    Economy
                  </option>
                </select>
              </div>

              {newTravelClassName !== props.travelClass.travelClassName && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => doEditTravelClassName()}
                >
                  Edit
                </button>
              )}

              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setNewTravelClassName(props.travelClass.travelClassName);
                  setEditTravelClassNameVisible(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </td>
        <td>
          {!editTravelClassSubnameVisible && (
            <div className="row">
              <span className="col col-4">
                {props.travelClass.travelClassSubname}
              </span>
              <div className="col col-4">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setEditTravelClassSubnameVisible(true)}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
          {editTravelClassSubnameVisible && (
            <div>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={newTravelClassSubname}
                  onChange={(e) => setNewTravelClassSubname(e.target.value)}
                />
              </div>

              {newTravelClassSubname !==
                props.travelClass.travelClassSubname && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => doEditTravelClassSubname()}
                >
                  Edit
                </button>
              )}

              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setNewTravelClassSubname(
                    props.travelClass.travelClassSubname
                  );
                  setEditTravelClassSubnameVisible(false);
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

export default function AdminTravelClassList() {
  const [travelClass, setTravelClass] = useState<ITravelClass[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function loadTravelClass() {
    api("get", "/api/travel-class", "administrator")
      .then((res) => {
        if (res.status === "error") {
          return setErrorMessage(res.data + "");
        }

        setTravelClass(res.data);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  useEffect(loadTravelClass, []);

  return (
    <div>
      {errorMessage && <p className="alert aler-danger">{errorMessage}</p>}
      {!errorMessage && (
        <table className="table table-sm table-hover travelClass-list">
          <thead>
            <tr>
              <th>ID</th>
              <th>Travel class name</th>
              <th>Travel class subname</th>
            </tr>
          </thead>
          <tbody>
            {travelClass.map((travelClass) => (
              <AdminTravelClassRow
                key={"travelClass" + travelClass.travelClassId}
                travelClass={travelClass}
                loadTravelClass={loadTravelClass}
                setErrorMessage={setErrorMessage}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
