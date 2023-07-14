import { useEffect, useState } from "react";
import Flight from "../../../models/Flight.model";
import Country from "../../../models/Country.model";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import AppStore from "../../../stores/AppStore";
import User from "../../../models/User.model";
import { MersenneTwister19937, Random } from "random-js";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { srLatn } from "date-fns/locale";
import UserDocument from "../../../models/Document.model";
import { FlightRowWithoutPrices } from "../FlightsPage/FlightsPage";

export default function BillingPage() {
  const flights = {
    departFlight: {
      flightId: 1,
      flightCode: "AS150",
      departureDateAndTime: "2023-07-09T12:45:00Z",
      arrivalDateAndTime: "2023-07-09T22:45:00Z",
      originAirportId: 3,
      destinationAirportId: 6,
      travelClasses: [
        {
          travelClass: {
            travelClassId: 2,
            travelClassName: "Economy",
            travelClassSubname: "Economy +",
          },
          isActive: true,
          price: 25225.36,
        },
      ],
      aircraftId: 4,
    } as Flight,
    returnFlight: {
      flightId: 2,
      flightCode: "AS151",
      departureDateAndTime: "2023-07-10T00:15:00Z",
      arrivalDateAndTime: "2023-07-10T08:30:00Z",
      originAirportId: 6,
      destinationAirportId: 3,
      travelClasses: [
        {
          travelClass: {
            travelClassId: 2,
            travelClassName: "Economy",
            travelClassSubname: "Economy +",
          },
          isActive: true,
          price: 25225.36,
        },
      ],
      aircraftId: 4,
    } as Flight,
    totalPrice: 50450.72,
  };

  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiryMonth, setExpiryMonth] = useState<string>("");
  const [expiryYear, setExpiryYear] = useState<string>("");
  const [cvcCode, setCvcCode] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [randomPrice, setRandomPrice] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    const random = new Random(MersenneTwister19937.autoSeed());
    setRandomPrice(
      random.integer(flights.totalPrice * 0.2, flights.totalPrice * 0.6)
    );
  }, [flights.totalPrice]);

  return (
    <>
      <div className="row offset-md-2 w-100">
        <div className="col col-xs-12 col-md-4 p-5 bg-light-subtle">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <h2>Enter billing information</h2>
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Card number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="input-group align-items-center gap-4">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Card expiry month"
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(e.target.value)}
                />
                /
                <input
                  className="form-control"
                  type="text"
                  placeholder="Card expiry year"
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="CVC code"
                  value={cvcCode}
                  onChange={(e) => setCvcCode(e.target.value)}
                />
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/order/booking", { replace: true })}
            >
              Book
            </button>
          </form>
        </div>
        <div className="col col-xs-12 col-md-4 p-5">
          <span>Departure flight:</span>
          <br></br>
          <FlightRowWithoutPrices flight={flights.departFlight} />
          <br></br>
          <br></br>
          <span>Return flight:</span>
          <br></br>
          <FlightRowWithoutPrices flight={flights.returnFlight} />
          <br></br>
          <br></br>
          <span>
            <h5>Ticket price: {flights.totalPrice - randomPrice} RSD</h5>
            <h5>Taxes and fees: {randomPrice} RSD</h5>
          </span>
          <br></br>
          <span>
            <h2>Total price: {flights.totalPrice} RSD</h2>
          </span>
        </div>
      </div>
      <span>{errorMessage}</span>
    </>
  );
}
