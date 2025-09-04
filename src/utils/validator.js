// ✅ Check if a string looks like a valid web URL (http/https)
export function isValidUrl(value) {
  try {
    const urlObject = new URL(value);
    return urlObject.protocol === "http:" || urlObject.protocol === "https:";
  } catch {
    // If the URL constructor throws, it's not valid
    return false;
  }
}

// ✅ Check if the "validity in minutes" is within a safe range
export function isValidMinutes(value) {
  // Empty field is allowed → it means "use default"
  if (value === "" || value === undefined) return true;

  const minutes = Number(value);
  return (
    Number.isInteger(minutes) && minutes >= 0 && minutes <= 1440
  );
}

// ✅ Check if the shortcode is allowed
// Rules: 3–20 chars, letters/numbers/_/-
export function isValidShortcode(code) {
  if (!code) return true; // Empty means auto-generate
  const pattern = /^[a-zA-Z0-9_-]{3,20}$/;
  return pattern.test(code);
}
