const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const db = new sqlite3.Database('./db.sqlite');

app.use(express.json());

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, room TEXT, message TEXT)");
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], function(err) {
    if (err) {
      res.status(500).send("Error registering user");
    } else {
      res.status(200).send("User registered");
    }
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err || !user || !bcrypt.compareSync(password, user.password)) {
      res.status(400).send("Invalid credentials");
    } else {
      res.status(200).send("Login successful");
    }
  });
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chatMessage', ({ room, message }) => {
    db.run("INSERT INTO messages (room, message) VALUES (?, ?)", [room, message], function(err) {
      if (err) {
        console.error(err.message);
      } else {
        io.emit('message', message);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on :3000');
});
