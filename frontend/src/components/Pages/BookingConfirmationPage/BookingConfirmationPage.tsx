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

      <h3>Passenger Details</h3>
      <ul className="list-unstyled">
        <li className="list-group-item">
          First name: {location.state.passengerDetails.firstName}{" "}
        </li>
        <li className="list-group-item">
          Last name: {location.state.passengerDetails.lastName}
        </li>
        <li className="list-group-item">
          Date of birth:{" "}
          {new Date(
            location.state.passengerDetails.dateOfBirth
          ).toLocaleDateString("sr")}
        </li>
      </ul>

      <h3>Flight Details</h3>
      {/* Display flight details here */}

      <h3>Seat Assignment</h3>
      {/* Display seat assignment here */}

      <h3>Baggage Information</h3>
      {/* Display baggage information here */}

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
