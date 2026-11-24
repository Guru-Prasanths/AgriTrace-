/**
 * Input Sanitization Middleware for AgriTrace
 * Strips dangerous HTML/script content from request bodies, query params, and URL params.
 */

function sanitizeValue(value) {
  if (typeof value === "string") {
    // Remove null bytes
    value = value.replace(/\0/g, "");
    // Strip script tags
    value = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    // Strip event handlers
    value = value.replace(/\bon\w+\s*=\s*(['"]).*?\1/gi, "");
    value = value.replace(/\bon\w+\s*=\s*[^\s>]+/gi, "");
    // Strip javascript: protocol
    value = value.replace(/javascript\s*:/gi, "");
    return value.trim();
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === "object") {
    const sanitized = {};
    for (const [k, v] of Object.entries(value)) {
      sanitized[k] = sanitizeValue(v);
    }
    return sanitized;
  }
  return value;
}

function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }
  next();
}

function sanitizeQuery(req, res, next) {
  if (req.query && typeof req.query === "object") {
    for (const [key, value] of Object.entries(req.query)) {
      if (typeof value === "string") {
        req.query[key] = sanitizeValue(value);
      }
    }
  }
  next();
}

function sanitizeParams(req, res, next) {
  if (req.params && typeof req.params === "object") {
    for (const [key, value] of Object.entries(req.params)) {
      if (typeof value === "string") {
        req.params[key] = sanitizeValue(value);
      }
    }
  }
  next();
}

module.exports = { sanitizeBody, sanitizeQuery, sanitizeParams, sanitizeValue };
