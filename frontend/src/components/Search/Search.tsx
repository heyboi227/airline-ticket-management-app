import "./Search.scss";
import { useEffect, useState } from "react";
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

  const debouncedFetchResults = debounce(fetchResults, 300);

  useEffect(() => {
    if (query) {
      debouncedFetchResults(query)?.catch((error) =>
        console.error("An error occured: ", error)
      );
    } else {
      setResults([]);
    }
  }, [debouncedFetchResults, query]);

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
        />
      </div>
      <div style={{ position: "absolute", zIndex: 2 }}>
        {results.length > 0 && (
          <ul className="list-group">
            {results.map((result) => (
              <li
                key={result.airportId}
                className="list-group-item"
                onClick={() => handleClick(result)}
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

function DateInput({ label, onDateChange }: DateInputProps) {
  const [value, setValue] = useState<Date | null>(null);

  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
    onDateChange(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={srLatn}>
      <DatePicker
        label={label}
        value={value}
        onChange={handleChange}
        className="form-control"
        disablePast={true}
      ></DatePicker>
    </LocalizationProvider>
  );
}

export default function Search() {
  const [originAirportId, setOriginAirportId] = useState<number>(0);
  const [destinationAirportId, setDestinationAirportId] = useState<number>(0);

  const [departureDate, setDepartureDate] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");

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

  const [isRoundtrip, setIsRoundtrip] = useState<boolean>(true);

  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const doSearchDeparture = () => {
    api("post", "/api/flight/search/departure", "user", {
      originAirportId,
      destinationAirportId,
      departureDate: departureDate,
    })
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Search could not be performed. Reason: " + JSON.stringify(res.data)
          );
        }
        return res;
      })
      .then((res) => {
        navigate("/search/flights", {
          replace: true,
          state: [
            originAirportId,
            destinationAirportId,
            departureDate,
            returnDate,
            res.data,
          ],
        });
      })
      .catch((error) => {
        setError(error?.message ?? "Could not perform the search.");

        setTimeout(() => {
          setError("");
        }, 3500);
      });
  };

  return (
    <div className="container pt-5 pb-5 d-flex justify-content-center align-items-center search">
      <div className="col-8 px-5 py-5 bg-dark bg-opacity-75 rounded-4 position-relative">
        <div
          className="row form-group mt-3 mb-3 text-white"
          style={{ width: "fit-content" }}
        >
          <div className="col">
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
          <div className="col">
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
        </div>
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
                ></DateInput>
              </div>
            </div>
            {isRoundtrip && (
              <div className="form-group mb-3">
                <div className="input-group">
                  <DateInput
                    onDateChange={handleReturnDateChange}
                    label="Choose a return date"
                  ></DateInput>
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-primary position-absolute"
            style={{ right: "5%" }}
            onClick={doSearchDeparture}
          >
            Search
          </button>
        </div>
        {error && <p className="text-bg-danger">{error}</p>}
      </div>
    </div>
  );
}
