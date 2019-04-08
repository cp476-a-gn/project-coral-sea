//constants
WIDTH = window.innerWidth;
HEIGHT = window.innerHeight;
SUBMARINE = 2 //1
DESTROYER = 2 //2
CRUISER = 1 //3
BATTLESHIP = 1 //4
CARRIER = 1 //5

num_miss = 0;
num_hit = 0;

var stage;
var shots = [];
const loader = PIXI.Loader.shared;

const sprites = {};

loadFiles(sprites, loader);

loader.onComplete.add(() => {

    let type="WebGL";
    if(!PIXI.utils.isWebGLSupported()){
        type="canvas";
    }
    PIXI.utils.sayHello(type);

    let app = new PIXI.Application({width: WIDTH , height: HEIGHT});

    document.body.appendChild(app.view);
    app.view.oncontextmenu =  function(e){return false;} 
    stage = app.stage;
    app.renderer.backgroundColor = 0x232323;

    //prep screen

    sprites.wallpaper.x = 0;
    sprites.wallpaper.y = 0;
    sprites.wallpaper.width = WIDTH;
    sprites.wallpaper.height = HEIGHT;

    sprites.userGrid.anchor.set(0.5);
    sprites.userGrid.x = WIDTH / 4;
    sprites.userGrid.y = HEIGHT / 3;
    sprites.userGrid.width = HEIGHT * .50;
    sprites.userGrid.height = HEIGHT * .50;

    sprites.oponGrid.anchor.set(0.5);
    sprites.oponGrid.x = (WIDTH / 4) * 3;
    sprites.oponGrid.y = HEIGHT / 2;
    sprites.oponGrid.width = HEIGHT * .66;
    sprites.oponGrid.height = HEIGHT * .66;

    // draw ships


    var beginx = sprites.userGrid.x - (sprites.userGrid.width / 2);
    var startx = beginx;
    var starth = HEIGHT - 350;
    val = 2;
    j = 0

    unit_size = sprites.userGrid.width / 10;

    for( var i = 0; i < 7; i++){
        if(j % val == 0 && j != 0){ starth = starth + (unit_size * 1.5); startx = beginx; val+=1; j = 0}
        sprites.ships[i].id = i;
        sprites.ships[i].width = (sprites.ships[i].width / sprites.ships[i].height) * unit_size;
				sprites.ships[i].height = unit_size;

        
        sprites.ships[i].x = startx;
        startx += sprites.ships[i].width + unit_size; 
        j++;
        sprites.ships[i].y = starth;
        sprites.ships[i].interactive = true;
        sprites.ships[i].on('mousedown', dragShipStart)
                .on('mouseup', dragShipEnd)
                .on('mousemove', dragShip)
                .on('rightclick', rotateQueue);
        sprites.ships[i].startPos = new PIXI.Point(sprites.ships[i].x, sprites.ships[i].y);

        sprites.ships[i].gridPoint = new PIXI.Point();
        sprites.ships[i].gridRotation = 0; // 0 horizontal 1 vertilce
        sprites.ships[i].rotating = false;  /// DONT REMEBER WHAT THIS IS FOR ????????
    }



    stage.addChild(sprites.wallpaper);
    stage.addChild(sprites.userGrid);
    stage.addChild(sprites.oponGrid);

    sprites.ships.forEach(function(ship){
        stage.addChild(ship);
    })


    sprites.screenblocker.x = WIDTH/2;
    sprites.screenblocker.y = 0;
    sprites.screenblocker.width = WIDTH/2;
    sprites.screenblocker.height = HEIGHT;
    stage.addChild(sprites.screenblocker);


});

function dragShipStart(event){
    this.dragging = true;
    this.data = event.data;
}

function dragShipEnd(event){
		if (this.data != null){
			var position = this.data.getLocalPosition(this.parent);
			startx = sprites.userGrid.x - (sprites.userGrid.width / 2);
			starty = sprites.userGrid.y - (sprites.userGrid.height / 2);
			endx = startx + sprites.userGrid.width;
			endy = starty + sprites.userGrid.height;
			if(position.x > startx && position.x < endx &&
			position.y > starty && position.y < endy){
					// do snapping
					this.position.y += (this.height / 2);
					
					if (this.rotation == 0){
						this.position = snapToGridHorizontal(this.position, sprites.userGrid, this.width);
						this.gridRotation = 0;
						occupied = checkOccupied(sprites.userGrid, this, sprites.ships);
						if (occupied){
							//console.log("should have had a message");
							this.position = this.startPos;
							this.rotation = 0;
							this.gridRotation = 0;
						}
					}	else{
						this.position.x += (this.height / 2);
						this.position = snapToGridVertical(this.position, sprites.userGrid, this.width);
						this.gridRotation = 1;
						occupied = checkOccupied(sprites.userGrid, this, sprites.ships);
						if (occupied){
							//console.log("should have had a message");
							this.position = this.startPos;
							this.rotation = 0;
							this.gridRotation = 0;
						}
					}
			}
			else{
					this.rotation = 0;
					this.position.x = this.startPos.x;
					this.position.y = this.startPos.y;
			}

			this.dragging = false;
			this.data = null;
		}else{
		console.log("got the bug. FIXME");
    }

    var stillAtStart = false;
    for(var i = 0; i < sprites.ships.length; i++ ){
        if(sprites.ships[i].startPos.x == sprites.ships[i].x && sprites.ships[i].startPos.y == sprites.ships[i].y){
            stillAtStart = true;
        }
    }
    if(!stillAtStart){
        showButton();
    }
    else{
        hideButton();
    }
}

