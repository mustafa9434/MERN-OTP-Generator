const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const port = process.env.SERVER_PORT;

// routes
const userRoutes = require('./routes/userRoutes');

// require db
app.use(bodyParser.json())
app.use(cors());
require('./config/db')

app.use('/', userRoutes);
app.get('/', (req, res) => {
    res.send('OTP Authentication')
})
app.use("*", (req, res, next) => {
    return res.status(404).json({msg: 'Route does not exist'})
  });

app.listen(port);
