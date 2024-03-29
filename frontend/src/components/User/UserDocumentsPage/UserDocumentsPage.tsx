import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import AppStore from "../../../stores/AppStore";
import UserDocument from "../../../models/UserDocument.model";

export default function UserDocumentsPage() {
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function loadDocuments() {
    api("get", "/api/document/user/" + AppStore.getState().auth.id, "user")
      .then((res) => {
        if (res.status === "error") {
          return setErrorMessage(res.data + "");
        }

        setDocuments(res.data);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  useEffect(loadDocuments, []);

  return (
    <div>
      {errorMessage && <p className="alert aler-danger">{errorMessage}</p>}
      {!errorMessage && documents.length === 0 && (
        <p className="text-center mt-2">
          You have no documents added at the moment.
        </p>
      )}
      {!errorMessage && documents.length !== 0 && (
        <table className="table table-sm table-hover document-list">
          <thead>
            <tr>
              <th>Issuing country</th>
              <th>Document type</th>
              <th>Document number</th>
              <th>Issuing date</th>
              <th>Expiration date</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={"document-" + document.documentId}>
                <td>
                  <div className="row">
                    <span className="col col-6">
                      {document.country?.countryName}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="row">
                    <span className="col col-8">{document.documentType}</span>
                  </div>
                </td>
                <td>
                  <div className="row">
                    <span className="col col-8">{document.documentNumber}</span>
                  </div>
                </td>
                <td>
                  <div className="row">
                    <span className="col col-8">
                      {new Date(
                        document.documentIssuingDate
                      ).toLocaleDateString("sr", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="row">
                    <span className="col col-8">
                      {new Date(
                        document.documentExpirationDate
                      ).toLocaleDateString("sr", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
