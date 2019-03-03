/*
 * Places horizontal ship in a valid position on the grid
 */
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
 * TODO: check that location is already occupied
 */
function checkOccupied(curShip, allShips){
	console.log("GONNA CHECK");

	var shipsNum = allShips.length;
	
	if (curShip.gridRotation == 0){ // if the ship we are oving is horizontal
		var unitSize = curShip.height;
		var shipX1 = curShip.x;
		var shipX2 = curShip.x + curShip.width;
		var shipY1 = curShip.y;
		var shipY2 = curShip.y + curShip.height; 
		var occupied = false;

		for (var i = 0; i <shipsNum; i++){ 
				//if (allShips[i].y < border){
						//console.log("y: " + allShips[i].y )
				if (allShips[i].gridRotation == 0) { //if ship with which we are comparing is horizontal
						//console.log("HORIZONTAL SHIP");
						var ship2X1 = allShips[i].x;
						var ship2X2 = allShips[i].x + allShips[i].width;
						var ship2Y1 = allShips[i].y;
						var ship2Y2 = allShips[i].y + allShips[i].height; 
						var ship2ID = allShips[i].id;
						//if ((shipY1 >= ship2Y1 && shipY1 <= ship2Y2) && (((shipX1 >= ship2X1) && (shipX1 <= ship2X2)) || ((shipX2 >= ship2X1) && (shipX2 <= ship2X2)))){ //()
					if ((curShip.id != ship2ID ) && (shipY1 == ship2Y1) && (((shipX1 >= ship2X1) && (shipX1 <= ship2X2)) || ((shipX2 >= ship2X1) && (shipX2 <= ship2X2)))){	
					//console.log("shipY1: " + shipY1 + " ship2Y1: " + ship2Y1 + " ship2Y2: " + ship2Y2);	
						//console.log("POSITION TAKEN");
							occupied = true;
						}
				}else{   //if ship we are comparing with is vertical
					console.log("VERTICAL SHIP");
					var ship2X1 = allShips[i].x;
					var ship2X2 = allShips[i].x + allShips[i].height;
					var ship2Y1 = allShips[i].y;
					var ship2Y2 = allShips[i].y + allShips[i].width; 
					var ship2ID = allShips[i].id;
						//if ((shipY1 >= ship2Y1 && shipY1 <= ship2Y2) && (((shipX1 >= ship2X1) && (shipX1 <= ship2X2)) || ((shipX2 >= ship2X1) && (shipX2 <= ship2X2)))){ //()
					if ((curShip.id != ship2ID ) && (((shipY1 >= ship2Y1) && (shipY1 < ship2Y2)) || ((shipY2 > ship2Y1) && (shipY2 <= ship2Y2)))  
						&& (((shipX1 >= ship2X1) && (shipX1 <= ship2X2)) || ((shipX2 >= ship2X1) && (shipX2 <= ship2X2)))){	
					console.log("shipY1: " + shipY1 + " ship2Y1: " + ship2Y1 + " ship2Y2: " + ship2Y2);	
						console.log("POSITION TAKEN");
							occupied = true;
						}
				}
		}
	}else{
		console.log("I am vertical");
		for (var i = 0; i <shipsNum; i++){ 
					//if (allShips[i].y < border){
							//console.log("y: " + allShips[i].y )
					if (allShips[i].gridRotation == 0) { //if ship with which we are comparing is horizontal
							console.log("HORIZONTAL SHIP");
							var ship2X1 = allShips[i].x;
							var ship2X2 = allShips[i].x + allShips[i].height;
							var ship2Y1 = allShips[i].y;
							var ship2Y2 = allShips[i].y + allShips[i].width; 
							var ship2ID = allShips[i].id;
							//if ((shipY1 >= ship2Y1 && shipY1 <= ship2Y2) && (((shipX1 >= ship2X1) && (shipX1 <= ship2X2)) || ((shipX2 >= ship2X1) && (shipX2 <= ship2X2)))){ //()
						
						if ((curShip.id != ship2ID ) && (((ship2Y1 >= shipY1) && (shipY1 < shipY2)) || ((ship2Y2 > shipY1) && (ship2Y2 <= shipY2)))  
							&& (((ship2X1 >= shipX1) && (ship2X1 <= shipX2)) || ((ship2X2 >= shipX1) && (ship2X2 <= shipX2)))){	
						console.log("shipY1: " + shipY1 + " ship2Y1: " + ship2Y1 + " ship2Y2: " + ship2Y2);	
							console.log("POSITION TAKEN");
								occupied = true;
							}
					}else{   //if ship we are comparing with is vertical
						console.log("VERTICAL SHIP");
						var ship2X1 = allShips[i].x;
						var ship2X2 = allShips[i].x + allShips[i].height;
						var ship2Y1 = allShips[i].y;
						var ship2Y2 = allShips[i].y + allShips[i].width; 
						var ship2ID = allShips[i].id;
							//if ((shipY1 >= ship2Y1 && shipY1 <= ship2Y2) && (((shipX1 >= ship2X1) && (shipX1 <= ship2X2)) || ((shipX2 >= ship2X1) && (shipX2 <= ship2X2)))){ //()
						if ((curShip.id != ship2ID ) && (shipX1 == ship2X1) && (((shipY1 <= ship2Y1) && (shipY2 > ship2Y1)) || ((shipY1 > ship2Y1) && (shipY2 <= ship2Y2)))){	
						console.log("shipY1: " + shipY1 + " ship2Y1: " + ship2Y1 + " ship2Y2: " + ship2Y2);	
							console.log("POSITION TAKEN");
								occupied = true;
							}
					}
			}
	}
	return occupied;
}

function pixel2grid(grid, posX, posY){
		var unit_size = grid.width / 10;
		var locX = Math.floor(posX/unit_size);
		var locY = Math.floor(posY/unit_size);
		var cell = {x: posX, y:posY}
		
		return cell;
}


function grid2pixel(grid, posX, posY){
		var unit_size = grid.width / 10;
		var x = posX*unit_size;
		var y = posY*unit_size;
		var converted_location = [x, y];
		
		return converted_location;
	
}

function createShipJSON(cell, type, direction){
		var ship_obj = {"x": cell.x, "y": cell.y, "type": type, "direction": direction};
		if (type < 1 || type >5){
				console.log("invalid type was passed");
				type = 1;
		}
		if (direction < 0 || direction >1){
			console.log("invalid direction was passed");
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