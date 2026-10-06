function parseNumericField(field, { min = null, max = null } = {}) {
  return (req, res, next) => {
    if (req.body[field] === undefined || req.body[field] === null || req.body[field] === "") return next();
    const value = Number(req.body[field]);
    if (!Number.isFinite(value) || (min !== null && value < min) || (max !== null && value > max)) {
      return res.status(400).json({ error: `${field} must be a valid number${min !== null ? ` >= ${min}` : ""}${max !== null ? ` <= ${max}` : ""}` });
    }
    req.body[field] = value;
    next();
  };
}

module.exports = { parseNumericField };
