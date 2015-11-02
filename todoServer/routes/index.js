var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	var db = req.db;
	var collection = db.get('goals');
	collection.find({},{},function(e,docs){
	    res.end(JSON.stringify(docs));
	});
});

module.exports = router;
