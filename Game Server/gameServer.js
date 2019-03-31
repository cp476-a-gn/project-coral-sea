
module.exports = function(app, io){

    current_room = 0;
    current_user = 0;
    first = true;

    games = []

    io.on('connection', function(socket){

        socket.on('add to queue', function(msg){

            room = 0;
            console.log(socket.handshake.room);
            if(first && socket.handshake.room === undefined){
                room = current_room;
                first = !first;
                socket.join(room);
                socket.handshake.session.player_order = 1;
                socket.handshake.session.room = current_room;
                socket.handshake.session.save();
                console.log("User has joined room " + room);
            }
            else if(!first && socket.handshake.room === undefined){
                room = current_room;
                current_room ++;
                first = !first;
                socket.join(room);
                socket.handshake.session.player_order = 2;
                socket.handshake.session.room = current_room - 1;
                socket.handshake.session.save();

                gameData = new Object(),
                gameData.boards = [null, null];
                gameData.firedAt = [[],[]];
                gameData.turn = 0;
                    
                games.push(gameData);

                io.of('/').in(current_room - 1).clients((error, socketIds) => {
                    if (error) throw error;
                    socketIds.forEach(socketId => io.sockets.sockets[socketId].leave('chat'));
                  
                });
                
                io.sockets.in(room).emit("start game", room);
                console.log("User has joined room " + room);
            }
        });
        socket.on('in game', function(msg){
            console.log("Player " + socket.handshake.session.player_order + " In room " + socket.handshake.session.room);
            socket.join(socket.handshake.session.room);
        });
        socket.on('ship submit', function(msg){
            room = socket.handshake.session.room;
            playeris = socket.handshake.session.player_order;
            boards = games[room].boards;
            
            boards[playeris - 1] = JSON.parse(msg);
            io.to(socket.handshake.session.room).emit('board accept', playeris);
            console.log("received player " + playeris + " board");

            if(boards[0] != null && boards[1] != null) io.to(room).emit("player turn", 1);
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
    });
}