const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/todo", (req, res) => {
    res.sendFile(path.join(__dirname, "todo.json"));
});

app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/read-todo", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "read-todo.html"));
});

app.use((req, res) => {
    res.writeHead(301, { 'Location': 'http://' + req.headers['host'] + '/index' });
    res.end();
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
