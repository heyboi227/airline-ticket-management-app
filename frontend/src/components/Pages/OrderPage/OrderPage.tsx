import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { srLatn } from "date-fns/locale";
import { api } from "../../../api/api";
import AppStore from "../../../stores/AppStore";
import { Random, MersenneTwister19937 } from "random-js";
import { FlightRowWithoutPrices } from "../FlightsPage/FlightsPage";
import Flight from "../../../models/Flight.model";
import Country from "../../../models/Country.model";
import Document from "../../../models/Document.model";

export default function OrderPage() {
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

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());
  const [userDocumentId, setUserDocumentId] = useState<number>(0);

  const [documentType, setDocumentType] = useState<string>("");
  const [documentNumber, setDocumentNumber] = useState<string>("");
  const [documentCountryId, setDocumentCountryId] = useState<number>(0);

  const [gender, setGender] = useState<"Male" | "Female">("Male");

  const [userDocuments, setUserDocuments] = useState<Document[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);

  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [randomPrice, setRandomPrice] = useState<number>(0);

  function loadCountries() {
    api("get", "/api/country", "user")
      .then((res) => {
        if (res.status === "error") {
          return setErrorMessage(res.data + "");
        }

        setCountries(res.data);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  function loadUserDocuments() {
    if (AppStore.getState().auth.id !== 0) {
      setLoggedIn(true);

      api("get", "/api/document/user/" + AppStore.getState().auth.id, "user")
        .then((res) => {
          if (res.status === "error") {
            return setErrorMessage(res.data + "");
          }

          setUserDocuments(res.data);
        })
        .catch((error) => {
          console.error("An error occured: ", error);
        });
    }
  }

  useEffect(loadCountries, []);

  useEffect(() => {
    const random = new Random(MersenneTwister19937.autoSeed());
    setRandomPrice(
      random.integer(flights.totalPrice * 0.2, flights.totalPrice * 0.6)
    );
    loadUserDocuments();
  }, [flights.totalPrice]);

  return (
    <>
      <div className="row offset-md-2 w-100">
        <div className="col col-xs-12 col-md-4 p-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
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
            <div className="form-group mb-3">
              <label>Date of birth</label>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={srLatn}
              >
                <DatePicker
                  label={"Pick a date"}
                  value={dateOfBirth}
                  onChange={(e) => {
                    if (e) setDateOfBirth(e);
                  }}
                  className="form-control"
                ></DatePicker>
              </LocalizationProvider>
            </div>
            {!loggedIn && (
              <div className="form-group mb-3">
                <div className="input-group">
                  <select
                    className="form-control"
                    placeholder="Document type"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                  >
                    <option value={""}>Choose a document type</option>
                    <option value={"National ID"}>National ID</option>
                    <option value={"Passport"}>Passport</option>
                  </select>
                </div>
                <div className="input-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Document number"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <select
                    className="form-control"
                    placeholder="Issuing country"
                    value={documentCountryId}
                    onChange={(e) => setDocumentCountryId(+e.target.value)}
                  >
                    <option value={""}>Choose the issuing country</option>
                    {countries.map((country) => (
                      <option key={country.countryId} value={country.countryId}>
                        {country.countryName}
                      </option>
                    ))}
                  </select>
                </div>
                <h6 className="mt-3">Gender</h6>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="male"
                    onChange={() => setGender("Male")}
                  />
                  <label className="form-check-label" htmlFor="male">
                    Male
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="female"
                    defaultChecked
                    onChange={() => setGender("Female")}
                  />
                  <label className="form-check-label" htmlFor="female">
                    Female
                  </label>
                </div>
              </div>
            )}
            {loggedIn && (
              <div className="form-group mb-3">
                <div className="input-group">
                  <select
                    className="form-select"
                    value={userDocumentId}
                    onChange={(e) => setUserDocumentId(+e.target.value)}
                  >
                    {userDocuments.map((document) => (
                      <option
                        value={document.documentId}
                        key={document.documentId}
                      >{`${document.documentType} - ${
                        document.documentNumber
                      } (${document.country!.countryName})`}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <button className="btn btn-primary">Billing information</button>
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
