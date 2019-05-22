var express = require('express');
var fs = require('fs');
var http = require('http');
var path = require('path');
var socket = require('socket.io');
var Redis = require('ioredis');

var app = express();
var server = http.createServer(app)
var io = socket(server);
var config = {
    host: process.env.HOST,
    password: process.env.PASSWORD,
    port: 6379,
};

var port = process.env.PORT || 3000;

app.get('/', function(req, res) {
    res.set('Content-Type', 'text/plain');
    res.send('Notebowl Push');
});

app.get('/_status', function(req, res) {
    // TODO enable / disable
    res.set('Content-Type', 'text/plain');

    if (fs.existsSync(path.join(process.env.TMPDIR, "down.txt"))) {
        res.status(503);
        res.send('DOWN');
    } else {
        res.send('OK');
    }
});

io.on('connection', function(socket) {
    var client = new Redis({port: config.port, host: config.host, password: config.password});

    socket.on('register', function(data, fn) {
        client.subscribe(data);
        fn && fn();
    });

    socket.on('disconnect', function() {
        client.quit();
    });

    client.on('message', function(channel, message) {
        socket.emit(channel, message);
    });
});

// Finally, listen on the port
console.log("Listening on port " + port + "...");
console.log("Polling from redis server " + config.host + ':' + config.port + "...");

server.listen(port);
