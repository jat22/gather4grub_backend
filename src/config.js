"use strict";

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "dev-secret";

const PORT = +process.env.PORT || 3001;

// Set Database URI
function getDatabaseUri(){
	return(process.env.NODE_ENV === "test")
		? "gather4grub_test"
		: process.env.DATABASE_URL || "postgresql:///gather4grub";
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;
const TOKEN_EXPIRATION = '1h'

console.log("GatherForGrub Config:");
console.log("SECRET_KEY:", SECRET_KEY);
console.log("PORT:", PORT.toString());
console.log("Database:", getDatabaseUri());
console.log("---------------------")

module.exports = {
	SECRET_KEY,
	PORT,
	BCRYPT_WORK_FACTOR,
	getDatabaseUri,
	TOKEN_EXPIRATION
}