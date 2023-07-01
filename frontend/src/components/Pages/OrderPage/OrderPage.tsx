import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function OrderPage() {
  const location = useLocation();
  const flights = location.state;

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  return (
    <div>
      Departure flight : {flights.departFlight.flightCode}
      <br></br>Return flight : {flights.returnFlight.flightCode}
      <br></br>
      Total price: {flights.totalPrice}
      <div className="col col-xs-12 col-md-4 p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // doOrder();
          }}
        >
          <div className="form-group mb-3">
            <div className="input-group">
              <input
                className="form-control"
                type="text"
                placeholder="Passenger's first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group mb-3">
            <div className="input-group">
              <input
                className="form-control"
                type="text"
                placeholder="Passenger's last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
