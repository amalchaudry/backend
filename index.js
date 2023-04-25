const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();

// This is so that the frontend can make requests to the backend
app.use(cors());

// This is to parse the inputs passed in the body of POST requests
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  // in terminal: export DB_PASSWORD='yourpassword'
  password: process.env.DB_PASSWORD,
  database: "flight_management",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: ", err);
  } else {
    console.log("Connected to database");
  }
});

const tables = [
  "airline",
  "airplane",
  "airport",
  "flight",
  "leg",
  "location",
  "passenger",
  "person",
  "pilot",
  "pilot_licenses",
  "route",
  "route_path",
  "ticket",
  "ticket_seats",
  "flights_in_the_air",
  "flights_on_the_ground",
  "people_in_the_air",
  "people_on_the_ground",
  "route_summary",
  "alternative_airports",
];

// Get all tables and views
app.get("/api/:table", (req, res) => {
  const table = req.params.table;
  if (!tables.includes(table)) {
    return res.sendStatus(404);
  }
  const query = `SELECT * FROM ${table}`;
  connection.query(query, (err, results, fields) => {
    if (err) {
      console.error("Error fetching data from database: ", err);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});

// Call procedure to add airport
app.post("/api/addAirport", (req, res) => {
  const airportID = req.body.airportID;
  const airport_name = req.body.airport_name;
  const city = req.body.city;
  const state = req.body.state;
  const locationID = req.body.locationID;
  const query = `CALL add_airport(?, ?, ?, ?, ?)`;
  connection.query(
    query,
    [airportID, airport_name, city, state, locationID],
    (err, results, fields) => {
      if (err) {
        console.error("Error adding airport to database: ", err);
        res.sendStatus(500);
      } else {
        res.send(results);
      }
    }
  );
});

// Call procedure to grand pilot license
app.post("/api/grantPilotLicense", (req, res) => {
  const personID = req.body.personID;
  const licenseID = req.body.licenseID;

  const query = `CALL grant_pilot_license(?, ?)`;
  connection.query(query, [personID, licenseID], (err, results, fields) => {
    if (err) {
      console.error("Error granting pilot license: ", err);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});
