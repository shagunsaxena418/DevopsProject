// Name - Shagun Saxena
// Id - C0902202
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CSV file path (text file)
const filePath = 'mydb.txt';

// Utility function to read user data from CSV
const readUserData = () => {
    if (!fs.existsSync(filePath)) {
        return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    const users = data.split('\n').filter(line => line).map(line => {
        const [username, password] = line.split(',');
        return { username, password };
    });
    return users;
};

// Utility function to write user data to CSV
const writeUserData = (data) => {
    const csvData = data.map(user => `${user.username},${user.password}`).join('\n');
    fs.writeFileSync(filePath, csvData);
};

// Signup Route
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    const users = readUserData();

    // Check if user already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).send('User already exists.');
    }

    // Save new user
    users.push({ username, password });
    writeUserData(users);
    res.send('Signup successful!');
});

// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    const users = readUserData();

    // Authenticate user
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).send('Invalid credentials.');
    }

    res.send('Login successful!');
});

// Serve HTML pages for signup and login
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// Starting the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
