import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-regular-svg-icons";

interface AddAircraftFormState {
  aircraftType: string;
  aircraftName: string;
}

type TSetAircraftType = {
  type: "addAircraftForm/setAircraftType";
  value: string;
};
type TSetAircraftName = {
  type: "addAircraftForm/setAircraftName";
  value: string;
};

type AddAircraftFormAction = TSetAircraftType | TSetAircraftName;

function AddAircraftFormReducer(
  oldState: AddAircraftFormState,
  action: AddAircraftFormAction
): AddAircraftFormState {
  switch (action.type) {
    case "addAircraftForm/setAircraftType": {
      return {
        ...oldState,
        aircraftType: action.value,
      };
    }

    case "addAircraftForm/setAircraftName": {
      return {
        ...oldState,
        aircraftName: action.value,
      };
    }

    default:
      return oldState;
  }
}

export default function AdminAircraftAdd() {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  const [formState, dispatchFormStateAction] = useReducer(
    AddAircraftFormReducer,
    {
      aircraftType: "",
      aircraftName: "",
    }
  );

  const doAddAircraft = () => {
    api("post", "/api/aircraft", "administrator", formState)
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
      .then((aircraft) => {
        if (!aircraft?.aircraftId) {
          throw new Error("Could not fetch new aircraft data!");
        }

        return aircraft;
      })
      .then(() => {
        navigate("/admin/dashboard/aircraft/list", {
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
          <div className="card-aircraft-value">
            <h1 className="h5">Add new aircraft</h1>
          </div>
          <div className="card-text">
            {errorMessage && (
              <div className="alert alert-danger mb-3">{errorMessage}</div>
            )}

            <div className="form-group mb-3">
              <label>Aircraft type</label>
              <div className="input-group">
                <select
                  className="form-select form-select-sm"
                  value={formState.aircraftType}
                  onChange={(e) =>
                    dispatchFormStateAction({
                      type: "addAircraftForm/setAircraftType",
                      value: e.target.value,
                    })
                  }
                >
                  <option value="">Choose a type</option>
                  <option value={"Narrow-body"}>Narrow-body</option>
                  <option value={"Wide-body"}>Wide-body</option>
                </select>
              </div>
            </div>

            <div className="form-group mb-3">
              <label>Aircraft name</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={formState.aircraftName}
                  onChange={(e) =>
                    dispatchFormStateAction({
                      type: "addAircraftForm/setAircraftName",
                      value: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <button className="btn btn-primary" onClick={doAddAircraft}>
                <FontAwesomeIcon icon={faSave} />
                &nbsp;Add aircraft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
