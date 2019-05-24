var express = require('express');
var router = express.Router();

/* GET drivers listing. */
router.get('/', function(req, res, next) {
  req.app.get('db').query("SELECT * FROM driver WHERE status != 0 or status is NULL ORDER BY lastName, firstName", function (err, rows, fields) {
    if (err) throw err
    var driver_list = rows;

      req.app.get('db').query("SELECT * FROM driver WHERE status = 0 or status is NULL ORDER BY lastName, firstName", function (err, rows, fields) {
        if (err) throw err
        var inactive_driver_list = rows;
      
        res.render('drivers', {title: 'Drivers (' + driver_list.length + ')',
          driver_list: driver_list,
          inactive_driver_list: inactive_driver_list
    });
  });
});

/* POST new driver */
router.post('/new', function(req, res, next) {
  for(var key in req.body)
    if(Object.prototype.hasOwnProperty.call(req.body, key)) {
      req.body[key] = req.body[key].toString();
    }

  req.app.get('db').query("INSERT INTO `driver` SET ?",req.body, function (err, rows, fields) {
    if (err) throw err

    res.redirect("/drivers/");
  });
});

/* POST update driver */
router.post('/update', function(req, res, next) {
  var id = req.body.id;

  for(var key in req.body)
    if(Object.prototype.hasOwnProperty.call(req.body, key))
      req.body[key] = req.body[key].toString();

  req.app.get('db').query("UPDATE `driver` SET ? WHERE id = " + id,req.body, function (err, rows, fields) {
    if (err) throw err
    res.setHeader('Content-Type', 'application/json');
    res.redirect("/drivers/");
  });
});

/* GET edit driver item */
router.get('/edit/:id', function(req, res, next) {
  var id = req.params.id;

  req.app.get('db').query("SELECT * FROM `driver` WHERE id = " + id, function (err, rows, fields) {
    if (err) throw err
      var driver = rows;
        res.render('driver_form', {
          driver: driver
      });
  });
});

/* GET request to show inactive drivers */
router.get('/showInactiveDrivers/:id', function(req, res, next) {
  var id = req.params.id;

  req.app.get('db').query("SELECT * FROM `driver` WHERE status = 0", function (err, rows, fields) {
    if (err) throw err
    var drivers = rows;

    res.render('driver_restore', {
      inactive_driver_list: drivers
    });
  });
});

/* GET request to restore an inactive driver */
router.get('/restore/:id', function(req, res, next) {
    var id = req.params.id;

    req.app.get('db').query("UPDATE `driver` SET status = 1 WHERE id = " + id, function (err, rows, fields) {
      if (err) throw err

        res.redirect("/drivers/");

      });
    });
});

/* GET delete driver item */
router.get('/delete/:id', function(req, res, next) {
  var id = req.params.id;

  req.app.get('db').query("UPDATE `driver` SET status = 0 WHERE id = " + id, function (err, rows, fields) {
    if (err) throw err

    res.redirect("/drivers/");
  });
});

module.exports = router;
