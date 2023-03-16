export function localDateFormat(date: string): string {
  const dateInstance = new Date(date);
  return dateInstance.toLocaleDateString();
}

export function getYear(): number {
  return new Date().getFullYear();
}
