

module.exports = function(app){
    app.get('/',function(req,res){
        res.render('pages/MainMenu.ejs');
    });

    app.get('/score', function(req,res){
        res.render("pages/ScoreBoard.ejs");
    });

    app.post('/score', function(req,res){
        console.log(req.body.return);
        res.render("pages/MainMenu.ejs")
    });

    app.get('/game', function(req,res){
        res.render("pages/Game.ejs")
    })
}