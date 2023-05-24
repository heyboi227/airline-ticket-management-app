import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import IFlight from "../../../models/IFlight.model";
import IAirport from "../../../models/IAirport.model";
import IAircraft from "../../../models/IAircraft.model";
import { localDateTimeFormat, formatDateTime } from "../../../helpers/helpers";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { srLatn } from "date-fns/locale";
import { parseISO } from "date-fns";
import Config from "../../../config";

interface IAdminFlightRowProperties {
  flight: IFlight;
  loadFlights: () => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

function AdminFlightRow(props: IAdminFlightRowProperties) {
  const [editFlightCodeVisible, setEditFlightCodeVisible] =
    useState<boolean>(false);
  const [editOriginAirportIdVisible, setEditOriginAirportIdVisible] =
    useState<boolean>(false);
  const [editDestinationAirportIdVisible, setEditDestinationAirportIdVisible] =
    useState<boolean>(false);
  const [editDepartureDateAndTimeVisible, setEditDepartureDateAndTimeVisible] =
    useState<boolean>(false);
  const [editArrivalDateAndTimeVisible, setEditArrivalDateAndTimeVisible] =
    useState<boolean>(false);
  const [editAircraftIdVisible, setEditAircraftIdVisible] =
    useState<boolean>(false);

  const [newFlightCode, setNewFlightCode] = useState<string>(
    props.flight.flightCode
  );
  const [newOriginAirportId, setNewOriginAirportId] = useState<number>(
    props.flight.originAirportId
  );
  const [newDestinationAirportId, setNewDestinationAirportId] =
    useState<number>(props.flight.destinationAirportId);
  const [newDepartureDateAndTime, setNewDepartureDateAndTime] =
    useState<string>(props.flight.departureDateAndTime);
  const [newArrivalDateAndTime, setNewArrivalDateAndTime] = useState<string>(
    props.flight.arrivalDateAndTime
  );
  const [newAircraftId, setNewAircraftId] = useState<number>(
    props.flight.aircraftId
  );

  const [airports, setAirports] = useState<IAirport[]>([]);
  const [aircraft, setAircraft] = useState<IAircraft[]>([]);

  function loadAirports() {
    api("get", "/api/airport", "administrator").then((res) => {
      if (res.status === "error") {
        return props.setErrorMessage(res.data + "");
      }

      const sortedAirports = res.data.sort((a: IAirport, b: IAirport) =>
        a.airportCode.localeCompare(b.airportCode)
      );

      setAirports(sortedAirports);
    });
  }

  function loadAircraft() {
    api("get", "/api/aircraft", "administrator").then((res) => {
      if (res.status === "error") {
        return props.setErrorMessage(res.data + "");
      }

      const sortedAircraft = res.data.sort((a: IAircraft, b: IAircraft) =>
        a.aircraftName.localeCompare(b.aircraftName)
      );

      setAircraft(sortedAircraft);
    });
  }

  function doEditFlightCode() {
    api("put", "/api/flight/" + props.flight.flightId, "administrator", {
      flightCode: newFlightCode,
    }).then((res) => {
      if (res.status === "error") {
        return props.setErrorMessage(res.data + "");
      }

      props.loadFlights();
      setEditFlightCodeVisible(false);
    });
  }

  function doEditOriginAirportId() {
    api("put", "/api/flight/" + props.flight.flightId, "administrator", {
      originAirportId: newOriginAirportId,
    }).then((res) => {
      if (res.status === "error") {
        return props.setErrorMessage(res.data + "");
      }

      props.loadFlights();
      setEditOriginAirportIdVisible(false);
    });
  }

  function doEditDestinationAirportId() {
    api("put", "/api/flight/" + props.flight.flightId, "administrator", {
      destinationAirportId: newDestinationAirportId,
    }).then((res) => {
      if (res.status === "error") {
        return props.setErrorMessage(res.data + "");
      }

      props.loadFlights();
      setEditDestinationAirportIdVisible(false);
    });
  }

  function doEditDepartureDateAndTime() {
    api("put", "/api/flight/" + props.flight.flightId, "administrator", {
      departureDateAndTime: newDepartureDateAndTime,
    }).then((res) => {
      if (res.status === "error") {
        return props.setErrorMessage(res.data + "");
      }

      props.loadFlights();
      setEditDepartureDateAndTimeVisible(false);
    });
  }

  function doEditArrivalDateAndTime() {
    api("put", "/api/flight/" + props.flight.flightId, "administrator", {
      arrivalDateAndTime: newArrivalDateAndTime,
    }).then((res) => {
      if (res.status === "error") {
        return props.setErrorMessage(res.data + "");
      }

      props.loadFlights();
      setEditArrivalDateAndTimeVisible(false);
    });
  }

  function doEditAircraftId() {
    api("put", "/api/flight/" + props.flight.flightId, "administrator", {
      aircraftId: newAircraftId,
    }).then((res) => {
      if (res.status === "error") {
        return props.setErrorMessage(res.data + "");
      }

      props.loadFlights();
      setEditAircraftIdVisible(false);
    });
  }

  return (
    <>
      <tr>
        <td>{props.flight.flightId}</td>
        <td>
          {!editFlightCodeVisible && (
            <div className="row">
              <span className="col col-6">{props.flight.flightCode}</span>
              <div className="col col-6">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setEditFlightCodeVisible(true)}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
          {editFlightCodeVisible && (
            <div>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={newFlightCode}
                  onChange={(e) => setNewFlightCode(e.target.value)}
                />
              </div>

              {newFlightCode !== props.flight.flightCode && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => doEditFlightCode()}
                >
                  Edit
                </button>
              )}

              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setNewFlightCode(props.flight.flightCode);
                  setEditFlightCodeVisible(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </td>
        <td>
          {!editOriginAirportIdVisible && (
            <div className="row">
              <span className="col col-9">
                {props.flight.originAirport?.airportName +
                  ` (${props.flight.originAirport?.airportCode})`}
              </span>
              <div className="col col-3">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setEditOriginAirportIdVisible(true);
                    loadAirports();
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
          {editOriginAirportIdVisible && (
            <div>
              <div className="form-group mb-3">
                <select
                  className="form-select form-select-sm"
                  value={newOriginAirportId}
                  onChange={(e) => setNewOriginAirportId(+e.target.value)}
                >
                  {airports.map((airport) => (
                    <option key={airport.airportId} value={airport.airportId}>
                      {airport.airportName + ` (${airport.airportCode})`}
                    </option>
                  ))}
                </select>
              </div>

              {newOriginAirportId !== props.flight.originAirportId && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => doEditOriginAirportId()}
                >
                  Edit
                </button>
              )}

              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setNewOriginAirportId(props.flight.originAirportId);
                  setEditOriginAirportIdVisible(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </td>
        <td>
          {!editDestinationAirportIdVisible && (
            <div className="row">
              <span className="col col-9">
                {props.flight.destinationAirport?.airportName +
                  ` (${props.flight.destinationAirport?.airportCode})`}
              </span>
              <div className="col col-3">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setEditDestinationAirportIdVisible(true);
                    loadAirports();
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
          {editDestinationAirportIdVisible && (
            <div>
              <div className="form-group mb-3">
                <select
                  className="form-select form-select-sm"
                  value={newDestinationAirportId}
                  onChange={(e) => setNewDestinationAirportId(+e.target.value)}
                >
                  {airports.map((airport) => (
                    <option key={airport.airportId} value={airport.airportId}>
                      {airport.airportName + ` (${airport.airportCode})`}
                    </option>
                  ))}
                </select>
              </div>

              {newDestinationAirportId !==
                props.flight.destinationAirportId && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => doEditDestinationAirportId()}
                >
                  Edit
                </button>
              )}

              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setNewDestinationAirportId(props.flight.destinationAirportId);
                  setEditDestinationAirportIdVisible(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </td>
        <td>
          {!editDepartureDateAndTimeVisible && (
            <div className="row">
              <span className="col col-6">
                {formatDateTime(
                  new Date(props.flight.departureDateAndTime),
                  Config.LOCAL_TIME_ZONE
                )}
              </span>
              <div className="col col-6">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setEditDepartureDateAndTimeVisible(true)}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
          {editDepartureDateAndTimeVisible && (
            <div>
              <div className="form-group mb-3">
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={srLatn}
                >
                  <DateTimePicker
                    label={"Pick a date and time"}
                    value={parseISO(newDepartureDateAndTime)}
                    onChange={(e) => {
                      if (e) setNewDepartureDateAndTime(e.toISOString());
                    }}
                    className="form-control"
                    disablePast={true}
                  ></DateTimePicker>
                </LocalizationProvider>
              </div>

              {newDepartureDateAndTime !==
                props.flight.departureDateAndTime && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => doEditDepartureDateAndTime()}
                >
                  Edit
                </button>
              )}

              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setNewDepartureDateAndTime(props.flight.departureDateAndTime);
                  setEditDepartureDateAndTimeVisible(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </td>
        <td>
          {!editArrivalDateAndTimeVisible && (
            <div className="row">
              <span className="col col-6">
                {formatDateTime(
                  new Date(props.flight.arrivalDateAndTime),
                  Config.LOCAL_TIME_ZONE
                )}
              </span>
              <div className="col col-6">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setEditArrivalDateAndTimeVisible(true)}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
          {editArrivalDateAndTimeVisible && (
            <div>
              <div className="form-group mb-3">
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={srLatn}
                >
                  <DateTimePicker
                    label={"Pick a date and time"}
                    value={parseISO(newArrivalDateAndTime)}
                    onChange={(e) => {
                      if (e) setNewArrivalDateAndTime(e.toISOString());
                    }}
                    className="form-control"
                    disablePast={true}
                  ></DateTimePicker>
                </LocalizationProvider>
              </div>

              {newArrivalDateAndTime !== props.flight.arrivalDateAndTime && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => doEditArrivalDateAndTime()}
                >
                  Edit
                </button>
              )}

              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setNewArrivalDateAndTime(props.flight.arrivalDateAndTime);
                  setEditArrivalDateAndTimeVisible(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </td>
        <td>
          {!editAircraftIdVisible && (
            <div className="row">
              <span className="col col-10">
                {props.flight.aircraft?.aircraftName}
              </span>
              <div className="col col-2">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setEditAircraftIdVisible(true);
                    loadAircraft();
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
          {editAircraftIdVisible && (
            <div>
              <div className="form-group mb-3">
                <select
                  className="form-select form-select-sm"
                  value={newAircraftId}
                  onChange={(e) => setNewAircraftId(+e.target.value)}
                >
                  {aircraft.map((aircraft) => (
                    <option
                      key={aircraft.aircraftId}
                      value={aircraft.aircraftId}
                    >
                      {aircraft.aircraftName}
                    </option>
                  ))}
                </select>
              </div>

              {newAircraftId !== props.flight.aircraftId && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => doEditAircraftId()}
                >
                  Edit
                </button>
              )}

              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setNewAircraftId(props.flight.aircraftId);
                  setEditAircraftIdVisible(false);
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

export default function AdminFlightList() {
  const [flights, setFlights] = useState<IFlight[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function loadFlights() {
    api("get", "/api/flight", "administrator").then((res) => {
      if (res.status === "error") {
        return setErrorMessage(res.data + "");
      }

      setFlights(res.data);
    });
  }

  useEffect(loadFlights, []);

  return (
    <div>
      {errorMessage && <p className="alert aler-danger">{errorMessage}</p>}
      {!errorMessage && (
        <table className="table table-sm table-hover flight-list">
          <thead>
            <tr>
              <th>ID</th>
              <th>Flight code</th>
              <th>Origin airport</th>
              <th>Destination airport</th>
              <th>Departure date and time</th>
              <th>Arrival date and time</th>
              <th>Aircraft</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <AdminFlightRow
                key={"flight" + flight.flightId}
                flight={flight}
                loadFlights={loadFlights}
                setErrorMessage={setErrorMessage}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
