import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import ICountry from "../../../models/ICountry.model";

interface IAddAirportFormState {
  airportCode: string;
  name: string;
  city: string;
  countryId: number;
  timeZone: string;
}

type TSetAirportCode = { type: "addAirportForm/setAirportCode"; value: string };
type TSetName = { type: "addAirportForm/setName"; value: string };
type TSetCity = { type: "addAirportForm/setCity"; value: string };
type TSetCountryId = { type: "addAirportForm/setCountryId"; value: number };
type TSetTimeZone = { type: "addAirportForm/setTimeZone"; value: string };

type AddAirportFormAction =
  | TSetAirportCode
  | TSetName
  | TSetCity
  | TSetCountryId
  | TSetTimeZone;

function AddAirportFormReducer(
  oldState: IAddAirportFormState,
  action: AddAirportFormAction
): IAddAirportFormState {
  switch (action.type) {
    case "addAirportForm/setAirportCode": {
      return {
        ...oldState,
        airportCode: action.value,
      };
    }

    case "addAirportForm/setName": {
      return {
        ...oldState,
        name: action.value,
      };
    }

    case "addAirportForm/setCity": {
      return {
        ...oldState,
        city: action.value,
      };
    }

    case "addAirportForm/setCountryId": {
      return {
        ...oldState,
        countryId: action.value,
      };
    }

    case "addAirportForm/setTimeZone": {
      return {
        ...oldState,
        timeZone: action.value,
      };
    }

    default:
      return oldState;
  }
}

export default function AdminAirportAdd() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [countries, setCountries] = useState<ICountry[]>([]);

  const navigate = useNavigate();

  const [formState, dispatchFormStateAction] = useReducer(
    AddAirportFormReducer,
    {
      airportCode: "",
      name: "",
      city: "",
      countryId: 0,
      timeZone: "",
    }
  );

  const fetchCountries = () => {
    api("get", "/api/country", "administrator")
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Could not fetch countries! Reason: " +
              res?.data
                ?.map(
                  (error: any) => error?.instancePath + " " + error?.message
                )
                .join(", ")
          );
        }

        setCountries(res.data);
      })
      .catch((error) => {
        setErrorMessage(error?.message ?? "Unknown error!");
      });
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const doAddAirport = () => {
    console.log(formState);
    api("post", "/api/airport", "administrator", formState)
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

        return res.data;
      })
      .then((airport) => {
        if (!airport?.airportId) {
          throw new Error("Could not fetch new airport data!");
        }

        return airport;
      })
      .then(() => {
        navigate("/admin/dashboard/airport/list", {
          replace: true,
        });
      })
      .catch((error) => {
        setErrorMessage(error?.message ?? "Unknown error!");
      });
  };

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="card-airport-value">
            <h1 className="h5">Add new airport</h1>
          </div>
          <div className="card-text">
            {errorMessage && (
              <div className="alert alert-danger mb-3">{errorMessage}</div>
            )}

            <div className="form-group mb-3">
              <label>Airport code</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={formState.airportCode}
                  onChange={(e) =>
                    dispatchFormStateAction({
                      type: "addAirportForm/setAirportCode",
                      value: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <label>Name</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={formState.name}
                  onChange={(e) =>
                    dispatchFormStateAction({
                      type: "addAirportForm/setName",
                      value: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <label>City</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={formState.city}
                  onChange={(e) =>
                    dispatchFormStateAction({
                      type: "addAirportForm/setCity",
                      value: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <label>Country</label>
              <div className="input-group">
                <select
                  className="form-select form-select-sm"
                  value={formState.countryId}
                  onChange={(e) =>
                    dispatchFormStateAction({
                      type: "addAirportForm/setCountryId",
                      value: +e.target.value,
                    })
                  }
                >
                  <option value="">Choose a country</option>
                  {countries.map((country) => (
                    <option value={country.countryId} key={country.countryId}>
                      {country.countryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group mb-3">
              <label>Time zone</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={formState.timeZone}
                  onChange={(e) =>
                    dispatchFormStateAction({
                      type: "addAirportForm/setTimeZone",
                      value: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <button className="btn btn-primary" onClick={doAddAirport}>
                Add airport
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
