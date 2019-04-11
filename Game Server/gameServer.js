
module.exports = function(app, io){

    current_room = 0;
    current_user = 0;
    first = true;

    games = []

    io.on('connection', function(socket){
        socket.on("new connection", function(){
			socket.handshake.session.room = undefined
		})
        socket.on('add to queue', function(msg){
            room = 0;
            console.log(socket.handshake.room);
            if(first && typeof socket.handshake.session.room === "undefined"){
                room = current_room;
                first = !first;
                socket.join(room);
                socket.handshake.session.player_order = 1;
                socket.handshake.session.room = current_room;
                socket.handshake.session.save();
                
                console.log("User has joined room " + room);
            }
            else if(!first && typeof socket.handshake.session.room === "undefined"){
                room = current_room;
                current_room ++;
                first = !first;
                socket.join(room);
                socket.handshake.session.player_order = 2;
                socket.handshake.session.room = current_room - 1;
                socket.handshake.session.save();
                

                gameData = new Object(),
                gameData.boards = [null, null];
                gameData.hits = [0,0];
                gameData.turn = 0;
                    
                games.push(gameData);
                
                io.sockets.in(room).emit("start game", room);
                console.log("User has joined room " + room);

                io.of('/').in(current_room - 1).clients((error, socketIds) => {
                    if (error) throw error;
                    socketIds.forEach(socketId => io.sockets.sockets[socketId].leave(current_room - 1));
                  
                });
            }
            else if(typeof socket.handshake.session.room !== "undefined"){
                socket.join(socket.handshake.session.room);
                
            }
        });
        socket.on('in game', function(msg){
            console.log("Player " + socket.handshake.session.player_order + " In room " + socket.handshake.session.room);
            var data = new Object();
            var room = socket.handshake.session.room;
            data.id = socket.handshake.session.player_order;
            data.name = socket.handshake.session.player_name;
            socket.emit("your id", JSON.stringify(data));
            socket.join(socket.handshake.session.room);
            setTimeout( function(){
                var roomData = io.sockets.adapter.rooms[room];
                if(roomData.length == 1){
                    console.log("Not enough players");
                    io.sockets.in(room).emit("leave game", room);
                }
            }, 3000);
            socket.handshake.session.room = undefined
        });
        socket.on('ship submit', function(msg){
            room = socket.handshake.session.room;
            playeris = socket.handshake.session.player_order;
            boards = games[room].boards;
            
            boards[playeris - 1] = JSON.parse(msg);
            socket.emit('board accept', playeris);
            console.log("received player " + playeris + " board");
            console.log(boards[playeris - 1]);
            
            if(boards[0] != null && boards[1] != null){ 
                var response = {'shot':null, 'hit':false, 'seq_id':1};
                var responseJSON = JSON.stringify(response);
                console.log("sending game start");
                io.to(room).emit("player turn",  responseJSON);
            }
        });
        socket.on('finish turn', function(msg){
            room = socket.handshake.session.room;
            var clientData = JSON.parse(msg);
            console.log("Finished turn " + msg);
            seq_id =  clientData.seq_id;
            var shot_coords = clientData.shotLoc;
            var gameData = games[room];
            var player =0;
            if (seq_id % 2 === 0 ) 
                player = 0;
            else 
                player = 1;
            var hit = checkLocation(shot_coords.x, shot_coords.y, gameData, player);
            
            console.log("sending seq_id: " + clientData.seq_id);
            seq_id ++;
            console.log("hit is: " + hit);
            var response = {'shot':shot_coords, 'hit':hit, 'seq_id':seq_id};
            var responseJSON = JSON.stringify(response);
            io.to(room).emit("player turn",  responseJSON);
            if(games[room].hits[0] >= 18){
                io.to(room).emit("player wins", "2");
            } else if(games[room].hits[1] >= 18){
                io.to(room).emit("player wins", "1");
            }
            
        });
        socket.on('disconnect', function(socket){
            console.log("A user has sailed to deeper waters!");
        });
        socket.on('player ready', function(msg){
            console.log("player ships submited");
        });
        socket.on('join queue', function(msg){
            console.log("player joined queue" + msg);
        })
			/**
        socket.on('getBoard', function(){
            function listUserNames(userIDs) {
                result = []
                var entry = JSON.stringify("meow");
                userIDs.forEach(row => {
                    result.push(row);
                });
                entry = JSON.stringify(result);
                socket.emit('returnBoard', entry);
            }
            db.getTop10(listUserNames);
        });
				*/
    });
}



/*
    Checks the location that the current player selected on the opponents board
    for a ship hit or miss

    Parameters
        posX: x cell coordinate of the click location
        posY: y cell location of the clock location
        gameData: the game object containing the current game info
        playerTurn: The player that sent the click 

*/
function checkLocation(posX, posY, gameData, playerTurn){
    console.log("posX: " + posX + " posY: " +posY);
    var is_hit = false;
    var boards = gameData.boards
    //player checks opponents bored for a click
    var playerToCheck = playerTurn;
    var ships = [];
    var playerToCheckBored = boards[playerToCheck];

    ships.push(playerToCheckBored.battleship);
    ships.push(playerToCheckBored.cruiser);
    ships.push(playerToCheckBored.carrier);
    ships.push(playerToCheckBored.destroyer[0]);
    ships.push(playerToCheckBored.destroyer[1]);
    ships.push(playerToCheckBored.submarine[0]);
    ships.push(playerToCheckBored.submarine[1]);

    ships.forEach( function(ship){
        relX = (posX - ship.x);
        relY = (posY - ship.y);
        console.log("relX: " + relX + " relY: " + relY);
        if(ship.r == 0 && relY == 0 && relX < ship.s && relX >= 0){
            gameData.hits[playerToCheck] += 1;
            is_hit = true;
            // is hit
        }
        else if(ship.r == 1 && relX == 0 && relY < ship.s && relY >= 0){
            gameData.hits[playerToCheck] += 1;
            is_hit = true;
            // is hit
        }
    });
    console.log("hit? " + is_hit);
    return(is_hit);
}

function isFinished(){

}



















