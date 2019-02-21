/*
 * Places horizontal ship in a valid position on the grid
 */
function snapToGridHorizontal(position, userGrid, width){
    var unitSize = userGrid.width / 10;
    var startX = userGrid.x - (userGrid.width / 2);
    var startY = userGrid.y - (userGrid.height / 2);
    var endX = startX + userGrid.width;
    var realX = startX + unitSize*(Math.floor((position.x - startX)/unitSize));  //left corner position
    var realY = startY + unitSize*(Math.floor((position.y - startY)/unitSize));
    
		var endPointR = realX + width;    
		if (endPointR > endX) realX = realX - (endPointR - endX);
    else if (realX < startX) realX = realX + (startX - realX);

    position.x = realX;
    position.y = realY;
    checkCollision();
		
    return position;
}

/*
 * Places vertical ship in a valid position on the grid 
 */
function snapToGridVertical(position, userGrid, width){

    var unitSize = userGrid.height / 10;
    var startX = userGrid.x - (userGrid.width / 2);
    var startY = userGrid.y - (userGrid.height / 2);
    var endY = startY + userGrid.height;
		var realX = startX + unitSize*(Math.floor((position.x - startX)/unitSize));  //left corner position
    var realY = startY + unitSize*(Math.floor((position.y - startY)/unitSize));
    		
		var endPointB = realY + width;
		if (realY < startY) realY = realY + (startY - realY);
		else if (endPointB > endY) realY = realY - (endPointB - endY);
    
    position.x = realX;
    position.y = realY;
    checkCollision();
		
    return position;
}

/*
 * Fixes ship's location after it was rotated
 */
function adjustLocation(ship, grid){
	console.log(ship.gridPoint);
}

/*
 * TODO: check that location is already occupied
 */
function checkCollision(){
	
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