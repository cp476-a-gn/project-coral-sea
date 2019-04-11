//var user_name = "";
function openRegister(){
	document.getElementById("sidebar").style.width = "25vw";
	document.getElementById("pas_rep").style.display = "flex"; 
	document.getElementById("reg_name").innerHTML = "Registration"; 
	document.getElementById("btnChanging").setAttribute("onclick", "register()"); 
	//var fAction = 0;
};

function openLogin(){
	document.getElementById("sidebar").style.width = "25vw";
	document.getElementById("pas_rep").style.display = "none"; 
	document.getElementById("reg_name").innerHTML = "Login"; 
	document.getElementById("btnChanging").setAttribute("onclick", "login()"); 
	//var fAction = 1;
};

function closeBar(){
	document.getElementById("sidebar").style.width = "0";
	document.getElementById("pas_rep").style.display = "none"; 
};

function register(){
	//var socket = io();
	var data = $('#userForm').serializeArray().reduce(function(obj, item){
		obj[item.name] = item.value;
		return obj;
	}, {});
	var userData = JSON.stringify(data);
	socket.emit('registerNew', userData);
	
};

function login(){
	//var socket = io();
	var data = $('#userForm').serializeArray().reduce(function(obj, item){
		obj[item.name] = item.value;
		return obj;
	}, {});
	var userData = JSON.stringify(data);
	socket.emit('loginUser', userData);
};

$(function(){
	//var socket = io(); 
	var errors = null;
	socket.on('registrationResult', (msg) => {
			regResults = JSON.parse(msg);
			$erText="";
			if (regResults.result == '1'){
				$erText = "<p> Welcome on board! </p>";
			}else{
				$erText ="";
				$erText += "<p> Got errors: </p><p class='errorM'>";
			
				for (var err of regResults.errors) {
					if (err == 0){
						$erText += "User name cannot be empty<br>";
					}
					if (err == 1){
						$erText += "User name is already taken<br>";
					}
					if (err == 2){
						$erText += "Password cannot be empty<br>";
					}
					if (err == 3){
						$erText += "Repeated password cannot be empty<br>";
					}
					if (err == 4){
						$erText += "Passwords should match<br>";
					}
				}
				$erText +="</p>";
			}
			$("#regResults").html($erText);
	});
	socket.on('loginResult',(msg) =>{
		logResults = JSON.parse(msg);
		$resText="";
		if (logResults[2] == 1){
			$resText += "Welcome back, captain!";
			user_name = document.getElementById("name").value
			document.cookie = "name=" + user_name;
		}else{
			if (logResults[0] == 1){
				$resText += "Uername and password cannot be empty";
			}
			if (logResults[1] == 1){
				$resText += "Wrong username or password";
			}
		}
		$("#regResults").html($resText);
	})
});