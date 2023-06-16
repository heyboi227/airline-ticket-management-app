import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import IFlight from "../../../models/IFlight.model";
import { formatDateTime } from "../../../helpers/helpers";
import "./AdminList.scss";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

export default function AdminFlightList() {
  const [flights, setFlights] = useState<IFlight[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [showInactiveFlights, setShowInactiveFlights] =
    useState<boolean>(false);

  function loadFlights() {
    api("get", "/api/flight", "administrator")
      .then((res) => {
        if (res.status === "error") {
          return setErrorMessage(res.data + "");
        }

        setFlights(res.data);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  useEffect(loadFlights, []);

  return (
    <div>
      {errorMessage && <p className="alert aler-danger">{errorMessage}</p>}
      {!errorMessage && (
        <>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              value=""
              id="showInactiveCheck"
              onChange={() => setShowInactiveFlights(!showInactiveFlights)}
            />
            <label className="form-check-label">Show inactive flights</label>
          </div>
          <table className="table table-sm table-hover flight-list">
            <thead>
              <tr>
                <th>ID</th>
                <th>Flight code</th>
                <th>Origin airport</th>
                <th>Destination airport</th>
                <th>Departure date and time</th>
                <th>Arrival date and time</th>
                <th>Aircraft</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) =>
                showInactiveFlights ||
                flight.travelClasses?.some(
                  (travelClass) => travelClass.isActive
                ) ? (
                  <tr key={"flight-" + flight.flightId}>
                    <td>{flight.flightId}</td>
                    <td>
                      <div className="row">
                        <span className="col col-6">{flight.flightCode}</span>
                      </div>
                    </td>
                    <td>
                      <div className="row">
                        <span className="col col-9">
                          {flight.originAirport?.airportName +
                            ` (${flight.originAirport?.airportCode})`}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="row">
                        <span className="col col-9">
                          {flight.destinationAirport?.airportName +
                            ` (${flight.destinationAirport?.airportCode})`}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="row">
                        <span className="col col-7">
                          {formatDateTime(
                            new Date(flight.departureDateAndTime),
                            flight.originAirport?.timeZone?.timeZoneName!
                          )}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="row">
                        <span className="col col-7">
                          {formatDateTime(
                            new Date(flight.arrivalDateAndTime),
                            flight.destinationAirport?.timeZone?.timeZoneName!
                          )}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="row">
                        <span className="col col-8">
                          {flight.aircraft?.aircraftName}
                        </span>
                      </div>
                    </td>
                    <td>
                      <Link
                        to={"/admin/dashboard/flight/edit/" + flight.flightId}
                        className="btn btn-sm btn-primary"
                      >
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </Link>
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
