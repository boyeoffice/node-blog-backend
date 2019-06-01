const express = require('express');
const router = express.Router();
const User = require('../model/user');
const passport = require('passport');
const mongoose = require('mongoose');

router.post('/register', (req, res, next) => {
  console.log(req.body.email);
  User.findOne({email: req.body.email})
      .exec()
      .then(user => {
        if(user){
          return res.status(422).json({
            message: "Email already in use"
          });
        }else{
          const password = req.body.password;
          const user = new User();
            user._id = new mongoose.Types.ObjectId();
            user.email = req.body.email;
            user.name = req.body.name;
            user.password = user.encryptPassword(password);
          user
            .save()
            .then(result => {
              console.log(result);
              res.status(201).json({
                message: "New user created"
              })
            }).catch(err => {
              console.log(err);
              res.status(500).json(err)
            });
        }
      });
});

router.post('/login', (req, res, next) => {
  User.findOne({email: req.body.email})
      .exec()
      .then(user => {
        if(user === null){
          return res.status(401).json({
            message: "Email or password does not match"
          });
        }
        if(!user.validPassword(req.body.password)){
          return res.status(401).json({
            message: "Password does not match"
          });
        }
        return res.status(200).json({
          message: "User logged in"
        });
      });
});
module.exports = router;