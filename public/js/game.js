//constants
WIDTH = window.innerWidth;
HEIGHT = window.innerHeight;
SUBMARINE = 2 //1
DESTROYER = 2 //2
CRUISER = 1 //3
BATTLESHIP = 1 //4
CARRIER = 1 //5

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
    var stage = app.stage;
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
				sprites.ships[i].height = unit_size;
        sprites.ships[i].width = (sprites.ships[i].width / 100) * unit_size;
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
    //stage.addChild(sprites.screenblocker);

    for(var i = 0; i < 3; i ++){
        
        var unit = sprites.oponGrid.width / 10;
        sprites.hit[i].width = unit;
        sprites.hit[i].height = unit;
        sprites.miss[i].width = unit;
        sprites.miss[i].height = unit;

        stage.addChild(sprites.miss[i]);
        stage.addChild(sprites.hit[i]);
    }
        var unit = sprites.oponGrid.width / 10;
    var startx = sprites.oponGrid.x - (sprites.oponGrid.width / 2);
    var starty = sprites.oponGrid.y - (sprites.oponGrid.height / 2);
    sprites.hit[0].x = startx + (unit * 2);
    sprites.hit[0].y = starty + (unit * 2);

    sprites.hit[1].x = startx + (unit * 3);
    sprites.hit[1].y = starty + (unit * 2);

    sprites.hit[2].x = startx + (unit * 4);
    sprites.hit[2].y = starty + (unit * 2);

    sprites.miss[0].x = startx + (unit * 3);
    sprites.miss[0].y = starty + (unit * 3);

    sprites.miss[1].x = startx + (unit * 3);
    sprites.miss[1].y = starty + (unit * 1);

    sprites.miss[2].x = startx + (unit * 5);
    sprites.miss[2].y = starty + (unit * 7);
    

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
						occupied = checkOccupied(this, sprites.ships);
					}	else{
						this.position.x += (this.height / 2);
						this.position = snapToGridVertical(this.position, sprites.userGrid, this.width);
						this.gridRotation = 1;
						occupied = checkOccupied(this, sprites.ships);
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
    console.log("???");
    if(this.rotation == 0){
			this.rotation = 3.14 / 2;
			this.gridRotation = 1;
			adjustLocationH2V(this, sprites.userGrid);
		}
    else{
			this.rotation = 0;
			this.gridRotation = 1;
			adjustLocationV2H(this, sprites.userGrid);
		}
}


