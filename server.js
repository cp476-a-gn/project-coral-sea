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


io.on('connection', function(socket){
	function listUserNames(userIDs) {
						result = []
						var entry = JSON.stringify("meow");
						userIDs.forEach(row => {
							result.push(row);
						});
						entry = JSON.stringify(result);
						console.log("gonna return: " + entry);
						socket.emit('returnBoard', entry);
		}
		socket.on('getBoard', function(){
				db.getTop10(listUserNames);
		});
		socket.on('updateBoardW', function(userName){
			//console.log("gonna update score for " + userName);
			uname = JSON.parse(userName).name;
			db.updateWin(listUserNames);
		});
		socket.on('updateBoardL', function(userName){
			//console.log("gonna update score for " + userName);
			uname = JSON.parse(userName).name;
			db.updateWin(listUserNames);
		});
		
		socket.on('registerNew', function(userForm){
				//NEEDS MORE INPUT CHECKING BUT INSERTING NEW USER WORKS
				//console.log("registring new user " + userForm);
				
				function getRegResult(inputErrors, queryResult){
					//console.log("REGISTRATION RESULTS");
					//console.log(inputErrors);
					//console.log(queryResult);
					var result = {errors:inputErrors, result:queryResult};
					var entry = JSON.stringify(result);
					socket.emit('registrationResult', entry);
				}
				
				db.registerUser(userForm, getRegResult);
		});
		socket.on('loginUser', function(userForm){
				console.log("logging in user " + userForm);
				function getLoginResult(result){
					var entry = JSON.stringify(result);
					socket.emit('loginResult', entry);
					userData = JSON.parse(userForm)
					if(result[2] == 1){
						socket.handshake.session.player_name = userData.user_name;
						console.log("User name is: " + userData.user_name)
					}
				userData.user_name
				}
				
				db.loginUser(userForm, getLoginResult);
		});
});


/*

user connects ->

<- place in room

<- starts the game, send room number

enters game ->

sends room number ->



*/