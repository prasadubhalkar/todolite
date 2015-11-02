var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  // Set our internal DB variable
    var db = req.db;

    console.log(req.query);

    // Get our form values. These rely on the "name" attributes
    var _id = req.query._id;
    console.log("ObjectId('"+_id+"')")
    // Set our collection
    var collection = db.get('goals');

    // Submit to the DB
    collection.remove({ "_id" : _id }, function (err, doc) {
        if (err) {
        	console.log("error removing")
            // If it failed, return error
            res.send("Error");
        }
        else {
        	console.log("Removed");
        	//res.end("Added");
            // And forward to success page
            res.redirect('/');
        }
    });
});

module.exports = router;
