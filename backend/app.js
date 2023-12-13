const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send({
    message: "Hello Vraj the greatest backend developer",
  });
});

app.listen(3001, () => {
  console.log("The server started to listen on http://localhost:3001");
});
