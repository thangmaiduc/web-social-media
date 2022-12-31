const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/').User;
const otpGenerator = require('otp-generator');
passport.serializeUser(function (user, done) {
  /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      /*
     use the profile info (mainly profile id) to check if the user is registerd in ur db
     If yes select the user and pass him to the done callback
     If not create the user and then select him and pass to callback
    */

      try {
        // console.log(JSON.stringify(profile));
        const data = profile._json;
        // console.log(profile._json);
        const checkUser = await User.findOne({ where: { email: data.email }, raw: true });
        let OTP = otpGenerator.generate(6, {
          digits: true,

          specialChars: false,
        });
        if (checkUser) {
          // console.log('checkUser:=========>',checkUser);
          return done(null, checkUser);
        }
        username = data.email.split('@')[0];
        const newUser = await User.create({
          email: data.email,
          fullName: data.name,
          username,
          profilePicture: data.picture,
          password: OTP,
        });
        // console.log('newUser:=========>',newUser);
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);
