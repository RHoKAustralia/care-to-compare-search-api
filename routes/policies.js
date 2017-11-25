var express = require('express');
var router = express.Router();

/* GET policies listing. */
router.get('/list', function(req, res) {
  var db = req.db;
  var collection = db.get('policies');
  collection.find({},{},function(err, result){
      res.json(result);
  });
});

router.post('/search', function(req, res) {
  var db = req.db;
  var collection = db.get('policies');
  if (typeof req.body !== 'undefined')
  {
    var search_query = req.body;

    // TODO: for local testing limit to 20 results...remove later
    collection.find(search_query,{ "limit": 20 },function(err, result){
      if (err) throw err;
      res.json(result);
      // console.log(result);
      // res.json(search_query);
      db.close();
    });
  }
});


module.exports = router;
