function snapToGrid(position, userGrid, width){
    var unitSize = userGrid.width / 10;
    var startX = userGrid.x - (userGrid.width / 2);
    var startY = userGrid.y - (userGrid.height / 2);
    var endX = startX + userGrid.width;
    var realX = startX + unitSize*(Math.floor((position.x - startX)/unitSize));
    var realY = startY + unitSize*(Math.floor((position.y - startY)/unitSize));
    
		var endPointR = realX + width;    
		if (endPointR > endX){
      realX = realX - (endPointR - endX);
    }else if (realX < startX){
			//console.log("realX: " + realX + "  endPointL:  " + endPointL + " startX: " + startX +" endX: " + endX);
			realX = realX + (startX - realX);
		}
    
    position.x = realX;
    position.y = realY;
    
    return position;
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