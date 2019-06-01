const express = require('express');
const router = express.Router();
const User = require('../model/user');
//const passport = require('passport');
const mongoose = require('mongoose');

router.post('/register', (req, res, next) => {
  const {name, email, password} = req.body;
  req.checkBody('name')
          .trim()
          .notEmpty()
          .withMessage('Name must be specified')
          .isLength({min: 3, max: 40})
          .withMessage('Name must be between 3 to 40 charaters')
  req.checkBody('email')
          .trim()
          .notEmpty()
          .withMessage('Email must be specified')
          .isEmail()
          .withMessage('Please input valid email address');
  req.checkBody('password')
          .trim()
          .notEmpty()
          .withMessage('Password must be specified')
          .isLength({min: 6})
          .withMessage('Password must be at least 6 charaters');
  req.checkBody('confirm_password', 'Password don\'t match')
          .equals(password);
  var errors = req.validationErrors();
  if(errors){
    var messages = [];
    errors.forEach((error) => {
      messages.push(error)
    });
    return res.status(422).json(messages);
  }
  User.findOne({email: email})
      .exec()
      .then(user => {
        if(user){
          return res.status(422).json({
            message: "Email already in use"
          });
        }else{
          //const password = req.body.password;
          const user = new User();
            user._id = new mongoose.Types.ObjectId();
            user.email = email;
            user.name = name;
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
  const {email, password} = req.body;
  req.checkBody('email')
      .trim()
      .notEmpty()
      .withMessage('Email must be specified');
  req.checkBody('password')
      .trim()
      .notEmpty()
      .withMessage('Password field is required')
      .isLength({min: 3})
      .withMessage('Please enter a valid password')
  User.findOne({email: email})
      .exec()
      .then(user => {
        if(user === null){
          return res.status(401).json({
            message: "Email or password does not match"
          });
        }
        if(!user.validPassword(password)){
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