/*
 * Places horizontal ship in a valid position on the grid
 */
function openInstructions(){
	document.getElementById("bottombar").classList.add("visible")
	if(document.getElementById("bottombar").classList.contains("hidden")){
		document.getElementById("bottombar").classList.remove("hidden")
	}
}	

function closeInstructions(){
	document.getElementById("bottombar").classList.add("hidden")

	if(document.getElementById("bottombar").classList.contains("visible")){
		document.getElementById("bottombar").classList.remove("visible")
	}
}
 
function snapToGridHorizontal(position, userGrid, width){
    var unitSize = userGrid.width / 10;
    var gridStartX = userGrid.x - (userGrid.width / 2);
    var gridStartY = userGrid.y - (userGrid.height / 2);
    var endX = gridStartX + userGrid.width;
    var realX = gridStartX + unitSize*(Math.floor((position.x - gridStartX)/unitSize));  //left corner position
    var realY = gridStartY + unitSize*(Math.floor((position.y - gridStartY)/unitSize));
    
		var endPointR = realX + width;    
		if (endPointR > endX) realX = realX - (endPointR - endX);
    else if (realX < gridStartX) realX = realX + (gridStartX - realX);

    position.x = realX;
    position.y = realY;
    //checkCollision();
		
    return position;
}

/*
 * Places vertical ship in a valid position on the grid 
 */
function snapToGridVertical(position, userGrid, width){

    var unitSize = userGrid.height / 10;
    var gridStartX = userGrid.x - (userGrid.width / 2);
    var gridStartY = userGrid.y - (userGrid.height / 2);
    var endY = gridStartY + userGrid.height;
		var realX = gridStartX + unitSize*(Math.floor((position.x - gridStartX)/unitSize));  //left corner position
    var realY = gridStartY + unitSize*(Math.floor((position.y - gridStartY)/unitSize));
    		
		var endPointB = realY + width;
		if (realY < gridStartY) realY = realY + (gridStartY - realY);
		else if (endPointB > endY) realY = realY - (endPointB - endY);
    
    position.x = realX;
    position.y = realY;
   // checkCollision();
		
    return position;
}

/*
 * Fixes ship's location after it was rotated from horizontal to vertical position
 */
function adjustLocationH2V(ship, userGrid){
		var gridStartX = userGrid.x - (userGrid.width / 2);
		var gridStartY = userGrid.y - (userGrid.height / 2);
		
		ship.x += ship.height;
		var endPointB = ship.y + ship.width;
		var gridEndY = gridStartY + userGrid.height;
		if (endPointB > gridEndY) ship.y -= (endPointB - gridEndY);

}

/*
 * Fixes ship's location after it was rotated from horizontal to vertical position
 */
function adjustLocationV2H(ship, userGrid){
		var gridStartX = userGrid.x - (userGrid.width / 2);
		var gridStartY = userGrid.y - (userGrid.height / 2);
		
		ship.x -= ship.height;
		var endPointR = ship.x + ship.width;
		var gridEndX = gridStartX + userGrid.width;
		if (endPointR > gridEndX) ship.x -= (endPointR - gridEndX);

}

/*
 * Checks that location is already occupied
 */
function checkOccupied(grid, curShip, allShips){

	var shipsNum = allShips.length;
	
	if (curShip.gridRotation == 0){ // the ship we are moving is horizontal
		var shipTC = pixel2grid(grid, curShip.x, curShip.y);
		shipX1 = shipTC.x;
		shipX2 = shipX1 + Math.floor(curShip.width/curShip.height)-1;
		shipY1 = shipTC.y;
		shipY2 = shipTC.y;
		
		var unitSize = curShip.height;
		var occupied = false;

		for (var i = 0; i <shipsNum; i++){ 
				if (allShips[i].gridRotation == 0) { //the ship with which we are comparing is horizontal
						var shipTC1 = pixel2grid(grid, allShips[i].x, allShips[i].y);
						ship2X1 = shipTC1.x;
						ship2X2 = ship2X1 + Math.floor(allShips[i].width/allShips[i].height)-1;
						ship2Y1 = shipTC1.y;
						ship2Y2 = shipTC1.y;
						
						var ship2ID = allShips[i].id;
					
					if ((curShip.id != ship2ID ) && (shipY1 == ship2Y1) && (((shipX1 >= ship2X1) && (shipX1 <= ship2X2)) || ((shipX2 >= ship2X1) && (shipX2 <= ship2X2)))){	
						
						occupied = true;
					}
				}else{   //if ship we are comparing with is vertical
					var shipTC2 = pixel2grid(grid, allShips[i].x, allShips[i].y);
					ship2X1 = shipTC2.x -1;
					ship2X2 = ship2X1;
					ship2Y1 = shipTC2.y;
					ship2Y2 = shipTC2.y + Math.floor(allShips[i].width/allShips[i].height)-1;

					var ship2ID = allShips[i].id;
					if ((curShip.id != ship2ID ) && (((shipX1 <= ship2X1) && (shipX2 >= ship2X2))
									&& (((shipY1 >= ship2Y1) && (shipY1 <= ship2Y2)) ))){

							occupied = true;
					}
				}
		}
	}else{ //the ship we are moving is vertical
		var shipTC = pixel2grid(grid, curShip.x, curShip.y);
		shipX1 = shipTC.x - 1;
		shipX2 = shipX1;
		shipY1 = shipTC.y;
		shipY2 = shipTC.y + Math.floor(curShip.width/curShip.height)-1;
		var occupied = false;
		for (var i = 0; i <shipsNum; i++){ 							
			if (allShips[i].gridRotation == 0) { //if ship with which we are comparing is horizontal
					var shipTC1 = pixel2grid(grid, allShips[i].x, allShips[i].y);
					ship2X1 = shipTC1.x;
					ship2X2 = shipTC1.x + Math.floor(allShips[i].width/allShips[i].height)-1;
					ship2Y1 = shipTC1.y;
					ship2Y2 = shipTC1.y;

					var ship2ID = allShips[i].id;
					if (ship2Y1 < 10){
					
						if ((curShip.id != ship2ID ) && (((shipX1 >= ship2X1) && (shipX2 <= ship2X2))
							&& (((shipY1 <= ship2Y1) && (shipY2 >= ship2Y1)) || ((shipY1 >= ship2Y1) && (shipY2 <= ship2Y2))))){ 
							occupied = true;
						}
					}
				}else{   //if ship we are comparing with is vertical
					var shipTC2 = pixel2grid(grid, allShips[i].x, allShips[i].y);
					ship2X1 = shipTC2.x + 1;
					ship2X2 = ship2X1;
					ship2Y1 = shipTC2.y;
					ship2Y2 = shipTC2.y + Math.floor(allShips[i].width/allShips[i].height)-1;
					if (ship2Y1 < 10){
					
						var ship2ID = allShips[i].id;
						if ((curShip.id != ship2ID ) && (shipX1 == ship2X1) && (((shipY2 >= ship2Y1) && (shipY2 <= ship2Y2)) || ((shipY1 >= ship2Y1) && (shipY1 <= ship2Y2)))){	
							occupied = true;
							}	
					}
				}
			}
	}
	return occupied;
}

