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

// https
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('./private/214080987710559.key', 'utf8'),
  cert: fs.readFileSync('./private/214080987710559.pem', 'utf8')
};

https.createServer(options, app).listen(443, '112.74.90.33', () => {
  console.log('Listening at https://112.74.90.33:443');
});