var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.app.get('db').query('SELECT * FROM settings', function (err, rows, fields) {
    var settings = rows;
    var weekStarts = null;
    for(var i=0;i<settings.length;i++)
      if(settings[i]['k'] == 'weekStarts')
        weekStarts = settings[i]['v'];

    var currWeek = parseInt(Math.floor(req.app.locals.moment().diff(req.app.locals.moment(weekStarts, "DD MMM YYYY"),'days')/7)+1);

    req.app.get('db').query('SELECT * FROM menu WHERE week = ?',currWeek, function (err, rows, fields) {
      var menu = rows;
      req.app.get('db').query("SELECT * FROM customer WHERE status != 0 or status is NULL ORDER BY lastName, firstName", function (err, rows, fields) {
        if (err) throw err

        var customer_list = rows;
        var day = req.app.locals.moment().format('dddd');

        req.app.get('db').query("SELECT * FROM customer WHERE " + day + " IS NOT NULL", function (err, rows2, fields) {
          var today_customer = rows2;

          req.app.get('db').query("SELECT * FROM driver WHERE status != 0 or status is NULL ORDER BY lastName, firstName", function (err, rows3, fields) {
            var driver_list = rows3;
            res.render('index', {
              title: 'Meals on Wheels',
              customer_list: customer_list,
              today_customer: today_customer,
              driver_list: driver_list,
              weekStarts:weekStarts,
              currWeek:currWeek,
              menu:menu
            });
          });
        });
      });
    });
  });
});

module.exports = router;
