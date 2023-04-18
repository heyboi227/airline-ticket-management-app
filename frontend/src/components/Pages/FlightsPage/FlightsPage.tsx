import "./FlightsPage.scss";
import { useLocation } from "react-router-dom";
import IFlight from "../../../models/IFlight.model";
import {
  checkForDayDifference,
  formatTime,
  subtractTime,
} from "../../../helpers/helpers";
import smallLogo from "../../../static/air-soko-logo-small.png";
import DashedArrow from "../../Shapes/DashedArrow/DashedArrow";
import Config from "../../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretSquareDown } from "@fortawesome/free-regular-svg-icons";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container, Tab, Tabs } from "react-bootstrap";
import { api } from "../../../api/api";
import { convertDateToMySqlDateTime } from "../../../helpers/helpers";

interface IFlightRowProps {
  flight: IFlight;
}

interface IClassPricesProps {
  travelClassName: string;
  flight: IFlight;
  visibility: boolean;
}

interface IClassPricesDrawerProps {
  travelClassName: string;
  flight: IFlight;
  handleToggle: () => void;
}

interface TabTitleProps {
  title: string;
}

export default function FlightsPage() {
  const location = useLocation();
  const [flightData, setFlightData] = useState<IFlight[]>(
    location.state[4] || []
  );

  const [error, setError] = useState<string>("");
  const [chooseFlightText, setChooseFlightText] = useState<string>(
    "Choose your departure flight"
  );

  const [flightDirection, setFlightDirection] = useState<string>("departure");

  const changeFlightDirection = (newDirection: string) => {
    setFlightDirection(newDirection);
  };

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

  const [activeTab, setActiveTab] = useState<string>(
    chosenDate.toLocaleDateString("en-US")
  );

  const generateDateRange = (): Date[] => {
    const dates = [];
    const currentDate = chosenDate;
    for (let i = -3; i <= 3; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const [minimalPrices, setMinimalPrices] = useState<number[]>([]);

  const handleTabSelect = (date: Date) => {
    handleChosenDateChange(date);
  };

  const dateRange = generateDateRange();

  const getMinimalPrice = async (
    directionDateAndTime: string,
    flightDirection: string
  ): Promise<number> => {
    console.log(flightDirection);
    try {
      const res = await api(
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
            ? { departureDateAndTime: directionDateAndTime }
            : { returnDateAndTime: directionDateAndTime }),
        }
      );

      if (res.status !== "ok") {
        throw new Error(
          "Prices could not be obtained. Reason: " + JSON.stringify(res.data)
        );
      }

      const flights = res.data as IFlight[];

      if (flights.length === 0) {
        return 0;
      }

      const lowestPrice = flights.reduce((minPrice, flight) => {
        const minPriceInFlight = flight.travelClasses?.reduce(
          (minClassPrice, travelClass) => {
            return Math.min(minClassPrice, travelClass.price);
          },
          Infinity
        );
        return Math.min(minPrice, minPriceInFlight!);
      }, Infinity);

      return lowestPrice;
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message ?? "Could not perform the search.");
      } else {
        setError("Could not perform the search.");
      }

      setTimeout(() => {
        setError("");
      }, 3500);

      return -1;
    }
  };

  useEffect(() => {
    async function fetchMinimalPrices() {
      console.log(dateRange);
      const pricesPromises = dateRange.map((date) =>
        getMinimalPrice(convertDateToMySqlDateTime(date), flightDirection)
      );
      const prices = await Promise.all(pricesPromises);
      setMinimalPrices(prices);
    }

    fetchMinimalPrices();
  }, [chosenDate, flightDirection]);

  const TabTitle = ({ title }: TabTitleProps) => {
    return (
      <div
        style={{
          whiteSpace: "pre-wrap",
          lineHeight: "1.2",
          width: "107px",
        }}
      >
        {title}
      </div>
    );
  };

  const doSearchArrival = (returnDate: Date) => {
    setChooseFlightText("Choose your return date");

    api("post", "/api/flight/search/return", "user", {
      originAirportId: location.state[1],
      destinationAirportId: location.state[0],
      returnDateAndTime: convertDateToMySqlDateTime(returnDate),
    })
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Search could not be performed. Reason: " + JSON.stringify(res.data)
          );
        }

        setFlightDirection("return");
        setFlightData(res.data);
      })
      .catch((error) => {
        setError(error?.message ?? "Could not perform the search.");

        setTimeout(() => {
          setError("");
        }, 3500);
      });
  };

  function ClassPricesDrawer({
    travelClassName,
    flight,
    handleToggle,
  }: IClassPricesDrawerProps) {
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
            <h2 className="card-title">{travelClassName}</h2>
            <p className="card-text">
              From{" "}
              <span style={{ fontSize: "1.5vw" }}>
                {flight.travelClasses
                  ?.filter((travelClass) =>
                    travelClass.travelClass.name.includes(travelClassName)
                  )
                  .map((travelClass) => travelClass.price)
                  .reduce((smallestPrice: number, currentPrice: number) => {
                    return currentPrice < smallestPrice
                      ? currentPrice
                      : smallestPrice;
                  })}{" "}
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
            onClick={handleToggle}
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

  const ClassPrices = ({
    travelClassName,
    flight,
    visibility,
  }: IClassPricesProps) => {
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
                A piece of carry-on baggage included, checked baggage is
                available for a fee
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
                Fully-flat seats, or spacious recliners with ample legroom,
                based on availability
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
      <AnimatePresence>
        {visibility && (
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
            {flight.travelClasses
              ?.filter((travelClass) =>
                travelClass.travelClass.name.includes(travelClassName)
              )
              .map((travelClass) => (
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
                      {travelClass.travelClass.subname}
                    </h2>
                    <div className="card-text">
                      {renderTextForSubTravelClasses(
                        travelClass.travelClass.subname
                      )}
                      <h1 style={{ position: "absolute", bottom: 0 }}>
                        {travelClass.price} RSD
                      </h1>
                    </div>
                  </div>
                  <div
                    className="card-footer text-bg-primary d-flex justify-content-center"
                    onClick={() => {
                      changeFlightDirection("return");
                      doSearchArrival(new Date(location.state[3]));
                    }}
                  >
                    Select
                  </div>
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  function FlightRow(props: IFlightRowProps) {
    const [isEconomyVisible, setIsEconomyVisible] = useState<boolean>(false);
    const [isBusinessVisible, setIsBusinessVisible] = useState<boolean>(false);

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
            <span>{props.flight.aircraft?.name}</span>
          </div>
          <ClassPricesDrawer
            travelClassName={"Economy"}
            flight={props.flight}
            handleToggle={() => setIsEconomyVisible(!isEconomyVisible)}
          />
          <ClassPricesDrawer
            travelClassName={"Business"}
            flight={props.flight}
            handleToggle={() => setIsBusinessVisible(!isBusinessVisible)}
          />
        </div>
        <ClassPrices
          travelClassName={"Economy"}
          flight={props.flight}
          visibility={isEconomyVisible}
        />
        <ClassPrices
          travelClassName={"Business"}
          flight={props.flight}
          visibility={isBusinessVisible}
        />
      </>
    );
  }

  return (
    <Container>
      <Tabs
        activeKey={activeTab}
        className="d-flex flex-row justify-content-center align-items-center"
        onSelect={() => handleTabSelect(chosenDate)}
      >
        {dateRange.map((date, index) => {
          const formattedDate = formatDate(date);
          const minimalPrice =
            minimalPrices[index] === Infinity ? 0 : minimalPrices[index];
          const isDisabled = date < chosenDate;

          return (
            <Tab
              key={formattedDate}
              eventKey={formattedDate}
              title={
                <TabTitle
                  title={`${formattedDate} ${minimalPrice} RSD`}
                ></TabTitle>
              }
              disabled={isDisabled}
            >
              <div className="d-flex flex-row justify-content-center align-items-center mt-5">
                <h2>{chooseFlightText}</h2>
              </div>
              {flightData.map((flight) => (
                <FlightRow flight={flight} key={flight.flightId} />
              ))}
            </Tab>
          );
        })}
      </Tabs>
    </Container>
  );
}
