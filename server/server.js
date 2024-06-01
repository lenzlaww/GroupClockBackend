const express = require('express');
const cors = require("cors");
const path = require("path");
require('dotenv').config();

const routes = require('./routes/routes.js');
const authRoutes = require('./routes/authRoutes.js');
const mongoose = require('mongoose');

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
// app.use(express.json({ limit: "1000mb" }));
// app.use(
//   express.urlencoded({ limit: "1000mb", extended: true, parameterLimit: 50000 })
// );
// app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000" || process.env.FRONTEND_URL,
    credentials: true,
    optionSuccessStatus: 200,
  })
);
app.use(express.json());
app.use((req, res, next) => {
    next();
})

app.use('/api', routes);
app.use('/auth', authRoutes);


app.use(express.static(path.join(__dirname, "client/build")));

app.get(["/Home", "/New", "/NewUser", "/PasswordRecovery"], (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //listen for request
    app.listen(process.env.PORT, () => {
      console.log("Connected to DB & Listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });


