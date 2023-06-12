import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../api/api";
import IFlight from "../../../models/IFlight.model";
import ITravelClass from "../../../models/ITravelClass.model";
import IAirport from "../../../models/IAirport.model";

export interface IAdminFlightEditUrlParams
  extends Record<string, string | undefined> {
  fid: string;
}

interface IEditFlightFormState {
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

type TSetFlightCode = { type: "editFlightForm/setFlightCode"; value: string };
type TSetOriginAirportId = {
  type: "editFlightForm/setOriginAirportId";
  value: number;
};
type TSetDestinationAirportId = {
  type: "editFlightForm/setDestinationAirportId";
  value: number;
};
type TSetDepartureDateAndTime = {
  type: "editFlightForm/setDepartureDateAndTime";
  value: string;
};
type TSetArrivalDateAndTime = {
  type: "editFlightForm/setArrivalDateAndTime";
  value: string;
};
type TSetAircraftId = { type: "editFlightForm/setAircraftId"; value: number };
type TAddTravelClass = { type: "editFlightForm/addTravelClass"; value: number };
type TAddTravelClassFull = {
  type: "editFlightForm/addTravelClassFull";
  value: { travelClassId: number; price: number };
};
type TRemoveTravelClass = {
  type: "editFlightForm/removeTravelClass";
  value: number;
};
type TSetTravelClassPrice = {
  type: "editFlightForm/setTravelClassPrice";
  value: { travelClassId: number; price: number };
};

type EditFlightFormAction =
  | TSetFlightCode
  | TSetOriginAirportId
  | TSetDestinationAirportId
  | TSetDepartureDateAndTime
  | TSetArrivalDateAndTime
  | TSetAircraftId
  | TAddTravelClass
  | TAddTravelClassFull
  | TRemoveTravelClass
  | TSetTravelClassPrice;

function EditFlightFormReducer(
  oldState: IEditFlightFormState,
  action: EditFlightFormAction
): IEditFlightFormState {
  switch (action.type) {
    case "editFlightForm/setFlightCode": {
      return {
        ...oldState,
        flightCode: action.value,
      };
    }

    case "editFlightForm/setOriginAirportId": {
      return {
        ...oldState,
        originAirportId: action.value,
      };
    }

    case "editFlightForm/setDestinationAirportId": {
      return {
        ...oldState,
        destinationAirportId: action.value,
      };
    }

    case "editFlightForm/setDepartureDateAndTime": {
      return {
        ...oldState,
        departureDateAndTime: action.value,
      };
    }

    case "editFlightForm/setArrivalDateAndTime": {
      return {
        ...oldState,
        arrivalDateAndTime: action.value,
      };
    }

    case "editFlightForm/setAircraftId": {
      return {
        ...oldState,
        aircraftId: action.value,
      };
    }

    case "editFlightForm/addTravelClass": {
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

    case "editFlightForm/addTravelClassFull": {
      if (
        oldState.travelClasses.find(
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
            return { ...travelClass };
          }),
          {
            travelClassId: action.value.travelClassId,
            price: +action.value.price,
          },
        ],
      };
    }

    case "editFlightForm/removeTravelClass": {
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

    case "editFlightForm/setTravelClassPrice": {
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

export default function AdminFlightEdit() {
  const params = useParams<IAdminFlightEditUrlParams>();
  const flightId = +(params.fid ?? "");

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [flight, setFlight] = useState<IFlight>();
  const [airports, setAirports] = useState<IAirport[]>([]);
  const [travelClasses, setTravelClasses] = useState<ITravelClass[]>([]);

  const navigate = useNavigate();

  const [formState, dispatchFormStateAction] = useReducer(
    EditFlightFormReducer,
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

  const loadFlight = () => {
    api("get", "/api/flight/" + flightId, "administrator")
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error("Could not load this flight!");
        }

        return res.data as IFlight;
      })
      .then((flight) => {
        setFlight(flight);
      })
      .catch((error) => {
        setErrorMessage(error?.message ?? "Unknown error!");
      });
  };

  const loadAirports = () => {
    api("get", "/api/airport/", "administrator")
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error("Could not load this flight!");
        }

        return res.data as IAirport[];
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

        return res.data as ITravelClass[];
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
    loadFlight();
  }, [params.fid]);

  useEffect(() => {
    dispatchFormStateAction({
      type: "editFlightForm/setFlightCode",
      value: flight?.flightCode ?? "",
    });

    dispatchFormStateAction({
      type: "editFlightForm/setOriginAirportId",
      value: flight?.originAirportId ?? 0,
    });

    dispatchFormStateAction({
      type: "editFlightForm/setDestinationAirportId",
      value: flight?.destinationAirportId ?? 0,
    });

    dispatchFormStateAction({
      type: "editFlightForm/setDepartureDateAndTime",
      value: flight?.departureDateAndTime ?? "",
    });

    dispatchFormStateAction({
      type: "editFlightForm/setArrivalDateAndTime",
      value: flight?.arrivalDateAndTime ?? "",
    });

    dispatchFormStateAction({
      type: "editFlightForm/setAircraftId",
      value: flight?.aircraftId ?? 0,
    });

    for (let travelClass of (flight?.travelClasses ?? []).filter(
      (travelClass) => travelClass.isActive
    )) {
      dispatchFormStateAction({
        type: "editFlightForm/addTravelClassFull",
        value: {
          travelClassId: travelClass.travelClass.travelClassId,
          price: travelClass.price,
        },
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
                          type: "editFlightForm/setFlightCode",
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
                          type: "editFlightForm/setOriginAirportId",
                          value: +e.target.value,
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
                          type: "editFlightForm/setDestinationAirportId",
                          value: +e.target.value,
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
                                  type: "editFlightForm/removeTravelClass",
                                  value: travelClass.travelClassId,
                                })
                              }
                              icon={faCheckSquare}
                            />
                          ) : (
                            <FontAwesomeIcon
                              onClick={() =>
                                dispatchFormStateAction({
                                  type: "editFlightForm/addTravelClass",
                                  value: travelClass.travelClassId,
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
                                onChange={(e) =>
                                  dispatchFormStateAction({
                                    type: "editFlightForm/setTravelClassPrice",
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
