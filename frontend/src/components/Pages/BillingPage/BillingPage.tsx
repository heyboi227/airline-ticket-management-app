import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FlightRowWithoutPrices } from "../FlightsPage/FlightsPage";
import Country from "../../../models/Country.model";
import { api } from "../../../api/api";
import Config from "../../../config";
import { debounce } from "lodash";
import { useRandomNumber } from "../OrderPage/OrderPage";
import "./BillingPage.css";

interface InputProps {
  id: string;
  placeholder: string;
}

interface CountryInputProps {
  onValueChange: (value: number) => void;
}

type CombinedCountryProps = InputProps & CountryInputProps;

function CountryInput({
  id,
  placeholder,
  onValueChange,
}: CombinedCountryProps) {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Country[]>([]);
  const [queryDone, setQueryDone] = useState<boolean>(false);

  const fetchResults = async (searchQuery: string) => {
    const response = await api(
      "get",
      Config.API_PATH + `/api/country/search/${searchQuery}`,
      "user",
      false
    );
    setResults(response.data);
  };

  const debouncedFetchResults = debounce(fetchResults, 300);

  useEffect(() => {
    if (query) {
      debouncedFetchResults(query)?.catch((error) =>
        console.error("An error occured: ", error)
      );
    } else {
      setResults([]);
    }
  }, [query]);

  const handleClick = (result: Country) => {
    setQuery(result.countryName);

    const countryId = result.countryId;
    onValueChange(countryId);

    setQueryDone(true);
  };

  return (
    <>
      <div className="input-group">
        <input
          placeholder={placeholder}
          className="form-control"
          type="text"
          required
          onChange={(e) => {
            const value = e.target.value;
            setQuery(e.target.value);

            if (results.some((result) => result.countryName === value)) {
              setQueryDone(true);
            } else {
              setQueryDone(false);
            }
          }}
          id={id}
          value={query}
        />
        <div className="invalid-feedback">Please enter your country.</div>
      </div>
      <div style={{ position: "absolute", zIndex: 5 }}>
        {results.length > 0 && !queryDone && (
          <ul className="list-group">
            {results.map((result) => (
              <li
                key={result.countryId}
                className="list-group-item"
                onClick={() => handleClick(result)}
              >
                {result.countryName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default function BillingPage() {
  const location = useLocation();
  const flights = location.state;

  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiryMonth, setExpiryMonth] = useState<string>("");
  const [expiryYear, setExpiryYear] = useState<string>("");
  const [cvcCode, setCvcCode] = useState<string>("");

  const [userAddress, setUserAddress] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [countryId, setCountryId] = useState<number>(0);
  const [email, setEmail] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string>("");

  const randomPrice = useRandomNumber();

  let bookingNumber: string = "";

  const navigate = useNavigate();

  const formRef = useRef<HTMLFormElement | null>(null);

  const [isValid, setIsValid] = useState<boolean>(true);

  const handleCountryIdChange = (newCountryId: number) => {
    setCountryId(newCountryId);
  };

  const nextInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length >= e.target.maxLength && nextInputRef.current) {
      nextInputRef.current.focus();
    }
  };

  const generateRandomFormattedString = () => {
    let result = "";

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";

    result += letters.charAt(Math.floor(Math.random() * letters.length));
    result += letters.charAt(Math.floor(Math.random() * letters.length));
    result += letters.charAt(Math.floor(Math.random() * letters.length));
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    result += letters.charAt(Math.floor(Math.random() * letters.length));

    return result;
  };

  const doSendBookingEmail = () => {
    api("post", "/api/ticket/confirm-booking", "user", {
      email,
      bookingNumber,
    }).catch((error) => {
      setErrorMessage(error?.message ?? "Could not send the email.");

      setTimeout(() => {
        setErrorMessage("");
      }, 3500);
    });
  };

  const doBooking = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const form = formRef.current;

    if (!form) return;

    if (form.checkValidity()) {
      setIsValid(true);

      bookingNumber = generateRandomFormattedString();
      navigate("/order/booking", {
        replace: true,
        state: { bookingNumber: bookingNumber },
      });
      doSendBookingEmail();
    } else {
      form.classList.add("was-validated");
      setIsValid(false);
    }
  };

  return (
    <>
      <div className="row offset-md-2 w-100">
        <div className="col col-xs-12 col-md-4 p-5 bg-light-subtle">
          <h2>Enter billing information</h2>
          <form
            ref={formRef}
            onSubmit={doBooking}
            noValidate
            className="needs-valdation"
          >
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Card number"
                  value={cardNumber}
                  required
                  maxLength={16}
                  onChange={(e) => {
                    setCardNumber(e.target.value);
                    handleInputChange(e);
                  }}
                />
                <div className="invalid-feedback">
                  Please enter your credit card number.
                </div>
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="input-group align-items-center gap-4">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Card expiry month"
                  maxLength={2}
                  value={expiryMonth}
                  required
                  ref={nextInputRef}
                  onChange={(e) => {
                    setExpiryMonth(e.target.value);
                    handleInputChange(e);
                  }}
                />
                /
                <input
                  className="form-control"
                  type="text"
                  placeholder="Card expiry year"
                  maxLength={2}
                  value={expiryYear}
                  required
                  ref={nextInputRef}
                  onChange={(e) => setExpiryYear(e.target.value)}
                />
                <div className="invalid-feedback">
                  Please enter your card expiry month / year.
                </div>
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="CVC code"
                  value={cvcCode}
                  required
                  onChange={(e) => setCvcCode(e.target.value)}
                />
                <div className="invalid-feedback">
                  Please enter your CVC code.
                </div>
              </div>
            </div>
            <br></br>
            <br></br>
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Address"
                  value={userAddress}
                  required
                  onChange={(e) => setUserAddress(e.target.value)}
                />
                <div className="invalid-feedback">
                  Please enter your address.
                </div>
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  className="form-control no-validation"
                  type="text"
                  placeholder="Address line 2"
                  defaultValue={""}
                  onChange={(e) =>
                    setUserAddress(userAddress + " " + e.target.value)
                  }
                />
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Postal code"
                  value={postalCode}
                  required
                  onChange={(e) => setPostalCode(e.target.value)}
                />
                <div className="invalid-feedback">
                  Please enter your postal code.
                </div>
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="City"
                  value={city}
                  required
                  onChange={(e) => setCity(e.target.value)}
                />
                <div className="invalid-feedback">Please enter your city.</div>
              </div>
            </div>
            <div className="form-group mb-3">
              <CountryInput
                id={"country"}
                placeholder={"Country"}
                onValueChange={handleCountryIdChange}
              />
            </div>
            <br></br>
            <br></br>
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Email address"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="invalid-feedback">
                  Please enter your email address.
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
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