function pixel2grid(grid, posX, posY){
	var unit_size = grid.width / 10;
	
	var locX = Math.floor(((posX + unit_size/2)-(grid.x - grid.width/2))/unit_size);
	var locY = Math.floor(((posY + unit_size/2)-(grid.y - grid.height/2))/unit_size);
	var cell = {x: locX, y:locY}
	
	return cell;
}

function pixel2gridFire(grid, posX, posY){
	var unit_size = grid.width / 10;
	
	var locX = Math.floor((posX - (grid.x - grid.width/2))/unit_size);
	var locY = Math.floor((posY - (grid.y - grid.height/2))/unit_size);
	var cell = {x: locX, y:locY}
	
	return cell;
}

function grid2pixel(grid, posX, posY){
	var unit_size = grid.width / 10;
	var x = posX*unit_size + (grid.x - (grid.width / 2));
	var y = posY*unit_size + (grid.y - (grid.height / 2));
	var converted_location = [x, y];
	
	return converted_location;
	
}

function createShipJSON(cell, type, direction){
	var ship_obj = {"x": cell.x, "y": cell.y, "type": type, "direction": direction};
	if (type < 1 || type >5){
		type = 1;
	}
	if (direction < 0 || direction >1){
		direction = 0;
	}
	var ship =JSON.stringify(ship_obj);
	
	return ship;
}

function createShotJSON(cell){
	var shot = JSON.stringify(cell);
	
	return shot;
}

function readJSON(hit_loc){
	var hit = JSON.parse(hit_loc);
	return hit;
}

function updateStatusBar(msg, status){
	document.getElementById("indicatorT").innerHTML = msg;
	classList = document.getElementById("indicatorD").classList;
	classList.remove("animate");
	document.getElementById("indicatorT").offsetWidth;
	classList.add("animate");
	if(status != null){
		if (classList.contains("indicateSuccess")) classList.remove("indicateSucess");
		if (classList.contains("indicateFail")) classList.remove("indicateFail");
		if (classList.contains("indicateYield")) classList.remove("indicateYield");
		switch(status){
			case "success":
				classList.add("indicateSuccess");
				break;
			case "fail":
				classList.add("indicateFail");
				break;
			case "yield":
				classList.add("indicateYield");
				break;			
		}
	}
}

/**
 * Setup screen for the actual game
**/
function startGame(){
	document.getElementsByClassName("ready")[0].classList.remove("readyShow");
}

function fire_aux(e){
	fire(e, finishTurn)
}

/**
 * Make a shot here
**/ 

/**
  * Shoot opponent
 **/
function fire(e, _callback){
	
	var shot = e.data.global;
	var grid = getOponGrid();
	var shotLoc = pixel2gridFire(grid, e.data.global.x, e.data.global.y);
	var taken = testShots(shotLoc);
	if (!taken){
		var dataToServer  = {'shotLoc':shotLoc, 'seq_id':seq_id};
		var dataToServerJSON = JSON.stringify(dataToServer);
		//socket.emit('finish turn', dataToServerJSON);
		_callback(dataToServerJSON);
	} else updateStatusBar("Can't shoot at the same place twice", "yield");
}

/**
  * Warn user that it's not their turn
 **/
function turnWarn(event){
}

function finishTurn(dataToServerJSON){
	socket.emit('finish turn', dataToServerJSON);
}

function testShots(shotLoc){
	var shots = getShots();
	var found = false;
	var iter = shots.length - 1;
	
	while (!found && iter >=0){
		if (shots[iter].x === shotLoc.x && shots[iter].y === shotLoc.y)
			found = true;
		iter --;
	}
	if (found){ 
		return true;
	}else{
		shots.push(shotLoc);
		return false;
	}

	
}

function endMessage(win){
	msg = "";
	if(win) msg = "You Win!";
	if(!win) msg = "You Lose ¯\\_(ツ)_/¯";
	end = document.getElementById("endWindow");
	var height = window.innerHeight * 0.5;
	var width = height * 3 / 2
	var left = (window.innerWidth - width) / 2;
	end.style.width = width + "px";
	end.style.height = height + "px";
	end.style.left = left + "px";
	document.getElementById("endText").innerHTML = msg;
}

function redirectW(){
	window.location.replace("/scorePlayerW")
}

function redirectL(){
	window.location.replace("/scorePlayerL")
}


