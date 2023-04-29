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

// Call procedure to grant pilot license
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


// Call procedure to add airplane
app.post("/api/addAirplane", (req, res) => {
  const airlineID = req.body.airlineID;
  const tail_num = req.body.tail_num;
  const seat_capacity = parseInt(req.body.seat_capacity);
  const speed = parseInt(req.body.speed);
  const locationID = req.body.locationID;
  const plane_type = req.body.plane_type;
  const skids = Number(req.body.skids);
  const propellers = parseInt(req.body.propellers);
  const jet_engines = parseInt(req.body.jet_engines);
  const query = `CALL add_airplane(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  connection.query(
    query,
    [airlineID, tail_num, seat_capacity, speed, locationID, plane_type, skids, propellers, jet_engines], (err, results, fields) => {
    if (err) {
      console.error("Error adding airport to database: ", err);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});


// Call procedure to add person
app.post("/api/addPerson", (req, res) => {
  const personID = req.body.personID;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const taxID = req.body.taxID;
  const locationID = req.body.locationID;
  const experience = parseInt(req.body.experience);
  const flying_airline = req.body.flying_airline;
  const flying_tail = req.body.flying_tail;
  const miles = parseInt(req.body.miles);
  const query = `CALL add_person(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  connection.query(
    query,
    [personID, first_name, last_name, taxID, locationID, experience, flying_airline, 
      flying_tail, miles], (err, results, fields) => {
    if (err) {
      console.error("Error adding person to database: ", err);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});

// Call procedure to offer flight
app.post("/api/offerFlight", (req, res) => {
  const flightID = req.body.flightID;
  const routeID = req.body.routeID;
  const support_airline = req.body.support_airline;
  const support_tail = req.body.support_tail;
  const progress = req.body.progress;
  const airplane_status = req.body.airplane_status;
  const next_time = req.body.next_time;
  const query = `CALL offer_flight(?, ?, ?, ?, ?, ?, ?)`;
  connection.query(
    query,
    [flightID, routeID, support_airline, support_tail, progress, 
      airplane_status, next_time], (err, results, fields) => {
    if (err) {
      console.error("Error offering flight: ", err);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});

// Call procedure to purchase ticket
app.post("/api/purchaseTicket", (req, res) => {
  const ticketID = req.body.ticketID;
  const cost = req.body.cost;
  const carrier = req.body.carrier;
  const customer = req.body.customer;
  const deplane_at = req.body.deplane_at;
  const seat_number = req.body.seat_number;
  const query = `CALL purchase_ticket_and_seat(?, ?, ?, ?, ?, ?)`;
  connection.query(
    query,
    [ticketID, cost, carrier, customer, deplane_at, seat_number], (err, results, fields) => {
    if (err) {
      console.error("Error purchasing ticket: ", err);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});


// Call procedure to add/update leg
app.post("/api/addupdateLeg", (req, res) => {
  const legID = req.body.legID;
  const distance = req.body.distance;
  const departure = req.body.departure;
  const arrival = req.body.arrival;
  const query = `CALL add_update_leg(?, ?, ?, ?)`;
  connection.query(
    query,
    [legID, distance, departure, arrival], (err, results, fields) => {
    if (err) {
      console.error("Error adding/updating leg: ", err);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});



// Call procedure to start route
app.post("/api/startRoute", (req, res) => {
  const routeID = req.body.routeID;
  const legID = req.body.legID;
  const query = `CALL start_route(?, ?)`;
  connection.query(
    query,
    [routeID, legID], (err, results, fields) => {
    if (err) {
      console.error("Error starting route: ", err);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});



// Call procedure to extend route
app.post("/api/extendRoute", (req, res) => {
  const routeID = req.body.routeID;
  const legID = req.body.legID;
  const query = `CALL extend_route(?, ?)`;
  connection.query(
    query,
    [routeID, legID], (err, results, fields) => {
    if (err) {
      console.error("Error extending route: ", err);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});



// Call procedure to land flight
app.post("/api/flightLanding", (req, res) => {
  const flightID = req.body.flightID;
  const query = `CALL flight_landing(?)`;
  connection.query(
    query,
    [flightID], (err, results, fields) => {
    if (err) {
      console.error("Error landing flight: ", err);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});



// Call procedure to flight takeoff
app.post("/api/flightTakeoff", (req, res) => {
  const flightID = req.body.flightID;
  const query = `CALL flight_takeoff(?)`;
  connection.query(
    query,
    [flightID], (err, results, fields) => {
    if (err) {
      console.error("Error in flight takeoff: ", err);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});



// Call procedure to passengers board
app.post("/api/passengersBoard", (req, res) => {
  const flightID = req.body.flightID;
  const query = `CALL passengers_board(?)`;
  connection.query(
    query,
    [flightID], (err, results, fields) => {
    if (err) {
      console.error("Error boarding passenger: ", err);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});



// Call procedure to passengers disembark
app.post("/api/passengersDisembark", (req, res) => {
  const flightID = req.body.flightID;
  const query = `CALL passengers_disembark(?)`;
  connection.query(
    query,
    [flightID], (err, results, fields) => {
    if (err) {
      console.error("Error disembarking passenger: ", err);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});



// Call procedure to assign pilot
app.post("/api/assignPilot", (req, res) => {
  const flightID = req.body.flightID;
  const personID = req.body.personID;
  const query = `CALL assign_pilot(?, ?)`;
  connection.query(
    query,
    [flightID, personID], (err, results, fields) => {
    if (err) {
      console.error("Error assigning pilot: ", err);
      res.sendStatus(500);
    } else {
      res.send(results);
      console.log(results);
    }
  });
});



// Call procedure to recycle crew
app.post("/api/recycleCrew", (req, res) => {
  const flightID = req.body.flightID;
  const query = `CALL recycle_crew(?)`;
  connection.query(
    query,
    [flightID], (err, results, fields) => {
    if (err) {
      console.error("Error recycling crew: ", err);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});



// Call procedure to retire flight
app.post("/api/retireFlight", (req, res) => {
  const flightID = req.body.flightID;
  const query = `CALL retire_flight(?)`;
  connection.query(
    query,
    [flightID], (err, results, fields) => {
    if (err) {
      console.error("Error retiring flight: ", err);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});



// Call procedure to remove passenger role
app.post("/api/removePassengerRole", (req, res) => {
  const personID = req.body.personID;
  const query = `CALL remove_passenger_role(?)`;
  connection.query(
    query,
    [personID], (err, results, fields) => {
    if (err) {
      console.error("Error removing passenger role: ", err);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});



// Call procedure to remove pilot role
app.post("/api/removePilotRole", (req, res) => {
  const personID = req.body.personID;
  const query = `CALL remove_pilot_role(?)`;
  connection.query(
    query,
    [personID], (err, results, fields) => {
    if (err) {
      console.error("Error removing pilot role: ", err);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});



