import { useLocation } from "react-router-dom";
import FlightModel from "../../../../../backend/src/components/flight/FlightModel.model";
import IFlight from "../../../models/IFlight.model";

interface IFlightRowProps {
  flight: IFlight;
}

export default function FlightsPage() {
  const location = useLocation();
  const flightData: FlightModel[] = location.state || [];

  function FlightRow(props: IFlightRowProps) {
    return (
      <>
        <tr>
          <td>{props.flight.flightCode}</td>
          <td>{props.flight.originAirport?.airportCode}</td>
          <td>{props.flight.destinationAirport?.airportCode}</td>
          <td>{props.flight.aircraft?.name}</td>
        </tr>
      </>
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
