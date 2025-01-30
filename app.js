const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");
const methodOverride = require("method-override");

const app = express();
const PORT = 3000;

// 1 | might error
app.engine("handlebars", exphbs.engine({
    helpers: {
        ifEquals: function(arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        },
        formatDate: function(date) {
            if (!date) return "";
            return new Date(date).toISOString().split("T")[0];  // Convert to YYYY-MM-DD format
        }
    }
}));
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const mongoURI = "mongodb://localhost:27017/Empl";
mongoose.connect(mongoURI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

const employeeRoutes = require("./routes/employeeRoutes");
app.use("/", employeeRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
