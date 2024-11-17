const express = require("express");
const UserController = require("./UserController");

const router = express.Router();

router.post("/create", UserController.createUser);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);

module.exports = router;

