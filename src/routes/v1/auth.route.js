"use strict";
const express = require("express");
const { validate } = require("../../middleware/validate.middleware")
const tokenSchema = require("../../validators/token.schema.json");
const registerSchema = require("../../validators/register.schema.json");
const authControllers = require("../../controllers/auth.controller");

const router = new express.Router();

router.post("/token", validate(tokenSchema), authControllers.token);
router.post("/register", validate(registerSchema), authControllers.register);
router.get('/check/username', authControllers.checkUsername)
router.get('/check/email', authControllers.checkEmail)

module.exports = router;