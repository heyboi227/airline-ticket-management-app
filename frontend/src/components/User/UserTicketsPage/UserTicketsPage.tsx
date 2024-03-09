import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import AppStore from "../../../stores/AppStore";
import Ticket from "../../../models/Ticket.model";

export default function UserTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function loadTickets() {
    api("get", "/api/ticket/user/" + AppStore.getState().auth.id, "user")
      .then((res) => {
        if (res.status === "error") {
          return setErrorMessage(res.data + "");
        }

        setTickets(res.data);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  useEffect(loadTickets, []);

  return (
    <div>
      {errorMessage && <p className="alert aler-danger">{errorMessage}</p>}
      {!errorMessage && tickets.length === 0 && (
        <p className="text-center mt-2">
          You have no tickets generated at the moment.
        </p>
      )}
      {!errorMessage && tickets.length !== 0 && (
        <table className="table table-sm table-hover document-list">
          <thead>
            <tr>
              <th>Ticket number</th>
              <th>Ticket holder name</th>
              <th>Price</th>
              <th>Flight number</th>
              <th>Departure date and time</th>
              <th>Flight fare code</th>
              <th>Seat number</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={"ticket-" + ticket.ticketId}>
                <td>
                  <div className="row">
                    <span className="col col-6">{ticket.ticketNumber}</span>
                  </div>
                </td>
                <td>
                  <div className="row">
                    <span className="col col-8">{ticket.ticketHolderName}</span>
                  </div>
                </td>
                <td>
                  <div className="row">
                    <span className="col col-8">{ticket.price}</span>
                  </div>
                </td>
                <td>
                  <div className="row">
                    <span className="col col-8">
                      {ticket.flight?.flightCode}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="row">
                    <span className="col col-8">
                      {new Date(
                        ticket.flight!.departureDateAndTime
                      ).toLocaleTimeString("sr", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="row">
                    <span className="col col-8">{ticket.flightFareCode}</span>
                  </div>
                </td>
                <td>
                  <div className="row">
                    <span className="col col-8">{ticket.seatNumber}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
