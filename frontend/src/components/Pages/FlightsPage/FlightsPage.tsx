import "./FlightsPage.scss";
import { useLocation } from "react-router-dom";
import IFlight from "../../../models/IFlight.model";
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

interface IFlightRowProps {
  flight: IFlight;
  handleToggleEconomy: () => void;
  handleToggleBusiness: () => void;
}

interface IFlightRowWithPricesProps {
  flight: IFlight;
  setFlightDirection: React.Dispatch<React.SetStateAction<string>>;
  setChooseFlightText: React.Dispatch<React.SetStateAction<string>>;
}

interface IClassPricesProps {
  travelClassName: string;
  flight: IFlight;
  visibility: boolean;
  setFlightDirection: React.Dispatch<React.SetStateAction<string>>;
  setChooseFlightText: React.Dispatch<React.SetStateAction<string>>;
}

interface IClassPricesDrawerProps {
  travelClassName: string;
  flight: IFlight;
  handleToggle: () => void;
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

function ClassPricesDrawer(props: IClassPricesDrawerProps) {
  const [isOpenPricesHovered, setIsOpenPricesHovered] =
    useState<boolean>(false);

  const handleMouseEnter = () => {
    setIsOpenPricesHovered(true);
  };

  const handleMouseLeave = () => {
    setIsOpenPricesHovered(false);
  };

  return (
    <>
      <div className="card" style={{ width: "18rem" }}>
        <div className="card-body mt-3 d-flex flex-column justify-content-start align-items-center">
          <h2 className="card-title">{props.travelClassName}</h2>
          <p className="card-text">
            From{" "}
            <span style={{ fontSize: "1.5vw" }}>
              {props.flight.travelClasses
                ?.filter((travelClass) =>
                  travelClass.travelClass.travelClassName.includes(props.travelClassName)
                )
                .map((travelClass) => travelClass.price)
                .reduce((smallestPrice: number, currentPrice: number) => {
                  return currentPrice < smallestPrice
                    ? currentPrice
                    : smallestPrice;
                }, Infinity)}{" "}
              RSD
            </span>
          </p>
        </div>
        <div
          className={`card-footer text-bg-primary d-flex justify-content-center open-prices ${
            isOpenPricesHovered ? "hover-background" : ""
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={props.handleToggle}
        >
          <FontAwesomeIcon
            icon={faCaretSquareDown}
            style={{ fontSize: "2vw" }}
          />
        </div>
      </div>
    </>
  );
}

const ClassPrices = (props: IClassPricesProps) => {
  const [selectPriceHoveredIndex, setSelectPriceHoveredIndex] = useState<
    number | null
  >(null);

  const handleMouseEnter = (index: number) => {
    setSelectPriceHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setSelectPriceHoveredIndex(null);
  };

  const changeFlightDirection = (newDirection: string) => {
    props.setFlightDirection(newDirection);
  };

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
      default:
        return "";
    }
  };

  return (
    <div
      className={
        props.visibility ? "class-prices-visible" : "class-prices-hidden"
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
            {props.flight.travelClasses
              ?.filter((travelClass) =>
                travelClass.travelClass.travelClassName.includes(props.travelClassName)
              )
              .map((travelClass, index) => (
                <div
                  className="card"
                  style={{ width: "25rem", height: "30vw" }}
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
                      <h1 style={{ position: "absolute", bottom: 0 }}>
                        {travelClass.price} RSD
                      </h1>
                    </div>
                  </div>
                  <div
                    className={`card-footer text-bg-primary d-flex justify-content-center select-price ${
                      selectPriceHoveredIndex === index
                        ? "hover-background"
                        : ""
                    }`}
                    onClick={() => {
                      changeFlightDirection("return");
                      props.setChooseFlightText("Choose your return flight");
                    }}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    Select
                  </div>
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function FlightRow(props: IFlightRowProps) {
  return (
    <>
      <div className="container-fluid d-flex flex-row my-5">
        <div className="card p-3 w-50 p-3">
          <div className="card-body d-flex flex-row justify-content-between w-100 my-0 mx-auto align-items-center">
            <div
              className="d-flex flex-column justify-content-center align-items-start"
              style={{ width: "10vw" }}
            >
              <span>Departure</span>
              <h3>
                {formatTime(
                  new Date(props.flight.departureDateAndTime),
                  props.flight.originAirport?.timeZone!
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
                    props.flight.destinationAirport?.timeZone!
                  )}
                </h3>
                <small>
                  {checkForDayDifference(
                    new Date(props.flight.departureDateAndTime),
                    new Date(props.flight.arrivalDateAndTime),
                    props.flight.originAirport?.timeZone!,
                    props.flight.destinationAirport?.timeZone!
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
        </div>
        <ClassPricesDrawer
          travelClassName={"Economy"}
          flight={props.flight}
          handleToggle={props.handleToggleEconomy}
        />
        <ClassPricesDrawer
          travelClassName={"Business"}
          flight={props.flight}
          handleToggle={props.handleToggleBusiness}
        />
      </div>
    </>
  );
}

function FlightRowWithPrices(props: IFlightRowWithPricesProps) {
  const [isEconomyVisible, setIsEconomyVisible] = useState<boolean>(false);
  const [isBusinessVisible, setIsBusinessVisible] = useState<boolean>(false);

  return (
    <>
      <FlightRow
        flight={props.flight}
        handleToggleEconomy={() => setIsEconomyVisible(!isEconomyVisible)}
        handleToggleBusiness={() => setIsBusinessVisible(!isBusinessVisible)}
      />
      <TransitionGroup component={null}>
        {isEconomyVisible && (
          <CSSTransition classNames={"row-transition"} timeout={300}>
            <ClassPrices
              travelClassName="Economy"
              flight={props.flight}
              visibility={isEconomyVisible}
              setFlightDirection={props.setFlightDirection}
              setChooseFlightText={props.setChooseFlightText}
            />
          </CSSTransition>
        )}
        {isBusinessVisible && (
          <CSSTransition classNames={"row-transition"} timeout={300}>
            <ClassPrices
              travelClassName="Business"
              flight={props.flight}
              visibility={isBusinessVisible}
              setFlightDirection={props.setFlightDirection}
              setChooseFlightText={props.setChooseFlightText}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </>
  );
}

export default function FlightsPage() {
  const location = useLocation();
  const [flightData, setFlightData] = useState<IFlight[]>(
    location.state[4] || []
  );

  const [flightDirection, setFlightDirection] = useState<string>("departure");

  const [chooseFlightText, setChooseFlightText] = useState<string>(
    "Choose your departure flight"
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingStyle, setLoadingStyle] = useState<Object>({ opacity: 1 });
  const [contentStyle, setContentStyle] = useState<Object>({});

  const [error, setError] = useState<string>("");

  const [chosenDate, setChosenDate] = useState<Date>(
    new Date(location.state[2])
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
    const dates = [];
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
      const flightDataResponse = await api(
        "post",
        `/api/flight/search/${flightDirection}`,
        "user",
        {
          originAirportId:
            flightDirection === "departure"
              ? location.state[0]
              : location.state[1],
          destinationAirportId:
            flightDirection === "departure"
              ? location.state[1]
              : location.state[0],
          ...(flightDirection === "departure"
            ? {
                departureDate: convertDateToMySqlDateTime(
                  new Date(directionDate)
                ).slice(0, 10),
              }
            : {
                returnDate: convertDateToMySqlDateTime(
                  new Date(directionDate)
                ).slice(0, 10),
              }),
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
  }, [chosenDate, flightDirection, location.state]);

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
    }

    if (isLoading) {
      setLoadingStyle({
        opacity: 1,
      });
    }
  }, [isLoading]);

  const buildApiRequestData = (
    flightDirection: string,
    locationState: any,
    directionDate: string
  ) => ({
    originAirportId:
      flightDirection === "departure" ? locationState[0] : locationState[1],
    destinationAirportId:
      flightDirection === "departure" ? locationState[1] : locationState[0],
    ...(flightDirection === "departure"
      ? {
          departureDate: convertDateToMySqlDateTime(
            new Date(directionDate)
          ).slice(0, 10),
        }
      : {
          returnDate: convertDateToMySqlDateTime(new Date(directionDate)).slice(
            0,
            10
          ),
        }),
  });

  const findLowestPriceInFlight = (flight: IFlight) => {
    const minPriceInFlight = flight.travelClasses?.reduce(
      (minClassPrice, travelClass) => {
        return Math.min(minClassPrice, travelClass.price);
      },
      Infinity
    );
    return minPriceInFlight;
  };

  const findLowestPrice = (flights: IFlight[]) => {
    const lowestPrice = flights.reduce((minPrice, flight) => {
      return Math.min(minPrice, findLowestPriceInFlight(flight)!);
    }, Infinity);

    return lowestPrice;
  };

  useEffect(() => {
    const getMinimalPrice = async (
      directionDate: string,
      flightDirection: string
    ): Promise<number> => {
      try {
        const res = await api(
          "post",
          `/api/flight/search/${flightDirection}`,
          "user",
          buildApiRequestData(flightDirection, location.state, directionDate)
        );

        if (res.status !== "ok") {
          throw new Error(
            "Prices could not be obtained: Reason: " + JSON.stringify(res.data)
          );
        }

        const flights = res.data as IFlight[];

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

    updateMinimalPrices();
  }, [chosenDate, dateRange, flightDirection, location.state]);

  const [activeTab, setActiveTab] = useState<string>("currentDate");

  const formatDate = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const [minimalPrices, setMinimalPrices] = useState<number[]>([]);

  const handleTabSelect = (key: string | null) => {
    if (key) {
      setActiveTab(key);
    }
  };

  const currentDate: Date = new Date(location.state[2]);

  return (
    <Container>
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
          const isDisabled = date < currentDate;

          return (
            <Tab
              key={formattedDate}
              eventKey={formattedDate}
              title={
                <TabTitle
                  title={
                    !isDisabled
                      ? `${formattedDate} ${minimalPrice} RSD`
                      : `${formattedDate}`
                  }
                ></TabTitle>
              }
              disabled={isDisabled}
            >
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
                  <>
                    {flightData.map((flight) => (
                      <FlightRowWithPrices
                        flight={flight}
                        key={flight.flightId}
                        setFlightDirection={setFlightDirection}
                        setChooseFlightText={setChooseFlightText}
                      />
                    ))}
                  </>
                </div>
              )}
            </Tab>
          );
        })}
      </Tabs>
    </Container>
  );
}
