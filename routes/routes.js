var express = require('express');
var router = express.Router();

/* GET routes listing. */
router.get('/', function(req, res, next) {

    req.app.get('db').query('SELECT * FROM driver', function(err, rows, fields) {
        if (err) throw err
        var driver_list = rows;

        req.app.get('db').query('SELECT * FROM customer WHERE Sunday IS NOT NULL', function(err, rows, fields) {
            if (err) throw err
            var customer_list = rows;

            req.app.get('db').query("SELECT route.id, route.name, route.day, concat(driver.lastName, ' ', driver.firstName) as driver, route.customer FROM route JOIN driver on driver.id = route.driver WHERE route.status != 0 or route.status is NULL ORDER BY name", function(err, rows, fields) {
                if (err) throw err
                var route_list = rows;

                res.render('routes', {
                    title: 'Routes (' + route_list.length + ')',
                    route_list: route_list,
                    driver_list: driver_list,
                    customer_list: customer_list
                });
            });
        });
    });
});

/* POST new route item */
router.post('/new', function(req, res, next) {
    for (var key in req.body)
        if (Object.prototype.hasOwnProperty.call(req.body, key))
            req.body[key] = req.body[key].toString();

    req.app.get('db').query("INSERT INTO `route` SET ?", req.body, function(err, rows, fields) {
        if (err) throw err

        res.redirect("/routes/");
    });
});

/* POST update route */
router.post('/update', function(req, res, next) {
    var id = req.body.id;
    console.log(req.body.id);

    for (var key in req.body)
        if (Object.prototype.hasOwnProperty.call(req.body, key))
            req.body[key] = req.body[key].toString();

    req.app.get('db').query("UPDATE `route` SET ? WHERE id = " + id,req.body, function(err, rows, fields) {
        if (err) throw err
        res.setHeader('Content-Type', 'application/json');
        res.redirect("/routes/");
    });
});

/* GET edit driver item */
router.get('/edit/:id', function(req, res, next) {
    var id = req.params.id;
    console.log(req.params);

    req.app.get('db').query("SELECT * FROM `route` WHERE id = " + id, function(err, rows, fields) {
        if (err) throw err
        var routes = rows;

        req.app.get('db').query('SELECT * FROM driver', function(err, rows, fields) {
            if (err) throw err
            var driver_list = rows;

            req.app.get('db').query('SELECT * FROM customer WHERE Sunday IS NOT NULL', function(err, rows, fields) {
                if (err) throw err
                var customer_list = rows;

                res.render('routes_form', {
                    route: routes,
                    driver_list: driver_list,
                    customer_list: customer_list
                });
            });
        });
    });
});

/* GET delete route item */
router.get('/delete/:id', function(req, res, next) {
    var id = req.params.id;

    req.app.get('db').query("UPDATE `route` SET status = 0 WHERE id = " + id, function(err, rows, fields) {
        if (err) throw err

        res.redirect("/routes/");
    });
});

module.exports = router;