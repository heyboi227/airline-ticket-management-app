import { faSave, faWindowClose } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import User from "../../../models/User.model";
import { motion } from "framer-motion";
import Country from "../../../models/Country.model";
import AppStore from "../../../stores/AppStore";

interface UserAddressAdderProperties {
  onAddressChange: (user: User) => void;
  onClose: () => void;
}

export default function UserAddressAdder(
  props: Readonly<UserAddressAdderProperties>
) {
  const [streetAndNumber, setStreetAndNumber] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [countryId, setCountryId] = useState<number>(0);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const [countries, setCountries] = useState<Country[]>([]);
  const [error, setError] = useState<string>("");

  function resetAndClose() {
    setStreetAndNumber("");
    setCity("");
    setPhoneNumber("");

    props.onClose();
  }

  function saveChanges() {
    const data = {
      streetAndNumber: streetAndNumber,
      zipCode: zipCode,
      city: city,
      countryId: countryId,
      phoneNumber: phoneNumber,
    };

    api("post", "/api/user/address", "user", data)
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Error adding an address. Reason: " + JSON.stringify(res.data)
          );
        }

        return res.data;
      })
      .then((address) => {
        props.onAddressChange(address.user);
      })
      .catch((error) => {
        setError(error?.message);
        setTimeout(() => setError(""), 5000);
      });
  }

  function loadCountries() {
    api("get", "/api/country", "user")
      .then((res) => {
        if (res.status === "error") {
          return setError(res.data + "");
        }

        setCountries(res.data);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  useEffect(() => loadCountries(), []);

  return (
    <motion.div
      className="row"
      initial={{
        position: "relative",
        top: 20,
        scale: 0.75,
        opacity: 0,
      }}
      animate={{
        top: 0,
        scale: 1,
        opacity: 1,
      }}
      transition={{
        delay: 0.125,
      }}
    >
      <div className="col col-10">
        <div className="row mb-3">
          <div className="col col-12 col-lg-6 form-group">
            <label>Street and number</label>
            <div className="input-group">
              <input
                className="form-control"
                value={streetAndNumber}
                onChange={(e) => setStreetAndNumber(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col col-12 col-lg-6 form-group">
            <label>ZIP code</label>
            <div className="input-group">
              <input
                className="form-control"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col col-12 col-lg-6 form-group">
            <label>City</label>
            <div className="input-group">
              <input
                className="form-control"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          <div className="col col-12 col-lg-6 form-group">
            <label>Country</label>
            <div className="input-group">
              <select
                className="form-control"
                placeholder="Country"
                value={countryId}
                required
                onChange={(e) => setCountryId(+e.target.value)}
              >
                <option value={""}>Choose the country</option>
                {countries.map((country) => (
                  <option key={country.countryId} value={country.countryId}>
                    {country.countryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col col-12 col-lg-6 form-group">
              <label>Phone number</label>
              <div className="input-group">
                <input
                  className="form-control"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="col col-12 col-lg-4 form-group">
            <div className="row mt-4">
              <div className="col col-6">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => saveChanges()}
                >
                  <FontAwesomeIcon icon={faSave} /> Save
                </button>
              </div>

              <div className="col col-6">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => resetAndClose()}
                >
                  <FontAwesomeIcon icon={faWindowClose} /> Close
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && <p className="alert alert-danger">{error}</p>}
      </div>
    </motion.div>
  );
}
