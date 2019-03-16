const sqlite3 = require('sqlite3').verbose();
const DB_PATH = './db/coralSea.db';

//SQL statements
var selectTop10 = "SELECT uid, uname, score FROM players ORDER BY score LIMIT 10;";


function DatabaseAPI(){
	const DB = new sqlite3.Database(DB_PATH, function(err){
		if (err){
			console.log(err);
			return
		}
		console.log('Connected to ' + DB_PATH + ' database.');
		DB.exec(' PRAGMA foreign_keys = ON;', function(error){
			if (error){
				console.error("Pragma statement didn't work. ");
			}else{
				console.log("Foreign Key Enforcement is on.");
			}
		});
	});
	
	return{
		getTop10: function(_callback){
			DB.all(selectTop10,[], function(error, rows){
				if(error){
					console.log(error);
					return
				}
				_callback(rows);
			});
		}
		//add comma to previous line and write more here if needed
	}
}

module.exports = {DatabaseAPI}