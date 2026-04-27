const errorHandler = require("../utils/errorHandler");

function authorize(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return errorHandler(res, "Forbidden", 403, "Akses ditolak");
    }
    next();
  };
}

module.exports = authorize;