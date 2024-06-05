var { expressjwt: jwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.SECRET;
  const api_url = process.env.API_URL;
  return jwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      {
        url: /\/api\/v1\/products(.*)/,
        methods: ["GET", "OPTIONS"],
      },
      {
        url: /\/api\/v1\/category(.*)/,
        methods: ["GET", "OPTIONS"],
      },
      `${api_url}/user/login`,
      `${api_url}/user/register`,
    ],
  });
}

async function isRevoked(req, header) {
  return !header.payload.isAdmin;
}

module.exports = authJwt;
