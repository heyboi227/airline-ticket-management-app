import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import IAirport from "../../../models/IAirport.model";
import ICountry from "../../../models/ICountry.model";
import "./AdminList.scss";
import ITimeZone from "../../../models/ITimeZone.model";

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
  const [editCountryIdVisible, setEditCountryIdVisible] =
    useState<boolean>(false);
  const [editTimeZoneIdVisible, setEditTimeZoneIdVisible] =
    useState<boolean>(false);

  const [newAirportCode, setNewAirportCode] = useState<string>(
    props.airport.airportCode
  );
  const [newAirportName, setNewAirportName] = useState<string>(
    props.airport.airportName
  );
  const [newCity, setNewCity] = useState<string>(props.airport.city);
  const [newCountryId, setNewCountryId] = useState<number>(
    props.airport.countryId
  );
  const [newTimeZoneId, setNewTimeZoneId] = useState<number>(
    props.airport.timeZoneId
  );

  const [countries, setCountries] = useState<ICountry[]>([]);
  const [timeZones, setTimeZones] = useState<ITimeZone[]>([]);

  function loadCountries() {
    api("get", "/api/country", "administrator")
      .then((res) => {
        if (res.status === "error") {
          return props.setErrorMessage(res.data + "");
        }

        setCountries(res.data);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  function loadTimeZones() {
    api("get", "/api/time-zone", "administrator")
      .then((res) => {
        if (res.status === "error") {
          return props.setErrorMessage(res.data + "");
        }

        setTimeZones(res.data);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  function doEditAirportCode() {
    api("put", "/api/airport/" + props.airport.airportId, "administrator", {
      airportCode: newAirportCode,
    })
      .then((res) => {
        if (res.status === "error") {
          return props.setErrorMessage(res.data + "");
        }

        props.loadAirports();
        setEditAirportCodeVisible(false);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  function doEditAirportName() {
    api("put", "/api/airport/" + props.airport.airportId, "administrator", {
      airportAirportName: newAirportName,
    })
      .then((res) => {
        if (res.status === "error") {
          return props.setErrorMessage(res.data + "");
        }

        props.loadAirports();
        setEditAirportNameVisible(false);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  function doEditCity() {
    api("put", "/api/airport/" + props.airport.airportId, "administrator", {
      city: newCity,
    })
      .then((res) => {
        if (res.status === "error") {
          return props.setErrorMessage(res.data + "");
        }

        props.loadAirports();
        setEditCityVisible(false);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  function doEditCountryId() {
    api("put", "/api/airport/" + props.airport.airportId, "administrator", {
      countryId: newCountryId,
    })
      .then((res) => {
        if (res.status === "error") {
          return props.setErrorMessage(res.data + "");
        }

        props.loadAirports();
        setEditCityVisible(false);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  function doEditTimeZoneId() {
    api("put", "/api/airport/" + props.airport.airportId, "administrator", {
      timeZoneId: newTimeZoneId,
    })
      .then((res) => {
        if (res.status === "error") {
          return props.setErrorMessage(res.data + "");
        }

        props.loadAirports();
        setEditTimeZoneIdVisible(false);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  return (
    <>
      <tr>
        <td>{props.airport.airportId}</td>
        <td>
          {!editAirportCodeVisible && (
            <div className="row">
              <span className="col col-6">{props.airport.airportCode}</span>
              <div className="col col-6">
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
              <span className="col col-7">{props.airport.airportName}</span>
              <div className="col col-5">
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
              <span className="col col-6">{props.airport.city}</span>
              <div className="col col-6">
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

              {newCity !== props.airport.city && (
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
                  setNewCity(props.airport.city);
                  setEditCityVisible(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </td>
        <td>
          {!editCountryIdVisible && (
            <div className="row">
              <span className="col col-7">
                {props.airport.country?.countryName}
              </span>
              <div className="col col-5">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setEditCountryIdVisible(true);
                    loadCountries();
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
          {editCountryIdVisible && (
            <div>
              <div className="form-group mb-3">
                <select
                  className="form-select form-select-sm"
                  value={newCountryId}
                  onChange={(e) => setNewCountryId(+e.target.value)}
                >
                  {countries.map((country) => (
                    <option key={country.countryId} value={country.countryId}>
                      {country.countryName}
                    </option>
                  ))}
                </select>
              </div>

              {newCountryId !== props.airport.countryId && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => doEditCountryId()}
                >
                  Edit
                </button>
              )}

              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setNewCountryId(props.airport.countryId);
                  setEditCountryIdVisible(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </td>
        <td>
          {!editTimeZoneIdVisible && (
            <div className="row">
              <span className="col col-6">
                {props.airport.timeZone?.timeZoneName}
              </span>
              <div className="col col-6">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setEditTimeZoneIdVisible(true);
                    loadTimeZones();
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
          {editTimeZoneIdVisible && (
            <div>
              <div className="form-group mb-3">
                <select
                  className="form-select form-select-sm"
                  value={newTimeZoneId}
                  onChange={(e) => setNewTimeZoneId(+e.target.value)}
                >
                  {timeZones.map((timeZone) => (
                    <option
                      key={timeZone.timeZoneId}
                      value={timeZone.timeZoneId}
                    >
                      {timeZone.timeZoneName}
                    </option>
                  ))}
                </select>
              </div>

              {newTimeZoneId !== props.airport.timeZoneId && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => doEditTimeZoneId()}
                >
                  Edit
                </button>
              )}

              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setNewTimeZoneId(props.airport.timeZoneId);
                  setEditTimeZoneIdVisible(false);
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

export default function AdminAirportList() {
  const [airports, setAirports] = useState<IAirport[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function loadAirports() {
    api("get", "/api/airport", "administrator")
      .then((res) => {
        if (res.status === "error") {
          return setErrorMessage(res.data + "");
        }

        setAirports(res.data);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  useEffect(loadAirports, []);

  return (
    <div>
      {errorMessage && <p className="alert aler-danger">{errorMessage}</p>}
      {!errorMessage && (
        <table className="table table-sm table-hover airport-list">
          <thead>
            <tr>
              <th>ID</th>
              <th>Airport code</th>
              <th>Airport name</th>
              <th>City</th>
              <th>Country</th>
              <th>Time zone</th>
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
      )}
    </div>
  );
}
