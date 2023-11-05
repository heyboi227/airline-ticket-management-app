import { Card } from "react-bootstrap";
import Flight from "../../models/Flight.model";
import { CardContent, Typography } from "@mui/material";
interface FlightReviewProps {
  flight: Flight;
}

export default function FlightReview(props: Readonly<FlightReviewProps>) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component={"div"}>
          Flight code: {props.flight.flightCode}
        </Typography>
        <Typography variant="body2" component={"div"}>
          Departure date and time: {props.flight.departureDateAndTime}
        </Typography>
        <Typography variant="body2" component={"div"}>
          Arrival date and time: {props.flight.arrivalDateAndTime}
        </Typography>
        <Typography variant="body2" component={"div"}>
          Departure airport:{" "}
          {props.flight.originAirport?.airportName +
            `(${props.flight.originAirport?.airportCode})`}
        </Typography>
        <Typography variant="body2" component={"div"}>
          Arrival airport:{" "}
          {props.flight.destinationAirport?.airportName +
            `(${props.flight.destinationAirport?.airportCode})`}
        </Typography>
        <Typography variant="body2" component={"div"}>
          Aircraft: {props.flight.aircraft?.aircraftName}
        </Typography>
      </CardContent>
    </Card>
  );
}
