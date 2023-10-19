import { useLocation } from "react-router-dom";
export default function BookingConfirmationPage() {
  const location = useLocation();

  return (
    <div className="container">
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h1>Success! Your booking has been confirmed.</h1>
        <h2>Your card has been charged.</h2>
      </div>
      <h2>
        Confirmation Number:{" "}
        {location.state ? location.state.bookingNumber : "AAAAA"}
      </h2>
      <div className="row">
        <div className="col">
          <h3>Passenger Details</h3>
          <ul className="list-unstyled">
            <li className="list-group-item">
              First name:{" "}
              {location.state
                ? location.state.passengerDetails.firstName
                : "Losmi"}{" "}
            </li>
            <li className="list-group-item">
              Last name:{" "}
              {location.state
                ? location.state.passengerDetails.lastName
                : "Losmi"}
            </li>
            <li className="list-group-item">
              Date of birth:{" "}
              {location.state
                ? new Date(
                    location.state.passengerDetails.dateOfBirth
                  ).toLocaleDateString("sr")
                : "1999-09-08"}
            </li>
          </ul>
        </div>
        <div className="col">
          <h3>Flight Details</h3>
          <div className="row">
            <div className="col">
              <ul className="list-unstyled">
                <li className="list-group-item">
                  {location.state
                    ? location.state.flights.departFlight.flightCode
                    : "AS101"}
                </li>
                <li className="list-group-item">
                  Departs:{" "}
                  {location.state
                    ? location.state.flights.departFlight.departureDateAndTime
                    : "1999-09-08"}{" "}
                </li>
                <li className="list-group-item">
                  Arrives:{" "}
                  {location.state
                    ? location.state.flights.departFlight.arrivalDateAndTime
                    : "1999-09-08"}{" "}
                </li>
                <li className="list-group-item">Aircraft: Embraer 175</li>
              </ul>
            </div>
            <div className="col">
              <ul className="list-unstyled">
                <li className="list-group-item">
                  {location.state
                    ? location.state.flights.returnFlight.flightCode
                    : "AS102"}
                </li>
                <li className="list-group-item">
                  Departs:{" "}
                  {location.state
                    ? location.state.flights.returnFlight.departureDateAndTime
                    : "1999-09-08"}{" "}
                </li>
                <li className="list-group-item">
                  Arrives:{" "}
                  {location.state
                    ? location.state.flights.returnFlight.arrivalDateAndTime
                    : "1999-09-08"}{" "}
                </li>
                <li className="list-group-item">Aircraft: Embraer 175</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <h3>Seat Assignment</h3>
          <ul className="list-unstyled">
            <li className="list-group-item">AS101: 13F</li>
            <li className="list-group-item">AS102: 4A</li>
          </ul>
        </div>
        <div className="col">
          <h3>Baggage Information</h3>
          <ul className="list-unstyled">
            <li className="list-group-item">Hand baggage: 1 piece included</li>
            <li className="list-group-item">
              Checked baggage: 1 piece included
            </li>
          </ul>
        </div>
      </div>

      <h3>Price Breakdown</h3>
      {/* Display price breakdown here */}

      <h3>Payment Information</h3>
      {/* Display payment information here */}

      <h3>Cancellation/Change Policy</h3>
      {/* Display cancellation/change policy here */}

      <h3>Check-in Information</h3>
      {/* Display check-in information here */}

      <h3>Contact Information</h3>
      {/* Display contact information here */}
    </div>
  );
}
