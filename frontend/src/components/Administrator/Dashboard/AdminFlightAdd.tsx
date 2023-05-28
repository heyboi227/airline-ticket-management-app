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

interface IAddFlightFormState {
  flightCode: string;
  originAirportId: number;
  destinationAirportId: number;
  departureDateAndTime: string;
  arrivalDateAndTime: string;
  aircraftId: number;
  travelClasses: {
    travelClassId: number;
    price: number;
  }[];
}

type TSetFlightCode = { type: "addFlightForm/setFlightCode"; value: string };
type TSetOriginAirportId = {
  type: "addFlightForm/setOriginAirportId";
  value: number;
};
type TSetDestinationAirportId = {
  type: "addFlightForm/setDestinationAirportId";
  value: number;
};
type TSetDepartureDateAndTime = {
  type: "addFlightForm/setDepartureDateAndTime";
  value: string;
};
type TSetArrivalDateAndTime = {
  type: "addFlightForm/setArrivalDateAndTime";
  value: string;
};
type TSetAircraftId = { type: "addFlightForm/setAircraftId"; value: number };
type TAddTravelClass = { type: "addFlightForm/addTravelClass"; value: number };
type TRemoveTravelClass = {
  type: "addFlightForm/removeTravelClass";
  value: number;
};
type TSetTravelClassPrice = {
  type: "addFlightForm/setTravelClassPrice";
  value: { travelClassId: number; price: number };
};

type AddFlightFormAction =
  | TSetFlightCode
  | TSetOriginAirportId
  | TSetDestinationAirportId
  | TSetDepartureDateAndTime
  | TSetArrivalDateAndTime
  | TSetAircraftId
  | TAddTravelClass
  | TRemoveTravelClass
  | TSetTravelClassPrice;

function AddFlightFormReducer(
  oldState: IAddFlightFormState,
  action: AddFlightFormAction
): IAddFlightFormState {
  switch (action.type) {
    case "addFlightForm/setFlightCode": {
      return {
        ...oldState,
        flightCode: action.value,
      };
    }

    case "addFlightForm/setOriginAirportId": {
      return {
        ...oldState,
        originAirportId: action.value,
      };
    }

    case "addFlightForm/setDestinationAirportId": {
      return {
        ...oldState,
        destinationAirportId: action.value,
      };
    }

    case "addFlightForm/setDepartureDateAndTime": {
      return {
        ...oldState,
        departureDateAndTime: action.value,
      };
    }

    case "addFlightForm/setArrivalDateAndTime": {
      return {
        ...oldState,
        arrivalDateAndTime: action.value,
      };
    }

    case "addFlightForm/setAircraftId": {
      return {
        ...oldState,
        aircraftId: action.value,
      };
    }

    case "addFlightForm/addTravelClass": {
      if (
        oldState.travelClasses.find(
          (travelClass) => travelClass.travelClassId === action.value
        )
      ) {
        return oldState;
      }

      return {
        ...oldState,
        travelClasses: [
          ...oldState.travelClasses.map((travelClass) => {
            return { ...travelClass };
          }),
          { travelClassId: action.value, price: 0 },
        ],
      };
    }

    case "addFlightForm/removeTravelClass": {
      if (
        !oldState.travelClasses.find(
          (travelClass) => travelClass.travelClassId === action.value
        )
      ) {
        return oldState;
      }

      return {
        ...oldState,
        travelClasses: [
          ...oldState.travelClasses
            .map((travelClass) => {
              return { ...travelClass };
            })
            .filter(
              (travelClass) => travelClass.travelClassId !== action.value
            ),
        ],
      };
    }

    case "addFlightForm/setTravelClassPrice": {
      if (
        !oldState.travelClasses.find(
          (travelClass) =>
            travelClass.travelClassId === action.value.travelClassId
        )
      ) {
        return oldState;
      }

      return {
        ...oldState,
        travelClasses: [
          ...oldState.travelClasses.map((travelClass) => {
            if (action.value.travelClassId !== travelClass.travelClassId) {
              return { ...travelClass };
            }

            return {
              ...travelClass,
              price: action.value.price,
            };
          }),
        ],
      };
    }

    default:
      return oldState;
  }
}

export default function AdminFlightAdd() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [airports, setAirports] = useState<IAirport[]>([]);
  const [aircraft, setAircraft] = useState<IAircraft[]>([]);
  const [travelClasses, setTravelClasses] = useState<ITravelClass[]>([]);

  const navigate = useNavigate();

  const [formState, dispatchFormStateAction] = useReducer(
    AddFlightFormReducer,
    {
      flightCode: "",
      originAirportId: 0,
      destinationAirportId: 0,
      departureDateAndTime: "",
      arrivalDateAndTime: "",
      aircraftId: 0,
      travelClasses: [],
    }
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
        navigate("/admin/dashboard/flight/list", {
          replace: true,
        });
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
                      type: "addFlightForm/setFlightCode",
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
                      type: "addFlightForm/setOriginAirportId",
                      value: +e.target.value,
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
                      type: "addFlightForm/setDestinationAirportId",
                      value: +e.target.value,
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
                        type: "addFlightForm/setDepartureDateAndTime",
                        value: e.toISOString(),
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
                        type: "addFlightForm/setArrivalDateAndTime",
                        value: e.toISOString(),
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
                      type: "addFlightForm/setAircraftId",
                      value: +e.target.value,
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
                              type: "addFlightForm/removeTravelClass",
                              value: travelClass.travelClassId,
                            })
                          }
                          icon={faCheckSquare}
                        />
                      ) : (
                        <FontAwesomeIcon
                          onClick={() =>
                            dispatchFormStateAction({
                              type: "addFlightForm/addTravelClass",
                              value: travelClass.travelClassId,
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
                                  type: "addFlightForm/setTravelClassPrice",
                                  value: {
                                    travelClassId: travelClass.travelClassId,
                                    price: +e.target.value,
                                  },
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
