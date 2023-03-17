import "./Search.scss";
import { useState } from "react";

export default function Search() {
  const [originAirport, setOriginAirport] = useState<string>();
  const [destinationAirport, setDestinationAirport] = useState<string>();

  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();

  return (
    <div className="container pt-5 d-flex justify-content-center align-items-center search">
      <div
        className="row px-5 py-5 mx-5 my-5 bg-dark bg-opacity-75 rounded-5"
        style={{ width: "70%" }}
      >
        <div className="col">
          <div className="form-group mt-3 mb-3">
            <div className="input-group">
              <input
                className="form-control"
                type="text"
                placeholder="Origin airport"
                value={originAirport}
                onChange={(e) => setOriginAirport(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group mb-3">
            <div className="input-group">
              <input
                className="form-control"
                type="text"
                placeholder="Destination airport"
                value={destinationAirport}
                onChange={(e) => setDestinationAirport(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="col">
          <div className="form-group mt-3 mb-3">
            <div className="input-group">
              <input
                className="form-control"
                type="date"
                placeholder="Departure date"
                value={departureDate?.toDateString()}
                onChange={(e) => setDepartureDate(new Date(e.target.value))}
              />
            </div>
          </div>
          <div className="form-group mb-3">
            <div className="input-group">
              <input
                className="form-control"
                type="date"
                placeholder="Return date"
                value={returnDate?.toDateString()}
                onChange={(e) => setReturnDate(new Date(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
