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
                    : "21.10.2023 10:10"}{" "}
                </li>
                <li className="list-group-item">
                  Arrives:{" "}
                  {location.state
                    ? location.state.flights.departFlight.arrivalDateAndTime
                    : "21.10.2023 11:20"}{" "}
                </li>
                <li className="list-group-item">
                  Aircraft:{" "}
                  {location.state
                    ? location.state.flights.departFlight.aircraft?.aircraftType
                    : "Embraer 175"}
                </li>
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
                    : "22.10.2023 09:50"}{" "}
                </li>
                <li className="list-group-item">
                  Arrives:{" "}
                  {location.state
                    ? location.state.flights.returnFlight.arrivalDateAndTime
                    : "22.10.2023 10:45"}{" "}
                </li>
                <li className="list-group-item">
                  Aircraft:{" "}
                  {location.state
                    ? location.state.flights.departFlight.aircraft?.aircraftType
                    : "Embraer 175"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <h3>Seat Assignment</h3>
          <ul className="list-unstyled">
            <li className="list-group-item">
              {" "}
              {location.state
                ? location.state.flights.departFlight.flightCode
                : "AS101"}
              : {location.state ? location.state.departSeat : "13F"}
            </li>
            <li className="list-group-item">
              {location.state
                ? location.state.flights.returnFlight.flightCode
                : "AS102"}
              : {location.state ? location.state.returnSeat : "13F"}
            </li>
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

      <div className="row">
        <div className="col">
          <h3>Price Breakdown</h3>
          <ul className="list-unstyled">
            <li className="list-group-item">Base price: 12512.53 RSD</li>
            <li className="list-group-item">Taxes and fees: 6435.24 RSD</li>
            <li className="list-group-item">Total price: 18947.77 RSD</li>
          </ul>
        </div>
        <div className="col">
          <h3>Payment Information</h3>
          <ul className="list-unstyled">
            <li className="list-group-item">Card number: XXXXXXXXXXXX5462</li>
            <li className="list-group-item">Status: succesful</li>
            <li className="list-group-item">Made on: 2023-10-28 14:20</li>
          </ul>
        </div>
      </div>

      <h3>Cancellation/Change Policy</h3>
      {/* Display cancellation/change policy here */}

      <h3>Check-in Information</h3>
      {/* Display check-in information here */}

      <h3>Contact Information</h3>
      {/* Display contact information here */}
    </div>
  );
}
