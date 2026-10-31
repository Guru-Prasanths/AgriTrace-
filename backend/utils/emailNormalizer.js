/**
 * AgriTrace Email Normalizer
 * Standardizes emails to ensure:
 * 1. Leading/trailing whitespace is removed.
 * 2. Entire address is converted to lowercase.
 * 3. Consistent Gmail domain handling (googlemail.com -> gmail.com).
 * Enforces: One Gmail, One Account, One Role.
 */

function normalizeEmail(rawEmail) {
  if (!rawEmail || typeof rawEmail !== "string") {
    return "";
  }

  let email = rawEmail.trim().toLowerCase();

  const parts = email.split("@");
  if (parts.length === 2) {
    let [localPart, domain] = parts;
    if (domain === "googlemail.com") {
      domain = "gmail.com";
    }
    return `${localPart}@${domain}`;
  }

  return email;
}

module.exports = { normalizeEmail };

