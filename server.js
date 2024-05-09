const express = require('express');
const cors = require('cors');
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

app.use(express.json());
app.use((req, res, next) => {
    next();
})

app.use('/api', routes);
app.use('/auth', authRoutes);

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


