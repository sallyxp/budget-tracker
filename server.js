const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = 3000;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

//mongoose.connect("mongodb://localhost/budget", {
 // useNewUrlParser: true,
 // useFindAndModify: false
//});
// Mongoose Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/radiant-brook-36574", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

mongoose.connection.on('connected', () => console.log('Connected to MongoDB Endpoint'));
mongoose.connection.on('error', (err) => console.log(`Mongoose default connection error: ${err}`));

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});