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
var startx = userGrid.x - (userGrid.width / 2);
var starth = HEIGHT - 400;

for( var i = 0; i < 7; i++){
    if(i > 0){
        startx += ships[i - 1].width + 10;
        ships[i].x = startx;   
    }
    else ships[i].x = startx;
    
    if(i % 2 == 0) starth += 100;

    if(i == 2) startx = beginx;

    ships[i].h = starth;
    ships[i].width /= 2;
    ships[i].height /= 2;
}

stage.addChild(wallpaper);
stage.addChild(userGrid);
stage.addChild(oponGrid);

ships.forEach(function(ship){
    stage.addChild(ship);
})

