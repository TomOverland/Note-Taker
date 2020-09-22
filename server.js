const express = require('express');
const fs = require('fs');
const util = require('util');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();

const PORT = process.env.PORT || 3000;

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load pages on GET requests
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'))
});

// Load notes page on GET request
app.get('/api/notes', (req, res) => {
    readFileAsync('./db/db.json', 'utf8')
    .then((data) => {
        const notes = JSON.parse(data);
        res.json(notes);
    })
    .catch((err) => console.log(err));
})

// POST the request into a notes object
app.post("./api/notes", async (req, res) => { 
    let notes = await readFileAsync('./db/db.json', 'utf8');
    notes = JSON.parse(notes);
    req.body.id = uuidv4();
    notes.push(req.body);

    await writeFileAsync('./db/db.json', JSON.stringify(notes));
    res.json(notes[notes.length -1]);
});

app.delete('/api/notes/:id', async (req, res) => {
    const id = req.params.id;

    let notes = await readFileAsync("./db/db.json", "utf8");
    notes = JSON.parse(notes);

    notes = notes.filter((note) => note.id !== id);

    await writeFileAsync("./db/db.json", JSON.stringify(notes));
    res.json(notes);
});

app.listen(PORT, () => {
    console.log(`Server is now listening at http://localhost:${PORT}`)
})