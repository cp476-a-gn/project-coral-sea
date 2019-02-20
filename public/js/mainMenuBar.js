function openRegister(){
	document.getElementById("sidebar").style.width = "30vw";
	document.getElementById("pas_rep").style.display = "block"; 
	document.getElementById("reg_name").innerHTML = "Registration"; 
}

function openLogin(){
	document.getElementById("sidebar").style.width = "30vw";
	document.getElementById("pas_rep").style.display = "none"; 
	document.getElementById("reg_name").innerHTML = "Login"; 
}

function closeBar(){
	document.getElementById("sidebar").style.width = "0";
	document.getElementById("pas_rep").style.display = "none"; 
}