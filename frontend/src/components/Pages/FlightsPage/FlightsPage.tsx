import { useLocation } from "react-router-dom";
import IFlight from "../../../models/IFlight.model";
import {
  formatTime,
  formatTimeAndCheckForDayDifference,
  subtractTime,
} from "../../../helpers/helpers";
import smallLogo from "../../../static/air-soko-logo-small.png";
import DashedArrow from "../../Shapes/DashedArrow/DashedArrow";
import Config from "../../../config";

interface IFlightRowProps {
  flight: IFlight;
}

export default function FlightsPage() {
  const location = useLocation();
  const flightData: IFlight[] = location.state || [];

  function FlightRow(props: IFlightRowProps) {
    return (
      <div className="container-fluid w-50 p-3">
        <div className="bg-dark bg-opacity-25 p-3 border border-2 border-dark rounded-3">
          <div className="d-flex flex-row justify-content-between w-75 my-0 mx-auto align-items-center">
            <div>
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
            <div className="d-flex flex-column justify-content-center align-items-end">
              <span>Arrival</span>
              <h3>
                {formatTimeAndCheckForDayDifference(
                  new Date(props.flight.departureDateAndTime),
                  new Date(props.flight.arrivalDateAndTime),
                  props.flight.destinationAirport?.timeZone!
                )}
              </h3>
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
      </div>
    );
  }

  return (
    <div>
      {flightData.map((flight) => (
        <FlightRow key={"flight" + flight.flightId} flight={flight} />
      ))}
    </div>
  );
}
