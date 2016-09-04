var express = require('express'),
    bodyParser = require('body-parser'),
    nunjucks = require('nunjucks'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    BattlesDAO = require('./battles').BattlesDAO

//Set up Express
app = express();
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use('/static', express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({ extended: true }));

var env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});

var nunjucksDate = require('nunjucks-date');
nunjucksDate.setDefaultFormat('MMMM Do YYYY, h:mm:ss a');
env.addFilter("date", nunjucksDate);

MongoClient.connect('mongodb://localhost:27017/local', function(err, db) {
    "use strict";

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    var battles = new BattlesDAO(db);

    var router = express.Router();

    router.get('/home', function(req, res){
      res.render('home', { categories: ['list', 'count'] });
    });


    router.get("/search", function(req, res) {
        "use strict";
        var query = req.query.query;
        var name = req.query.name ;
        var location = req.query.location;
        var type = req.query.type;
        var king = req.query.king;
        if(query){
        console.log("query is : "+query);
        battles.searchBattles(query, function(list) {
          console.log("query result count is : "+list.length);
          //res.status(200).send("Battles list is : "+JSON.stringify(list, null, 3));
          res.render('home', {list: JSON.stringify(list, null, 3)});
    });
  } else if(name) {
    battles.searchBattlesByName(name, function(list) {
      console.log("query result count is : "+list.length);
      //res.status(200).send("Battles list is : "+JSON.stringify(list, null, 3));
      res.render('home', {list: JSON.stringify(list, null, 3)});
});
  }
  else if(location) {
    battles.searchBattlesByLocation(location, function(list) {
      console.log("query result count is : "+list.length);
      //res.status(200).send("Battles list is : "+JSON.stringify(list, null, 3));
      res.render('home', {list: JSON.stringify(list, null, 3)});
});
  }
  else if(type) {
    battles.searchBattlesByType(type, function(list) {
      console.log("query result count is : "+list.length);
      //res.status(200).send("Battles list is : "+JSON.stringify(list, null, 3));
      res.render('home', {list: JSON.stringify(list, null, 3)});
});
  }
  else if(king) {
    battles.searchBattlesByKing(king, function(list) {
      console.log("query result count is : "+list.length);
      //res.status(200).send("Battles list is : "+JSON.stringify(list, null, 3));
      res.render('home', {list: JSON.stringify(list, null, 3)});
});
  }
  else{
    res.status(404).send("No Query Found");
  }
  });


    router.get("/list", function(req, res) {
        "use strict";

        battles.getBattlesList(function(list) {
            console.log(list);

            if (list == null) {
                res.status(404).send("No Battles found.");
                return;
            }
        //res.status(200).send("Battles list is : "+JSON.stringify(list, null, 3));
        res.render('home', {list: JSON.stringify(list, null, 3), categories: ['list', 'count']});
      });
    });

    router.get("/count", function(req, res) {
        "use strict";

        battles.getCount(function(list) {
      //  res.status(200).send("Count is : "+battlesCount);
      res.render('home', {list: list, categories: ['list', 'count']});
      });
    });

    // Use the router routes in our application
    app.use('/', router);

    // Start the server listening
    var server = app.listen(8099, function() {
        var port = server.address().port;
        console.log('gotmining server listening on port %s.', port);
    });
  });
