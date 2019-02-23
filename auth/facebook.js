var passport = require("passport"),
  FacebookStrategy = require("passport-facebook").Strategy;
var User = require("../models/User");

passport.use(
  new FacebookStrategy(
    {
      clientID: 1134063810105047,
      clientSecret: "4f22f977a669fa2d6125afec1ecb7d8a",
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ["id", "emails", "name"]
    },
    function(accessToken, refreshToken, profile, cb) {
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
              name: profile.name.givenName + " " + profile.name.familyName,
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
