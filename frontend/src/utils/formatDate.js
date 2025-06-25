export function formatDate(dateArray) {
  if (!Array.isArray(dateArray) || dateArray.length < 6) return "N/A";
  const [year, month, day, hour, minute, second] = dateArray;
  const dateObj = new Date(year, month - 1, day, hour, minute, second);
  return dateObj.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
}
