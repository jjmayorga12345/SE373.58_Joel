const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const router = express.Router();

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        req.flash("error_msg", "Please fill in all fields");
        return res.redirect("/auth/register");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        req.flash("error_msg", "Email already in use");
        return res.redirect("/auth/register");
    }

    const newUser = new User({ username, email, password });
    await newUser.save();
    req.flash("success_msg", "You are now registered! Please log in.");
    res.redirect("/auth/login");
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/auth/login",
        failureFlash: true
    })(req, res, next);
});

router.get("/logout", (req, res) => {
    req.logout(function(err) {
        if (err) return next(err);
        req.flash("success_msg", "You have logged out.");
        res.redirect("/auth/login");
    });
});

module.exports = router;
