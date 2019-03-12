const sqlite3 = require('sqlite3').verbose();

function DatabaseAPI(DB_PATH){
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
}

module.exports = {DatabaseAPI}