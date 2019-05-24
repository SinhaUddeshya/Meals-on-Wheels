var express = require('express');
var fs = require("fs");
var csv = require("fast-csv");
var async = require("async");
var router = express.Router();

/* GET settings listing. */
router.get('/', function(req, res, next) {
  let asyncTasks = [];
  let stream = fs.createReadStream("csv/ingredients.csv");

  let csvStream = csv.fromStream(stream, {headers : true})
      .on("data", function(data){
          asyncTasks.push(function (callback) {
            let name = data["name"];
            let type = data["type"];
            req.app.get('db').query("INSERT INTO `ingredient` (name,type) VALUES (?,?) ON DUPLICATE KEY UPDATE name = ?", [name, type, name], function (err, rows, fields) {
              callback();
            });
          });
      }).on("end", function(){
        async.parallel(asyncTasks, function(){
          console.log("Finished entering ingredient data.");
        });
      });
});

module.exports = router;