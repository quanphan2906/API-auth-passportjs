const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

require("dotenv").config();

const app = express();

//CONNECT TO MONGODB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(() => {
        console.log("Error connecting to MongoDB");
    });
mongoose.Promise = global.Promise;

//RUN PASSPORT CONFIG
require("./auth/passport");

//BODY-PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//INIT PASSPORT
app.use(passport.initialize());

//WRITING ROUTES
const routes = require("./routes/users");
const secureRoute = require("./routes/secure-routes");

app.use("/", routes);
//We plugin our jwt strategy as a middleware so only verified users can access this route
app.use("/user", passport.authenticate("jwt", { session: false }), secureRoute);

//HANDLE ERRORS
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err });
});

app.listen(process.env.PORT, () => {
    console.log("Server is listening on port: " + process.env.PORT);
});
