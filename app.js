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

app.get('/', async (req, res, next) => {
  res.status(200).send(myTemplate({
    method: req.method,
    values: req.query,
  }));
})

app.post('/', async (req, res, next) => {
  res.status(200).send(myTemplate({
    method: req.method,
    values: req.body,
  }));
})

module.exports.server = sls(app)