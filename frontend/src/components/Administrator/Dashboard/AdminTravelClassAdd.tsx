import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-regular-svg-icons";

interface IAddTravelClassFormState {
  travelClassName: "Business" | "Economy";
  travelClassSubname: string;
}

type TSetTravelClassName = {
  type: "addTravelClassForm/setTravelClassName";
  value: "Business" | "Economy";
};

type TSetTravelClassSubname = {
  type: "addTravelClassForm/setTravelClassSubname";
  value: string;
};

type AddTravelClassFormAction = TSetTravelClassName | TSetTravelClassSubname;

function AddTravelClassFormReducer(
  oldState: IAddTravelClassFormState,
  action: AddTravelClassFormAction
): IAddTravelClassFormState {
  if (action.type === "addTravelClassForm/setTravelClassName") {
    return {
      ...oldState,
      travelClassName: action.value,
    };
  } else if (action.type === "addTravelClassForm/setTravelClassSubname") {
    return {
      ...oldState,
      travelClassSubname: action.value,
    };
  } else {
    return oldState;
  }
}

export default function AdminTravelClassAdd() {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  const [formState, dispatchFormStateAction] = useReducer(
    AddTravelClassFormReducer,
    {
      travelClassName: "Business",
      travelClassSubname: "",
    }
  );

  const doAddTravelClass = () => {
    console.log(formState);
    api("post", "/api/travel-class", "administrator", formState)
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
      .then((travelClass) => {
        if (!travelClass?.travelClassId) {
          throw new Error("Could not fetch new travel class data!");
        }

        return travelClass;
      })
      .then(() => {
        navigate("/admin/dashboard/travel-class/list", {
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
          <div className="card-travel-class-value">
            <h1 className="h5">Add new travel class</h1>
          </div>
          <div className="card-text">
            {errorMessage && (
              <div className="alert alert-danger mb-3">{errorMessage}</div>
            )}

            <div className="form-group mb-3">
              <label>Travel class name</label>
              <div className="input-group">
                <select
                  className="form-select form-select-sm"
                  value={formState.travelClassName}
                  onChange={(e) =>
                    dispatchFormStateAction({
                      type: "addTravelClassForm/setTravelClassName",
                      value: e.target.value as "Business" | "Economy",
                    })
                  }
                >
                  <option value={"Business"}>Business</option>
                  <option value={"Economy"}>Economy</option>
                </select>
              </div>
            </div>

            <div className="form-group mb-3">
              <label>Travel class name</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={formState.travelClassSubname}
                  onChange={(e) =>
                    dispatchFormStateAction({
                      type: "addTravelClassForm/setTravelClassSubname",
                      value: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <button className="btn btn-primary" onClick={doAddTravelClass}>
                <FontAwesomeIcon icon={faSave} />
                &nbsp;Add travel class
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
