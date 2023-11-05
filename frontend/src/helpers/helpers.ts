export function localDateFormat(date: string): string {
  const dateInstance = new Date(date);
  return dateInstance.toLocaleDateString("sr-RS");
}

export function localDateTimeFormat(date: string): string {
  const dateInstance = new Date(date);
  return dateInstance.toLocaleString("sr-RS");
}

export function getYear(): number {
  return new Date().getFullYear();
}

export function convertDateToMySqlDateTime(date: Date): string {
  function pad(number: number): string {
    return number < 10 ? "0" + number : number.toString();
  }

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function stringToTime(time: string, baseDate: Date): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const newDate = new Date(baseDate);

  newDate.setHours(hours);
  newDate.setMinutes(minutes);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);

  return newDate;
}

export function formatDateTime(date: Date, timeZone: string): string {
  const dateTimeFormatter = new Intl.DateTimeFormat("sr-RS", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timeZone,
  });

  return dateTimeFormatter.format(date);
}

export function formatTime(date: Date, timeZone: string): string {
  const timeFormatter = new Intl.DateTimeFormat("sr-RS", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timeZone,
  });

  return timeFormatter.format(date);
}

/**
 * This function determines the day difference between a flight's departure and arrival dates and times.
 * @param departureDateAndTime Indicates the flight's departure date and time.
 * @param arrivalDateAndTime Indicates the flight's arrival date and time.
 * @param departureTimeZone Indicates the local time zone of the departure airport.
 * @param arrivalTimeZone Indicates the local time zone of the arrival airport.
 * @returns The number of how many days later does the flight arrive at the destination. Will not show if the difference is 0.
 */
export function checkForDayDifference(
  departureDateAndTime: Date,
  arrivalDateAndTime: Date,
  departureTimeZone: string,
  arrivalTimeZone: string
): string {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  const localDepartureDateAndTime = Intl.DateTimeFormat("en-US", {
    timeZone: departureTimeZone,
  }).format(departureDateAndTime);

  const localArrivalDateAndTime = Intl.DateTimeFormat("en-US", {
    timeZone: arrivalTimeZone,
  }).format(arrivalDateAndTime);

  const departureDateWithoutTime = new Date(localDepartureDateAndTime);
  const arrivalDateWithoutTime = new Date(localArrivalDateAndTime);

  const daysDifference = Math.round(
    (arrivalDateWithoutTime.valueOf() - departureDateWithoutTime.valueOf()) /
      millisecondsPerDay
  );

  return daysDifference > 0 ? " +" + daysDifference : "";
}

export function subtractTime(
  time1: string,
  time2: string,
  date1: Date,
  date2: Date
): string {
  const dateTime1 = stringToTime(time1, date1);
  const dateTime2 = stringToTime(time2, date2);

  const diffMilliseconds = Math.abs(dateTime2.getTime() - dateTime1.getTime());

  const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
  const remainingMilliseconds = diffMilliseconds % (1000 * 60 * 60);
  const diffMinutes = Math.floor(remainingMilliseconds / (1000 * 60));

  const formattedHours = diffHours.toString().padStart(2, "0");
  const formattedMinutes = diffMinutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}
