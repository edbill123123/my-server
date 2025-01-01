const session = require('express-session');
const express = require("express");
require('dotenv').config();

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

export default session = (req, res) => {

}