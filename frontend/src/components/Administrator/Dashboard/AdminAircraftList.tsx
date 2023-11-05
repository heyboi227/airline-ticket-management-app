import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import Aircraft from "../../../models/Aircraft.model";
import "./AdminList.scss";
import ConfirmAction from "../../../helpers/ConfirmAction";

interface AdminAircraftRowProperties {
  aircraft: Aircraft;
  loadAircraft: () => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

function AdminAircraftRow(props: Readonly<AdminAircraftRowProperties>) {
  const [editAircraftTypeVisible, setEditAircraftTypeVisible] =
    useState<boolean>(false);
  const [editAircraftNameVisible, setEditAircraftNameVisible] =
    useState<boolean>(false);

  const [newAircraftType, setNewAircraftType] = useState<string>(
    props.aircraft.aircraftType
  );
  const [newAircraftName, setNewAircraftName] = useState<string>(
    props.aircraft.aircraftName
  );

  const [aircraftDeleteRequested, setAircraftDeleteRequested] =
    useState<boolean>(false);

  function doEditAircraftType() {
    api("put", "/api/aircraft/" + props.aircraft.aircraftId, "administrator", {
      type: newAircraftType,
    })
      .then((res) => {
        if (res.status === "error") {
          return props.setErrorMessage(res.data + "");
        }

        props.loadAircraft();
        setEditAircraftTypeVisible(false);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  function doEditAircraftName() {
    api("put", "/api/aircraft/" + props.aircraft.aircraftId, "administrator", {
      aircraftAircraftName: newAircraftName,
    })
      .then((res) => {
        if (res.status === "error") {
          return props.setErrorMessage(res.data + "");
        }

        props.loadAircraft();
        setEditAircraftNameVisible(false);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  function doDeleteAircraft() {
    api("delete", "/api/aircraft/" + props.aircraft.aircraftId, "administrator")
      .then((res) => {
        if (res.status === "error") {
          return props.setErrorMessage("Could not delete this aircraft!");
        }

        props.loadAircraft();
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  return (
    <tr>
        <td>{props.aircraft.aircraftId}</td>
        <td>
          {!editAircraftTypeVisible && (
            <div className="row">
              <span className="col col-6">{props.aircraft.aircraftType}</span>
              <div className="col col-6">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setEditAircraftTypeVisible(true)}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
          {editAircraftTypeVisible && (
            <div>
              <div className="form-group mb-3">
                <select
                  className="form-select form-select-sm"
                  value={newAircraftType}
                  onChange={(e) => setNewAircraftType(e.target.value)}
                >
                  <option value={""}>Choose a type</option>
                  <option value={"Wide-body"}>Wide-body</option>
                  <option value={"Narrow-body"}>Narrow-body</option>
                </select>
              </div>

              {newAircraftType !== props.aircraft.aircraftType && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => doEditAircraftType()}
                >
                  Edit
                </button>
              )}

              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setNewAircraftType(props.aircraft.aircraftType);
                  setEditAircraftTypeVisible(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </td>
        <td>
          {!editAircraftNameVisible && (
            <div className="row">
              <span className="col col-9">{props.aircraft.aircraftName}</span>
              <div className="col col-3">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setEditAircraftNameVisible(true)}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
          {editAircraftNameVisible && (
            <div>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={newAircraftName}
                  onChange={(e) => setNewAircraftName(e.target.value)}
                />
              </div>

              {newAircraftName !== props.aircraft.aircraftName && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => doEditAircraftName()}
                >
                  Edit
                </button>
              )}

              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setNewAircraftName(props.aircraft.aircraftName);
                  setEditAircraftNameVisible(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </td>
        <td>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => {
              setAircraftDeleteRequested(true);
            }}
          >
            Delete
          </button>

          {aircraftDeleteRequested && (
            <ConfirmAction
              title={`Are you sure you want to delete ${props.aircraft.aircraftName}?`}
              message={
                "All associated flights with this aircraft will also be deleted."
              }
              onYes={doDeleteAircraft}
              onNo={() => setAircraftDeleteRequested(false)}
            />
          )}
        </td>
      </tr>
  );
}

export default function AdminAircraftList() {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function loadAircraft() {
    api("get", "/api/aircraft", "administrator")
      .then((res) => {
        if (res.status === "error") {
          return setErrorMessage(res.data + "");
        }

        setAircraft(res.data);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  useEffect(loadAircraft, []);

  return (
    <div>
      {errorMessage && <p className="alert aler-danger">{errorMessage}</p>}
      {!errorMessage && (
        <table className="table w-75 my-0 mx-auto table-sm table-hover aircraft-list">
          <thead>
            <tr>
              <th>ID</th>
              <th>Aircraft type</th>
              <th>Aircraft name</th>
            </tr>
          </thead>
          <tbody>
            {aircraft.map((aircraft) => (
              <AdminAircraftRow
                key={"aircraft" + aircraft.aircraftId}
                aircraft={aircraft}
                loadAircraft={loadAircraft}
                setErrorMessage={setErrorMessage}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
