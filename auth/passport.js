const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const UserModel = require("../models/Users");

//create a passport middleware to handle registration
passport.use(
    "register",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        async (email, password, done) => {
            try {
                const user = await UserModel.create({ email, password });
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

//create a passport middleware to handle regisration
passport.use(
    "login",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password" //actually, this is automatic in passport
        },
        async (email, password, done) => {
            try {
                const user = await UserModel.findOne({ email });
                if (!user) {
                    return done(null, false, { message: "User not found" });
                }

                const validate = await user.isValidPassword(password);
                if (!validate) {
                    return done(null, false, { message: "Wrong Password" });
                }

                return done(null, user, { message: "Logged in successfully" });
            } catch (error) {
                return done(error);
            }
        }
    )
);

const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

passport.use(
    new JWTStrategy(
        {
            secretOrKey: "top_secret",
            jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token")
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (err) {
                done(err);
            }
        }
    )
);
