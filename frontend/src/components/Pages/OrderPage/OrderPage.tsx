import { useLocation, useNavigate } from "react-router-dom";
import {
  createContext,
  useEffect,
  useState,
  PropsWithChildren,
  useContext,
  useRef,
} from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { srLatn } from "date-fns/locale";
import { api } from "../../../api/api";
import AppStore from "../../../stores/AppStore";
import { Random, MersenneTwister19937 } from "random-js";
import { FlightRowWithoutPrices } from "../FlightsPage/FlightsPage";
import Country from "../../../models/Country.model";
import UserDocument from "../../../models/UserDocument.model";
import User from "../../../models/User.model";
import "./OrderPage.css";
import Flight from "../../../models/Flight.model";

interface DateInputProps {
  label: string;
  onDateChange: (date: Date | null) => void;
  isValid: boolean;
}

const RandomNumberContext = createContext<number>(0);

export function RandomNumberProvider(props: PropsWithChildren) {
  const location = useLocation();
  const flights = location.state;

  const [randomNumber, setRandomNumber] = useState<string>(() => {
    const storedRandomNumber = localStorage.getItem("randomNumber");
    if (storedRandomNumber !== null) {
      return storedRandomNumber;
    } else {
      const newRandomNumber = new Random(MersenneTwister19937.autoSeed())
        .integer(
          Number(flights.totalPrice) * 0.2,
          Number(flights.totalPrice) * 0.6
        )
        .toFixed(2);

      localStorage.setItem("randomNumber", newRandomNumber);
      return newRandomNumber;
    }
  });

  return (
    <RandomNumberContext.Provider value={Number(randomNumber)}>
      {props.children}
    </RandomNumberContext.Provider>
  );
}

export function useRandomNumber() {
  const context = useContext(RandomNumberContext);
  if (context === undefined) {
    throw new Error(
      "useRandomNumber must be used within a RandomNumberProvider!"
    );
  }
  return context;
}

function DateInput({ label, onDateChange, isValid }: DateInputProps) {
  const [value, setValue] = useState<Date | null>(null);

  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
    onDateChange(newValue);
    if (!newValue) {
      isValid = true;
    } else {
      isValid = false;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={srLatn}>
      <div className="input-group">
        <DatePicker
          label={label}
          value={value}
          onChange={handleChange}
          className={`form-control ${!isValid ? "is-invalid" : ""}`}
          disableFuture={true}
        />
        {!isValid && (
          <div className="invalid-feedback">Please choose a valid date.</div>
        )}
      </div>
    </LocalizationProvider>
  );
}

