var express = require('express');
var router = express.Router();

/* GET customer listing. */
router.get('/', function(req, res, next) {
  req.app.get('db').query("SELECT * FROM customer WHERE status != 0 or status is NULL ORDER BY lastName, firstName", function (err, rows, fields) {
    if (err) throw err
    var customer_list = rows;
      req.app.get('db').query("SELECT * FROM customer WHERE status = 0 or status is NULL ORDER BY lastName, firstName", function (err, rows, fields) {
      if (err) throw err
      var inactive_customer_list = rows;
        req.app.get('db').query('SELECT * FROM ingredient WHERE type = "meat" ORDER BY name', function (err, rows, fields) {
          if (err) throw err
          var meat_list = rows;
          req.app.get('db').query('SELECT * FROM ingredient WHERE type = "vegetable" ORDER BY name', function (err, rows, fields) {
            if (err) throw err
            var veg_list = rows;
            req.app.get('db').query('SELECT * FROM ingredient WHERE type = "fruit" ORDER BY name', function (err, rows, fields) {
              if (err) throw err
              var fruit_list = rows;
              req.app.get('db').query('SELECT * FROM ingredient WHERE type = "sandwich" ORDER BY name', function (err, rows, fields) {
                if (err) throw err
                var sandwich_list = rows;

              res.render('customers', {
                title: 'Customers (' + customer_list.length + ')',
                customer_list: customer_list,
                inactive_customer_list: inactive_customer_list,
                meat_list: meat_list,
                veg_list: veg_list,
                fruit_list: fruit_list,
                sandwich_list:sandwich_list
              });
            });
          });
        });
      });
    });
  });
});

/* POST new customer */
router.post('/new', function(req, res, next) {
  var keys = ["Meal","Dessert","Soup","Sandwiches","Fruit","Baking"];

  var reversedMap = {};
  for(var key in req.body) {
    if ((Object.prototype.hasOwnProperty.call(req.body, key)) && keys.indexOf(key) != -1) {
      var list = req.body[key];
      if(Array.isArray(list)) {
        list.forEach(function (value) {
          (reversedMap[value] = reversedMap[value] || []).push(key);
        });
      }
      else
        (reversedMap[list] = reversedMap[list] || []).push(key);
      delete req.body[key];
    }
  }
  Object.assign(req.body, reversedMap);

  for(var key in req.body)
	if(Object.prototype.hasOwnProperty.call(req.body, key))
      req.body[key] = req.body[key].toString();

  req.app.get('db').query("INSERT INTO `customer` SET ?",req.body, function (err, rows, fields) {
    if (err) throw err

    res.redirect("/customers/");
  });
});

/* POST update customer */
router.post('/update', function(req, res, next) {
  var id = req.body.id;
  var keys = ["Meal","Dessert","Soup","Sandwiches","Fruit","Baking"];

  var reversedMap = {};
  for(var key in req.body) {
    if ((Object.prototype.hasOwnProperty.call(req.body, key)) && keys.indexOf(key) != -1) {
      var list = req.body[key];
      if(Array.isArray(list)) {
        list.forEach(function (value) {
          (reversedMap[value] = reversedMap[value] || []).push(key);
        });
      }
      else
        (reversedMap[list] = reversedMap[list] || []).push(key);
      delete req.body[key];
    }
  }
  Object.assign(req.body, reversedMap);

  for(var key in req.body)
    if(Object.prototype.hasOwnProperty.call(req.body, key))
      req.body[key] = req.body[key].toString();

  req.app.get('db').query("UPDATE `customer` SET ? WHERE id = " + id,req.body, function (err, rows, fields) {
    if (err) throw err
    res.setHeader('Content-Type', 'application/json');
    res.redirect("/customers/");
  });
});

/* GET edit customer item */
router.get('/edit/:id', function(req, res, next) {
  var id = req.params.id;

  req.app.get('db').query("SELECT * FROM `customer` WHERE id = " + id, function (err, rows, fields) {
    if (err) throw err
    var customer = rows;
    req.app.get('db').query('SELECT * FROM ingredient WHERE type = "meat"', function (err, rows, fields) {
      if (err) throw err
      var meat_list = rows;
      req.app.get('db').query('SELECT * FROM ingredient WHERE type = "vegetable"', function (err, rows, fields) {
        if (err) throw err
        var veg_list = rows;
        req.app.get('db').query('SELECT * FROM ingredient WHERE type = "fruit"', function (err, rows, fields) {
          if (err) throw err
          var fruit_list = rows;
          req.app.get('db').query('SELECT * FROM ingredient WHERE type = "sandwich"', function (err, rows, fields) {
            if (err) throw err
            var sandwich_list = rows;

            res.render('customer_form', {
              customer: customer,
              meat_list: meat_list,
              veg_list: veg_list,
              fruit_list: fruit_list,
              sandwich_list: sandwich_list
            });
          });
        });
      });
    });
  });
});

/* GET request to show inactive customers */
router.get('/showInactiveCustomers/:id', function(req, res, next) {
  var id = req.params.id;

  req.app.get('db').query("SELECT * FROM `customer` WHERE status = 0", function (err, rows, fields) {
    if (err) throw err
    var customers = rows;

    res.render('customer_restore', {
      inactive_customer_list: customers
    });
  });
});

/* GET request to restore an inactive customer */
router.get('/restore/:id', function(req, res, next) {
    var id = req.params.id;

    req.app.get('db').query("UPDATE `customer` SET status = 1 WHERE id = " + id, function (err, rows, fields) {
      if (err) throw err

      res.redirect("/customers/");
    });
});

/* GET delete customer item */
router.get('/delete/:id', function(req, res, next) {
    var id = req.params.id;

    req.app.get('db').query("UPDATE `customer` SET status = 0 WHERE id = " + id, function (err, rows, fields) {
      if (err) throw err

    res.redirect("/customers/");
  });
});

/* POST addresses listing. */
router.post('/addresses', function(req, res, next) {
  var term = req.body.term + "%";
  req.app.get('db').query('SELECT * FROM addresses WHERE address like ?',term, function (err, rows, fields) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(rows));
  })
});

/* POST customer by day */
router.post('/day', function(req,res,next){
  var day = req.body.day;

  req.app.get('db').query("SELECT * FROM `customer` WHERE " + day + " IS NOT NULL ORDER BY lastName, firstName", function(err, rows, fields){
    if (err) throw err
    var customer_list = rows;
    res.render('customer_list', {customer_list:customer_list});
  });
});

module.exports = router;
