// Declarations
var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 8082;
var morgan = require('morgan');
var bodyParser = require('body-parser');
var io = require('socket.io')(http);
//DB stuff
const { DatabaseAPI } = require('./db/database');
const DB_PATH = './db/coralSea.db';
var DB = new DatabaseAPI(DB_PATH);

// Configure
//app.use(morgan('dev'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/public'));
app.use('/resources', express.static(__dirname + '/public/resources/game'));

// Routes
require('./routes/roots.js')(app);

// Launch
http.listen(port, '0.0.0.0', function(){
    console.log('Server Started on Port: ' + port);
});


io.on('connection', function(socket){
    console.log("A user has sailed!");
    socket.on('disconnect', function(socket){
        console.log("A user has sailed to deeper waters!");
    });
    socket.on('player ready', function(msg){
        console.log("player ships submited");
    });
});

//DB.close()



