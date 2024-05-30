var { expressjwt: jwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.SECRET;
  return jwt({
    secret,
    algorithms: ["HS256"],
  }).unless({ path: ["/api/v1/user/login"] });
}

module.exports = authJwt;
