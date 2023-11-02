import { useLocation, Link } from "react-router-dom";
export default function BookingConfirmationPage() {
  const location = useLocation();

  return (
    <>
      <div className="container">
        <div className="d-flex flex-column justify-content-center align-items-center">
          <h1>Success! Your booking has been confirmed.</h1>
          <h2>Your card has been charged.</h2>
        </div>
        <h2>
          Confirmation Number: {location.state.flightDetails.bookingNumber}
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
                    {location.state.flightDetails.departFlight.flightCode}
                  </li>
                  <li className="list-group-item">
                    Departs:{" "}
                    {
                      location.state.flightDetails.departFlight
                        .departureDateAndTime
                    }{" "}
                  </li>
                  <li className="list-group-item">
                    Arrives:{" "}
                    {
                      location.state.flightDetails.departFlight
                        .arrivalDateAndTime
                    }{" "}
                  </li>
                  <li className="list-group-item">
                    Aircraft:{" "}
                    {
                      location.state.flightDetails.departFlight.aircraft
                        .aircraftName
                    }
                  </li>
                </ul>
              </div>
              <div className="col">
                <ul className="list-unstyled">
                  <li className="list-group-item">
                    {location.state.flightDetails.returnFlight.flightCode}
                  </li>
                  <li className="list-group-item">
                    Departs:{" "}
                    {
                      location.state.flightDetails.returnFlight
                        .departureDateAndTime
                    }{" "}
                  </li>
                  <li className="list-group-item">
                    Arrives:{" "}
                    {
                      location.state.flightDetails.returnFlight
                        .arrivalDateAndTime
                    }{" "}
                  </li>
                  <li className="list-group-item">
                    Aircraft:{" "}
                    {
                      location.state.flightDetails.departFlight.aircraft
                        .aircraftName
                    }
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
                {location.state.flightDetails.departFlight.flightCode}:{" "}
                {location.state.flightDetails.departSeat}
              </li>
              <li className="list-group-item">
                {location.state.flightDetails.returnFlight.flightCode}:{" "}
                {location.state.flightDetails.returnSeat}
              </li>
            </ul>
          </div>
          <div className="col">
            <h3>Baggage Information</h3>
            <ul className="list-unstyled">
              <li className="list-group-item">
                Hand baggage: 1 piece included
              </li>
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

        <div className="row">
          <h3>Cancellation/Change Policy</h3>
          <span>No cancellation/change provided</span>
          <h3>Check-in Information</h3>
          <p>
            It is recommended to be present at the check-in counter at least two
            hours before the flight departure.
          </p>
          <p>Selected airports offer online check-in option.</p>
        </div>

        <div className="row">
          <h3>Contact Information</h3>
          <span>Emergency number: +381111234567</span>
        </div>

        <Link to={"/"} className="btn my-3 btn-sm btn-primary">
          Home
        </Link>
      </div>
    </>
  );
}
