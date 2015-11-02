var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  // Set our internal DB variable
    var db = req.db;

    console.log(req.query);

    // Get our form values. These rely on the "name" attributes
    var id 				= req.query.id;
    var goalName 		= req.query.goalname;
    var goalCompleted 	= req.query.goalcompleted;

    // Set our collection
    var collection = db.get('goals');

    // Submit to the DB
    collection.insert({
    	"id" : id,
        "name" : goalName,
        "completed" : goalCompleted
    }, function (err, doc) {
        if (err) {
        	console.log("error adding")
            // If it failed, return error
            res.send("Error");
        }
        else {
        	console.log("added");
        	//res.end("Added");
            // And forward to success page
            res.redirect('/');
        }
    });
});

module.exports = router;
