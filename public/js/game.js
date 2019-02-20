WIDTH = window.innerWidth;
HEIGHT = window.innerHeight;



let type="WebGL";
if(!PIXI.utils.isWebGLSupported()){
    type="canvas";
}
PIXI.utils.sayHello(type);

let app = new PIXI.Application({width: WIDTH , height: HEIGHT});

document.body.appendChild(app.view);

var stage = app.stage;

var wallpaper = PIXI.Sprite.from('resources/background.png');
var grid1 = PIXI.Sprite.from('resources/grid.png');
var grid2 = PIXI.Sprite.from('resources/grid.png');

wallpaper.x = 0;
wallpaper.y = 0;
wallpaper.width = WIDTH
wallpaper.height = HEIGHT

grid1.anchor.set(0.5);
grid1.x = WIDTH / 4;
grid1.y = HEIGHT / 2;

grid2.anchor.set(0.5);
grid2.x = (WIDTH / 4) * 3;
grid2.y = HEIGHT / 2;


stage.addChild(wallpaper);
stage.addChild(grid1);
stage.addChild(grid2);

