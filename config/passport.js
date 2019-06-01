const passport = require('passport');
const User = require('../model/user');
const LocalStrategy = require('passport-local').Strategy;
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done)=> {
  req.checkBody('email').notEmpty().withMessage('Email field must not be empty')
      .isEmail().withMessage('Must be email only');
  req.checkBody('password').notEmpty.withMessage('Password field must not be empty')
      .isLegth({min: 4}).withMessage('Password must be atleast 4 char long');
  req.checkBody('confirmedPassword', 'Password do not match').equals(req.body.password);
  req.checkBody('name').isAlpha().withMessage('Name field must be only alphabet')
      .notEmpty().withMessage('Name field is required')
      .isLength({min: 3}).withMessage('Name field must be atleast 3 char long');
  var errors = req.validationErrors();
  if(errors) {
    var messages = [];
    errors.forEach((error) => {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }
  User.findOne({'email': email}, (err, user) => {
    if(err){
      return done(err);
    }
    if(user){
      return done(null, false, {message: 'Email is already in use'});
    }
    var newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.name = req.body.name;
    newUser.save(function(err, result) {
      if(err){
        return done(err);
      }
      return done(null, newUser);
    });
  });
}));