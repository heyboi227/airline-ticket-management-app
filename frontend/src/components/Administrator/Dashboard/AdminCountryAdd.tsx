import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-regular-svg-icons";

interface IAddCountryFormState {
  countryName: string;
}

type TSetCountryName = {
  type: "addCountryForm/setCountryName";
  value: string;
};

function AddCountryFormReducer(
  oldState: IAddCountryFormState,
  action: TSetCountryName
): IAddCountryFormState {
  if (action.type === "addCountryForm/setCountryName") {
    return {
      ...oldState,
      countryName: action.value,
    };
  } else {
    return oldState;
  }
}

export default function AdminCountryAdd() {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  const [formState, dispatchFormStateAction] = useReducer(
    AddCountryFormReducer,
    {
      countryName: "",
    }
  );

  const doAddCountry = () => {
    console.log(formState);
    api("post", "/api/country", "administrator", formState)
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
      .then((country) => {
        if (!country?.countryId) {
          throw new Error("Could not fetch new country data!");
        }

        return country;
      })
      .then(() => {
        navigate("/admin/dashboard/country/list", {
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
          <div className="card-country-value">
            <h1 className="h5">Add new country</h1>
          </div>
          <div className="card-text">
            {errorMessage && (
              <div className="alert alert-danger mb-3">{errorMessage}</div>
            )}

            <div className="form-group mb-3">
              <label>Country name</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={formState.countryName}
                  onChange={(e) =>
                    dispatchFormStateAction({
                      type: "addCountryForm/setCountryName",
                      value: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <button className="btn btn-primary" onClick={doAddCountry}>
                <FontAwesomeIcon icon={faSave} />
                &nbsp;Add country
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
