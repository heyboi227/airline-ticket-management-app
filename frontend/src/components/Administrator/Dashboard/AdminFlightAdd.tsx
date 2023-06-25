import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckSquare,
  faSave,
  faSquare,
} from "@fortawesome/free-regular-svg-icons";
import IAirport from "../../../models/IAirport.model";
import IAircraft from "../../../models/IAircraft.model";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { srLatn } from "date-fns/locale";
import { parseISO } from "date-fns";
import ITravelClass from "../../../models/ITravelClass.model";
import { convertDateToMySqlDateTime } from "../../../helpers/helpers";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import FlightFormReducer, {
  initialFlightFormState,
} from "../../../api/flight-reducers";

export default function AdminFlightAdd() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [airports, setAirports] = useState<IAirport[]>([]);
  const [aircraft, setAircraft] = useState<IAircraft[]>([]);
  const [travelClasses, setTravelClasses] = useState<ITravelClass[]>([]);

  const [flightAdded, setFlightAdded] = useState<boolean>(false);

  const navigate = useNavigate();

  const [formState, dispatchFormStateAction] = useReducer(
    FlightFormReducer,
    initialFlightFormState
  );

  const fetchAirports = () => {
    api("get", "/api/airport", "administrator")
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Could not fetch airports! Reason: " +
              res?.data
                ?.map(
                  (error: any) => error?.instancePath + " " + error?.message
                )
                .join(", ")
          );
        }

        setAirports(res.data);
      })
      .catch((error) => {
        setErrorMessage(error?.message ?? "Unknown error!");
      });
  };

  const fetchAircraft = () => {
    api("get", "/api/aircraft", "administrator")
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Could not fetch aircraft! Reason: " +
              res?.data
                ?.map(
                  (error: any) => error?.instancePath + " " + error?.message
                )
                .join(", ")
          );
        }

        setAircraft(res.data);
      })
      .catch((error) => {
        setErrorMessage(error?.message ?? "Unknown error!");
      });
  };

  const fetchTravelClasses = () => {
    api("get", "/api/travel-class", "administrator")
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Could not fetch travel classes! Reason: " +
              res?.data
                ?.map(
                  (error: any) => error?.instancePath + " " + error?.message
                )
                .join(", ")
          );
        }

        setTravelClasses(res.data);
      })
      .catch((error) => {
        setErrorMessage(error?.message ?? "Unknown error!");
      });
  };

  useEffect(() => {
    fetchAirports();
    fetchAircraft();
    fetchTravelClasses();
  }, []);

  const doAddFlight = () => {
    api("post", "/api/flight", "administrator", formState)
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Could not add this flight! Reason: " +
              res?.data
                ?.map(
                  (error: any) => error?.instancePath + " " + error?.message
                )
                .join(", ")
          );
        }

        return res.data;
      })
      .then((flight) => {
        if (!flight?.flightId) {
          throw new Error("Could not fetch new flight data!");
        }

        return flight;
      })
      .then(() => {
        setFlightAdded(true);
        setTimeout(() => setFlightAdded(false), 3000);
      })
      .catch((error) => {
        setErrorMessage(error?.message ?? "Unknown error!");
      });
  };

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="card-flight-value">
            <h1 className="h5">Add new flight</h1>
          </div>
          <div className="card-text">
            {errorMessage && (
              <div className="alert alert-danger mb-3">{errorMessage}</div>
            )}

            <div className="form-group mb-3">
              <label>Flight code</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Enter the IATA flight code"
                  value={formState.flightCode}
                  onChange={(e) =>
                    dispatchFormStateAction({
                      type: "flightForm/setFlightCode",
                      value: e.target.value,
                      formType: "add",
                    })
                  }
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <label>Origin airport</label>
              <div className="input-group">
                <select
                  className="form-select form-select-sm"
                  value={formState.originAirportId}
                  onChange={(e) =>
                    dispatchFormStateAction({
                      type: "flightForm/setOriginAirportId",
                      value: +e.target.value,
                      formType: "add",
                    })
                  }
                >
                  <option value={""}>Choose an airport</option>
                  {airports.map((airport) => (
                    <option key={airport.airportId} value={airport.airportId}>
                      {airport.airportName + ` (${airport.airportCode})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group mb-3">
              <label>Destination airport</label>
              <div className="input-group">
                <select
                  className="form-select form-select-sm"
                  value={formState.destinationAirportId}
                  onChange={(e) =>
                    dispatchFormStateAction({
                      type: "flightForm/setDestinationAirportId",
                      value: +e.target.value,
                      formType: "add",
                    })
                  }
                >
                  <option value={""}>Choose an airport</option>
                  {airports.map((airport) => (
                    <option key={airport.airportId} value={airport.airportId}>
                      {airport.airportName + ` (${airport.airportCode})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group mb-3">
              <label>Departure date and time</label>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={srLatn}
              >
                <DateTimePicker
                  label={"Pick a date and time"}
                  value={parseISO(formState.departureDateAndTime)}
                  onChange={(e) => {
                    if (e)
                      dispatchFormStateAction({
                        type: "flightForm/setDepartureDateAndTime",
                        value: convertDateToMySqlDateTime(e),
                        formType: "add",
                      });
                  }}
                  className="form-control"
                  disablePast={true}
                ></DateTimePicker>
              </LocalizationProvider>
            </div>

            <div className="form-group mb-3">
              <label>Arrival date and time</label>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={srLatn}
              >
                <DateTimePicker
                  label={"Pick a date and time"}
                  value={parseISO(formState.arrivalDateAndTime)}
                  onChange={(e) => {
                    if (e)
                      dispatchFormStateAction({
                        type: "flightForm/setArrivalDateAndTime",
                        value: convertDateToMySqlDateTime(e),
                        formType: "add",
                      });
                  }}
                  className="form-control"
                  disablePast={true}
                ></DateTimePicker>
              </LocalizationProvider>
            </div>

            <div className="form-group mb-3">
              <label>Aircraft</label>
              <div className="input-group">
                <select
                  className="form-select form-select-sm"
                  value={formState.aircraftId}
                  onChange={(e) =>
                    dispatchFormStateAction({
                      type: "flightForm/setAircraftId",
                      value: +e.target.value,
                      formType: "add",
                    })
                  }
                >
                  <option value={""}>Choose an aircraft</option>
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
            </div>

            <div className="form-group mb-3">
              <label>Travel classes</label>

              {travelClasses?.map((travelClass) => {
                const travelClassData = formState.travelClasses.find(
                  (tc) => tc.travelClassId === travelClass.travelClassId
                );

                return (
                  <div
                    className="row"
                    key={"travel-class-" + travelClass.travelClassId}
                  >
                    <div className="col col-3">
                      {travelClassData ? (
                        <FontAwesomeIcon
                          onClick={() =>
                            dispatchFormStateAction({
                              type: "flightForm/removeTravelClass",
                              value: travelClass.travelClassId,
                              formType: "add",
                            })
                          }
                          icon={faCheckSquare}
                        />
                      ) : (
                        <FontAwesomeIcon
                          onClick={() =>
                            dispatchFormStateAction({
                              type: "flightForm/addTravelClass",
                              value: travelClass.travelClassId,
                              formType: "add",
                            })
                          }
                          icon={faSquare}
                        />
                      )}{" "}
                      {travelClass.travelClassSubname}
                    </div>

                    {travelClassData && (
                      <>
                        <div className="col col-2"></div>
                        <div className="col col-2">
                          <div className="input-group input-group-sm">
                            <input
                              type="number"
                              min={0.01}
                              step={0.01}
                              value={travelClassData.price}
                              className="form-control form-control-sm"
                              onChange={(e) =>
                                dispatchFormStateAction({
                                  type: "flightForm/setTravelClassPrice",
                                  value: {
                                    travelClassId: travelClass.travelClassId,
                                    price: +e.target.value,
                                  },
                                  formType: "add",
                                })
                              }
                            />
                            <span className="input-group-text">RSD</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="form-group mb-3">
              <button className="btn btn-primary" onClick={doAddFlight}>
                <FontAwesomeIcon icon={faSave} />
                &nbsp;Add flight
              </button>
              &nbsp;
              <button
                className="btn btn-danger"
                onClick={() =>
                  navigate("/admin/dashboard/flight/list", {
                    replace: true,
                  })
                }
              >
                <FontAwesomeIcon icon={faBackward} />
                &nbsp;Back
              </button>
              &nbsp;
              {flightAdded && (
                <span className="text-bg-success rounded-3 p-3">
                  Flight successfully added!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
