"use strict";

const express = require("express");
const cors = require("cors");

const morgan = require("morgan");
const authMiddleware = require("./middleware/auth.middleware")
const authRoutes = require("./routes/v1/auth.route");
const userRoutes = require("./routes/v1/users.route");
const eventRoutes = require("./routes/v1/events.route");
const dishRoutes = require("./routes/v1/dishes.route")
const { NotFoundError } = require("./expressError");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authMiddleware.authenticateToken);

app.use("/auth", authRoutes); 
app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/dishes", dishRoutes);

app.use(function (req, res, next){
	return next(new NotFoundError());
})

app.use(function (err, req, res, next) {
	if (process.env.NODE_ENV !== "test") console.error(err.stack);
	console.log(err.message)
	const status = err.status || 500;
	const message = err.message;
  
	return res.status(status).json({
	  error: { message, status },
	});
  });

module.exports = app;