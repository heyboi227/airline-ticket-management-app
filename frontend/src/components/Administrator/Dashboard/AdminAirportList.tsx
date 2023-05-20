import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import IAirport from "../../../models/IAirport.model";
import ICountry from "../../../models/ICountry.model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";

interface IAdminAirportRowProperties {
  airport: IAirport;
  loadAirports: () => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

function AdminAirportRow(props: IAdminAirportRowProperties) {
  const [editAirportCodeVisible, setEditAirportCodeVisible] =
    useState<boolean>(false);
  const [editAirportNameVisible, setEditAirportNameVisible] =
    useState<boolean>(false);
  const [editCityVisible, setEditCityVisible] = useState<boolean>(false);

  const [newAirportCode, setNewAirportCode] = useState<string>(
    props.airport.airportCode
  );
  const [newAirportName, setNewAirportName] = useState<string>(
    props.airport.airportName
  );
  const [newCity, setNewCity] = useState<string>(props.airport.city);

  function doEditAirportCode() {
    api("put", "/api/airport/" + props.airport.airportId, "administrator", {
      airportCode: newAirportCode,
    }).then((res) => {
      if (res.status === "error") {
        return props.setErrorMessage(res.data + "");
      }

      props.loadAirports();
      setEditAirportCodeVisible(false);
    });
  }

  function doEditAirportName() {
    api("put", "/api/airport/" + props.airport.airportId, "administrator", {
      airportAirportName: newAirportName,
    }).then((res) => {
      if (res.status === "error") {
        return props.setErrorMessage(res.data + "");
      }

      props.loadAirports();
      setEditAirportNameVisible(false);
    });
  }

  function doEditCity() {
    api("put", "/api/airport/" + props.airport.airportId, "administrator", {
      city: newCity,
    }).then((res) => {
      if (res.status === "error") {
        return props.setErrorMessage(res.data + "");
      }

      props.loadAirports();
      setEditCityVisible(false);
    });
  }

  return (
    <>
      <tr>
        <td>{props.airport.airportId}</td>
        <td>
          {!editAirportCodeVisible && (
            <div className="row">
              <span className="col col-4">{props.airport.airportCode}</span>
              <div className="col col-4">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setEditAirportCodeVisible(true)}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
          {editAirportCodeVisible && (
            <div>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={newAirportCode}
                  onChange={(e) => setNewAirportCode(e.target.value)}
                />
              </div>

              {newAirportCode !== props.airport.airportCode && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => doEditAirportCode()}
                >
                  Edit
                </button>
              )}

              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setNewAirportCode(props.airport.airportCode);
                  setEditAirportCodeVisible(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </td>
        <td>
          {!editAirportNameVisible && (
            <div className="row">
              <span className="col col-4">{props.airport.airportName}</span>
              <div className="col col-4">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setEditAirportNameVisible(true)}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
          {editAirportNameVisible && (
            <div>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={newAirportName}
                  onChange={(e) => setNewAirportName(e.target.value)}
                />
              </div>

              {newAirportName !== props.airport.airportName && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => doEditAirportName()}
                >
                  Edit
                </button>
              )}

              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setNewAirportName(props.airport.airportName);
                  setEditAirportNameVisible(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </td>
        <td>
          {!editCityVisible && (
            <div className="row">
              <span className="col col-4">{props.airport.city}</span>
              <div className="col col-4">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setEditCityVisible(true)}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
          {editCityVisible && (
            <div>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                />
              </div>

              {newCity !== props.airport.airportName && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => doEditCity()}
                >
                  Edit
                </button>
              )}

              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setNewCity(props.airport.airportName);
                  setEditCityVisible(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </td>
        <td>
          <div className="row">
            <span className="col col-4">
              {props.airport.country?.countryName}
            </span>
          </div>
        </td>
      </tr>
    </>
  );
}

export default function AdminAirportList() {
  const [airports, setAirports] = useState<IAirport[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function loadAirports() {
    api("get", "/api/airport", "administrator").then((res) => {
      if (res.status === "error") {
        return setErrorMessage(res.data + "");
      }

      setAirports(res.data);
    });
  }

  useEffect(loadAirports, []);

  return (
    <div>
      {errorMessage && <p className="alert aler-danger">{errorMessage}</p>}
      {!errorMessage && (
        <>
          <div>
            <Link
              className="btn btn-sm btn-success"
              to={"/admin/dashboard/airport/add"}
            >
              <FontAwesomeIcon icon={faPlusSquare} /> Add airport
            </Link>
          </div>
          <table className="table table-sm table-hover airport-list">
            <thead>
              <tr>
                <th>ID</th>
                <th>Airport code</th>
                <th>Airport name</th>
                <th>City</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {airports.map((airport) => (
                <AdminAirportRow
                  key={"airport" + airport.airportId}
                  airport={airport}
                  loadAirports={loadAirports}
                  setErrorMessage={setErrorMessage}
                />
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
