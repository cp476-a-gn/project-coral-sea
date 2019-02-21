function loadFiles(sprites, loader){

    loader.add('wallpaper', "resources/background.png")
        .add('grid', "resources/grid.png")
        .add('carrier', "resources/ships/carrier.png")
        .add('battleship', "resources/ships/battleship.png")
        .add('cruiser', "resources/ships/cruiser.png")
        .add('destroyer', "resources/ships/destroyer.png")
        .add('submarine', "resources/ships/submarine.png")
        .add('blocker','resources/blocker.png');

    //files

    loader.load((loader, resources) => {
        sprites.wallpaper = PIXI.Sprite.from(resources.wallpaper.texture);
        sprites.userGrid = PIXI.Sprite.from(resources.grid.texture);
        sprites.oponGrid = PIXI.Sprite.from(resources.grid.texture);
        sprites.ships = [PIXI.Sprite.from(resources.carrier.texture), 
            PIXI.Sprite.from(resources.battleship.texture), 
            PIXI.Sprite.from(resources.cruiser.texture),
            PIXI.Sprite.from(resources.destroyer.texture),
            PIXI.Sprite.from(resources.destroyer.texture),
            PIXI.Sprite.from(resources.submarine.texture),
            PIXI.Sprite.from(resources.submarine.texture)];
        sprites.screenblocker = PIXI.Sprite.from(resources.blocker.texture);
    });

}