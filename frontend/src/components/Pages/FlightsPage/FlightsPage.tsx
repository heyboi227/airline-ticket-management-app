import "./FlightsPage.scss";
import { useLocation, useNavigate } from "react-router-dom";
import Flight from "../../../models/Flight.model";
import {
  checkForDayDifference,
  formatTime,
  subtractTime,
  convertDateToMySqlDateTime,
} from "../../../helpers/helpers";
import smallLogo from "../../../static/air-soko-logo-small.png";
import DashedArrow from "../../Shapes/DashedArrow/DashedArrow";
import Config from "../../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretSquareDown } from "@fortawesome/free-regular-svg-icons";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container, Tab, Tabs } from "react-bootstrap";
import { api } from "../../../api/api";
import { Circles } from "react-loader-spinner";
import "./transitions.css";
import "./tabs-transition.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import LoadingScreen from "../../LoadingScreen/LoadingScreen";

interface FlightRowProps {
  flight: Flight;
  handleToggleEconomy?: () => void;
  handleToggleBusiness?: () => void;
}

interface FlightRowWithPricesProps {
  flight: Flight;
  flightDirection: string;
  setFlightDirection: React.Dispatch<React.SetStateAction<string>>;
  chooseFlightText: string;
  setChooseFlightText: React.Dispatch<React.SetStateAction<string>>;
  chosenDate: Date;
  setChosenDate: React.Dispatch<React.SetStateAction<Date>>;
  departFlight: Flight | undefined;
  setDepartFlight: React.Dispatch<React.SetStateAction<Flight | undefined>>;
  returnFlight: Flight | undefined;
  setReturnFlight: React.Dispatch<React.SetStateAction<Flight | undefined>>;
  selectedDepartureTravelClass: string;
  setSelectedDepartureTravelClass: React.Dispatch<React.SetStateAction<string>>;
  selectedReturnTravelClass: string;
  setSelectedReturnTravelClass: React.Dispatch<React.SetStateAction<string>>;
  selectedDeparturePrice: number;
  setSelectedDeparturePrice: React.Dispatch<React.SetStateAction<number>>;
  selectedReturnPrice: number;
  setSelectedReturnPrice: React.Dispatch<React.SetStateAction<number>>;
  areFlightsSelected: boolean;
  setAreFlightsSelected: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ClassPricesProps {
  travelClassName: string;
  visibility: boolean;
  flightRowWithPricesProps: FlightRowWithPricesProps;
}

interface ClassPricesDrawerProps {
  travelClassName: string;
  flight: Flight;
  handleToggle: (() => void) | undefined;
}

interface TabTitleProps {
  title: string;
}

const TabTitle = (props: TabTitleProps) => {
  return (
    <div
      style={{
        whiteSpace: "pre-wrap",
        lineHeight: "1.2",
        width: "107px",
      }}
    >
      {props.title}
    </div>
  );
};

function ClassPricesDrawer(props: Readonly<ClassPricesDrawerProps>) {
  const [isOpenPricesHovered, setIsOpenPricesHovered] =
    useState<boolean>(false);

  const handleMouseEnter = () => {
    setIsOpenPricesHovered(true);
  };

  const handleMouseLeave = () => {
    setIsOpenPricesHovered(false);
  };

  return (
    <div className="card" style={{ width: "max-content" }}>
      <div className="card-body mt-3 d-flex flex-column justify-content-start align-items-center">
        <h2 className="card-title">{props.travelClassName}</h2>
        {props.flight.travelClasses?.filter((travelClass) =>
          travelClass.travelClass.travelClassName.includes(
            props.travelClassName
          )
        ).length !== 0 ? (
          <p className="card-text">
            From{" "}
            <span style={{ fontSize: "1.5vw" }}>
              {props.flight.travelClasses
                ?.filter((travelClass) =>
                  travelClass.travelClass.travelClassName.includes(
                    props.travelClassName
                  )
                )
                .map((travelClass) => travelClass.price)
                .reduce((smallestPrice: number, currentPrice: number) => {
                  return currentPrice < smallestPrice
                    ? currentPrice
                    : smallestPrice;
                }, Infinity)}{" "}
              RSD
            </span>
            &nbsp;/ person
          </p>
        ) : (
          <p>N/A</p>
        )}
      </div>
      <button
        className={`card-footer text-bg-primary d-flex justify-content-center open-prices ${
          isOpenPricesHovered ? "hover-background" : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={props.handleToggle}
      >
        <FontAwesomeIcon icon={faCaretSquareDown} style={{ fontSize: "2vw" }} />
      </button>
    </div>
  );
}

const ClassPrices = (props: ClassPricesProps) => {
  const [selectPriceHoveredIndex, setSelectPriceHoveredIndex] = useState<
    number | null
  >(null);

  const handleMouseEnter = (index: number) => {
    setSelectPriceHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setSelectPriceHoveredIndex(null);
  };

  const location = useLocation();

  const formData = location.state;

  const renderTextForSubTravelClasses = (subTravelClass: string) => {
    switch (subTravelClass) {
      case "Basic Economy":
        return (
          <div>
            <p>Standard pitch reclination</p>
            <p>Complimentary beverage service, meal available for purchase</p>
            <p>
              Overhead bin space available on first-come, first-served basis
            </p>
            <p>
              A piece of carry-on baggage included, checked baggage is available
              for a fee
            </p>
            <p>A fee for seat selection and priority boarding</p>
          </div>
        );
      case "Economy":
        return (
          <div>
            <p>Increased seat pitch reclination</p>
            <p>
              Complimentary in-flight entertainment (subject for availability)
            </p>
            <p>Complimentary meal and beverage service</p>
            <p>One free checked bag included</p>
            <p>Free seat selection</p>
          </div>
        );
      case "Economy+":
        return (
          <div>
            <p>Extra legroom</p>
            <p>Dedicated overhead bin space</p>
            <p>Upgraded meal services and free alcoholic beverages</p>
            <p>Two free checked bags included</p>
            <p>Free seat selection</p>
          </div>
        );
      case "Business":
        return (
          <div>
            <p>
              Fully-flat seats, or spacious recliners with ample legroom, based
              on availability
            </p>
            <p>Priority check-in, boarding and baggage handling</p>
            <p>
              Access to exclusive airport or our personalized{" "}
              <strong>SokoRest&trade;</strong> lounges
            </p>
            <p>
              Personalized in-flight service, including gourmet meals, premium
              beverages, wide selection of in-flight entertainment
            </p>
            <p>Two free checked bags included</p>
            <p>Priority seat selection</p>
          </div>
        );
      case "Business+":
        return (
          <div>
            <p>
              Access to premium <strong>SokoRest&trade;</strong> with additional
              amenities such as spa services and private rooms
            </p>
            <p>
              Personalized in-flight service with an expanded gourmet menu,
              including meals designed by renowned chefs and a wider selection
              of premium wines and spirits
            </p>
            <p>Three free checked bags included</p>
            <p>
              Priority seat selection with the option to pre-book specific
              suites or seats
            </p>
            <p>Complimentary high-speed Wi-Fi throughout the flight</p>
          </div>
        );
      default:
        return "";
    }
  };

  return (
    <div
      className={
        props.visibility ? "class-prices-visible my-5" : "class-prices-hidden"
      }
    >
      <AnimatePresence>
        {props.visibility && (
          <motion.div
            className="d-flex g-3 flex-row justify-content-center align-items-center"
            initial={{
              position: "relative",
              top: 20,
              scale: 0.95,
              height: 0,
              opacity: 0,
            }}
            animate={{
              top: 0,
              scale: 1,
              opacity: 1,
              height: "auto",
            }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
            }}
          >
            {props.flightRowWithPricesProps.flight.travelClasses
              ?.filter((travelClass) =>
                travelClass.travelClass.travelClassName.includes(
                  props.travelClassName
                )
              )
              .map((travelClass, index) => (
                <div
                  className="card"
                  style={{ width: "25rem", height: "32vw" }}
                  key={travelClass.travelClass.travelClassId}
                >
                  <div
                    className="card-body mt-3 d-flex flex-column justify-content-start align-items-center"
                    style={{ position: "relative" }}
                  >
                    <h2 className="card-title">
                      {travelClass.travelClass.travelClassSubname}
                    </h2>
                    <div className="card-text">
                      {renderTextForSubTravelClasses(
                        travelClass.travelClass.travelClassSubname
                      )}
                      <div
                        style={{ position: "absolute", bottom: 0 }}
                        className="d-flex flex-column justify-content-center align-items-start"
                      >
                        <h1 className="mb-3">{travelClass.price} RSD</h1>
                        {formData.numberOfPassengers > 1 && (
                          <h4>
                            Total price:{" "}
                            {parseFloat(
                              (
                                travelClass.price * formData.numberOfPassengers
                              ).toFixed(2)
                            )}{" "}
                            RSD
                          </h4>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    className={`card-footer text-bg-primary d-flex justify-content-center select-price ${
                      selectPriceHoveredIndex === index
                        ? "hover-background"
                        : ""
                    }`}
                    onClick={() => {
                      if (
                        props.flightRowWithPricesProps.flightDirection.includes(
                          "departure"
                        )
                      ) {
                        props.flightRowWithPricesProps.setDepartFlight(
                          props.flightRowWithPricesProps.flight
                        );
                        props.flightRowWithPricesProps.setSelectedDepartureTravelClass(
                          travelClass.travelClass.travelClassSubname
                        );
                        props.flightRowWithPricesProps.setSelectedDeparturePrice(
                          travelClass.price
                        );
                        if (!formData.isRoundtrip) {
                          props.flightRowWithPricesProps.setAreFlightsSelected(
                            true
                          );
                        } else {
                          props.flightRowWithPricesProps.setChosenDate(
                            new Date(formData.returnDate)
                          );
                          props.flightRowWithPricesProps.setFlightDirection(
                            "return"
                          );
                          props.flightRowWithPricesProps.setChooseFlightText(
                            "Choose your return flight"
                          );
                        }
                      } else {
                        props.flightRowWithPricesProps.setReturnFlight(
                          props.flightRowWithPricesProps.flight
                        );
                        props.flightRowWithPricesProps.setSelectedReturnTravelClass(
                          travelClass.travelClass.travelClassSubname
                        );
                        props.flightRowWithPricesProps.setSelectedReturnPrice(
                          travelClass.price
                        );
                        props.flightRowWithPricesProps.setAreFlightsSelected(
                          true
                        );
                      }
                    }}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    Select
                  </button>
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function FlightDetails(props: Readonly<FlightRowProps>) {
  return (
    <>
      <div className="card-body d-flex flex-row justify-content-between w-100 my-0 mx-auto align-items-center">
        <div
          className="d-flex flex-column justify-content-center align-items-start"
          style={{ width: "10vw" }}
        >
          <span>Departure</span>
          <h3>
            {formatTime(
              new Date(props.flight.departureDateAndTime),
              props.flight.originAirport?.timeZone?.timeZoneName!
            )}
          </h3>
          <h5>{props.flight.originAirport?.airportCode}</h5>
        </div>
        <div className="d-flex flex-column align-items-center mt-3">
          <DashedArrow />
          <p>
            Duration:{" "}
            {subtractTime(
              formatTime(
                new Date(props.flight.departureDateAndTime),
                Config.LOCAL_TIME_ZONE
              ),
              formatTime(
                new Date(props.flight.arrivalDateAndTime),
                Config.LOCAL_TIME_ZONE
              ),
              new Date(props.flight.departureDateAndTime),
              new Date(props.flight.arrivalDateAndTime)
            )}
          </p>
        </div>
        <div
          className="d-flex flex-column justify-content-center align-items-end"
          style={{ width: "10vw" }}
        >
          <span>Arrival</span>
          <div className="d-flex flex-row justify-content-center align-items-center">
            <h3>
              {formatTime(
                new Date(props.flight.arrivalDateAndTime),
                props.flight.destinationAirport?.timeZone?.timeZoneName!
              )}
            </h3>
            <small>
              {checkForDayDifference(
                new Date(props.flight.departureDateAndTime),
                new Date(props.flight.arrivalDateAndTime),
                props.flight.originAirport?.timeZone?.timeZoneName!,
                props.flight.destinationAirport?.timeZone?.timeZoneName!
              )}
            </small>
          </div>
          <h5>{props.flight.destinationAirport?.airportCode}</h5>
        </div>
      </div>
      <div
        className="d-flex flex-row justify-content-start align-items-center"
        style={{ width: "10vw" }}
      >
        <img
          src={smallLogo}
          alt="The logo of Air Soko, without the fontface"
          style={{ width: "2vw", borderRadius: "15px" }}
          className="me-2"
        />
        <span>{props.flight.flightCode}</span>
      </div>
      <span>{props.flight.aircraft?.aircraftName}</span>
    </>
  );
}

export function FlightRowWithoutPrices(
  flightRowProps: Readonly<FlightRowProps>
) {
  return <FlightDetails flight={flightRowProps.flight} />;
}

function FlightRow(props: Readonly<FlightRowProps>) {
  const classConfig = [
    { className: "Economy", handler: props.handleToggleEconomy },
    { className: "Business", handler: props.handleToggleBusiness },
  ];

  return (
    <div className="container-fluid d-flex flex-row my-5">
      <div className="card p-3 w-50 p-3">
        <FlightDetails flight={props.flight} />
      </div>
      {classConfig.map((config) => (
        <ClassPricesDrawer
          key={config.className}
          travelClassName={config.className}
          flight={props.flight}
          handleToggle={config.handler}
        />
      ))}
    </div>
  );
}

function FlightRowWithPrices(props: Readonly<FlightRowWithPricesProps>) {
  const [isEconomyVisible, setIsEconomyVisible] = useState<boolean>(false);
  const [isBusinessVisible, setIsBusinessVisible] = useState<boolean>(false);

  const nodeRef = React.useRef(null);

  return (
    <>
      <FlightRow
        flight={props.flight}
        handleToggleEconomy={() => {
          if (isBusinessVisible) setIsBusinessVisible(false);
          setIsEconomyVisible(!isEconomyVisible);
        }}
        handleToggleBusiness={() => {
          if (isEconomyVisible) setIsEconomyVisible(false);
          setIsBusinessVisible(!isBusinessVisible);
        }}
      />
      <TransitionGroup component={null}>
        {isEconomyVisible && (
          <CSSTransition
            nodeRef={nodeRef}
            classNames={"row-transition"}
            timeout={300}
          >
            <div ref={nodeRef}>
              <ClassPrices
                travelClassName="Economy"
                visibility={isEconomyVisible}
                flightRowWithPricesProps={props}
              />
            </div>
          </CSSTransition>
        )}
        {isBusinessVisible && (
          <CSSTransition
            nodeRef={nodeRef}
            classNames={"row-transition"}
            timeout={300}
          >
            <div ref={nodeRef}>
              <ClassPrices
                travelClassName="Business"
                visibility={isBusinessVisible}
                flightRowWithPricesProps={props}
              />
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </>
  );
}

export const isTodayTabDisabled = (flightData: Flight[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysFlights = flightData.filter(
    (flight) =>
      new Date(flight.departureDateAndTime).toDateString() ===
      today.toDateString()
  );

  if (todaysFlights.length === 0) return true;

  const lastFlightTime = new Date(
    Math.max(
      ...todaysFlights.map((flight) =>
        new Date(flight.departureDateAndTime).getTime()
      )
    )
  );

  return new Date() > lastFlightTime;
};

export default function FlightsPage() {
  const location = useLocation();
  const formData = location.state;

  const [flightData, setFlightData] = useState<Flight[]>(
    formData.flightData || null
  );

  const [flightDirection, setFlightDirection] = useState<string>("departure");

  const [chooseFlightText, setChooseFlightText] = useState<string>(
    "Choose your departure flight"
  );

  const [departFlight, setDepartFlight] = useState<Flight | undefined>(
    undefined
  );
  const [returnFlight, setReturnFlight] = useState<Flight | undefined>(
    undefined
  );

  const [selectedDepartureTravelClass, setSelectedDepartureTravelClass] =
    useState<string>("");
  const [selectedReturnTravelClass, setSelectedReturnTravelClass] =
    useState<string>("");

  const [selectedDeparturePrice, setSelectedDeparturePrice] =
    useState<number>(0);
  const [selectedReturnPrice, setSelectedReturnPrice] = useState<number>(0);

  const [areFlightsSelected, setAreFlightsSelected] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingStyle, setLoadingStyle] = useState<Object>({ opacity: 1 });
  const [contentStyle, setContentStyle] = useState<Object>({});

  const [error, setError] = useState<string>("");

  const [chosenDate, setChosenDate] = useState<Date>(
    new Date(formData.departureDate)
  );

  const handleChosenDateChange = (date: Date) => {
    setChosenDate(date);
  };

  useEffect(() => {
    if (chosenDate) {
      const formattedDate = formatDate(chosenDate);
      setActiveTab(formattedDate);
    }
  }, [chosenDate]);

  const [dateRange, setDateRange] = useState<Date[]>([]);

  useEffect(() => {
    const dates: Date[] = [];
    const currentDate = chosenDate;
    for (let i = -3; i <= 3; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    setDateRange(dates);
  }, [chosenDate]);

  useEffect(() => {
    async function fetchData(directionDate: string) {
      setIsLoading(true);
      let originAirportId: number, destinationAirportId: number;

      originAirportId = formData.originAirportId;
      destinationAirportId = formData.destinationAirportId;

      if (formData.isRoundtrip) {
        if (flightDirection !== "departure") {
          originAirportId = formData.destinationAirportId;
          destinationAirportId = formData.originAirportId;
        }
      }

      const formattedDate = convertDateToMySqlDateTime(
        new Date(directionDate)
      ).slice(0, 10);

      const flightDataResponse = await api(
        "post",
        "/api/flight/search",
        "user",
        {
          originAirportId,
          destinationAirportId,
          flightDate: formattedDate,
        }
      );

      if (flightDataResponse.status !== "ok") {
        throw new Error(
          "Could not fetch the flights. Reason: " +
            JSON.stringify(flightDataResponse.data)
        );
      }

      setFlightData(flightDataResponse.data);

      if (flightDataResponse.data.length !== 0) {
        setTimeout(() => {
          setLoadingStyle({ opacity: 0 });
          setTimeout(() => setIsLoading(false), 300);
        }, 3000);
      } else {
        setIsLoading(false);
      }
    }

    fetchData(chosenDate.toDateString()).catch((error) => {
      setError(error?.message ?? "Could not fetch the flights.");

      setTimeout(() => {
        setError("");
      }, 3500);
    });
  }, [chosenDate, flightDirection, formData]);

  useEffect(() => {
    if (!isLoading) {
      setContentStyle({
        opacity: 0,
        transform: "translateY(-10px)",
        height: "auto",
      });
      setTimeout(() => {
        setContentStyle({
          opacity: 1,
          transform: "translateY(0)",
          height: "max-content",
        });
      }, 100);
    } else {
      setLoadingStyle({
        opacity: 1,
      });
    }
  }, [isLoading]);

  const buildApiRequestData = (
    flightDirection: string,
    locationState: any,
    flightDate: string
  ) => ({
    originAirportId:
      flightDirection === "departure"
        ? locationState.originAirportId
        : locationState.destinationAirportId,
    destinationAirportId:
      flightDirection === "departure"
        ? locationState.destinationAirportId
        : locationState.originAirportId,
    flightDate: convertDateToMySqlDateTime(new Date(flightDate)).slice(0, 10),
  });

  const findLowestPriceInFlight = (flight: Flight) => {
    const minPriceInFlight = flight.travelClasses?.reduce(
      (minClassPrice, travelClass) => {
        return Math.min(minClassPrice, travelClass.price);
      },
      Infinity
    );
    return minPriceInFlight;
  };

  useEffect(() => localStorage.removeItem("randomNumber"), []);

  useEffect(() => {
    const findLowestPrice = (flights: Flight[]) => {
      const lowestPrice = flights.reduce((minPrice, flight) => {
        return Math.min(minPrice, findLowestPriceInFlight(flight)!);
      }, Infinity);

      return lowestPrice;
    };

    const getMinimalPrice = async (
      flightDate: string,
      flightDirection: string
    ): Promise<number> => {
      try {
        const res = await api(
          "post",
          "/api/flight/search",
          "user",
          buildApiRequestData(flightDirection, formData, flightDate)
        );

        if (res.status !== "ok") {
          throw new Error(
            "Prices could not be obtained: Reason: " + JSON.stringify(res.data)
          );
        }

        const flights = res.data as Flight[];

        if (
          flights.length === 0 ||
          flights.every((flight) =>
            flight.travelClasses?.every((travelClass) => !travelClass.isActive)
          )
        ) {
          return 0;
        }

        return findLowestPrice(flights);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message ?? "Could not retrieve the prices.");
        } else {
          setError("Could not retrieve the prices.");
        }

        setTimeout(() => {
          setError("");
        }, 3500);

        return -1;
      }
    };

    async function updateMinimalPrices() {
      const pricesPromises = dateRange.map((date) =>
        getMinimalPrice(convertDateToMySqlDateTime(date), flightDirection)
      );
      const prices = await Promise.all(pricesPromises);
      setMinimalPrices(prices);
    }

    updateMinimalPrices().catch((error) =>
      console.error("An error occured: ", error)
    );
  }, [chosenDate, dateRange, flightDirection, formData]);

  const currentDate = new Date(formData.departureDate);

  const [activeTab, setActiveTab] = useState<string>(
    currentDate.toDateString()
  );

  const formatDate = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const [minimalPrices, setMinimalPrices] = useState<number[]>([]);

  const navigate = useNavigate();

  const handleTabSelect = (key: string | null) => {
    if (key) {
      setActiveTab(key);
    }
  };

  const today: Date = new Date();

  return (
    <Container>
      <LoadingScreen loadingTime={2000} loadingLogoImage={undefined} />
      <Tabs
        activeKey={activeTab}
        className="d-flex flex-row justify-content-center align-items-center"
        onSelect={(key) => {
          handleTabSelect(key);
          if (key) handleChosenDateChange(new Date(key));
        }}
      >
        {dateRange.map((date, index) => {
          const formattedDate = formatDate(date);
          const minimalPrice = minimalPrices[index];

          const isBeforeToday = (date1: Date, date2: Date) => {
            return (
              date1.getFullYear() < date2.getFullYear() ||
              (date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() < date2.getMonth()) ||
              (date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() < date2.getDate())
            );
          };

          const isDisabled = isBeforeToday(date, today);

          return (
            <Tab
              key={formattedDate}
              eventKey={formattedDate}
              title={
                <TabTitle
                  title={
                    !(
                      isDisabled ||
                      (formattedDate === formatDate(new Date()) &&
                        isTodayTabDisabled(flightData))
                    )
                      ? `${formattedDate} ${minimalPrice} RSD`
                      : `${formattedDate}`
                  }
                ></TabTitle>
              }
              disabled={
                isDisabled ||
                (formattedDate === formatDate(new Date()) &&
                  isTodayTabDisabled(flightData))
              }
            >
              <div className="d-flex flex-row justify-content-center align-items-center mt-2">
                {departFlight && (
                  <div className="d-flex flex-column flex-fill justify-content-center align-items-start">
                    <p>
                      Selected departure flight:{" "}
                      {departFlight.departureDateAndTime.slice(0, 10)}
                    </p>
                    <div className="container-fluid d-flex flex-row">
                      <div className="card p-3">
                        <FlightRowWithoutPrices flight={departFlight} />
                        <h2 className="text-end">
                          {selectedDeparturePrice * formData.numberOfPassengers}{" "}
                          RSD
                        </h2>
                      </div>
                    </div>
                  </div>
                )}
                {returnFlight && (
                  <div className="d-flex flex-column flex-fill justify-content-center align-items-start">
                    <p>
                      Selected return flight:{" "}
                      {returnFlight.departureDateAndTime.slice(0, 10)}
                    </p>
                    <div className="container-fluid d-flex flex-row">
                      <div className="card p-3">
                        <FlightRowWithoutPrices flight={returnFlight} />
                        <h2 className="text-end">
                          {selectedReturnPrice * formData.numberOfPassengers}{" "}
                          RSD
                        </h2>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {(selectedDeparturePrice !== 0 || selectedReturnPrice !== 0) && (
                <div className="d-flex flex-column justify-content-center align-items-end mt-5">
                  <h2>
                    Price:{" "}
                    {(
                      (Number(selectedDeparturePrice) +
                        Number(selectedReturnPrice)) *
                      formData.numberOfPassengers
                    ).toFixed(2)}{" "}
                    RSD
                  </h2>
                  <small>Including taxes + airport fees</small>
                </div>
              )}
              {!areFlightsSelected && (
                <div className="d-flex flex-row justify-content-center align-items-center mt-5">
                  {error && <h2 className="text-bg-warning">{error}</h2>}
                  {!isLoading && flightData.length === 0 && (
                    <h2 className="fade" style={contentStyle}>
                      There are no flights for the specified {flightDirection}{" "}
                      date. Please choose another one.
                    </h2>
                  )}
                  {!isLoading && flightData.length !== 0 && (
                    <h2 className="fade" style={contentStyle}>
                      {chooseFlightText}
                    </h2>
                  )}
                </div>
              )}
              {areFlightsSelected && (
                <div className="d-flex flex-row justify-content-end align-items-center">
                  <button
                    className="btn btn-lg btn-primary mb-3"
                    onClick={() => {
                      navigate("/order", {
                        replace: true,
                        state: {
                          departFlight: departFlight,
                          returnFlight: returnFlight,
                          departureTravelClass: selectedDepartureTravelClass,
                          returnTravelClass: selectedReturnTravelClass,
                          departurePrice:
                            selectedDeparturePrice *
                            formData.numberOfPassengers,
                          returnPrice:
                            selectedReturnPrice * formData.numberOfPassengers,
                          totalPrice: parseFloat(
                            (
                              (Number(selectedDeparturePrice) +
                                Number(selectedReturnPrice)) *
                              formData.numberOfPassengers
                            ).toFixed(2)
                          ),
                          isRoundtrip: formData.isRoundtrip,
                          numberOfPassengers: formData.numberOfPassengers,
                        },
                      });
                    }}
                  >
                    Enter passenger details
                  </button>
                </div>
              )}
              {!areFlightsSelected && (
                <div>
                  {isLoading && (
                    <div
                      className="fade d-flex justify-content-center align-items-center mb-5"
                      style={loadingStyle}
                    >
                      <Circles color="#0718c4" height={40} width={40} />
                    </div>
                  )}
                  {!isLoading && (
                    <div className="fade" style={contentStyle}>
                      {flightData
                        .filter((flight) => flight.travelClasses?.length !== 0)
                        .map((flight) => (
                          <FlightRowWithPrices
                            flight={flight}
                            key={flight.flightId}
                            setFlightDirection={setFlightDirection}
                            setChooseFlightText={setChooseFlightText}
                            setChosenDate={setChosenDate}
                            flightDirection={flightDirection}
                            chooseFlightText={chooseFlightText}
                            chosenDate={chosenDate}
                            departFlight={departFlight}
                            setDepartFlight={setDepartFlight}
                            returnFlight={returnFlight}
                            setReturnFlight={setReturnFlight}
                            selectedDeparturePrice={selectedDeparturePrice}
                            setSelectedDeparturePrice={
                              setSelectedDeparturePrice
                            }
                            selectedReturnPrice={selectedReturnPrice}
                            setSelectedReturnPrice={setSelectedReturnPrice}
                            areFlightsSelected={areFlightsSelected}
                            setAreFlightsSelected={setAreFlightsSelected}
                            selectedDepartureTravelClass={
                              selectedDepartureTravelClass
                            }
                            setSelectedDepartureTravelClass={
                              setSelectedDepartureTravelClass
                            }
                            selectedReturnTravelClass={
                              selectedReturnTravelClass
                            }
                            setSelectedReturnTravelClass={
                              setSelectedReturnTravelClass
                            }
                          />
                        ))}
                    </div>
                  )}
                </div>
              )}
            </Tab>
          );
        })}
      </Tabs>
    </Container>
  );
}
