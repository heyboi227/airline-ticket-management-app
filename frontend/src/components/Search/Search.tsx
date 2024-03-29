import "./Search.scss";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import Config from "../../config";
import { debounce } from "lodash";
import Airport from "../../models/Airport.model";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import srLatn from "date-fns/locale/sr-Latn";
import { convertDateToMySqlDateTime } from "../../helpers/helpers";
import { isTodayTabDisabled } from "../Pages/FlightsPage/FlightsPage";
import Flight from "../../models/Flight.model";

interface InputProps {
  id: string;
  placeholder: string;
}

interface AirportInputProps {
  onValueChange: (value: number) => void;
}

interface DateInputProps {
  label: string;
  onDateChange: (date: Date | null) => void;
  onDateValidation: (date: Date | null) => void;
  isValid: boolean;
  disableToday: boolean;
}

type CombinedAirportProps = InputProps & AirportInputProps;

function AirportInput({
  id,
  placeholder,
  onValueChange,
}: CombinedAirportProps) {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Airport[]>([]);

  const fetchResults = async (searchQuery: string) => {
    const response = await api(
      "get",
      Config.API_PATH + `/api/airport/search/${searchQuery}`,
      "user",
      false
    );
    setResults(response.data);
  };

  useEffect(() => {
    const debouncedFetchResults = debounce(fetchResults, 300);

    if (query) {
      debouncedFetchResults(query)?.catch((error) =>
        console.error("An error occured: ", error)
      );
    } else {
      setResults([]);
    }
  }, [query]);

  const handleClick = (result: Airport) => {
    setQuery(
      result.city +
        ", " +
        result.country?.countryName +
        " (" +
        result.airportCode +
        ")"
    );

    const airportId = result.airportId;
    onValueChange(airportId);
  };

  return (
    <>
      <div className="input-group">
        <input
          placeholder={placeholder}
          className="form-control"
          type="text"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          id={id}
          value={query}
          required
        />
        {id === "origin" && (
          <div className="invalid-feedback">
            Please choose an origin airport.
          </div>
        )}
        {id === "destination" && (
          <div className="invalid-feedback">
            Please choose a destination airport.
          </div>
        )}
      </div>
      <div style={{ position: "absolute", zIndex: 2 }}>
        {results.length > 0 && (
          <ul className="list-group">
            {results.map((result) => (
              <li
                key={result.airportId}
                className="list-group-item"
                tabIndex={0}
                onClick={() => handleClick(result)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") handleClick(result);
                }}
              >
                {result.city}, {result.country?.countryName} (
                {result.airportCode})
                <br />
                <small>{result.airportName}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function DateInput(props: Readonly<DateInputProps>) {
  const [value, setValue] = useState<Date | null>(null);

  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
    props.onDateChange(newValue);
    props.onDateValidation(newValue);
  };

  const shouldDisableDate = (date: Date | null) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date
      ? props.disableToday && date.toDateString() === today.toDateString()
      : false;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={srLatn}>
      <div className="input-group">
        <DatePicker
          label={props.label}
          value={value}
          onChange={handleChange}
          className={`form-control ${!props.isValid ? "is-invalid" : ""}`}
          disablePast={true}
          shouldDisableDate={shouldDisableDate}
        />
        {!props.isValid && (
          <div className="invalid-feedback">Please choose a valid date.</div>
        )}
      </div>
    </LocalizationProvider>
  );
}

export default function Search() {
  const [originAirportId, setOriginAirportId] = useState<number>(0);
  const [destinationAirportId, setDestinationAirportId] = useState<number>(0);

  const [departureDate, setDepartureDate] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");

  const [numberOfPassengers, setNumberOfPassengers] = useState<number>(1);

  const handleOriginAirportIdChange = (newOriginAirportId: number) => {
    setOriginAirportId(newOriginAirportId);
  };

  const handleDestinationAirportIdChange = (
    newDestinationAirportId: number
  ) => {
    setDestinationAirportId(newDestinationAirportId);
  };

  const handleDepartureDateChange = (date: Date | null) => {
    if (date) {
      setDepartureDate(convertDateToMySqlDateTime(date));
    }
  };

  const handleReturnDateChange = (date: Date | null) => {
    if (date) {
      setReturnDate(convertDateToMySqlDateTime(date));
    }
  };

  const handleDateValidation = (date: Date | null) => {
    const isValid: boolean = date !== null;
    setIsValid(isValid);
  };

  const [isRoundtrip, setIsRoundtrip] = useState<boolean>(true);

  const [shouldDisableToday, setShouldDisableToday] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const formRef = useRef<HTMLFormElement | null>(null);

  const [isValid, setIsValid] = useState<boolean>(true);

  const doSearchDeparture = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const form = formRef.current;

    if (!form) return;

    if (form.checkValidity()) {
      setIsValid(true);

      api("post", "/api/flight/search", "user", {
        originAirportId,
        destinationAirportId,
        flightDate: departureDate,
      })
        .then((res) => {
          if (res.status !== "ok") {
            throw new Error(
              "Search could not be performed. Reason: " +
                JSON.stringify(res.data)
            );
          }
          return res;
        })
        .then((res) => {
          navigate("/search/flights", {
            replace: true,
            state: {
              originAirportId: originAirportId,
              destinationAirportId: destinationAirportId,
              departureDate: departureDate,
              returnDate: returnDate,
              isRoundtrip: isRoundtrip,
              numberOfPassengers: numberOfPassengers,
              flightData: res.data,
            },
          });
        })
        .catch((error) => {
          setError(error?.message ?? "Could not perform the search.");

          setTimeout(() => {
            setError("");
          }, 3500);
        });
    } else {
      form.classList.add("was-validated");
      setIsValid(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await api("post", "/api/flight/search", "user", {
        originAirportId: originAirportId,
        destinationAirportId: destinationAirportId,
        flightDate: new Date().toISOString().slice(0, 10),
      });
      if (isTodayTabDisabled(response.data as Flight[])) {
        setShouldDisableToday(true);
      } else {
        setShouldDisableToday(false);
      }
    };
    if (originAirportId !== 0 && destinationAirportId !== 0) fetchData();
  }, [originAirportId, destinationAirportId]);

  return (
    <div
      className="w-100 d-flex flex-column justify-content-center align-items-center search"
      style={{ padding: "7vw 0" }}
    >
      <h1 className="text-light mb-5">Flight search</h1>
      <div className="col-6 px-5 py-5 bg-dark bg-opacity-75 rounded-4 position-relative">
        <div
          className="row form-group mt-3 mb-3 text-white"
          style={{ width: "fit-content" }}
        >
          <div className="col d-flex flex-row align-items-center justify-content-center gap-2">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="ticket-type"
                id="one-way"
                onChange={() => setIsRoundtrip(false)}
              />
              <label className="form-check-label" htmlFor="one-way">
                One-way
              </label>
            </div>
          </div>
          <div className="col d-flex flex-row align-items-center justify-content-center gap-2">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="ticket-type"
                id="roundtrip"
                defaultChecked
                onChange={() => setIsRoundtrip(true)}
              />
              <label className="form-check-label" htmlFor="roundtrip">
                Roundtrip
              </label>
            </div>
          </div>
          <div className="col">
            <div className="form-group d-flex flex-row align-items-center justify-content-center gap-2">
              <span>Adults:</span>
              <input
                className="form-control"
                style={{ width: "fit-content" }}
                type="number"
                min={1}
                max={6}
                onChange={(e) => {
                  setNumberOfPassengers(+e.target.value);
                }}
                id="numberOfPassengers"
                value={numberOfPassengers}
              />
            </div>
          </div>
        </div>
        <form
          ref={formRef}
          onSubmit={doSearchDeparture}
          noValidate
          className="needs-valdation"
        >
          <div className="row">
            <div className="col">
              <div className="form-group mt-3 mb-3">
                <AirportInput
                  id="origin"
                  placeholder="Origin airport"
                  onValueChange={handleOriginAirportIdChange}
                />
              </div>
              <div className="form-group mb-3">
                <AirportInput
                  id="destination"
                  placeholder="Destination airport"
                  onValueChange={handleDestinationAirportIdChange}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group mt-3 mb-3">
                <div className="input-group">
                  <DateInput
                    onDateChange={handleDepartureDateChange}
                    label="Choose a departure date"
                    isValid={isValid}
                    onDateValidation={handleDateValidation}
                    disableToday={shouldDisableToday}
                  ></DateInput>
                </div>
              </div>
              {isRoundtrip && (
                <div className="form-group mb-3">
                  <div className="input-group">
                    <DateInput
                      onDateChange={handleReturnDateChange}
                      label="Choose a return date"
                      isValid={isValid}
                      onDateValidation={handleDateValidation}
                      disableToday={shouldDisableToday}
                    ></DateInput>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="btn btn-primary position-absolute"
              style={{ right: "5%" }}
            >
              Search
            </button>
          </div>
          {error && <p className="text-bg-danger">{error}</p>}
        </form>
      </div>
    </div>
  );
}
