{
  function exports(passport) {

    var LocalStrategy = require('passport-local').Strategy;
    var User = require('../app/models/user');

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        delete user.password;
        done(err, user);
      });
    });

    passport.use('local', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
      function(req, username, password, done) {

        User.findOne({
          username: username
        }, function(err, user) {

          if (err)
            return done(err);
          if (!user) {
            console.log(`No user found for username: [${username}]`);
            return done(null, false); // no user
          }

          if (!user.validPassword(password)) {
            console.log(`FAILED LOGIN ATTEMPT! INVALID PASS FOR USER: [${user.username}]`);
            return done(null, false); // password wrong
          }

          console.log(`SUCCESSFUL LOGIN OF USER: [${user.username}]`);
          return done(null, user);
        });

      }));

  }

  module.exports = exports;
}
