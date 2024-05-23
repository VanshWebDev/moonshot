const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const authRouter = require("./router/auth.router");
const graphRouter = require("./router/dashboard.router");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv").config();

// mongoose configuration
mongoose
  .connect(
    "mongodb+srv://moonshot:Wg7GKLAi67L3gDcw@moonshot.wsiq4xr.mongodb.net/?retryWrites=true&w=majority&appName=moonshot"
  )
  .then(() => console.log("mongoose connected"))
  .catch((err) => console.log(err));

//middlewares
app.use(
  cors({
    origin: [process.env.FRONTEND_URL,`${process.env.BACKEND_URL}/`,"http://localhost:5173"],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// all routes
app.use("/auth", authRouter);
app.use("/dashboard", graphRouter);

//listning for requests
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
