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

// function that changes the key in the request body to null, false, true, or a number
// if it's an empty string, then just leave it as an empty string
const cleanBody = (body) => {
  const cleanedBody = {};
  for (const key in body) {
    const value = body[key];
    if (value.toLowerCase() === "null") {
      cleanedBody[key] = null;
    } else if (value.toLowerCase() === "true") {
      cleanedBody[key] = true;
    } else if (value.toLowerCase() === "false") {
      cleanedBody[key] = false;
    }
    // this should be handled individually in case a number is actually a string
    else if (!isNaN(value)) {
      cleanedBody[key] = Number(value);
    } else {
      cleanedBody[key] = value;
    }
  }
  return cleanedBody;
};

// Call procedure to add airport
app.post("/api/addAirport", (req, res) => {
  // make a call to cleanBody
  const cleanedBody = cleanBody(req.body);
  console.log("The cleanedBody is ", cleanedBody);

  const airportID = cleanedBody.airportID;
  const airport_name = cleanedBody.airport_name;
  const city = cleanedBody.city;
  const state = cleanedBody.state;
  const locationID = cleanedBody.locationID;

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
  const cleanedBody = cleanBody(req.body);
  console.log("The cleanedBody is ", cleanedBody);

  const personID = cleanedBody.personID;
  const license = cleanedBody.license;

  const query = `CALL grant_pilot_license(?, ?)`;
  connection.query(query, [personID, license], (err, results, fields) => {
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
  const cleanedBody = cleanBody(req.body);

  const airlineID = cleanedBody.airlineID;
  const tail_num = cleanedBody.tail_num;
  const seat_capacity = cleanedBody.seat_capacity;
  const speed = cleanedBody.speed;
  const locationID = cleanedBody.locationID;
  const plane_type = cleanedBody.plane_type;
  const skids = cleanedBody.skids;
  const propellers = cleanedBody.propellers;
  const jet_engines = cleanedBody.jet_engines;

  console.log(
    airlineID,
    tail_num,
    seat_capacity,
    speed,
    locationID,
    plane_type,
    skids,
    propellers,
    jet_engines
  );

  const query = `CALL add_airplane(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  connection.query(
    query,
    [
      airlineID,
      tail_num,
      seat_capacity,
      speed,
      locationID,
      plane_type,
      skids,
      propellers,
      jet_engines,
    ],
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

// Call procedure to add person
app.post("/api/addPerson", (req, res) => {
  const cleanedBody = cleanBody(req.body);
  console.log("The cleanedBody is ", cleanedBody);

  const personID = cleanedBody.personID;
  const first_name = cleanedBody.first_name;
  const last_name = cleanedBody.last_name;
  const locationID = cleanedBody.locationID;
  const taxID = cleanedBody.taxID;
  const experience = cleanedBody.experience;
  const flying_airline = cleanedBody.flying_airline;
  const flying_tail = cleanedBody.flying_tail;
  const miles = cleanedBody.miles;
  const query = `CALL add_person(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  connection.query(
    query,
    [
      personID,
      first_name,
      last_name,
      locationID,
      taxID,
      experience,
      flying_airline,
      flying_tail,
      miles,
    ],
    (err, results, fields) => {
      if (err) {
        console.error("Error adding person to database: ", err);
        res.sendStatus(500);
      } else {
        res.send(results);
      }
    }
  );
});

// Call procedure to offer flight
app.post("/api/offerFlight", (req, res) => {
  const cleanedBody = cleanBody(req.body);
  console.log("The cleanedBody is ", cleanedBody);

  const flightID = cleanedBody.flightID;
  const routeID = cleanedBody.routeID;
  const support_airline = cleanedBody.support_airline;
  const support_tail = cleanedBody.support_tail;
  const progress = cleanedBody.progress;
  const airplane_status = cleanedBody.airplane_status;
  const next_time = cleanedBody.next_time;
  const query = `CALL offer_flight(?, ?, ?, ?, ?, ?, ?)`;
  connection.query(
    query,
    [
      flightID,
      routeID,
      support_airline,
      support_tail,
      progress,
      airplane_status,
      next_time,
    ],
    (err, results, fields) => {
      if (err) {
        console.error("Error offering flight: ", err);
        res.sendStatus(500);
      } else {
        res.send(results);
      }
    }
  );
});

// Call procedure to purchase ticket
app.post("/api/purchaseTicket", (req, res) => {
  const cleanedBody = cleanBody(req.body);
  console.log("The cleanedBody is ", cleanedBody);

  const ticketID = cleanedBody.ticketID;
  const cost = cleanedBody.cost;
  const carrier = cleanedBody.carrier;
  const customer = cleanedBody.customer;
  const deplane_at = cleanedBody.deplane_at;
  const seat_number = cleanedBody.seat_number;
  const query = `CALL purchase_ticket_and_seat(?, ?, ?, ?, ?, ?)`;
  connection.query(
    query,
    [ticketID, cost, carrier, customer, deplane_at, seat_number],
    (err, results, fields) => {
      if (err) {
        console.error("Error purchasing ticket: ", err);
        res.sendStatus(500);
      } else {
        res.send(results);
      }
    }
  );
});

// Call procedure to add/update leg
app.post("/api/addupdateLeg", (req, res) => {
  const cleanedBody = cleanBody(req.body);
  console.log("The cleanedBody is ", cleanedBody);

  const legID = cleanedBody.legID;
  const distance = cleanedBody.distance;
  const departure = cleanedBody.departure;
  const arrival = cleanedBody.arrival;
  const query = `CALL add_update_leg(?, ?, ?, ?)`;
  connection.query(
    query,
    [legID, distance, departure, arrival],
    (err, results, fields) => {
      if (err) {
        console.error("Error adding/updating leg: ", err);
        res.sendStatus(500);
      } else {
        res.send(results);
      }
    }
  );
});

// Call procedure to start route
app.post("/api/startRoute", (req, res) => {
  const cleanedBody = cleanBody(req.body);
  console.log("The cleanedBody is ", cleanedBody);

  const routeID = cleanedBody.routeID;
  const legID = cleanedBody.legID;
  const query = `CALL start_route(?, ?)`;
  connection.query(query, [routeID, legID], (err, results, fields) => {
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
  const cleanedBody = cleanBody(req.body);
  console.log("The cleanedBody is ", cleanedBody);

  const routeID = cleanedBody.routeID;
  const legID = cleanedBody.legID;
  const query = `CALL extend_route(?, ?)`;
  connection.query(query, [routeID, legID], (err, results, fields) => {
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
  const cleanedBody = cleanBody(req.body);
  console.log("The cleanedBody is ", cleanedBody);

  const flightID = cleanedBody.flightID;
  const query = `CALL flight_landing(?)`;
  connection.query(query, [flightID], (err, results, fields) => {
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
  const cleanedBody = cleanBody(req.body);
  console.log("The cleanedBody is ", cleanedBody);

  const flightID = cleanedBody.flightID;
  const query = `CALL flight_takeoff(?)`;
  connection.query(query, [flightID], (err, results, fields) => {
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
  const cleanedBody = cleanBody(req.body);
  console.log("The cleanedBody is ", cleanedBody);

  const flightID = cleanedBody.flightID;
  const query = `CALL passengers_board(?)`;
  connection.query(query, [flightID], (err, results, fields) => {
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
  const cleanedBody = cleanBody(req.body);
  console.log("The cleanedBody is ", cleanedBody);

  const flightID = cleanedBody.flightID;
  const query = `CALL passengers_disembark(?)`;
  connection.query(query, [flightID], (err, results, fields) => {
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
  const cleanedBody = cleanBody(req.body);
  console.log("The cleanedBody is ", cleanedBody);

  const flightID = cleanedBody.flightID;
  const personID = cleanedBody.personID;
  const query = `CALL assign_pilot(?, ?)`;
  connection.query(query, [flightID, personID], (err, results, fields) => {
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
  const cleanedBody = cleanBody(req.body);
  console.log("The cleanedBody is ", cleanedBody);

  const flightID = cleanedBody.flightID;
  const query = `CALL recycle_crew(?)`;
  connection.query(query, [flightID], (err, results, fields) => {
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
  const cleanedBody = cleanBody(req.body);
  console.log("The cleanedBody is ", cleanedBody);

  const flightID = cleanedBody.flightID;
  const query = `CALL retire_flight(?)`;
  connection.query(query, [flightID], (err, results, fields) => {
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
  const cleanedBody = cleanBody(req.body);
  console.log("The cleanedBody is ", cleanedBody);

  const personID = cleanedBody.personID;
  const query = `CALL remove_passenger_role(?)`;
  connection.query(query, [personID], (err, results, fields) => {
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
  const cleanedBody = cleanBody(req.body);
  console.log("The cleanedBody is ", cleanedBody);

  const personID = cleanedBody.personID;
  const query = `CALL remove_pilot_role(?)`;
  connection.query(query, [personID], (err, results, fields) => {
    if (err) {
      console.error("Error removing pilot role: ", err);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});

// Call procedure to simulate flight
app.post("/api/simulationCycle", (req, res) => {
  console.log("The request body is ", req.body);

  // this doesn't take any parameters
  const query = `CALL simulation_cycle()`;
  connection.query(query, (err, results, fields) => {
    if (err) {
      console.error("Error simulating flight: ", err);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});
