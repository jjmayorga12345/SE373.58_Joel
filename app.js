const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

const app = express();
const PORT = 3000;

require("./config/passport")(passport);

app.engine("handlebars", exphbs.engine({
    helpers: {
        ifEquals: function(arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        },
        formatDate: function(date) {
            if (!date) return "";
            return new Date(date).toISOString().split("T")[0];
        }
    }
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

const mongoURI = process.env.MONGO_URI || "mongodb+srv://joel101:joel123@employeedb.lw7av.mongodb.net/Empl?retryWrites=true&w=majority&appName=EmployeeDB";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => console.error(" MongoDB Connection Error:", err));

const employeeRoutes = require("./routes/employeeRoutes");
const authRoutes = require("./routes/auth");

app.use("/", employeeRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
