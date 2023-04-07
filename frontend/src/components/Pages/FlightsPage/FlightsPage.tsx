import { useLocation } from "react-router-dom";
import IFlight from "../../../models/IFlight.model";
import {
  checkForDayDifference,
  formatTime,
  subtractTime,
} from "../../../helpers/helpers";
import smallLogo from "../../../static/air-soko-logo-small.png";
import DashedArrow from "../../Shapes/DashedArrow/DashedArrow";
import Config from "../../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretSquareDown } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";

interface IFlightRowProps {
  flight: IFlight;
}

export default function FlightsPage() {
  const location = useLocation();
  const testFlightData: IFlight[] = [
    {
      travelClasses: [
        {
          travelClass: {
            travelClassId: 1,
            name: "Economy",
            subname: "Basic Economy",
          },
          price: 8500.0,
          isActive: true,
        },
        {
          travelClass: {
            travelClassId: 2,
            name: "Economy",
            subname: "Economy",
          },
          price: 11000.0,
          isActive: true,
        },
        {
          travelClass: {
            travelClassId: 3,
            name: "Economy",
            subname: "Economy+",
          },
          price: 24000.0,
          isActive: true,
        },
        {
          travelClass: {
            travelClassId: 5,
            name: "Business",
            subname: "Business",
          },
          price: 65000.0,
          isActive: true,
        },
      ],
      originAirport: {
        airportId: 1,
        airportCode: "BEG",
        name: "Nikola Tesla",
        city: "Belgrade",
        countryId: 153,
        timeZone: "Europe/Belgrade",
        country: {
          countryId: 153,
          name: "Serbia",
        },
      },
      destinationAirport: {
        airportId: 3,
        airportCode: "LHR",
        name: "Heathrow",
        city: "London",
        countryId: 185,
        timeZone: "Europe/London",
        country: {
          countryId: 185,
          name: "United Kingdom",
        },
      },
      aircraft: {
        aircraftId: 2,
        type: "Narrow-body",
        name: "Airbus A319-100",
      },
      flightId: 1,
      flightCode: "AS100",
      originAirportId: 1,
      destinationAirportId: 3,
      departureDateAndTime: "2023-04-01T14:00:00.000Z",
      arrivalDateAndTime: "2023-04-01T17:00:00.000Z",
      aircraftId: 2,
    },
    {
      travelClasses: [
        {
          travelClass: {
            travelClassId: 1,
            name: "Economy",
            subname: "Basic Economy",
          },
          price: 8500.0,
          isActive: true,
        },
        {
          travelClass: {
            travelClassId: 2,
            name: "Economy",
            subname: "Economy",
          },
          price: 11000.0,
          isActive: true,
        },
        {
          travelClass: {
            travelClassId: 3,
            name: "Economy",
            subname: "Economy+",
          },
          price: 24000.0,
          isActive: true,
        },
        {
          travelClass: {
            travelClassId: 5,
            name: "Business",
            subname: "Business",
          },
          price: 65000.0,
          isActive: true,
        },
      ],
      originAirport: {
        airportId: 3,
        airportCode: "LHR",
        name: "Heathrow",
        city: "London",
        countryId: 185,
        timeZone: "Europe/London",
        country: {
          countryId: 185,
          name: "United Kingdom",
        },
      },
      destinationAirport: {
        airportId: 1,
        airportCode: "BEG",
        name: "Nikola Tesla",
        city: "Belgrade",
        countryId: 153,
        timeZone: "Europe/Belgrade",
        country: {
          countryId: 153,
          name: "Serbia",
        },
      },
      aircraft: {
        aircraftId: 2,
        type: "Narrow-body",
        name: "Airbus A319-100",
      },
      flightId: 2,
      flightCode: "AS101",
      originAirportId: 3,
      destinationAirportId: 1,
      departureDateAndTime: "2023-04-01T18:10:00.000Z",
      arrivalDateAndTime: "2023-04-01T20:50:00.000Z",
      aircraftId: 2,
    },
    {
      travelClasses: [
        {
          travelClass: {
            travelClassId: 1,
            name: "Economy",
            subname: "Basic Economy",
          },
          price: 8500.0,
          isActive: true,
        },
        {
          travelClass: {
            travelClassId: 2,
            name: "Economy",
            subname: "Economy",
          },
          price: 11000.0,
          isActive: true,
        },
        {
          travelClass: {
            travelClassId: 3,
            name: "Economy",
            subname: "Economy+",
          },
          price: 24000.0,
          isActive: true,
        },
        {
          travelClass: {
            travelClassId: 5,
            name: "Business",
            subname: "Business",
          },
          price: 65000.0,
          isActive: true,
        },
      ],
      originAirport: {
        airportId: 1,
        airportCode: "BEG",
        name: "Nikola Tesla",
        city: "Belgrade",
        countryId: 153,
        timeZone: "Europe/Belgrade",
        country: {
          countryId: 153,
          name: "Serbia",
        },
      },
      destinationAirport: {
        airportId: 10,
        airportCode: "JFK",
        name: "John F. Kennedy International",
        city: "New York",
        countryId: 186,
        timeZone: "America/New_York",
        country: {
          countryId: 186,
          name: "United States of America",
        },
      },
      aircraft: {
        aircraftId: 1,
        type: "Wide-body",
        name: "Boeing 777-300",
      },
      flightId: 6,
      flightCode: "AS300",
      originAirportId: 1,
      destinationAirportId: 10,
      departureDateAndTime: "2023-04-05T07:30:00.000Z",
      arrivalDateAndTime: "2023-04-05T17:30:00.000Z",
      aircraftId: 1,
    },
    {
      travelClasses: [
        {
          travelClass: {
            travelClassId: 1,
            name: "Economy",
            subname: "Basic Economy",
          },
          price: 8500.0,
          isActive: true,
        },
        {
          travelClass: {
            travelClassId: 2,
            name: "Economy",
            subname: "Economy",
          },
          price: 11000.0,
          isActive: true,
        },
        {
          travelClass: {
            travelClassId: 3,
            name: "Economy",
            subname: "Economy+",
          },
          price: 24000.0,
          isActive: true,
        },
        {
          travelClass: {
            travelClassId: 5,
            name: "Business",
            subname: "Business",
          },
          price: 65000.0,
          isActive: true,
        },
      ],
      originAirport: {
        airportId: 10,
        airportCode: "JFK",
        name: "John F. Kennedy International",
        city: "New York",
        countryId: 186,
        timeZone: "America/New_York",
        country: {
          countryId: 186,
          name: "United States of America",
        },
      },
      destinationAirport: {
        airportId: 1,
        airportCode: "BEG",
        name: "Nikola Tesla",
        city: "Belgrade",
        countryId: 153,
        timeZone: "Europe/Belgrade",
        country: {
          countryId: 153,
          name: "Serbia",
        },
      },
      aircraft: {
        aircraftId: 1,
        type: "Wide-body",
        name: "Boeing 777-300",
      },
      flightId: 7,
      flightCode: "AS301",
      originAirportId: 10,
      destinationAirportId: 1,
      departureDateAndTime: "2023-04-05T19:45:00.000Z",
      arrivalDateAndTime: "2023-04-06T04:35:00.000Z",
      aircraftId: 1,
    },
  ];

  function FlightRow(props: IFlightRowProps) {
    const [isEconomyVisible, setIsEconomyVisible] = useState<boolean>(false);
    const [isBusinessVisible, setIsBusinessVisible] = useState<boolean>(false);

    const handleToggle = (travelClassName: string) => {
      if (travelClassName.toLowerCase().includes("economy")) {
        setIsEconomyVisible(!isEconomyVisible);
      } else {
        setIsBusinessVisible(!isBusinessVisible);
      }
    };

    return (
      <>
        <div className="container-fluid d-flex flex-row my-5">
          <div className="card p-3 w-50 p-3">
            <div className="card-body d-flex flex-row justify-content-between w-100 my-0 mx-auto align-items-center">
              <div
                className="d-flex flex-column justify-content-center align-items-start"
                style={{ width: "10vw" }}
              >
                <span>Departure</span>
                <h3>
                  {formatTime(
                    new Date(props.flight.departureDateAndTime),
                    props.flight.originAirport?.timeZone!
                  )}
                </h3>
                <h5>{props.flight.originAirport?.airportCode}</h5>
              </div>
              <div className="d-flex flex-column align-items-center mt-3">
                <DashedArrow />
                <p>
                  Duration:{" "}
                  {subtractTime(
                    formatTime(
                      new Date(props.flight.departureDateAndTime),
                      Config.LOCAL_TIME_ZONE
                    ),
                    formatTime(
                      new Date(props.flight.arrivalDateAndTime),
                      Config.LOCAL_TIME_ZONE
                    ),
                    new Date(props.flight.departureDateAndTime),
                    new Date(props.flight.arrivalDateAndTime)
                  )}
                </p>
              </div>
              <div
                className="d-flex flex-column justify-content-center align-items-end"
                style={{ width: "10vw" }}
              >
                <span>Arrival</span>
                <div className="d-flex flex-row justify-content-center align-items-center">
                  <h3>
                    {formatTime(
                      new Date(props.flight.arrivalDateAndTime),
                      props.flight.destinationAirport?.timeZone!
                    )}
                  </h3>
                  <small>
                    {checkForDayDifference(
                      new Date(props.flight.departureDateAndTime),
                      new Date(props.flight.arrivalDateAndTime)
                    )}
                  </small>
                </div>
                <h5>{props.flight.destinationAirport?.airportCode}</h5>
              </div>
            </div>
            <div
              className="d-flex flex-row justify-content-start align-items-center"
              style={{ width: "10vw" }}
            >
              <img
                src={smallLogo}
                alt="The logo of Air Soko, without the fontface"
                style={{ width: "2vw", borderRadius: "15px" }}
                className="me-2"
              />
              <span>{props.flight.flightCode}</span>
            </div>
            <span>{props.flight.aircraft?.name}</span>
          </div>
          <div className="card" style={{ width: "18rem" }}>
            <div className="card-body mt-3 d-flex flex-column justify-content-start align-items-center">
              <h2 className="card-title">Economy</h2>
              <p className="card-text">
                From{" "}
                <span style={{ fontSize: "1.5vw" }}>
                  {props.flight.travelClasses
                    ?.filter((travelClass) =>
                      travelClass.travelClass.name
                        .toLowerCase()
                        .includes("economy")
                    )
                    .map((travelClass) => travelClass.price)
                    .reduce((smallestPrice, currentPrice) => {
                      return currentPrice < smallestPrice
                        ? currentPrice
                        : smallestPrice;
                    })}{" "}
                  RSD
                </span>
              </p>
            </div>
            <div
              className="card-footer text-bg-primary d-flex justify-content-center"
              onClick={() =>
                handleToggle(
                  props.flight.travelClasses!.filter((travelClass) =>
                    travelClass.travelClass.name
                      .toLowerCase()
                      .includes("economy")
                  )[0].travelClass.name
                )
              }
            >
              <FontAwesomeIcon
                icon={faCaretSquareDown}
                style={{ fontSize: "2vw" }}
              />
            </div>
          </div>
          <div className="card" style={{ width: "18rem" }}>
            <div className="card-body mt-3 d-flex flex-column justify-content-start align-items-center">
              <h2 className="card-title">Business</h2>
              <p className="card-text">
                From{" "}
                <span style={{ fontSize: "1.5vw" }}>
                  {props.flight.travelClasses
                    ?.filter((travelClass) =>
                      travelClass.travelClass.name
                        .toLowerCase()
                        .includes("business")
                    )
                    .map((travelClass) => travelClass.price)
                    .reduce((smallestPrice, currentPrice) => {
                      return currentPrice < smallestPrice
                        ? currentPrice
                        : smallestPrice;
                    })}{" "}
                  RSD
                </span>
              </p>
            </div>
            <div
              className="card-footer text-bg-primary d-flex justify-content-center"
              onClick={() =>
                handleToggle(
                  props.flight.travelClasses!.filter((travelClass) =>
                    travelClass.travelClass.name
                      .toLowerCase()
                      .includes("business")
                  )[0].travelClass.name
                )
              }
            >
              <FontAwesomeIcon
                icon={faCaretSquareDown}
                style={{ fontSize: "2vw" }}
              />
            </div>
          </div>
        </div>
        <div>
          {isEconomyVisible && (
            <div className="d-flex g-3 flex-row justify-content-center align-items-center">
              {props.flight.travelClasses
                ?.filter((travelClass) =>
                  travelClass.travelClass.name.toLowerCase().includes("economy")
                )
                .map((travelClass) => (
                  <div className="card" style={{ width: "18rem" }}>
                    <div className="card-body mt-3 d-flex flex-column justify-content-start align-items-center">
                      <h2 className="card-title">
                        {travelClass.travelClass.subname}
                      </h2>
                      <p className="card-text">
                        <ul className="list-group">
                          <li className="list-group-item">1</li>
                          <li className="list-group-item">2</li>
                          <li className="list-group-item">3</li>
                          <li className="list-group-item">4</li>
                        </ul>
                      </p>
                    </div>
                    <div
                      className="card-footer text-bg-primary d-flex justify-content-center"
                      onClick={() =>
                        handleToggle(
                          props.flight.travelClasses!.filter((travelClass) =>
                            travelClass.travelClass.name
                              .toLowerCase()
                              .includes("business")
                          )[0].travelClass.name
                        )
                      }
                    >
                      Select
                    </div>
                  </div>
                ))}
            </div>
          )}
          {isBusinessVisible && (
            <div className="d-flex g-3 flex-row justify-content-center align-items-center">
              {props.flight.travelClasses
                ?.filter((travelClass) =>
                  travelClass.travelClass.name
                    .toLowerCase()
                    .includes("business")
                )
                .map((travelClass) => (
                  <div className="card" style={{ width: "18rem" }}>
                    <div className="card-body mt-3 d-flex flex-column justify-content-start align-items-center">
                      <h2 className="card-title">
                        {travelClass.travelClass.subname}
                      </h2>
                      <p className="card-text">
                        <ul className="list-group">
                          <li className="list-group-item">1</li>
                          <li className="list-group-item">2</li>
                          <li className="list-group-item">3</li>
                          <li className="list-group-item">4</li>
                        </ul>
                      </p>
                    </div>
                    <div
                      className="card-footer text-bg-primary d-flex justify-content-center"
                      onClick={() =>
                        handleToggle(
                          props.flight.travelClasses!.filter((travelClass) =>
                            travelClass.travelClass.name
                              .toLowerCase()
                              .includes("business")
                          )[0].travelClass.name
                        )
                      }
                    >
                      Select
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <div>
      <ul className="nav nav-tabs justify-content-center">
        <li className="nav-item">
          <a className="nav-link" href="#">
            {new Intl.DateTimeFormat("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            }).format(new Date("2023-04-02"))}
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            {new Intl.DateTimeFormat("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            }).format(new Date("2023-04-03"))}
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            {new Intl.DateTimeFormat("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            }).format(new Date("2023-04-04"))}
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">
            {new Intl.DateTimeFormat("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            }).format(new Date())}
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            {new Intl.DateTimeFormat("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            }).format(new Date("2023-04-06"))}
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            {new Intl.DateTimeFormat("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            }).format(new Date("2023-04-07"))}
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            {new Intl.DateTimeFormat("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            }).format(new Date("2023-04-08"))}
          </a>
        </li>
      </ul>
      {testFlightData.map((flight) => (
        <FlightRow key={"flight" + flight.flightId} flight={flight} />
      ))}
    </div>
  );
}