export default function OrderPage() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());
  const [userDocumentId, setUserDocumentId] = useState<number>(0);

  const [documentType, setDocumentType] = useState<string>("");
  const [documentNumber, setDocumentNumber] = useState<string>("");
  const [documentCountryId, setDocumentCountryId] = useState<number>(0);

  const [gender, setGender] = useState<"Male" | "Female">("Male");

  const [userDocuments, setUserDocuments] = useState<UserDocument[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);

  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const [isValid, setIsValid] = useState<boolean>(true);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const formRef = useRef<HTMLFormElement | null>(null);

  const randomPrice = useRandomNumber();

  const navigate = useNavigate();

  const location = useLocation();

  const formData = location.state;

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

  function loadCurrentUser() {
    api("get", "/api/user/" + AppStore.getState().auth.id, "user")
      .then((res) => {
        if (res.status === "error") {
          return setErrorMessage(res.data + "");
        }

        const userData = res.data as User;
        setFirstName(userData.forename);
        setLastName(userData.surname);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  function loadUserDocuments() {
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

  useEffect(() => {
    if (AppStore.getState().auth.id !== 0) setLoggedIn(true);
    loadCountries();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      loadCurrentUser();
      loadUserDocuments();
    }
  }, [loggedIn]);

  const toBilling = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const form = formRef.current;

    if (!form) return;

    if (form.checkValidity()) {
      setIsValid(true);
      navigate("/order/billing", {
        replace: true,
        state: {
          flightDetails: {
            departFlight: formData.departFlight,
            returnFlight: formData.returnFlight,
            departureTravelClass: location.state.departureTravelClass,
            returnTravelClass: location.state.returnTravelClass,
            departurePrice: formData.departFlight.travelClasses![0].price,
            returnPrice: formData.returnFlight.travelClasses![0].price,
            totalPrice: formData.totalPrice,
          },
          ticketHolderDetails: {
            ticketHolderFirstName: firstName,
            ticketHolderLastName: lastName,
            ticketHolderDateOfBirth: dateOfBirth,
          },
        },
      });
    } else {
      form.classList.add("was-validated");
      setIsValid(false);
    }
  };

  const handleDateOfBirthChange = (date: Date | null) => {
    if (date) {
      setDateOfBirth(date);
    }
  };

  return (
    <>
      <div className="row offset-md-2 w-100">
        <div className="col col-xs-12 col-md-4 p-5 bg-light-subtle">
          <form
            ref={formRef}
            onSubmit={toBilling}
            noValidate
            className="needs-validation"
          >
            <h2>Enter passenger details</h2>
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Passenger's first name"
                  value={firstName}
                  required
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <div className="invalid-feedback">
                  Please enter your first name.
                </div>
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Passenger's last name"
                  value={lastName}
                  required
                  onChange={(e) => setLastName(e.target.value)}
                />
                <div className="invalid-feedback">
                  Please enter your last name.
                </div>
              </div>
            </div>
            <div className="form-group mb-3">
              <DateInput
                onDateChange={handleDateOfBirthChange}
                label="Choose your date of birth"
                isValid={isValid}
              ></DateInput>
            </div>
            {(!loggedIn || (loggedIn && userDocuments.length === 0)) && (
              <div className="form-group mb-3">
                <div className="input-group">
                  <select
                    className="form-control"
                    placeholder="Document type"
                    value={documentType}
                    required
                    onChange={(e) => setDocumentType(e.target.value)}
                  >
                    <option value={""}>Choose a document type</option>
                    <option value={"National ID"}>National ID</option>
                    <option value={"Passport"}>Passport</option>
                  </select>
                  <div className="invalid-feedback">
                    Please choose a document type.
                  </div>
                </div>
                <div className="input-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Document number"
                    value={documentNumber}
                    required
                    onChange={(e) => setDocumentNumber(e.target.value)}
                  />
                  <div className="invalid-feedback">
                    Please enter your document number.
                  </div>
                </div>
                <div className="input-group">
                  <select
                    className="form-control"
                    placeholder="Issuing country"
                    value={documentCountryId}
                    required
                    onChange={(e) => setDocumentCountryId(+e.target.value)}
                  >
                    <option value={""}>Choose the issuing country</option>
                    {countries.map((country) => (
                      <option key={country.countryId} value={country.countryId}>
                        {country.countryName}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">
                    Please choose a document issuing country.
                  </div>
                </div>
              </div>
            )}
            {loggedIn && userDocuments.length !== 0 && (
              <div className="form-group mb-3">
                <div className="input-group">
                  <select
                    className="form-select"
                    value={userDocumentId}
                    onChange={(e) => setUserDocumentId(+e.target.value)}
                  >
                    <option value={""}>Choose a document</option>
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
            <div className="form-group mb-3">
              <h6 className="mt-3">Gender</h6>
              <div className="form-check form-check-inline no-validation">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  id="male"
                  defaultChecked
                  value={gender}
                  onChange={() => setGender("Male")}
                />
                <label className="form-check-label" htmlFor="male">
                  Male
                </label>
              </div>
              <div className="form-check form-check-inline no-validation">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  id="female"
                  value={gender}
                  onChange={() => setGender("Female")}
                />
                <label className="form-check-label" htmlFor="female">
                  Female
                </label>
              </div>
            </div>
            <button className="btn btn-primary" type="submit">
              Billing information
            </button>
          </form>
        </div>
        <div className="col col-xs-12 col-md-4 p-5">
          <span>Departure flight:</span>
          <br></br>
          <FlightRowWithoutPrices flight={formData.departFlight} />
          <br></br>
          <span>Class: {location.state.departureFlightClass}</span>
          <br></br>
          <span>Return flight:</span>
          <br></br>
          <FlightRowWithoutPrices flight={formData.returnFlight} />
          <br></br>
          <span>Class: {location.state.returnFlightClass}</span>
          <br></br>
          <span>
            <h5>Ticket price: {formData.totalPrice - randomPrice} RSD</h5>
            <h5>Taxes and fees: {randomPrice} RSD</h5>
          </span>
          <br></br>
          <span>
            <h2>Total price: {formData.totalPrice} RSD</h2>
          </span>
        </div>
      </div>
      <span>{errorMessage}</span>
    </>
  );
}
