import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { srLatn } from "date-fns/locale";
import DocumentModel from "../../../../../backend/dist/components/document/DocumentModel.model";
import { api } from "../../../api/api";
import AppStore from "../../../stores/AppStore";
import { Random, MersenneTwister19937 } from "random-js";

export default function OrderPage() {
  const location = useLocation();
  const flights = location.state;

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());
  const [userDocumentId, setUserDocumentId] = useState<number>(0);

  const [documentType, setDocumentType] = useState<string>("");
  const [documentNumber, setDocumentNumber] = useState<string>("");

  const [userDocuments, setUserDocuments] = useState<DocumentModel[]>([]);

  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const random = new Random(MersenneTwister19937.autoSeed());

  function loadUserDocuments() {
    if (AppStore.getState().auth.id !== 0) {
      setLoggedIn(true);

      api("get", "/api/document/user/" + AppStore.getState().auth.id, "user")
        .then((res) => {
          if (res.status === "error") {
            return setErrorMessage(res.data + "");
          }

          setUserDocuments(res.data);
        })
        .catch((error) => {
          console.error("An error occured: ", error);
        });
    }
  }

  useEffect(loadUserDocuments, []);

  return (
    <>
      <div className="row">
        <div className="col col-xs-12 col-md-4 p-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Passenger's first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Passenger's last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group mb-3">
              <label>Date of birth</label>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={srLatn}
              >
                <DateTimePicker
                  label={"Pick a date and time"}
                  value={dateOfBirth}
                  onChange={(e) => {
                    if (e) setDateOfBirth(e);
                  }}
                  className="form-control"
                ></DateTimePicker>
              </LocalizationProvider>
            </div>
            {!loggedIn && (
              <div className="form-group mb-3">
                <div className="input-group">
                  <select
                    className="form-control"
                    placeholder="Document type"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                  >
                    <option value={""}>Choose a document type</option>
                    <option value={"National ID"}>National ID</option>
                    <option value={"Passport"}>Passport</option>
                  </select>
                </div>
                <div className="input-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Document number"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                  />
                </div>
              </div>
            )}
            {loggedIn && (
              <div className="form-group mb-3">
                <div className="input-group">
                  <select
                    className="form-select"
                    value={userDocumentId}
                    onChange={(e) => setUserDocumentId(+e.target.value)}
                  >
                    {userDocuments.map((document) => (
                      <option
                        value={document.documentId}
                        key={document.documentId}
                      >{`${document.documentType} - ${
                        document.documentNumber
                      } (${document.country!.countryName})`}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </form>
        </div>
        <div className="col col-xs-12 col-md-4 p-5">
          <span>
            Ticket price:{" "}
            {flights.totalPrice -
              random.integer(
                flights.totalPrice * 0.05,
                flights.totalPrice * 0.1
              )}{" "}
            RSD
          </span>
          <span>Total price: {flights.totalPrice} RSD</span>
        </div>
      </div>
      <span>{errorMessage}</span>
    </>
  );
}
