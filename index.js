const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

const app = express();
const api = require('./api');

// CORS
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());

app.use('/api', api);

// Catch 404
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  err.status === 404 ?
    res.status(404).send('Can\'t find that!') :
    res.status(500).send('Server Error!');
});

app.listen(3000, () => {
  console.log('Listening at http://localhost:3000');
});