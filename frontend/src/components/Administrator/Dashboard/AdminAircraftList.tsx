import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import IAircraft from "../../../models/IAircraft.model";

interface IAdminAircraftRowProperties {
  aircraft: IAircraft;
  loadAircraft: () => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

function AdminAircraftRow(props: IAdminAircraftRowProperties) {
  const [editAircraftTypeVisible, setEditAircraftTypeVisible] =
    useState<boolean>(false);
  const [editNameVisible, setEditNameVisible] = useState<boolean>(false);

  const [newAircraftType, setNewAircraftType] = useState<string>(
    props.aircraft.type
  );
  const [newName, setNewName] = useState<string>(props.aircraft.name);

  function doEditAircraftType() {
    api("put", "/api/aircraft/" + props.aircraft.aircraftId, "administrator", {
      type: newAircraftType,
    }).then((res) => {
      if (res.status === "error") {
        return props.setErrorMessage(res.data + "");
      }

      props.loadAircraft();
      setEditAircraftTypeVisible(false);
    });
  }

  function doEditName() {
    api("put", "/api/aircraft/" + props.aircraft.aircraftId, "administrator", {
      name: newName,
    }).then((res) => {
      if (res.status === "error") {
        return props.setErrorMessage(res.data + "");
      }

      props.loadAircraft();
      setEditNameVisible(false);
    });
  }

  return (
    <>
      <tr>
        <td>{props.aircraft.aircraftId}</td>
        <td>
          {!editAircraftTypeVisible && (
            <div className="row">
              <span className="col col-4">{props.aircraft.type}</span>
              <div className="col col-4">
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
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={newAircraftType}
                  onChange={(e) => setNewAircraftType(e.target.value)}
                />
              </div>

              {newAircraftType !== props.aircraft.type && (
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
                  setNewAircraftType(props.aircraft.type);
                  setEditAircraftTypeVisible(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </td>
        <td>
          {!editNameVisible && (
            <div className="row">
              <span className="col col-4">{props.aircraft.name}</span>
              <div className="col col-4">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setEditNameVisible(true)}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
          {editNameVisible && (
            <div>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              {newName !== props.aircraft.name && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => doEditName()}
                >
                  Edit
                </button>
              )}

              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setNewName(props.aircraft.name);
                  setEditNameVisible(false);
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

export default function AdminAircraftList() {
  const [aircraft, setAircraft] = useState<IAircraft[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function loadAircraft() {
    api("get", "/api/aircraft", "administrator").then((res) => {
      if (res.status === "error") {
        return setErrorMessage(res.data + "");
      }

      setAircraft(res.data);
    });
  }

  useEffect(loadAircraft, []);

  return (
    <div>
      {errorMessage && <p className="alert aler-danger">{errorMessage}</p>}
      {!errorMessage && (
        <table className="table table-sm table-hover aircraft-list">
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
