"use strict";

const express = require("express");

const { ensureLoggedIn, ensureDishAddedBy } = require('../../middleware/auth.middleware');
const { validate } = require("../../middleware/validate.middleware");
const newDishSchema = require("../../validators/newDish.schema.json");
const updateDishSchema = require("../../validators/updateDish.schema.json")
const dishControllers = require("../../controllers/dishes.controller");
const { update } = require("../../models/user.model");

const router = express.Router();

router
	.route('/')
	.all(ensureLoggedIn)
	.get(dishControllers.getAllDishes)
	.post(
		validate(newDishSchema), 
		dishControllers.postDish);

router
	.route('/:dishId')
	.get(dishControllers.getDish)
	.put(
		validate(updateDishSchema),
		dishControllers.putDish)
	.delete(
		dishControllers.deleteDish)

module.exports = router