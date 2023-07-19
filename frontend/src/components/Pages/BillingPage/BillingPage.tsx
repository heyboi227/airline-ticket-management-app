import { useEffect, useRef, useState } from "react";
import Flight from "../../../models/Flight.model";
import { useNavigate } from "react-router-dom";
import { FlightRowWithoutPrices } from "../FlightsPage/FlightsPage";
import Country from "../../../models/Country.model";
import { api } from "../../../api/api";
import Config from "../../../config";
import { debounce } from "lodash";
import { useRandomNumber } from "../OrderPage/OrderPage";

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

  const [userAddress, setUserAddress] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [countryId, setCountryId] = useState<number>(0);
  const [email, setEmail] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string>("");

  const randomPrice = useRandomNumber();

  const navigate = useNavigate();

  const handleCountryIdChange = (newCountryId: number) => {
    setCountryId(newCountryId);
  };

  const nextInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length >= e.target.maxLength && nextInputRef.current) {
      nextInputRef.current.focus();
    }
  };

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
                  maxLength={16}
                  onChange={(e) => {
                    setCardNumber(e.target.value);
                    handleInputChange(e);
                  }}
                />
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
                  ref={nextInputRef}
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
            <br></br>
            <br></br>
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Address"
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  className="form-control"
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
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
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
                  onChange={(e) => setEmail(e.target.value)}
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
