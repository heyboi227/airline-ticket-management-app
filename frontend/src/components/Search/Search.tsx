import "./Search.scss";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import Config from "../../config";
import { debounce } from "lodash";
import AirportModel from "../../../../backend/src/components/airport/AirportModel.model";

interface InputProps {
  id: string;
  placeholder: string;
}

interface AirportInputProps {
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

interface DateInputProps {
  value: string | undefined;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type CombinedAirportProps = InputProps & AirportInputProps;
type CombinedDateProps = InputProps & DateInputProps;

function AirportInput({ id, placeholder, handleBlur }: CombinedAirportProps) {
  const [airportCode, setAirportCode] = useState<string>("");

  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<AirportModel[]>([]);

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
      debouncedFetchResults(query);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <>
      <div className="input-group">
        <input
          placeholder={placeholder}
          className="form-control"
          type="text"
          name={airportCode}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={handleBlur}
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
                onClick={() => {
                  setQuery(
                    `${result.city}, ${result.country?.name} (${result.airportCode})`
                  );
                  setAirportCode(result.airportCode);
                }}
              >
                {result.city}, {result.country?.name} ({result.airportCode})
                <br />
                <small>{result.name}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function DateInput({
  id,
  placeholder,
  value,
  handleChange,
}: CombinedDateProps) {
  const [inputType, setInputType] = useState<string>("text");

  const handleFocus = () => {
    setInputType("date");
  };

  const handleBlur = () => {
    setInputType("text");
  };

  return (
    <input
      placeholder={placeholder}
      className="form-control"
      type={inputType}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      id={id}
      value={value}
    />
  );
}

export default function Search() {
  const [originAirportCode, setOriginAirportCode] = useState<string>("");
  const [destinationAirportCode, setDestinationAirportCode] =
    useState<string>("");

  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();

  const [isRoundtrip, setIsRoundtrip] = useState<boolean>(true);

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
                handleBlur={(e) => setOriginAirportCode(e.target.name)}
              />
            </div>
            <div className="form-group mb-3">
              <AirportInput
                id="destination"
                placeholder="Destination airport"
                handleBlur={(e) => setDestinationAirportCode(e.target.name)}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group mt-3 mb-3">
              <div className="input-group">
                <DateInput
                  id="departure"
                  placeholder="Departure date"
                  value={departureDate?.toDateString()}
                  handleChange={(e) =>
                    setDepartureDate(new Date(e.target.value))
                  }
                ></DateInput>
              </div>
            </div>
            {isRoundtrip && (
              <div className="form-group mb-3">
                <div className="input-group">
                  <DateInput
                    id="return"
                    placeholder="Return date"
                    value={returnDate?.toDateString()}
                    handleChange={(e) =>
                      setReturnDate(new Date(e.target.value))
                    }
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
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
