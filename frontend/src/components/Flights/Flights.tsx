import { useLocation } from "react-router-dom";
import FlightModel from "../../../../backend/src/components/flight/FlightModel.model";

export default function Flights() {
  const location = useLocation();
  const flightData: FlightModel[] = location.state || [];

  return (
    <div>
      {flightData.map((flight) => flight.bags?.map((bag) => bag.price))}
    </div>
  );
}
