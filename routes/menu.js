var express = require('express');
var router = express.Router();

/* GET menu listing. */
router.get('/', function(req, res, next) {

  req.app.get('db').query('SELECT * FROM settings', function (err, rows, fields) {
    var settings = rows;
    var weekStarts = null;
    for(var i=0;i<settings.length;i++)
      if(settings[i]['k'] == 'weekStarts')
        weekStarts = settings[i]['v'];

    req.app.get('db').query("SELECT * FROM menu WHERE status != 0 or status IS NULL ORDER BY cast(week as decimal) asc, FIELD(day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')", function (err, rows, fields) {
      var menu_list = rows;

      req.app.get('db').query('SELECT * FROM food', function (err, rows, fields) {
        var food_list = rows;

        req.app.get('db').query('SELECT * FROM ingredient', function (err, rows, fields) {
          var ingredient_list = rows;
          
          res.render('menu', {
            title: 'Menu (' + menu_list.length + ')',
            menu_list: menu_list,
            food_list: food_list,
            weekStarts: weekStarts, 
            ingredient_list:ingredient_list
          });
        });
      });
    });
  });
});

/* POST new menu item */
router.post('/new', function(req, res, next) {
  for(var key in req.body)
	if(Object.prototype.hasOwnProperty.call(req.body, key)) {
		req.body[key] = req.body[key].toString();
  }

  req.app.get('db').query("INSERT INTO `menu` SET ?",req.body, function (err, rows, fields) {
    if (err) throw err

    res.redirect("/menu/");
  });
});

/* POST new food item */
router.post('/food/new', function(req, res, next) {
  console.log(req.body);

  for(var key in req.body)
	if(Object.prototype.hasOwnProperty.call(req.body, key)) {
		req.body[key] = req.body[key].toString();
	}

  req.app.get('db').query("INSERT INTO `food` SET ?",req.body, function (err, rows, fields) {
    if (err) throw err

    res.redirect("/menu/");
  });
});

/* POST update driver */
router.post('/update', function(req, res, next) {
  var id = req.body.id;

  for(var key in req.body)
    if(Object.prototype.hasOwnProperty.call(req.body, key))
      req.body[key] = req.body[key].toString();

  req.app.get('db').query("UPDATE `menu` SET ? WHERE id = " + id,req.body, function (err, rows, fields) {
    if (err) throw err
    res.setHeader('Content-Type', 'application/json');
    res.redirect("/menu/");
  });
});

/* GET edit driver item */
router.get('/edit/:id', function(req, res, next) {
  var id = req.params.id;

  req.app.get('db').query("SELECT * FROM `menu` WHERE id = " + id, function (err, rows, fields) {
    if (err) throw err
    var menu = rows;
    req.app.get('db').query("SELECT * FROM `food` WHERE id = " + id, function (err, rows, fields) {
      if (err) throw err
      var food_list = rows;
        req.app.get('db').query("SELECT * FROM `ingredient` WHERE id = " + id, function (err, rows, fields) {
        if (err) throw err
        var ingredient_list = rows;
        
        res.render('menu_form', {
          menu: menu,
          food_list: food_list,
          ingredient_list: ingredient_list
          });
      });
    });
  });
});

/* GET delete menu item */
router.get('/delete/:id', function(req, res, next) {
  var id = req.params.id;

  req.app.get('db').query("UPDATE `menu` SET status = 0 WHERE id = " + id, function (err, rows, fields) {
    if (err) throw err

    res.redirect("/menu/");
  });
});

module.exports = router;
