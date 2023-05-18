const port = 8081
const express = require('express');

app = express();

app.use(express.static('client'));

app.listen(port);

console.log(`listing on ${port}`);