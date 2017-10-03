var express = require('express');
var fs      = require('fs');
var http    = require('http');
var path    = require('path');
var socket  = require('socket.io');
var Redis   = require('ioredis');
var YAML    = require('yamljs');

var app    = express();
var server = http.createServer(app)
var io     = socket(server);
var config = {};

if (process.env.CONFIG_PATH) {
  config = YAML.load(process.env.CONFIG_PATH);
}

var port = process.env.PORT || config.port || 3000;
var redis = config.redis || {
    'port': 6379,
    'host': 'redis',
};

app.get('/', function(req, res) {
  res.set('Content-Type', 'text/plain');
  res.send('NoteBowl Push');
});

app.get('/_status', function(req, res){
  // TODO enable / disable
  res.set('Content-Type', 'text/plain');
  if (fs.existsSync(path.join(process.env.TMPDIR, "down.txt"))) {
    res.status(503);
    res.send('DOWN');
  } else {
    res.send('OK');
  }
});

io.on('connection', function (socket) {
  if (redis.sentinel) {
    var client = new Redis({
      name: redis.cluster,
      sentinels: redis.sentinel.map(function (addr) {
        return {
          host: addr.split(":")[0],
          port: parseInt(addr.split(":")[1], 10),
        };
      })
    });
  } else {
    var client = new Redis(redis.port, redis.host);
  }

  socket.on('register', function (data, fn) {
    client.subscribe(data);
    fn && fn();
  });

  socket.on('disconnect', function () {
    client.quit();
  });

  client.on('message', function(channel, message) {
    socket.emit(channel, message);
  });
});

// Finally, listen on the port
console.log("Listening on port " + port + "...");
console.log("Polling from redis server " + redis.host + ':' + redis.port + "...");
server.listen(port);
