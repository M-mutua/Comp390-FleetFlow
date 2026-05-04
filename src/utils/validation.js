export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Validates that an email address follows the "name@gmail.com" format.
 * @param {string} email - The email address to validate.
 */
export function isGmailAddress(email) {
  if (!isNonEmptyString(email)) return false;
  // Enforces: name (alphanumeric and common symbols) followed by @gmail.com
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(email.trim());
}

/**
 * Checks if a string contains any numeric characters.
 * @param {string} value - The string to check.
 * @returns {boolean} - True if the string contains no numbers, false otherwise.
 */
export function containsNoNumbers(value) {
  if (typeof value !== "string") return false;
  return !/\d/.test(value);
}

export function isNonNegativeNumberString(value) {
  if (value === null || value === undefined) return false;
  const text = String(value).trim();
  if (!text) return false;
  if (!/^\d+(?:\.\d+)?$/.test(text)) return false;
  const numberValue = Number(text);
  return Number.isFinite(numberValue) && numberValue >= 0;
}

export function isNonNegativeIntegerString(value) {
  if (value === null || value === undefined) return false;
  const text = String(value).trim();
  if (!text) return false;
  if (!/^\d+$/.test(text)) return false;
  const numberValue = Number(text);
  return Number.isFinite(numberValue) && numberValue >= 0;
}
