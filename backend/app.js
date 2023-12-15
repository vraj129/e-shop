require("dotenv/config");
const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const productRouter = require("./routers/product_router");
const categoryRouter = require("./routers/category_router");
const orderRouter = require("./routers/order_router");
const userRouter = require("./routers/user_router");
const cors = require("cors");
const api_url = process.env.API_URL;

/// Middlewares
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(morgan("tiny"));

///Routes
app.use(`${api_url}/products`, productRouter);
app.use(`${api_url}/category`, categoryRouter);
app.use(`${api_url}/order`, orderRouter);
app.use(`${api_url}/user`, userRouter);

///Mongo db connection
mongoose
  .connect(process.env.CONNECTION_STRING, { dbName: process.env.DB_NAME })
  .then(() => {
    console.log("Database connection is ready");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3001, () => {
  console.log("The server started to listen on http://localhost:3001");
});
