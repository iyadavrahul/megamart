const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      // eslint-disable-next-line no-undef
      clientID: process.env.CLIENT_ID,
      // eslint-disable-next-line no-undef
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      //   callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    (request, accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;
