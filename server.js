require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const path = require('path');

const auth = require('./routes/auth');
const portItem = require('./routes/portitem');
const mailer = require('./routes/mailer');

app.use(express.json());

app.get("/index.html.var", (req, res) =>{
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.use("/api/auth", auth);
app.use("/api/portitem", portItem);
app.use("/api/mailer", mailer);

app.listen(3000);


