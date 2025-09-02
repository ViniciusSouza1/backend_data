const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { json } = require('express');
const routes = require('./routes');
const app = express();
const path = require('path')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use(routes);
app.use(express.static(path.join(__dirname + 'public')));

//
const port = process.env.PORT || 3333;

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({ error: error.message });
});

app.listen(port);