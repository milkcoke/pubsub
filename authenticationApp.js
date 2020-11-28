
require('dotenv').config()

//this app just support login/logout + refresh token

const express = require('express')
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());



app.use('/posts/login', require('./routes/jwt_test/login'));



module.exports = app;