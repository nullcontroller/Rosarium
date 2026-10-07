/** Thirty calendar days including today, using the site's Japan time zone. */
export function japanToday(now = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(now);
}

export function inRecentWindow(date: string, today = japanToday()) {
  // A month-only historical record cannot be assigned an invented day.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const age = (Date.parse(today) - Date.parse(date)) / 86_400_000;
  return age >= 0 && age < 30;
}
