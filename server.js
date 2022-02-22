const express = require('express');

app = express();

app.use(express.static('client'));

app.listen(8080);