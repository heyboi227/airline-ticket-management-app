import { useLocation, useNavigate } from "react-router-dom";
import {
  createContext,
  useEffect,
  useState,
  useMemo,
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
import {
  convertDateToMySqlDateTime,
  numbersToLetters,
} from "../../../helpers/helpers";

interface DateInputProps {
  label: string;
  onDateChange: (date: Date | null) => void;
  isValid: boolean;
  disablePast?: boolean;
  disableFuture?: boolean;
}

const RandomNumberContext = createContext<number>(0);

export function RandomNumberProvider(props: Readonly<PropsWithChildren>) {
  const location = useLocation();
  const flights = location.state;

  const randomNumber = useMemo(
    () => () => {
      const storedRandomNumber = localStorage.getItem("randomNumber");
      if (storedRandomNumber !== null) {
        return parseFloat(storedRandomNumber);
      } else {
        const random = new Random(MersenneTwister19937.autoSeed());
        const totalPrice =
          flights.totalPrice || flights.flightDetails.totalPrice;
        const min = Number(totalPrice) * 0.2 * 100;
        const max = Number(totalPrice) * 0.6 * 100;
        const newRandomNumber = random.integer(min, max) / 100;
        localStorage.setItem("randomNumber", newRandomNumber.toFixed(2));
        return parseFloat(newRandomNumber.toFixed(2));
      }
    },
    [flights]
  );

  return (
    <RandomNumberContext.Provider value={randomNumber()}>
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

function DateInput({
  label,
  onDateChange,
  isValid,
  disablePast,
  disableFuture,
}: Readonly<DateInputProps>) {
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
          disablePast={disablePast}
          disableFuture={disableFuture}
        />
        {!isValid && (
          <div className="invalid-feedback">Please choose a valid date.</div>
        )}
      </div>
    </LocalizationProvider>
  );
}

export default function OrderPage() {
  const [userDocuments, setUserDocuments] = useState<UserDocument[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  const formData = location.state;

  const [passengers, setPassengers] = useState(() =>
    Array.from({ length: formData.numberOfPassengers }, () => ({
      firstName: "",
      lastName: "",
      dateOfBirth: new Date(),
      userDocumentId: 0,
      documentType: "Passport",
      documentNumber: "",
      documentCountryId: 0,
      documentIssuingDate: new Date(),
      documentExpirationDate: new Date(),
      gender: "Male",
    }))
  );

  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const [isValid, setIsValid] = useState<boolean>(true);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const formRef = useRef<HTMLFormElement | null>(null);

  const taxesAndFeesPrice = useRandomNumber();

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
        handlePassengerUpdate(0, "firstName", userData.forename);
        handlePassengerUpdate(0, "lastName", userData.surname);
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

  function setActiveDocument(userDocumentId: number) {
    api("get", "/api/document/" + userDocumentId, "user")
      .then((res) => {
        if (res.status === "error") {
          return setErrorMessage(res.data + "");
        }

        return res.data;
      })
      .then((res: UserDocument) => {
        handlePassengerUpdate(0, "userDocumentId", res.documentId);
        handlePassengerUpdate(0, "documentType", res.documentType);
        handlePassengerUpdate(0, "documentNumber", res.documentNumber);
        handlePassengerUpdate(0, "countryId", res.countryId);
        handlePassengerUpdate(
          0,
          "documentIssuingDate",
          new Date(res.documentIssuingDate)
        );
        handlePassengerUpdate(
          0,
          "documentExpirationDate",
          new Date(res.documentExpirationDate)
        );
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  function doAddUserDocument(passenger: any) {
    api("post", "/api/document", "user", {
      countryId: passenger.documentCountryId,
      documentType: passenger.documentType,
      documentNumber: passenger.documentNumber,
      documentIssuingDate: convertDateToMySqlDateTime(
        passenger.documentIssuingDate
      ).slice(0, 10),
      documentExpirationDate: convertDateToMySqlDateTime(
        passenger.documentExpirationDate
      ).slice(0, 10),
      userId: AppStore.getState().auth.id,
    })
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Could not add this item! Reason: " +
              res?.data
                ?.map(
                  (error: any) => error?.instancePath + " " + error?.message
                )
                .join(", ")
          );
        }

        handlePassengerUpdate(0, "userDocumentId", res.data.documentId);
      })
      .catch((error) => {
        setErrorMessage(error?.message ?? "Unknown error!");
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

  const validateAllPassengerForms = (
    event: React.FormEvent<HTMLFormElement>,
    form: HTMLFormElement | null
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!form) return;

    return form.checkValidity();
  };

  const toBilling = (passenger: any) => {
    const syntheticEvent = new Event("submit", {
      bubbles: true,
      cancelable: true,
    }) as unknown as React.FormEvent<HTMLFormElement>;

    if (validateAllPassengerForms(syntheticEvent, formRef.current)) {
      setIsValid(true);
      if (AppStore.getState().auth.id !== 0 && userDocuments.length === 0)
        doAddUserDocument(passenger);
      navigate("/order/billing", {
        replace: true,
        state: {
          flightDetails: {
            departFlight: formData.departFlight,
            returnFlight: formData.returnFlight,
            departureTravelClass: formData.departureTravelClass,
            returnTravelClass: formData.returnTravelClass,
            departurePrice: formData.departurePrice,
            returnPrice: formData.returnPrice,
            totalPrice: formData.totalPrice,
            isRoundtrip: formData.isRoundtrip,
          },
          passengers: passengers,
        },
      });
    } else {
      if (formRef.current) formRef.current.classList.add("was-validated");
      setIsValid(false);
    }
  };

  const handlePassengerUpdate = (index: number, field: string, value: any) => {
    setPassengers((current) =>
      current.map((passenger, i) =>
        i === index ? { ...passenger, [field]: value } : passenger
      )
    );
  };

  return (
    <>
      <div className="row offset-md-2 w-100">
        <div className="col col-xs-12 col-md-4 p-5 bg-light-subtle">
          {passengers.map((passenger, index) => (
            <form
              ref={formRef}
              key={index}
              noValidate
              className="needs-validation"
            >
              <h2>Enter details for {numbersToLetters[index]} passenger:</h2>
              <div className="form-group mb-3">
                <div className="input-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Passenger's first name"
                    value={passenger.firstName}
                    required
                    onChange={(e) =>
                      handlePassengerUpdate(index, "firstName", e.target.value)
                    }
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
                    value={passenger.lastName}
                    required
                    onChange={(e) =>
                      handlePassengerUpdate(index, "lastName", e.target.value)
                    }
                  />
                  <div className="invalid-feedback">
                    Please enter your last name.
                  </div>
                </div>
              </div>
              <div className="form-group mb-3">
                <DateInput
                  onDateChange={(date) =>
                    handlePassengerUpdate(index, "dateOfBirth", date)
                  }
                  label="Date of birth"
                  isValid={isValid}
                  disableFuture={true}
                ></DateInput>
              </div>
              {!loggedIn ||
                (loggedIn && userDocuments.length === 0) ||
                (index > 0 && (
                  <>
                    <div className="form-group mb-3">
                      <div className="input-group">
                        <select
                          className="form-control"
                          value={passenger.documentType}
                          required
                          onChange={(e) =>
                            handlePassengerUpdate(
                              index,
                              "documentType",
                              e.target.value
                            )
                          }
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
                          value={passenger.documentNumber}
                          required
                          onChange={(e) =>
                            handlePassengerUpdate(
                              index,
                              "documentNumber",
                              e.target.value
                            )
                          }
                        />
                        <div className="invalid-feedback">
                          Please enter your document number.
                        </div>
                      </div>
                      <div className="input-group">
                        <select
                          className="form-control"
                          value={passenger.documentCountryId}
                          required
                          onChange={(e) =>
                            handlePassengerUpdate(
                              index,
                              "documentCountryId",
                              +e.target.value
                            )
                          }
                        >
                          <option value={""}>Choose the issuing country</option>
                          {countries.map((country) => (
                            <option
                              key={country.countryId}
                              value={country.countryId}
                            >
                              {country.countryName}
                            </option>
                          ))}
                        </select>
                        <div className="invalid-feedback">
                          Please choose a document issuing country.
                        </div>
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <DateInput
                        onDateChange={(date) =>
                          handlePassengerUpdate(
                            index,
                            "documentIssuingDate",
                            date
                          )
                        }
                        label="Document issuing date"
                        isValid={isValid}
                        disableFuture={true}
                      ></DateInput>
                    </div>
                    <div className="form-group mb-3">
                      <DateInput
                        onDateChange={(date) =>
                          handlePassengerUpdate(
                            index,
                            "documentExpirationDate",
                            date
                          )
                        }
                        label="Document expiration date"
                        isValid={isValid}
                        disablePast={true}
                      ></DateInput>
                    </div>
                  </>
                ))}
              {loggedIn && userDocuments.length !== 0 && index === 0 && (
                <div className="form-group mb-3">
                  <div className="input-group">
                    <select
                      className="form-select"
                      value={passenger.userDocumentId}
                      onChange={(e) => setActiveDocument(+e.target.value)}
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
                    name={"gender-" + index}
                    id="male"
                    defaultChecked
                    value={passenger.gender}
                    onChange={() =>
                      handlePassengerUpdate(index, "gender", "Male")
                    }
                  />
                  <label className="form-check-label" htmlFor="male">
                    Male
                  </label>
                </div>
                <div className="form-check form-check-inline no-validation">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={"gender-" + index}
                    id="female"
                    value={passenger.gender}
                    onChange={() =>
                      handlePassengerUpdate(index, "gender", "Female")
                    }
                  />
                  <label className="form-check-label" htmlFor="female">
                    Female
                  </label>
                </div>
              </div>
            </form>
          ))}
          <button
            className="btn btn-primary"
            onClick={() => toBilling(passengers[0])}
          >
            Billing information
          </button>
        </div>
        <div className="col col-xs-12 col-md-4 p-5">
          <div className="mb-4">
            <h3>Departure flight</h3>
            <FlightRowWithoutPrices flight={formData.departFlight} />
            <br></br>
            <span>Class: {location.state.departureTravelClass}</span>
            <br></br>
          </div>
          {formData.isRoundtrip && (
            <div className="my-4">
              <h3>Return flight</h3>
              <FlightRowWithoutPrices flight={formData.returnFlight} />
              <br></br>
              <span>Class: {location.state.returnTravelClass}</span>
              <br></br>
            </div>
          )}
          <span>
            <h5>
              Ticket price:{" "}
              {(formData.totalPrice - taxesAndFeesPrice).toFixed(2)} RSD
            </h5>
            <h5>Taxes and fees: {taxesAndFeesPrice} RSD</h5>
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
