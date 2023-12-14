require("dotenv/config");
const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");

const api_url = process.env.API_URL;
app.use(express.json());
app.use(morgan("tiny"));

app.get(`${api_url}/products`, (req, res) => {
  const product = {
    id: 1,
    name: "Beauty",
    image: "some_url",
  };
  res.send(product);
});

app.post(`${api_url}/products`, (req, res) => {
  const t = req.body;
  res.send(t);
});

mongoose
  .connect(process.env.CONNECTION_STRING, { dbName: "ehop-database" })
  .then(() => {
    console.log("Database connection is ready");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3001, () => {
  console.log("The server started to listen on http://localhost:3001");
});
