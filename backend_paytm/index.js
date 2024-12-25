const express = require("express");
const cors = require("cors");
const { connectToDB } = require("./models");
const router = require("./routes");

const app = express();

app.use(
  cors({
    origin: ["https://gowallet.onrender.com", "http://localhost:3000"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/api/v1", router);

connectToDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server started on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error(
      "Failed to start the server due to DB connection error:",
      err
    );
  });
