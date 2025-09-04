export function isValidUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidMinutes(value) {
  if (value === "" || value === undefined) return true;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 && n <= 1440;
}

export function isValidShortcode(code) {
  if (!code) return true;
  return /^[a-zA-Z0-9_-]{3,20}$/.test(code);
}
