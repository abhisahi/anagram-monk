var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var socketsMap = {};


//Global Application object
PROJECTX = {};

//Setting up application wide logging
var logger = require('winston');

PROJECTX.logger = logger;

var assert = require('assert');
PROJECTX.assert = assert;

//Setting config
var path = require('path'), config = require('jsconfig'), configFilePath = path.join(__dirname, 'config.js');
config.load(configFilePath, function () {
        PROJECTX.config = config;
        logger.info("Configuration file loaded");
});


(function () {
        //Initializing DB connection
        var mongo = require('mongodb');
	var db = new mongo.Db(PROJECTX.config.mongo_db, new mongo.Server(PROJECTX.config.mongo_domain, PROJECTX.config.mongo_port));
        logger.info("Mongo DB object created");
        PROJECTX.db = db;
        logger.info("Connected to DB");
}());





var words = ['wicked', 'profane', 'java', 'anshul', 'heartbeat', 'append', 'stylus', 'style', 'luck', 'cramp', 'tennis', 'cricket', 'technology', 'welcome'];
var currentWord = words[Math.floor(Math.random() * words.length)];

String.prototype.shuffle = function () {
    var a = this.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}

server.listen(3001);

app.use("/", express.static(__dirname + '/public'));

io.sockets.on('connection', function (socket) {
	console.log(socket.id);
	socketsMap[socket.id] = socket;
	
	socket.on('msg', function (data) {
		socket.emit('new', data);
		if (data.msg === currentWord){	
			io.sockets.emit('MYANAGRAM', data.name + ' got it right. The word was: ' + currentWord );
			currentWord = words[Math.floor(Math.random() * words.length)];
		}
 	});

	setInterval(function(){
		io.sockets.emit('MYANAGRAM', currentWord.shuffle());
	}, 15000);
});
