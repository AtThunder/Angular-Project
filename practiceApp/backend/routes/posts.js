const express = require("express");

const checkAuth = require("../middleware/checkAuth");
const controller = require("../controllers/posts");
const extractFile = require("../middleware/file");

const routes = express.Router();

routes.get("", controller.getPosts);

routes.get("/:id", controller.getPostsByID);

routes.post("", checkAuth, extractFile, controller.savePosts);

routes.put("/:id", checkAuth, extractFile, controller.updatePost);

routes.delete("/:id", checkAuth, controller.deletePost);

module.exports = routes;
