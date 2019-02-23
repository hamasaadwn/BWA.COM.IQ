var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "1002823797362-a9mafmfl55djhhrmn2runnft764t0962.apps.googleusercontent.com",
      clientSecret: "8mQbGda03TWzZp7tlWODVMUh",
      callbackURL: "http://localhost:3000/auth/google/callback"
    },
    (accessToken, refreshToken, profile, cb) => {
      User.findOne(
        { userid: profile.id },
        // {
        //   name: profile.displayName,
        //   userid: profile.id,
        //   email: profile.emails
        // },
        (err, user) => {
          if (!user) {
            user = new User({
              name: profile.displayName,
              email: profile.emails[0].value,
              userid: profile.id
            });
            user.save(err => {
              if (err) console.log(err);
              return cb(err, user);
            });
          } else {
            //found user. Return
            return cb(err, user);
          }
        }
      );
    }
  )
);

module.exports = passport;
