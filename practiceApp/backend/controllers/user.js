const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then((result) => {
          res.status(201).json({
            message: "User created.",
            userData: result,
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    });
  }

  exports.userLogin = (req, res, next) => {
    let userData;
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            message: "Auth failed.",
          });
        }
        userData = user;
        return bcrypt.compare(req.body.password, user.password);
      })
      .then((result) => {
        if (!result) {
          return res.status(401).json({
            message: "Enter correct password.",
          });
        }
        const token = jwt.sign(
          {
            email: req.body.email,
            UserId: userData._id,
          },
          process.env.JWT_KEY, //this is answer to facebook verified unique users to give access to content in authority of user.
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          UserId: userData._id
        });
      })
      .catch((err) => {
        res.status(401).json({
          message: "Bcrypt failed_",
        });
      });
  }