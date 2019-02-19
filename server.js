// Declarations
var express = require('express');
var app = express();
var port = process.env.PORT || 8082;
var morgan = require('morgan');
var bodyParser = require('body-parser');

// Configure
app.use(morgan('dev'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));

// Routes
require('./routes/roots.js')(app);

// Launch
app.listen(port, '0.0.0.0', function(){
    console.log('Server Started on Port: ' + port);
});