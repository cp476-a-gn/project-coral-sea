 // Declarations
var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 8082;
var morgan = require('morgan');
var bodyParser = require('body-parser');
var io = require('socket.io')(http);
var session = require("express-session")({
	secret: "WeLoveCP476NG",
	resave: true,
	savedUninitialized: true
});

var sharedsession = require("express-socket.io-session");

//DB stuff
const { DatabaseAPI } = require('./db/database.js');
var db = new DatabaseAPI();

// Configure
//app.use(morgan('dev'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
app.use('/resources', express.static(__dirname + '/public/resources/game'));
app.use(bodyParser.json());
app.use(session);

io.use(sharedsession(session));

// Routes
require('./routes/roots.js')(app);

// Launch
http.listen(port, '0.0.0.0', function(){
    console.log('Server Started on Port: ' + port);
});

//game server
require('./Game Server/gameServer.js')(app, io);


/*

user connects ->

<- place in room

<- starts the game, send room number

enters game ->

sends room number ->



*/