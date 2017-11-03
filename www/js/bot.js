
var express = require('express');
var bodyParser = require('body-parser');
var requet = require('request');
var app = express();
app.set('port', process.env.PORT || 5000);
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())
app.get('/webhook', function (req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === 'abcd124') {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
})