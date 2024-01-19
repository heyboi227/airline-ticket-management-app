import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../api/api";
import Flight from "../../../models/Flight.model";
import TravelClass from "../../../models/TravelClass.model";
import Airport from "../../../models/Airport.model";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { srLatn } from "date-fns/locale";
import { parseISO } from "date-fns";
import { convertDateToMySqlDateTime } from "../../../helpers/helpers";
import FlightFormReducer, {
  initialFlightFormState,
} from "../../../helpers/flight-reducers";

export interface AdminFlightEditUrlParams
  extends Record<string, string | undefined> {
  fid: string;
}

export default function AdminFlightEdit() {
  const params = useParams<AdminFlightEditUrlParams>();
  const flightId = +(params.fid ?? "");

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [flight, setFlight] = useState<Flight>();
  const [airports, setAirports] = useState<Airport[]>([]);
  const [travelClasses, setTravelClasses] = useState<TravelClass[]>([]);

  const navigate = useNavigate();

  const [formState, dispatchFormStateAction] = useReducer(
    FlightFormReducer,
    initialFlightFormState
  );

  const loadAirports = () => {
    api("get", "/api/airport/", "administrator")
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error("Could not load this flight!");
        }

        return res.data as Airport[];
      })
      .then((airports) => {
        airports.sort((a, b) => a.airportName.localeCompare(b.airportName));
        setAirports(airports);
      })
      .catch((error) => {
        setErrorMessage(error?.message ?? "Unknown error!");
      });
  };

  const loadTravelClasses = () => {
    api("get", "/api/travel-class", "administrator")
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error("Could not load travel class information!");
        }

        return res.data as TravelClass[];
      })
      .then((travelClasses) => {
        setTravelClasses(travelClasses);
      })
      .catch((error) => {
        setErrorMessage(error?.message ?? "Unknown error!");
      });
  };

  const doEditFlight = () => {
    api("put", "/api/flight/" + flightId, "administrator", formState)
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Could not edit this flight! Reason: " +
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
          throw new Error("Could not fetch the edited flight data!");
        }
      })
      .then(() => {
        navigate("/admin/dashboard/flight/list", {
          replace: true,
        });
      })
      .catch((error) => {
        setErrorMessage(error?.message ?? "Unknown error!");
      });
  };

  useEffect(() => {
    loadAirports();
    loadTravelClasses();
  }, []);

  useEffect(() => {
    setErrorMessage("");
    const loadFlight = () => {
      api("get", "/api/flight/" + flightId, "administrator")
        .then((res) => {
          if (res.status !== "ok") {
            throw new Error("Could not load this flight!");
          }

          return res.data as Flight;
        })
        .then((flight) => {
          setFlight(flight);
        })
        .catch((error) => {
          setErrorMessage(error?.message ?? "Unknown error!");
        });
    };
    loadFlight();
  }, [flightId, params.fid]);

  useEffect(() => {
    dispatchFormStateAction({
      type: "flightForm/setFlightCode",
      value: flight?.flightCode ?? "",
      formType: "edit",
    });

    dispatchFormStateAction({
      type: "flightForm/setOriginAirportId",
      value: flight?.originAirportId ?? 0,
      formType: "edit",
    });

    dispatchFormStateAction({
      type: "flightForm/setDestinationAirportId",
      value: flight?.destinationAirportId ?? 0,
      formType: "edit",
    });

    dispatchFormStateAction({
      type: "flightForm/setDepartureDateAndTime",
      value:
        convertDateToMySqlDateTime(new Date(flight?.departureDateAndTime!)) ??
        "",
      formType: "edit",
    });

    dispatchFormStateAction({
      type: "flightForm/setArrivalDateAndTime",
      value:
        convertDateToMySqlDateTime(new Date(flight?.arrivalDateAndTime!)) ?? "",
      formType: "edit",
    });

    dispatchFormStateAction({
      type: "flightForm/setAircraftId",
      value: flight?.aircraftId ?? 0,
      formType: "edit",
    });

    for (let travelClass of (flight?.travelClasses ?? []).filter(
      (travelClass) => travelClass.isActive
    )) {
      dispatchFormStateAction({
        type: "flightForm/addTravelClassFull",
        value: {
          travelClassId: travelClass.travelClass.travelClassId,
          price: travelClass.price,
        },
        formType: "edit",
      });
    }
  }, [flight]);

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="card-title">
            <h1 className="h5">Add new flight</h1>
          </div>
          <div className="card-text">
            {errorMessage && (
              <div className="alert alert-danger mb-3">{errorMessage}</div>
            )}

            <div className="row">
              <div className="col col-12 col-lg-7 mb-3 mb-lg-0">
                <h2 className="h6">Manage flight data</h2>

                <div className="form-group mb-3">
                  <label>Flight code</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={formState.flightCode}
                      onChange={(e) =>
                        dispatchFormStateAction({
                          type: "flightForm/setFlightCode",
                          value: e.target.value,
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
                          formType: "edit",
                        })
                      }
                    >
                      {airports.map((airport) => (
                        <option
                          key={airport.airportId}
                          value={airport.airportId}
                        >
                          {airport.airportName} ({airport.airportCode})
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
                          formType: "edit",
                        })
                      }
                    >
                      {airports.map((airport) => (
                        <option
                          key={airport.airportId}
                          value={airport.airportId}
                        >
                          {airport.airportName} ({airport.airportCode})
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
                      value={parseISO(formState.departureDateAndTime)}
                      onChange={(e) => {
                        if (e)
                          dispatchFormStateAction({
                            type: "flightForm/setDepartureDateAndTime",
                            value: convertDateToMySqlDateTime(e),
                            formType: "edit",
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
                      value={parseISO(formState.arrivalDateAndTime)}
                      onChange={(e) => {
                        if (e)
                          dispatchFormStateAction({
                            type: "flightForm/setArrivalDateAndTime",
                            value: convertDateToMySqlDateTime(e),
                            formType: "edit",
                          });
                      }}
                      className="form-control"
                      disablePast={true}
                    ></DateTimePicker>
                  </LocalizationProvider>
                </div>

                <div className="form-froup mb-3">
                  <label>Travel classes</label>

                  {travelClasses?.map((travelClass) => {
                    const travelClassData = formState.travelClasses.find(
                      (s) => s.travelClassId === travelClass.travelClassId
                    );

                    return (
                      <div
                        className="row"
                        key={"travelClass-" + travelClass.travelClassId}
                      >
                        <div className="col col-3">
                          {travelClassData ? (
                            <FontAwesomeIcon
                              onClick={() =>
                                dispatchFormStateAction({
                                  type: "flightForm/removeTravelClass",
                                  value: travelClass.travelClassId,
                                  formType: "edit",
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
                                  formType: "edit",
                                })
                              }
                              icon={faSquare}
                            />
                          )}{" "}
                          {travelClass.travelClassSubname}
                        </div>

                        {travelClassData && (
                          <div className="col col-4">
                            <div className="input-group input-group-sm">
                              <input
                                type="number"
                                min={0.01}
                                step={0.01}
                                value={travelClassData.price}
                                className="form-control form-control-sm"
                                onChange={(e) => {
                                  const value = +e.target.value;
                                  if (value !== 0) {
                                    dispatchFormStateAction({
                                      type: "flightForm/setTravelClassPrice",
                                      value: {
                                        travelClassId:
                                          travelClass.travelClassId,
                                        price: value,
                                      },
                                      formType: "edit",
                                    });
                                  }
                                }}
                              />
                              <span className="input-group-text">RSD</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="form-froup mb-3">
                  <button
                    className="btn btn-primary"
                    onClick={() => doEditFlight()}
                  >
                    Edit flight
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
