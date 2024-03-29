import { api } from "../api/api";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const chars = letters + numbers;

export const generateRandomBookingConfirmationFormattedString = (
  departureAirportCode: string
) => {
  let result = departureAirportCode;

  result += chars.charAt(Math.floor(Math.random() * chars.length));
  result += chars.charAt(Math.floor(Math.random() * chars.length));
  result += chars.charAt(Math.floor(Math.random() * chars.length));

  return result;
};

export const generateRandomTicketNumberFormattedString = () => {
  let result = "";

  result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  result += numbers.charAt(Math.floor(Math.random() * numbers.length));

  let incrementedResult = () => {
    const resultArray = result.split("");

    if (resultArray[0] === "0") {
      return "0" + (parseFloat(resultArray.slice(1).join("")) + 1).toString();
    }

    return (parseFloat(resultArray.join("")) + 1).toString();
  };

  return [result, incrementedResult()];
};

const generateRandomSeatNumberFormattedString = () => {
  let row = Math.random() * 30 + 1;
  let columns = letters.substring(0, 6);

  let result = "";

  result +=
    row.toFixed(0) + columns.charAt(Math.floor(Math.random() * columns.length));

  return result;
};

export const generateRandomSeat = async (flightId: number): Promise<string> => {
  while (true) {
    const seatNumber = generateRandomSeatNumberFormattedString();

    const isAvailable = await checkSeatAvailability(flightId, seatNumber);

    if (isAvailable.length === 0) {
      return seatNumber;
    }
  }
};

const checkSeatAvailability = async (
  flightId: number,
  seatNumber: string
): Promise<any> => {
  try {
    const response = await api("post", "/api/ticket/search", "user", {
      flightId: flightId,
      seatNumber: seatNumber,
    });
    return response.data;
  } catch (error) {
    console.error("Error checking seat availability:", error);
    throw error;
  }
};
