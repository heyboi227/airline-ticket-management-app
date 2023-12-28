import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FlightRowWithoutPrices } from "../FlightsPage/FlightsPage";
import Country from "../../../models/Country.model";
import { api } from "../../../api/api";
import Config from "../../../config";
import { debounce } from "lodash";
import { useRandomNumber } from "../OrderPage/OrderPage";
import "./BillingPage.css";
import AppStore from "../../../stores/AppStore";
import {
  generateRandomTicketNumberFormattedString,
  generateRandomBookingConfirmationFormattedString,
  generateRandomSeat,
} from "../../../helpers/generators";
import User from "../../../models/User.model";
import Address from "../../../models/Address.model";

interface InputProps {
  id: string;
  placeholder: string;
}

interface CountryInputProps {
  onValueChange: (value: string) => void;
}

type CombinedCountryProps = InputProps & CountryInputProps;

function CountryInput({
  id,
  placeholder,
  onValueChange,
}: CombinedCountryProps) {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Country[]>([]);
  const [queryDone, setQueryDone] = useState<boolean>(false);

  const fetchResults = async (searchQuery: string) => {
    const response = await api(
      "get",
      Config.API_PATH + `/api/country/search/${searchQuery}`,
      "user",
      false
    );
    setResults(response.data);
  };

  useEffect(() => {
    const debouncedFetchResults = debounce(fetchResults, 300);

    if (query) {
      debouncedFetchResults(query)?.catch((error) =>
        console.error("An error occured: ", error)
      );
    } else {
      setResults([]);
    }
  }, [query]);

  const handleClick = (result: Country) => {
    setQuery(result.countryName);

    const countryName = result.countryName;
    onValueChange(countryName);

    setQueryDone(true);
  };

  return (
    <>
      <div className="input-group">
        <input
          placeholder={placeholder}
          className="form-control"
          type="text"
          required
          onChange={(e) => {
            const value = e.target.value;
            setQuery(e.target.value);

            if (results.some((result) => result.countryName === value)) {
              setQueryDone(true);
            } else {
              setQueryDone(false);
            }
          }}
          id={id}
          value={query}
        />
        <div className="invalid-feedback">Please enter your country.</div>
      </div>
      <div style={{ position: "absolute", zIndex: 5 }}>
        {results.length > 0 && !queryDone && (
          <ul className="list-group">
            {results.map((result) => (
              <li
                key={result.countryId}
                tabIndex={0}
                className="list-group-item"
                onClick={() => handleClick(result)}
                onKeyUp={() => handleClick(result)}
              >
                {result.countryName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default function BillingPage() {
  const location = useLocation();
  const formData = location.state;

  const [cardHolderFirstName, setCardHolderFirstName] = useState<string>("");
  const [cardHolderLastName, setCardHolderLastName] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiryMonth, setExpiryMonth] = useState<string>("");
  const [expiryYear, setExpiryYear] = useState<string>("");
  const [cvcCode, setCvcCode] = useState<string>("");

  const [streetAndNumber, setStreetAndNumber] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [selectedCountryName, setSelectedCountryName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const [selectedAddressId, setSelectedAddressId] = useState<number>(0);

  const [userAddresses, setUserAddresses] = useState<Address[]>([]);

  const [passengers, setPassengers] = useState<any[]>(
    formData.passengers.map((passenger: any) => ({
      ...passenger,
      departSeat: "",
      returnSeat: "",
    }))
  );

  const [errorMessage, setErrorMessage] = useState<string>("");

  const taxesAndFeesPrice = useRandomNumber();

  const basePrice = formData.flightDetails.totalPrice - taxesAndFeesPrice;

  let bookingNumber: string = "";

  const navigate = useNavigate();

  const formRef = useRef<HTMLFormElement | null>(null);

  const [isValid, setIsValid] = useState<boolean>(true);

  function loadUserAddresses() {
    api("get", "/api/user/" + AppStore.getState().auth.id, "user")
      .then((res) => {
        if (res.status === "error") {
          return setErrorMessage(res.data + "");
        }

        return res.data;
      })
      .then((user: User) => {
        setUserAddresses(user.addresses);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  const handlePassengerUpdate = (index: number, field: string, value: any) => {
    setPassengers((current) =>
      current.map((passenger, i) =>
        i === index ? { ...passenger, [field]: value } : passenger
      )
    );
  };

  const handleSelectedCountryNameChange = (newSelectedCountryName: string) => {
    setSelectedCountryName(newSelectedCountryName);
  };

  const cardNumberRef = useRef<HTMLInputElement>(null);
  const expiryMonthRef = useRef<HTMLInputElement>(null);
  const expiryYearRef = useRef<HTMLInputElement>(null);
  const cvcCodeRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length >= e.target.maxLength) {
      switch (e.target.placeholder) {
        case "Card number":
          expiryMonthRef.current?.focus();
          break;
        case "Card expiry month":
          expiryYearRef.current?.focus();
          break;
        case "Card expiry year":
          cvcCodeRef.current?.focus();
          break;
        case "CVC code":
          addressRef.current?.focus();
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    const generateSeats = async () => {
      passengers.forEach(async (_passenger, index) => {
        const departSeat = await generateRandomSeat(
          formData.flightDetails.departFlight.flightId
        );
        handlePassengerUpdate(index, "departSeat", departSeat);

        if (formData.flightDetails.returnFlight) {
          const returnSeat = await generateRandomSeat(
            formData.flightDetails.returnFlight.flightId
          );
          handlePassengerUpdate(index, "returnSeat", returnSeat);
        }
      });
    };

    generateSeats();
  }, [
    formData.flightDetails.departFlight,
    formData.flightDetails.returnFlight,
  ]);

  useEffect(() => {
    if (AppStore.getState().auth.id !== 0) setLoggedIn(true);
  }, []);

  useEffect(() => {
    if (loggedIn) {
      loadUserAddresses();
      setCardHolderFirstName(formData.passengers[0].firstName);
      setCardHolderLastName(formData.passengers[0].lastName);
    }
  }, [formData.passengers, loggedIn]);

  const doAddTicket = async () => {
    const randomBookingConfirmationFormattedString =
      generateRandomBookingConfirmationFormattedString(
        formData.flightDetails.departFlight.originAirport.airportCode
      );

    passengers.forEach(async (passenger) => {
      const randomTicketNumberFormattedString =
        generateRandomTicketNumberFormattedString();

      const ticketData = {
        ticketHolderName: passenger.firstName + " " + passenger.lastName,
        documentId:
          passenger.userDocumentId !== 0 ? passenger.userDocumentId : null,
        userId:
          AppStore.getState().auth.id !== 0
            ? AppStore.getState().auth.id
            : null,
        flightFareCode: randomBookingConfirmationFormattedString,
      };

      const generateFlights = async () => {
        const flights: any[] = [
          {
            ticketNumber: randomTicketNumberFormattedString[0],
            flightId: formData.flightDetails.departFlight.flightId,
            price: Number(formData.flightDetails.departurePrice),
            seatNumber: passenger.departSeat,
            ...ticketData,
          },
          ...(formData.flightDetails.isRoundtrip
            ? [
                {
                  ticketNumber: randomTicketNumberFormattedString[1],
                  flightId: formData.flightDetails.returnFlight.flightId,
                  price: Number(formData.flightDetails.returnPrice),
                  seatNumber: passenger.returnSeat,
                  ...ticketData,
                },
              ]
            : []),
        ];

        return flights;
      };

      const flights = await generateFlights();

      const apiCalls = flights.map(async (flight) => {
        await api("post", "/api/ticket", "user", {
          ...flight,
        });
      });

      Promise.all(apiCalls).catch((error) => {
        setErrorMessage(error?.message ?? "Could not generate the ticket(s).");

        setTimeout(() => {
          setErrorMessage("");
        }, 3500);
      });
    });
  };

  const doSendBookingEmail = () => {
    api("post", "/api/ticket/confirm-booking", "user", {
      email,
      cardHolderFirstName,
      cardHolderLastName,
      bookingNumber,
      flightDetails: {
        departFlight: formData.flightDetails.departFlight,
        ...(formData.flightDetails.returnFlight
          ? { returnFlight: formData.flightDetails.returnFlight }
          : undefined),
        departureTravelClass: formData.flightDetails.departureTravelClass,
        ...(formData.flightDetails.returnTravelClass
          ? { returnTravelClass: formData.flightDetails.returnTravelClass }
          : undefined),
        basePrice,
        taxesAndFeesPrice,
        totalPrice: formData.flightDetails.totalPrice,
      },
      passengers: passengers,
      billingAddressDetails: {
        billingAddressStreetAndNumber: streetAndNumber,
        billingAddressZipCode: zipCode,
        billingAddressCity: city,
        billingAddressCountry: selectedCountryName,
        billingAddressPhoneNumber: phoneNumber,
      },
      paymentDetails: {
        cardNumber: cardNumber.replace(/\d{1,12}/, "************"),
        paymentTimestamp: new Date().toLocaleDateString("sr", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      },
    }).catch((error) => {
      setErrorMessage(error?.message ?? "Could not send the email.");

      setTimeout(() => {
        setErrorMessage("");
      }, 3500);
    });
  };

  const doBooking = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const form = formRef.current;

    if (!form) return;

    if (form.checkValidity()) {
      setIsValid(true);

      bookingNumber = generateRandomBookingConfirmationFormattedString(
        formData.flightDetails.departFlight.originAirport.airportCode
      );
      navigate("/order/booking", {
        replace: true,
        state: {
          flightDetails: {
            bookingNumber: bookingNumber,
            departFlight: formData.flightDetails.departFlight,
            returnFlight: formData.flightDetails.isRoundtrip
              ? formData.flightDetails.returnFlight
              : undefined,
            departureTravelClass: formData.flightDetails.departureTravelClass,
            returnTravelClass: formData.flightDetails.isRoundtrip
              ? formData.flightDetails.returnTravelClass
              : undefined,
            basePrice: basePrice,
            taxesAndFeesPrice: taxesAndFeesPrice,
            totalPrice: formData.flightDetails.totalPrice,
            isRoundtrip: formData.flightDetails.isRoundtrip,
          },
          passengers: passengers,
          billingAddressDetails: {
            billingAddressStreetAndNumber: streetAndNumber,
            billingAddressZipCode: zipCode,
            billingAddressCity: city,
            billingAddressCountry: selectedCountryName,
            billingAddressPhoneNumber: phoneNumber,
          },
          paymentDetails: {
            cardNumber: cardNumber.replace(/\d{1,12}/, "************"),
            paymentTimestamp: new Date().toLocaleDateString("sr", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          },
        },
      });
      doAddTicket();
      doSendBookingEmail();
      localStorage.removeItem("randomNumber");
    } else {
      form.classList.add("was-validated");
      setIsValid(false);
    }
  };

  function setActiveAddress(userId: number, addressId: number) {
    api("get", "/api/user/" + userId, "user")
      .then((res) => {
        if (res.status === "error") {
          return setErrorMessage(res.data + "");
        }

        return res.data;
      })
      .then((user: User) => {
        return user.addresses;
      })
      .then((addresses) => {
        return addresses.find(
          (userAddress) => userAddress.addressId === addressId
        );
      })
      .then((userAddress) => {
        setSelectedAddressId(addressId);
        setStreetAndNumber(userAddress!.streetAndNumber);
        setZipCode(userAddress!.zipCode);
        setCity(userAddress!.city);
        setSelectedCountryName(userAddress!.country!.countryName);
        setPhoneNumber(userAddress!.phoneNumber);
      })
      .catch((error) => {
        console.error("An error occured: ", error);
      });
  }

  return (
    <>
      <div className="row offset-md-2 w-100">
        <div className="col col-xs-12 col-md-4 p-5 bg-light-subtle">
          <h2>Enter billing information</h2>
          <form
            ref={formRef}
            onSubmit={doBooking}
            noValidate
            className="needs-valdation"
          >
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Card holder first name"
                  value={cardHolderFirstName}
                  required
                  onChange={(e) => {
                    setCardHolderFirstName(e.target.value);
                  }}
                />
                <div className="invalid-feedback">
                  Please enter your first name.
                </div>
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Card holder last name"
                  value={cardHolderLastName}
                  required
                  onChange={(e) => {
                    setCardHolderLastName(e.target.value);
                  }}
                />
                <div className="invalid-feedback">
                  Please enter your last name.
                </div>
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Card number"
                  value={cardNumber}
                  ref={cardNumberRef}
                  required
                  maxLength={16}
                  onChange={(e) => {
                    setCardNumber(e.target.value);
                    handleInputChange(e);
                  }}
                />
                <div className="invalid-feedback">
                  Please enter your credit card number.
                </div>
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="input-group align-items-center gap-4">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Card expiry month"
                  maxLength={2}
                  value={expiryMonth}
                  required
                  ref={expiryMonthRef}
                  onChange={(e) => {
                    setExpiryMonth(e.target.value);
                    handleInputChange(e);
                  }}
                />
                /
                <input
                  className="form-control"
                  type="text"
                  placeholder="Card expiry year"
                  maxLength={2}
                  value={expiryYear}
                  required
                  ref={expiryYearRef}
                  onChange={(e) => {
                    setExpiryYear(e.target.value);
                    handleInputChange(e);
                  }}
                />
                <div className="invalid-feedback">
                  Please enter your card expiry month / year.
                </div>
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="CVC code"
                  maxLength={3}
                  value={cvcCode}
                  ref={cvcCodeRef}
                  required
                  onChange={(e) => {
                    setCvcCode(e.target.value);
                    handleInputChange(e);
                  }}
                />
                <div className="invalid-feedback">
                  Please enter your CVC code.
                </div>
              </div>
            </div>
            <br></br>
            <br></br>
            {!loggedIn && (
              <>
                <div className="form-group mb-3">
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Address"
                      value={streetAndNumber}
                      ref={addressRef}
                      required
                      onChange={(e) => setStreetAndNumber(e.target.value)}
                    />
                    <div className="invalid-feedback">
                      Please enter your address.
                    </div>
                  </div>
                </div>
                <div className="form-group mb-3">
                  <div className="input-group">
                    <input
                      className="form-control no-validation"
                      type="text"
                      placeholder="Address line 2"
                      defaultValue={""}
                      onChange={(e) =>
                        setStreetAndNumber(
                          streetAndNumber + " " + e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <div className="form-group mb-3">
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Postal code"
                      value={zipCode}
                      required
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                    <div className="invalid-feedback">
                      Please enter your postal code.
                    </div>
                  </div>
                </div>
                <div className="form-group mb-3">
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="City"
                      value={city}
                      required
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <div className="invalid-feedback">
                      Please enter your city.
                    </div>
                  </div>
                </div>
                <div className="form-group mb-3">
                  <CountryInput
                    id={"country"}
                    placeholder={"Country"}
                    onValueChange={handleSelectedCountryNameChange}
                  />
                </div>
                <div className="form-group mb-3">
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Phone number"
                      value={phoneNumber}
                      required
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <div className="invalid-feedback">
                      Please enter your phone number.
                    </div>
                  </div>
                </div>
              </>
            )}
            {loggedIn && (
              <div className="form-group mb-3">
                <div className="input-group">
                  <select
                    className="form-select"
                    value={selectedAddressId}
                    onChange={(e) =>
                      setActiveAddress(
                        AppStore.getState().auth.id,
                        +e.target.value
                      )
                    }
                  >
                    <option value={""}>Choose an address</option>
                    {userAddresses.map((address) => (
                      <option
                        value={address.addressId}
                        key={address.addressId}
                      >{`${address.streetAndNumber} ${address.zipCode} ${address.city}, ${address.country?.countryName}`}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <br></br>
            <br></br>
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Email address"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="invalid-feedback">
                  Please enter your email address.
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Book
            </button>
          </form>
        </div>
        <div className="col col-xs-12 col-md-4 p-5">
          <span>Departure flight:</span>
          <br></br>
          <FlightRowWithoutPrices
            flight={formData.flightDetails.departFlight}
          />
          <br></br>
          <br></br>
          {formData.flightDetails.returnFlight && (
            <>
              <span>Return flight:</span>
              <br></br>
              <FlightRowWithoutPrices
                flight={formData.flightDetails.returnFlight}
              />
              <br></br>
              <br></br>
            </>
          )}
          <span>
            <h5>Ticket price: {basePrice} RSD</h5>
            <h5>Taxes and fees: {taxesAndFeesPrice} RSD</h5>
          </span>
          <br></br>
          <span>
            <h2>Total price: {formData.flightDetails.totalPrice} RSD</h2>
          </span>
        </div>
      </div>
      <span>{errorMessage}</span>
    </>
  );
}
