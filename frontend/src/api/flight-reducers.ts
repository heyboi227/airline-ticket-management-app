export interface FlightFormState {
  flightCode: string;
  originAirportId: number;
  destinationAirportId: number;
  departureDateAndTime: string;
  arrivalDateAndTime: string;
  aircraftId: number;
  travelClasses: {
    travelClassId: number;
    price: number;
  }[];
}

export const initialFlightFormState = {
  flightCode: "",
  originAirportId: 0,
  destinationAirportId: 0,
  departureDateAndTime: "",
  arrivalDateAndTime: "",
  aircraftId: 0,
  travelClasses: [],
};

type TSetFlightCode = {
  type: "flightForm/setFlightCode";
  value: string;
  formType?: string;
};
type TSetOriginAirportId = {
  type: "flightForm/setOriginAirportId";
  value: number;
  formType?: string;
};
type TSetDestinationAirportId = {
  type: "flightForm/setDestinationAirportId";
  value: number;
  formType?: string;
};
type TSetDepartureDateAndTime = {
  type: "flightForm/setDepartureDateAndTime";
  value: string;
  formType?: string;
};
type TSetArrivalDateAndTime = {
  type: "flightForm/setArrivalDateAndTime";
  value: string;
  formType?: string;
};
type TSetAircraftId = {
  type: "flightForm/setAircraftId";
  value: number;
  formType?: string;
};
type TAddTravelClass = {
  type: "flightForm/addTravelClass";
  value: number;
  formType?: string;
};
type TAddTravelClassFull = {
  type: "flightForm/addTravelClassFull";
  value: { travelClassId: number; price: number };
  formType?: string;
};
type TRemoveTravelClass = {
  type: "flightForm/removeTravelClass";
  value: number;
  formType?: string;
};
type TSetTravelClassPrice = {
  type: "flightForm/setTravelClassPrice";
  value: { travelClassId: number; price: number };
  formType?: string;
};

export type FlightFormAction =
  | TSetFlightCode
  | TSetOriginAirportId
  | TSetDestinationAirportId
  | TSetDepartureDateAndTime
  | TSetArrivalDateAndTime
  | TSetAircraftId
  | TAddTravelClass
  | TAddTravelClassFull
  | TRemoveTravelClass
  | TSetTravelClassPrice;

export default function FlightFormReducer(
  oldState: FlightFormState,
  action: FlightFormAction
): FlightFormState {
  switch (action.type) {
    case "flightForm/setFlightCode": {
      return {
        ...oldState,
        flightCode: action.value,
      };
    }

    case "flightForm/setOriginAirportId": {
      return {
        ...oldState,
        originAirportId: action.value,
      };
    }

    case "flightForm/setDestinationAirportId": {
      return {
        ...oldState,
        destinationAirportId: action.value,
      };
    }

    case "flightForm/setDepartureDateAndTime": {
      return {
        ...oldState,
        departureDateAndTime: action.value,
      };
    }

    case "flightForm/setArrivalDateAndTime": {
      return {
        ...oldState,
        arrivalDateAndTime: action.value,
      };
    }

    case "flightForm/setAircraftId": {
      return {
        ...oldState,
        aircraftId: action.value,
      };
    }

    case "flightForm/addTravelClass": {
      if (
        oldState.travelClasses.find(
          (travelClass) => travelClass.travelClassId === action.value
        )
      ) {
        return oldState;
      }

      return {
        ...oldState,
        travelClasses: [
          ...oldState.travelClasses.map((travelClass) => {
            return { ...travelClass };
          }),
          { travelClassId: action.value, price: 0.01 },
        ],
      };
    }

    case "flightForm/addTravelClassFull": {
      if (action.formType !== "edit") {
        return oldState;
      }

      if (
        oldState.travelClasses.find(
          (travelClass) =>
            travelClass.travelClassId === action.value.travelClassId
        )
      ) {
        return oldState;
      }

      return {
        ...oldState,
        travelClasses: [
          ...oldState.travelClasses.map((travelClass) => {
            return { ...travelClass };
          }),
          {
            travelClassId: action.value.travelClassId,
            price: +action.value.price,
          },
        ],
      };
    }

    case "flightForm/removeTravelClass": {
      if (
        !oldState.travelClasses.find(
          (travelClass) => travelClass.travelClassId === action.value
        )
      ) {
        return oldState;
      }

      return {
        ...oldState,
        travelClasses: [
          ...oldState.travelClasses
            .map((travelClass) => {
              return { ...travelClass };
            })
            .filter(
              (travelClass) => travelClass.travelClassId !== action.value
            ),
        ],
      };
    }

    case "flightForm/setTravelClassPrice": {
      if (
        !oldState.travelClasses.find(
          (travelClass) =>
            travelClass.travelClassId === action.value.travelClassId
        )
      ) {
        return oldState;
      }

      return {
        ...oldState,
        travelClasses: [
          ...oldState.travelClasses.map((travelClass) => {
            if (action.value.travelClassId !== travelClass.travelClassId) {
              return { ...travelClass };
            }

            return {
              ...travelClass,
              price: action.value.price,
            };
          }),
        ],
      };
    }

    default:
      return oldState;
  }
}
