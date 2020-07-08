require('dotenv').config();

const express = require('express');
const session = require('express-session');
const massive = require('massive');

const auth = require('./middleware/authMiddleware');
const authCtrl = require('./controllers/authController');
const treasureCtrl = require('./controllers/treasureController');

const {CONNECTION_STRING, SESSION_SECRET} = process.env;

const app = express();
const PORT = 4000;
app.use(express.json());

massive({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false}
}).then(db => {
    app.set('db', db);
    console.log("DATABASE CONNECTED")
})

app.use(
    session({
        resave: true,
        saveUninitialized: false,
        secret: SESSION_SECRET
    })
);

app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);

app.listen(PORT, () => console.log("Server is running on " + PORT))