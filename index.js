const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();

app.use(cors());

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
];

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

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});
