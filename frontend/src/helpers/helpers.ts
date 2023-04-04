export function localDateFormat(date: string): string {
  const dateInstance = new Date(date);
  return dateInstance.toLocaleDateString();
}

export function getYear(): number {
  return new Date().getFullYear();
}

export function convertIsoToMySqlDateTime(isoDateString: string): string {
  const date = new Date(isoDateString);
  const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");
  return formattedDate;
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

export function formatTime(date: Date, timeZone: string): string {
  const timeFormatter = new Intl.DateTimeFormat("sr-RS", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timeZone,
  });

  return timeFormatter.format(date);
}

export function formatTimeAndCheckForDayDifference(
  departureDate: Date,
  arrivalDate: Date,
  timeZone: string
): string {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const departureDateWithoutTime = new Date(
    departureDate.getFullYear(),
    departureDate.getMonth(),
    departureDate.getDate()
  );
  const arrivalDateWithoutTime = new Date(
    arrivalDate.getFullYear(),
    arrivalDate.getMonth(),
    arrivalDate.getDate()
  );

  const daysDifference = Math.round(
    (arrivalDateWithoutTime.valueOf() - departureDateWithoutTime.valueOf()) /
      millisecondsPerDay
  );

  const timeFormatter = new Intl.DateTimeFormat("sr-RS", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timeZone,
  });

  return (
    timeFormatter.format(arrivalDate) +
    (daysDifference > 0 ? " +" + daysDifference : "")
  );
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
