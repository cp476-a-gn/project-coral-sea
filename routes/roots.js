const { DatabaseAPI } = require('.././db/database.js');
function listUserNames(userIDs) {
    userIDs.forEach(row => {
        console.log(row.uid + " " + row.uname);
				//var entry =JSON.stringify(row);
    });
		var test = "testing";
		return test
}



module.exports = function(app){
		//var db = new DatabaseAPI();
	
    app.get('/',function(req,res){
        res.render('pages/MainMenu.ejs');
    });

    app.get('/score', function(req,res){
				res.render("pages/ScoreBoard.ejs",  {usname: '0'});
				
    });
		app.get('/scorePlayerW', function(req, res){
				res.render("pages/ScoreBoard.ejs", {usname: '1'});
		});			
		app.get('/scorePlayerL', function(req, res){
				res.render("pages/ScoreBoard.ejs", {usname: '2'});
		});	
    app.get('/score/json', function (req,res){
        var testJSON = db.getTop10(listUserNames); 
        res.json(testJSON);
    });
		
	app.get('/mainMenu',function(req,res){
        res.render('pages/MainMenu.ejs');
    });
		
	app.get('/matching',function(req,res){
		res.render('pages/WaitQueue.ejs');
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