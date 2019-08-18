const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const indexRoute = require('./Routes/index');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', indexRoute);

app.listen(3000);

module.express = app;