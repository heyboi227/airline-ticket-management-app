import "./Search.scss";
import { useState } from "react";

interface DateInputProps {
  id: string;
  placeholder: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => any;
}

function DateInput({ id, placeholder, value, onChange }: DateInputProps) {
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
      onChange={onChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      id={id}
      value={value}
    />
  );
}

export default function Search() {
  const [originAirport, setOriginAirport] = useState<string>();
  const [destinationAirport, setDestinationAirport] = useState<string>();

  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();

  const [isRoundtrip, setIsRoundtrip] = useState<boolean>(true);

  return (
    <div className="container pt-5 pb-5 d-flex justify-content-center align-items-center search">
      <div className="col-8 px-5 py-5 bg-dark bg-opacity-75 rounded-4 position-relative">
        <div className="row form-group mt-3 mb-3 text-white w-50">
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
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Origin airport"
                  value={originAirport}
                  onChange={(e) => setOriginAirport(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Destination airport"
                  value={destinationAirport}
                  onChange={(e) => setDestinationAirport(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="col">
            <div className="form-group mt-3 mb-3">
              <div className="input-group">
                <DateInput
                  id={"departure"}
                  placeholder={"Departure date"}
                  value={departureDate?.toDateString()}
                  onChange={(e) => setDepartureDate(new Date(e.target.value))}
                ></DateInput>
              </div>
            </div>
            {isRoundtrip && (
              <div className="form-group mb-3">
                <div className="input-group">
                  <DateInput
                    id={"return"}
                    placeholder={"Return date"}
                    value={returnDate?.toDateString()}
                    onChange={(e) => setReturnDate(new Date(e.target.value))}
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
