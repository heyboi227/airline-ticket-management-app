import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import ICountry from "../../../models/ICountry.model";
import "./AdminList.scss";

interface IAdminCountryRowProperties {
  country: ICountry;
  loadCountry: () => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

function AdminCountryRow(props: IAdminCountryRowProperties) {
  const [editCountryNameVisible, setEditCountryNameVisible] =
    useState<boolean>(false);

  const [newCountryName, setNewCountryName] = useState<string>(
    props.country.countryName
  );

  function doEditCountryName() {
    api("put", "/api/country/" + props.country.countryId, "administrator", {
      countryName: newCountryName,
    })
      .then((res) => {
        if (res.status === "error") {
          return props.setErrorMessage(res.data + "");
        }

        props.loadCountry();
        setEditCountryNameVisible(false);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  return (
    <>
      <tr>
        <td>{props.country.countryId}</td>
        <td>
          {!editCountryNameVisible && (
            <div className="row">
              <span className="col col-4">{props.country.countryName}</span>
              <div className="col col-4">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setEditCountryNameVisible(true)}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
          {editCountryNameVisible && (
            <div>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={newCountryName}
                  onChange={(e) => setNewCountryName(e.target.value)}
                />
              </div>

              {newCountryName !== props.country.countryName && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => doEditCountryName()}
                >
                  Edit
                </button>
              )}

              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setNewCountryName(props.country.countryName);
                  setEditCountryNameVisible(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </td>
      </tr>
    </>
  );
}

export default function AdminCountryList() {
  const [country, setCountry] = useState<ICountry[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function loadCountry() {
    api("get", "/api/country", "administrator")
      .then((res) => {
        if (res.status === "error") {
          return setErrorMessage(res.data + "");
        }

        setCountry(res.data);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  useEffect(loadCountry, []);

  return (
    <div>
      {errorMessage && <p className="alert aler-danger">{errorMessage}</p>}
      {!errorMessage && (
        <table className="table table-sm table-hover country-list">
          <thead>
            <tr>
              <th>ID</th>
              <th>Country name</th>
            </tr>
          </thead>
          <tbody>
            {country.map((country) => (
              <AdminCountryRow
                key={"country" + country.countryId}
                country={country}
                loadCountry={loadCountry}
                setErrorMessage={setErrorMessage}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
