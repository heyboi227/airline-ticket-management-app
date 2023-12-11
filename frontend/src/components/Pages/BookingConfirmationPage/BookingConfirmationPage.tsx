import { useLocation, Link } from "react-router-dom";
export default function BookingConfirmationPage() {
  const location = useLocation();
  const formData = location.state;

  return (
    <div className="container">
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h1>Success! Your booking has been confirmed.</h1>
        <h2>Your card has been charged.</h2>
      </div>
      <h2>Confirmation Number: {formData.flightDetails.bookingNumber}</h2>
      <div className="row">
        <div className="col">
          <h3>Passenger Details</h3>
          {formData.passengers.map((passenger: any, index: number) => (
            <ul className="list-unstyled" key={"passenger-" + index}>
              <li className="list-group-item">
                First name: {passenger.firstName}
              </li>
              <li className="list-group-item">
                Last name: {passenger.lastName}
              </li>
              <li className="list-group-item">
                Date of birth:{" "}
                {passenger.dateOfBirth.toLocaleDateString("sr", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
              </li>
            </ul>
          ))}
        </div>
        <div className="col">
          <h3>Flight Details</h3>
          <div className="row">
            <div className="col">
              <ul className="list-unstyled">
                <li className="list-group-item">
                  {formData.flightDetails.departFlight.flightCode}
                </li>
                <li className="list-group-item">
                  Departs:{" "}
                  {new Date(
                    formData.flightDetails.departFlight.departureDateAndTime
                  ).toLocaleDateString("sr", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                </li>
                <li className="list-group-item">
                  Arrives:{" "}
                  {new Date(
                    formData.flightDetails.departFlight.arrivalDateAndTime
                  ).toLocaleDateString("sr", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                </li>
                <li className="list-group-item">
                  Aircraft:{" "}
                  {formData.flightDetails.departFlight.aircraft.aircraftName}
                </li>
              </ul>
            </div>
            {formData.flightDetails.isRoundtrip && (
              <div className="col">
                <ul className="list-unstyled">
                  <li className="list-group-item">
                    {formData.flightDetails.returnFlight.flightCode}
                  </li>
                  <li className="list-group-item">
                    Departs:{" "}
                    {new Date(
                      formData.flightDetails.returnFlight.departureDateAndTime
                    ).toLocaleDateString("sr", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                  </li>
                  <li className="list-group-item">
                    Arrives:{" "}
                    {new Date(
                      formData.flightDetails.returnFlight.arrivalDateAndTime
                    ).toLocaleDateString("sr", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                  </li>
                  <li className="list-group-item">
                    Aircraft:{" "}
                    {formData.flightDetails.departFlight.aircraft.aircraftName}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <h3>Seat Assignment</h3>
          {formData.passengers.map((passenger: any, index: number) => (
            <>
              <span>{passenger.firstName + " " + passenger.lastName}:</span>
              <ul className="list-unstyled" key={"passenger-" + index}>
                <li className="list-group-item">
                  {formData.flightDetails.departFlight.flightCode}:{" "}
                  {passenger.departSeat}
                </li>
                {formData.flightDetails.isRoundtrip && (
                  <li className="list-group-item">
                    {formData.flightDetails.returnFlight.flightCode}:{" "}
                    {passenger.returnSeat}
                  </li>
                )}
              </ul>
            </>
          ))}
        </div>
        <div className="col">
          <h3>Baggage Information</h3>
          <ul className="list-unstyled">
            <li className="list-group-item">Hand baggage: 1 piece included</li>
            {(!formData.flightDetails.departureTravelClass
              .toLowerCase()
              .includes("basic") ||
              !formData.flightDetails.returnTravelClass
                .toLowerCase()
                .includes("basic")) && (
              <li className="list-group-item">
                Checked baggage: 1 piece included
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <h3>Price Breakdown</h3>
          <ul className="list-unstyled">
            <li className="list-group-item">
              Base price: {formData.flightDetails.basePrice} RSD
            </li>
            <li className="list-group-item">
              Taxes and fees: {formData.flightDetails.taxesAndFeesPrice} RSD
            </li>
            <li className="list-group-item">
              Total price: {formData.flightDetails.totalPrice} RSD
            </li>
          </ul>
        </div>
        <div className="col">
          <h3>Travel Document Information</h3>
          {formData.passengers.map((passenger: any, index: number) => (
            <ul className="list-unstyled" key={"passenger-" + index}>
              <li className="list-group-item">
                Document type: {passenger.documentType}
              </li>
              <li className="list-group-item">
                Document number: {passenger.documentNumber}
              </li>
              <li className="list-group-item">
                Issued on:{" "}
                {passenger.documentIssuingDate.toLocaleDateString("sr", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
              </li>
              <li className="list-group-item">
                Expires on:{" "}
                {passenger.documentExpirationDate.toLocaleDateString("sr", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
              </li>
            </ul>
          ))}
        </div>
        <div className="col">
          <h3>Payment Information</h3>
          <ul className="list-unstyled">
            <li className="list-group-item">
              Card number: {formData.paymentDetails.cardNumber}
            </li>
            <li className="list-group-item">Status: succesful</li>
            <li className="list-group-item">
              Made on: {formData.paymentDetails.paymentTimestamp}
            </li>
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
  );
}
