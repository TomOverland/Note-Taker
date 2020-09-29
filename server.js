// Dependencies
const express = require("express");
const fs = require("fs");
const util = require("util");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Async Processes
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Setting up Express server
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Middleware
app.use(express.static("public"));

// Load HTML on GET requests
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//   Couldn't get "*" route to work as requested, found that "/" worked instead
//   app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

// Load API Routes on GET request
app.get("/api/notes", (req, res) => {
  readFile("./db/db.json", "utf8")
    .then((data) => {
      const notes = JSON.parse(data);
      res.json(notes);
    })
    .catch((err) => console.log(err));
});

// POST the request into a notes object
app.post("/api/notes", async (req, res) => {
  let notes = await readFile("./db/db.json", "utf8");
  notes = JSON.parse(notes);
  // give notes an ID
  req.body.id = uuidv4();
  notes.push(req.body);

  await writeFile("./db/db.json", JSON.stringify(notes));
  res.json(notes[notes.length - 1]);
});

// DELETE call to delete items based on ID
app.delete("/api/notes/:id", async (req, res) => {
  const id = req.params.id;

  let notes = await readFile("./db/db.json", "utf8");
  notes = JSON.parse(notes);
  // Filter through the notes array, removing the note with the ID that matches the deleted item
  notes = notes.filter((note) => note.id !== id);
  // write the notes array into the db.json file
  await writeFile("./db/db.json", JSON.stringify(notes));
  res.json(notes);
});

// Listen call
app.listen(PORT, () => {
  console.log(`Server listening at PORT: ${PORT}`);
});
