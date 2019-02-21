//constants
WIDTH = window.innerWidth;
HEIGHT = window.innerHeight;
SUBMARINE = 2 //1
DESTROYER = 2 //2
CRUISER = 1 //3
BATTLESHIP = 1 //4
CARRIER = 1 //5

//files
var file_wallpaper =    "resources/background.png";
var file_grid =         "resources/grid.png";
var file_carrier =      "resources/ships/carrier.png";
var file_battleship =   "resources/ships/battleship.png";
var file_cruiser =      "resources/ships/cruiser.png";
var file_destroyer =    "resources/ships/destroyer.png";
var file_submarine =    "resources/ships/submarine.png";

let type="WebGL";
if(!PIXI.utils.isWebGLSupported()){
    type="canvas";
}
PIXI.utils.sayHello(type);

let app = new PIXI.Application({width: WIDTH , height: HEIGHT});

document.body.appendChild(app.view);

var stage = app.stage;

//prep screen

var wallpaper = PIXI.Sprite.from('resources/background.png');
var userGrid = PIXI.Sprite.from('resources/grid.png');
var oponGrid = PIXI.Sprite.from('resources/grid.png');

wallpaper.x = 0;
wallpaper.y = 0;
wallpaper.width = WIDTH;
wallpaper.height = HEIGHT;

userGrid.anchor.set(0.5);
userGrid.x = WIDTH / 4;
userGrid.y = HEIGHT / 3;
userGrid.width = HEIGHT * .50;
userGrid.height = HEIGHT * .50;

console.log(userGrid.width);

oponGrid.anchor.set(0.5);
oponGrid.x = (WIDTH / 4) * 3;
oponGrid.y = HEIGHT / 2;
oponGrid.width = HEIGHT * .66;
oponGrid.height = HEIGHT * .66;

// draw ships
var ships = [PIXI.Sprite.from(file_carrier), 
            PIXI.Sprite.from(file_battleship), 
            PIXI.Sprite.from(file_cruiser),
            PIXI.Sprite.from(file_destroyer),
            PIXI.Sprite.from(file_destroyer),
            PIXI.Sprite.from(file_submarine),
            PIXI.Sprite.from(file_submarine)];

var beginx = userGrid.x - (userGrid.width / 2);
var startx = beginx;
var starth = HEIGHT - 350;
val = 2;
j = 0

unit_size = userGrid.width / 10;

for( var i = 0; i < 7; i++){
    if(j % val == 0 && j != 0){ starth = starth + (unit_size * 1.5); startx = beginx; val+=1; j = 0}
    ships[i].height = unit_size;
    ships[i].width = (ships[i].width / 100) * unit_size;
    ships[i].x = startx;
    startx += ships[i].width + unit_size; 
    j++;
    ships[i].y = starth;
    ships[i].interactive = true;
    ships[i].on('mousedown', dragShipStart)
            .on('mouseup', dragShipEnd)
            .on('mousemove', dragShip);
}



stage.addChild(wallpaper);
stage.addChild(userGrid);
stage.addChild(oponGrid);

ships.forEach(function(ship){
    stage.addChild(ship);
})

var screenblocker = PIXI.Sprite.from('resources/blocker.png');
screenblocker.x = WIDTH/2;
screenblocker.y = 0;
screenblocker.width = WIDTH/2;
screenblocker.height = HEIGHT;
stage.addChild(screenblocker);


function dragShipStart(event){
    this.dragging = true;
    this.startPos = event.data.getLocalPosition(this.parent);
    this.data = event.data;
}

function dragShipEnd(event){
    var position = this.data.getLocalPosition(this.parent);
    startx = userGrid.x - (userGrid.width / 2);
    starty = userGrid.y - (userGrid.height / 2);
    endx = startx + userGrid.width;
    endy = starty + userGrid.height;
    if(position.x > startx && position.x < endx &&
    position.y > starty && position.y < endy){
        // do snapping
        this.position = snapToGrid(position, userGrid);
    }
    else{
        this.position.x = this.startPos.x;
        this.position.y = this.startPos.y;
    }

    this.dragging = false;
    this.data = null;

}

function dragShip(event){
    if(this.dragging){
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}   

function snapToGrid(position, userGrid){
		var unitSize = userGrid.width / 10;
		var startX = userGrid.x - (userGrid.width / 2);
    var startY = userGrid.y - (userGrid.height / 2);
		var realX = startX + unitSize*(Math.floor((position.x - startX)/unitSize));
		var realY = startY + unitSize*(Math.floor((position.y - startY)/unitSize));
		position.x = realX;
		position.y = realY;
		
		return position;
}
