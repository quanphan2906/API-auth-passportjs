const router = require("express").Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

router.post(
    "/register",
    passport.authenticate("register", { session: false }),
    async (req, res, next) => {
        res.json({
            message: "Signup successfully",
            user: req.user
        });
    }
);

router.post("/login", (req, res, next) => {
    passport.authenticate("login", async (err, user, info) => {
        try {
            if (err || !user) {
                const error = new Error("An error occurred");
                return next(error);
            }
            req.logIn(user, { session: false }, async error => {
                if (error) return next(error);
                const body = { _id: user._id, email: user.email };
                const token = jwt.sign({ user: body }, "top_secret");
                return res.json({ token, ...info });
            });
        } catch (err) {
            return next(err);
        }
    })(req, res, next);
});

module.exports = router;
