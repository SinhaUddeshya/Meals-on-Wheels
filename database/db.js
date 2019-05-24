var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'meals_admin',
  password : 'thisisasecurepassword',
  database : 'mealsonwheels'
});

connection.connect(function(err) {
  if (err) throw err;
  
   setInterval(function () {
                connection.query('SELECT 1');
        }, 5000);

  //connection.query("DROP TABLE customer", function (err, rows, fields) {
    connection.query("CREATE TABLE IF NOT EXISTS customer (" +
        "id INT NOT NULL AUTO_INCREMENT, " +
        "customerNumber VARCHAR(10) NULL," +
        "title VARCHAR(30) NULL," +
        "firstName VARCHAR(80) NULL," +
        "lastName VARCHAR(80) NOT NULL," +
        "village VARCHAR(50) NULL," +
        "email VARCHAR(100) NULL," +
        "address VARCHAR(80) NOT NULL," +
        "phone_number VARCHAR(20) NULL," +
        "lat VARCHAR(20) NULL," +
        "lng VARCHAR(20) NULL," +
        "status BIT NOT NULL DEFAULT 1," +
        "notes text NULL," +

        "options text NULL," +
        "type text NULL," +
        "serve text NULL," +
        "size text NULL," +
        "meat text NULL," +
        "vegetables text NULL," +
        "sandwiches text NULL," +
        "fruit text NULL," +

        "Monday VARCHAR(100) NULL," +
        "Tuesday VARCHAR(100) NULL," +
        "Wednesday VARCHAR(100) NULL," +
        "Thursday VARCHAR(100) NULL," +
        "Friday VARCHAR(100) NULL," +
        "Saturday VARCHAR(100) NULL," +
        "Sunday VARCHAR(100) NULL," +

        "PRIMARY KEY(`id`)" +
    ") ENGINE=InnoDB");
  //});

  //connection.query("DROP TABLE driver", function (err, rows, fields) {
    connection.query("CREATE TABLE IF NOT EXISTS driver (" +
        "id INT NOT NULL AUTO_INCREMENT, " +
        "driverNumber INT NOT NULL," +
        "firstName VARCHAR(80) NOT NULL," +
        "lastName VARCHAR(80) NOT NULL," +
        "email VARCHAR(100) NULL," +
        "address VARCHAR(80) NOT NULL," +
        "phone_number VARCHAR(20) NULL," +
        "type ENUM('Staff','Volunteer') NOT NULL," +
        "status BIT NOT NULL DEFAULT 1," +
        "notes text NULL," +

        "PRIMARY KEY(`id`)" +
    ") ENGINE=InnoDB");
  //});

  //connection.query("DROP TABLE route", function (err, rows, fields) {
    connection.query("CREATE TABLE IF NOT EXISTS route (" +
        "id INT NOT NULL AUTO_INCREMENT, " +
        "name VARCHAR(255) NOT NULL," +
        "day VARCHAR(255) NOT NULL," +
        "driver INT NOT NULL," +
        "customer VARCHAR(255) NULL," +
        "status BIT NOT NULL DEFAULT 1 NULL," +

        "PRIMARY KEY(`id`)" +
        ") ENGINE=InnoDB");
  //});

  //connection.query("DROP TABLE menu", function (err, rows, fields) {
  connection.query("CREATE TABLE IF NOT EXISTS menu (" +
      "id INT NOT NULL AUTO_INCREMENT, " +
      "meat VARCHAR(255) NOT NULL," +
      "alternative VARCHAR(255) NOT NULL," +
      "vegetarian VARCHAR(255) NOT NULL," +
      "vegetable VARCHAR(255) NOT NULL," +
      "dessert VARCHAR(255) NOT NULL," +
      "soup VARCHAR(255) NOT NULL," +
      "day VARCHAR(255) NOT NULL," +
      "week VARCHAR(255) NOT NULL," +
      "ingredients text NULL," +
      "status BIT NOT NULL DEFAULT 1 NULL," +

      "PRIMARY KEY(`id`)" +
      ") ENGINE=InnoDB");
  //});

  //connection.query("DROP TABLE ingredient", function (err, rows, fields) {
  connection.query("CREATE TABLE IF NOT EXISTS ingredient (" +
      "id INT NOT NULL AUTO_INCREMENT, " +
      "name VARCHAR(255) NOT NULL," +
      "type VARCHAR(255) NOT NULL," +

      "PRIMARY KEY(`id`)," +
      "UNIQUE (`name`)" +
      ") ENGINE=InnoDB");
  //});

  //connection.query("DROP TABLE food", function (err, rows, fields) {
  connection.query("CREATE TABLE IF NOT EXISTS food (" +
      "id INT NOT NULL AUTO_INCREMENT, " +
      "name VARCHAR(255) NOT NULL," +
      "type VARCHAR(255) NOT NULL," +
      "ingredients text NULL," +

      "PRIMARY KEY(`id`)" +
      ") ENGINE=InnoDB");
  //});

  //connection.query("DROP TABLE settings", function (err, rows, fields) {
  connection.query("CREATE TABLE IF NOT EXISTS settings (" +
      "id INT NOT NULL AUTO_INCREMENT, " +
      "k VARCHAR(255) NOT NULL," +
      "v VARCHAR(255) NOT NULL," +

      "PRIMARY KEY(`id`)," +
      "UNIQUE (`k`)" +
      ") ENGINE=InnoDB");
  //});

    //connection.query("DROP TABLE addresses", function (err, rows, fields) {
    connection.query("CREATE TABLE IF NOT EXISTS addresses (" +
        "id INT NOT NULL AUTO_INCREMENT, " +
        "address VARCHAR(255) NOT NULL," +
        "lat VARCHAR(255) NOT NULL," +
        "lng VARCHAR(255) NOT NULL," +

        "PRIMARY KEY(`id`)," +
        "UNIQUE (`address`)" +
        ") ENGINE=InnoDB");
    //});

});

module.exports = connection;