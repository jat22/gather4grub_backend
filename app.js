"use strict";

const express = require("express");
const cors = require("cors");

const morgan = require("morgan");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users")
const { NotFoundError } = require("./expressError");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use("/auth", authRoutes)
app.use("/users", userRoutes)

app.use(function (req, res, next){
	return next(new NotFoundError());
})

module.exports = app;