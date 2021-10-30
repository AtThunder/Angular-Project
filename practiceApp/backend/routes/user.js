const express = require("express");

const controller = require('../controllers/user')

const routes = express.Router();

routes.post("/signup", controller.createUser);

routes.post("/login", controller.userLogin);

module.exports = routes;
