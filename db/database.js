const sqlite3 = require('sqlite3').verbose();
var Crypto = require('crypto-js');
var SHA256 = require("crypto-js/sha256");
const DB_PATH = './db/coralSea.db';

//SQL statements
var selectTop10SQL = "SELECT uid, uname, score FROM players ORDER BY score DESC LIMIT 10;";
var insertNewSQL = "INSERT INTO players (uid, uname, pwd, score) VALUES ((select max(uid)+1 from players), ?, ?, ?);";
var checkUserSQL = "SELECT COUNT(uid) as counter FROM players WHERE uname = ?;";
var checkLoginSQL = "SELECT pwd FROM players WHERE uname = ?;";

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
	
	var checkUser = function(uname){
		return new Promise(function(resolve, reject){
				DB.get(checkUserSQL, uname, function(error, row){
					if (error){
						reject(error);
					}else{
						resolve(row);
					}
			});
		});
	}
	
	var checkLogin = function(uname){
		return new Promise(function(resolve, reject){
				DB.get(checkLoginSQL, uname, function(error, row){
					if (error){
						reject(error);
					}else{
						resolve(row);
					}
			});
		});
	}
	
	var insertUser = function(userData){
		return new Promise(function(resolve, reject){
			console.log("userData: "+userData);
				var uscore = "0";
				var uname = userData.user_name;
				var upass = userData.user_password;
				var hashed = Crypto.SHA256(upass);
				upass = hashed.toString();
				
				console.log("uname: " + uname + "  upass: " + upass);
				DB.run(insertNewSQL, [uname, upass, uscore], function(error){
					if (error){
						reject(error);
					}else{
						resolve(this.changes);
					}
			});
		});
	}
	
	function checkPasswords(userData, errorsAr){
		if (userData.user_password == ""){
				errorsAr.push("2");
			}
			if (userData.password_repeat == ""){
				errorsAr.push("3");
			}else{
				if (userData.user_password != userData.password_repeat){
					errorsAr.push("4");
				}
			}
			console.log(errorsAr);
			return
	}
	
	
	return{
		registerUser: function(userForm, _callback){
			/**
			* Error codes:
			* 0 - empty username
			* 1 - username already taken
			* 2 - empty password
			* 3 - empty password_repeat
			* 4 - password and password_repeat do not match
			*/
			var userData = JSON.parse(userForm);
			var errorsAr = [];
			var querySuccess = 0;
			console.log("user data");
			console.log(userData);
			if (userData.user_name == ""){
				console.log("empty user name");
				errorsAr.push("0");
				checkPasswords(userData, errorsAr);
				_callback(errorsAr, querySuccess);
			}else{
				checkUser(userData.user_name)
					.then(function (fullfilled){
						console.log(fullfilled);
						if (fullfilled.counter > 0){
							errorsAr.push("1");
						}
						checkPasswords(userData, errorsAr);
						if (errorsAr.length == 0){
							console.log("gonna add new user");
							insertUser(userData)
								.then(function (fullfilled){
									console.log("succes: " + fullfilled);
									querySuccess = fullfilled;
									_callback(errorsAr, querySuccess);
								})
								.catch(function(error){
									console.log("error: " + error.message);
									_callback(errorsAr, querySuccess);
								});
						}else{
							_callback(errorsAr, querySuccess);
						}
					})
					.catch(function(error){
						console.log("error: " + error.message);
						_callback(errorsAr, fullfilled);
					});
			}
			
		},
		loginUser: function(userForm, _callback){
			/**
			* resultsAr:
			* 0: 0 - non-empty inputs; 1- empty username or password
			* 1: 0 - correct user name and pwd; 1 - wrong username or password
			* 2: 0 - login failed; 1 - successfull login 
			*/
			var userData = JSON.parse(userForm);
			var resultsAr = [0, 0, 0];
			
			if (userData.user_name == "" || userData.user_password == ""){
				console.log("empty user name or password");
				resultsAr[0] = 1;
				_callback(resultsAr);
			}else{
				var passHash = userData.user_password;
				//Crypto.SHA256(passHash).toString;
				var passHash = Crypto.SHA256(userData.user_password);
				checkLogin(userData.user_name)
					.then(function (fullfilled){
						console.log(fullfilled);
						if (fullfilled.pwd != passHash.toString()){
							resultsAr[1] = 1;
						}else{
							resultsAr[2] = 1;
						}
						_callback(resultsAr);
					})
					.catch(function(error){
						console.log("error: " + error.message);
						_callback(resultsAr);
					});
			}
		},
		
		getTop10: function(_callback){
			DB.all(selectTop10SQL,[], function(error, rows){
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