export function localDateFormat(date: string): string {
  const dateInstance = new Date(date);
  return dateInstance.toLocaleDateString();
}

export function getYear(): number {
  return new Date().getFullYear();
}

export function convertIsoToMySqlDateTime(isoDateString: string) {
  const date = new Date(isoDateString);
  const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");
  return formattedDate;
}
