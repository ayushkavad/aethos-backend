const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    data: {
      status: "success",
      message: "Everyting is working just fine!",
    },
  });
});

module.exports = app;
