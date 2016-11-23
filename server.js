var express = require('express');
var http    = require('http');
var socket  = require('socket.io');
var Redis   = require('ioredis');
var YAML    = require('yamljs');

var app    = express();
var server = http.createServer(app)
var io     = socket(server);

if (!process.env.CONFIG_FILE) {
  console.error("Missing CONFIG_FILE env variable");
  process.exit(1);
}

var config = YAML.load(process.env.CONFIG_FILE);

app.get('/', function(req, res) {
  res.send('NoteBowl Push');
});

app.get('/_status', function(req, res){
  res.send('OK');
});

io.on('connection', function (socket) {
  if (config.redis.sentinel) {
    var client = new Redis({
      name: config.redis.cluster,
      sentinels: config.redis.sentinel.map(function (addr) {
        return {
          host: addr.split(":")[0],
          port: parseInt(addr.split(":")[1], 10),
        };
      })
    });
  } else {
    var client = new Redis(config.redis.port, config.redis.host);
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
console.log("Listening on port " + config.port + "...");
server.listen(config.port);
