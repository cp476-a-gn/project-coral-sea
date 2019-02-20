

module.exports = function(app){
    app.get('/',function(req,res){
        res.render('pages/MainMenu.ejs');
    });

    app.get('/score', function(req,res){
        res.render("pages/ScoreBoard.ejs");
    });
		
		app.get('/mainMenu',function(req,res){
        res.render('pages/MainMenu.ejs');
    });
		
		app.get('/matching',function(req,res){
    res.render('pages/waitQueue.ejs');
    });

    app.get('/scoreToMain', function(req,res){
        res.redirect('/')
    });
		
		app.get('/mainToQueue', function(req,res){
        res.redirect('/matching')
    });
 
    app.get('/mainToScore',function(req,res){
      res.redirect('/score');
    });
    app.get('/game',function(req,res){
        res.render("pages/Game.ejs");
    });
}