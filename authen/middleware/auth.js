var jwt = require("jsonwebtoken");
var dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");

const verifyCallback =
  (req, resolve, reject, requiredRights) => async (err, user, info) => {
    if (err || info || !user) {
      return reject("Not authenticate");
    }
    req.user = user;
    if (!requiredRights || requiredRights !== user.role.toLowerCase()) {
      return reject("You do not have access");
    } else {
      resolve();
    }
  };

exports.auth = (requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, resolve, reject, requiredRights)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};
