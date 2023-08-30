"use strict";

require("doteng").config();

const SECRET_KEY = process.env.SECRET_KEY || "dev-secret";

const PORT = +process.env.PORT || 3001;

// Set Database URI
function getDatabaseUri(){
	return(process.env.NODE_ENV === "test")
		? "gather4grub_test"
		: process.env.DATABASE_URL || "gather4grub";
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("GatherForGrub Config:");
console.log("SECRET_KEY:", SECRET_KEY);
console.log("PORT:", PORT.toString());
console.log("Database:", getDatabaseUri());
console.log("---------------------")

module.exports = {
	SECRET_KEY,
	PORT,
	BCRYPT_WORK_FACTOR,
	getDatabaseUri
}