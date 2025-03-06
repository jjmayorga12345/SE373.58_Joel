const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const employeeSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    department: String,
    startDate: Date,
    jobTitle: String,
    salary: Number
});
const Employee = mongoose.model("Employee", employeeSchema, "employees");

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/auth/login");
}

router.get("/", ensureAuthenticated, async (req, res) => {
    try {
        const employees = await Employee.find().lean();
        res.render("home", { employees });
    } catch (err) {
        res.status(500).send("Error fetching employees");
    }
});

router.get("/addEmployee", ensureAuthenticated, (req, res) => {
    res.render("addEmployee");
});

router.post("/add-employee", ensureAuthenticated, async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        await newEmployee.save();
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error adding employee");
    }
});

router.get("/edit-employee/:id", ensureAuthenticated, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).lean();
        if (!employee) {
            return res.status(404).send("Employee not found");
        }
        res.render("updateEmployee", { employee });
    } catch (err) {
        res.status(500).send("Error loading update page");
    }
});

router.put("/update-employee/:id", ensureAuthenticated, async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedEmployee) {
            return res.status(404).send("Employee not found");
        }
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error updating employee");
    }
});

router.post("/delete-employee/:id", ensureAuthenticated, async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error deleting employee");
    }
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
    res.render("dashboard", { user: req.user });
});

module.exports = router;