function dragShip(event){
    if(this.dragging){
       // console.log(this.data.getLocalPosition(this.parent));
        var newPosition = this.data.getLocalPosition(this.parent);
        if(this.rotation == 0){
            this.position.x = newPosition.x - (this.width / 2);
            this.position.y = newPosition.y - (this.height / 2);
        }
        else{
            this.position.x = newPosition.x + (this.height / 2);
            this.position.y = newPosition.y - (this.width / 2);
        }
    }
}   

function rotateQueue(event){
    //console.log("???");
    if(this.rotation == 0){
			this.rotation = 3.14 / 2;
			this.gridRotation = 1;
			//console.log("new x: ", this.x, " new y: ", this.y);
			adjustLocationH2V(this, sprites.userGrid);
			occupied = checkOccupied(sprites.userGrid, this, sprites.ships);
			if (occupied){
				this.position = this.startPos;
				this.rotation = 0;
				this.gridRotation = 0;
			}
			//console.log("super new x: ", this.x, " super new y: ", this.y);
		}
    else{
			this.rotation = 0;
			this.gridRotation = 0;
			adjustLocationV2H(this, sprites.userGrid);
			occupied = checkOccupied(sprites.userGrid, this, sprites.ships);
			if (occupied){
				this.position = this.startPos;
				this.rotation = 0;
				this.gridRotation = 0;
			}
		}
}


function showButton(){
    document.getElementsByClassName("ready")[0].classList.add("readyShow");
}

function hideButton(){
    ready = document.getElementsByClassName("ready")[0];
    if(ready.classList.contains("readyShow")) ready.classList.remove("readyShow");
}

function sendShips(socket){

    ships = new Object();
    ships.carrier = new Object();
    ships.battleship = new Object();
    ships.cruiser = new Object();
    ships.destroyer = [new Object(), new Object()];
    ships.submarine = [new Object(), new Object()];

    positions = [];
    var i = 0;
    sprites.ships.forEach(function(element){
        var cell = pixel2grid(sprites.userGrid, element.x, element.y)
        cell.r = element.gridRotation
        if(cell.r == 1) cell.x -= 1;
        positions.push(cell);
		element.removeAllListeners();
    });

    ships.carrier.x = positions[0].x;
    ships.carrier.y = positions[0].y;
    ships.carrier.r = positions[0].r;
    ships.carrier.s = 5;

    ships.battleship.x = positions[1].x
    ships.battleship.y = positions[1].y;
    ships.battleship.r = positions[1].r;
    ships.battleship.s = 4;

    ships.cruiser.x = positions[2].x;
    ships.cruiser.y = positions[2].y;
    ships.cruiser.r = positions[2].r;
    ships.cruiser.s = 3;

    ships.destroyer[0].x = positions[3].x;
    ships.destroyer[0].y = positions[3].y;
    ships.destroyer[0].r = positions[3].r;
    ships.destroyer[0].s = 2;

    ships.destroyer[1].x = positions[4].x;
    ships.destroyer[1].y = positions[4].y;
    ships.destroyer[1].r = positions[4].r;
    ships.destroyer[1].s = 2;

    ships.submarine[0].x = positions[5].x;
    ships.submarine[0].y = positions[5].y;
    ships.submarine[0].r = positions[5].r;
    ships.submarine[0].s = 1;

    ships.submarine[1].x = positions[6].x;
    ships.submarine[1].y = positions[6].y;
    ships.submarine[1].r = positions[6].r;
    ships.submarine[1].s = 1;

    console.log(ships);
    socket.emit("ship submit", JSON.stringify(ships));
}

function getStage(){
    return stage;
}


function getOponGrid(){
	return sprites.oponGrid;
}

function getUserGrid(){
	return sprites.userGrid;
}

function getShots(){
	return shots;
}

/*
    parameters:
        position: an object with properties x and y containing grid positions 
        type: "hit" or "miss"
        turn: 1 or 2 

*/
function drawMarker(position, type, turn){
    var mark;

    if(type == "hit"){ 
        mark = sprites.hit[num_hit]; 
        num_hit++; 
    }
    if(type == "miss"){ 
        mark = sprites.miss[num_miss]; 
        num_miss++; 
    }
		//console.log("TURN IS " + turn);
    if (turn == 1)
        grid = sprites.oponGrid;
    else
        grid = sprites.userGrid;
    
    var cell = grid2pixel(grid, position.x, position.y)
    mark.x = cell[0];
    mark.y = cell[1];
    mark.width = grid.width / 10;
    mark.height = grid.width / 10;
    stage.addChild(mark);
}

function executeWait(stage, data, board){
    stage.addChild(sprites.screenblocker);
		sprites.oponGrid.removeAllListeners(); 

		if(data.hit) type = "hit";
		else type = "miss";

		drawMarker(data.shot, type, (your_id + seq_id)%2);
}

function executeTurn(board, stage, data){
  //console.log(board);
	sprites.oponGrid.interactive = true;
    sprites.oponGrid.on('click', function(e){
			fire(e, finishTurn);
		});
    
	//console.log(board);
	//console.log("executing turn "+ seq_id);
	stage.removeChild(sprites.screenblocker);
	var type = ""
	if (data.seq_id !== 1){
		if(data.hit) type = "hit";
		else type = "miss"; 

		drawMarker(data.shot,type,seq_id % your_id);
	}
}







