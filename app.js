const bodyParser = require('body-parser');
const handlebars = require('handlebars');
const sls = require('serverless-http');
const express = require('express');
const fs = require('fs');

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const templateFile = fs.readFileSync('index.hbs', 'utf-8');
const myTemplate = handlebars.compile(templateFile);

function extractRequest(req) {
  return {
    'headers': req.headers || {},
    'connection': req.connection || {},
    'url': req.url || "",
    'originalUrl': req.originalUrl || "",
    'query': req.query || {},
    'body': req.body || {},
    'files': req.files || {},
    'cookies': req.cookies || {},
    'signedCookies': req.signedCookies || {},
  };
}

function requestJson(req) {
  return JSON.stringify(
    extractRequest(req),
    null,
    2
  );
}

app.get('/', async (req, res, next) => {
  res.status(200).send(myTemplate({
    method: req.method,
    values: req.query,
    request: requestJson(req)
  }));
})

app.post('/', async (req, res, next) => {
  res.status(200).send(myTemplate({
    method: req.method,
    values: req.body,
    request: requestJson(req)
  }));
})

module.exports.server = sls(app)