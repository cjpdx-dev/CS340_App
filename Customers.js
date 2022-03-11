
module.exports = function() {
    const express = require('express');
    const router = express.Router();
    const logger = require('./Logger.js');

    function getCustomers(res, mysql, context, complete) {
        mysql.pool.query("SELECT * FROM Customers", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers = results;
            complete();
        });
    }

    function getCustomerByID(id, res, mysql, context, complete) {
        let sql = "SELECT * FROM Customers WHERE customer_id = ?";
        let inserts = [id]
        mysql.pool.query(sql, inserts, function(error, results, fields) {
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers = results;
            complete();
        });
    }

    function getCustomersByName(firstName, lastName, res, mysql, context, complete) {
        console.log(firstName)
        console.log(lastName)

        let inserts = []

        if (firstName && lastName) {
            sql = "SELECT * FROM Customers WHERE first_name = ? AND last_name = ?";
            inserts = [firstName, lastName];
        }
        else if (!firstName && lastName) {
            sql = "SELECT * FROM Customers WHERE last_name = ?";
            inserts = [lastName];
        }
        else if (!lastName && firstName) {
            sql = "SELECT * FROM Customers WHERE first_name = ?";
            inserts = [firstName];
        }
        else {
            res.write(JSON.stringify("Error: both first and last name fields were left empty."));
            res.end();
            complete();
        }

        mysql.pool.query(sql, inserts, function(error, results, fields) {
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers = results;
            complete();
        });
    }

    router.get('/', function(req, res) {
        logger("router.get(/Customers/)", req); 
        console.log(req.params)
        let context = {};
        context.jsscripts = ['searchCustomers.js'];
        let mysql = req.app.get('mysql');
        getCustomers(res, mysql, context, complete);
        function complete() {
            res.render('Customers', context)
        }
    })

    router.get('/searchId/:id', function(req, res) {

        logger("router.get(/Customers/searchId/:id)", req); 
        
        let context = {};
        context.jsscripts = ['searchCustomers.js'];

        let mysql = req.app.get('mysql');
        let id = req.params.id;

        getCustomerByID(id, res, mysql, context, complete);
        function complete() {
            res.render('Customers', context);
        }
    })

    router.get('/searchName/', function(req, res) {
        console.log("Called router.get(/seachName/");
        
        let context = {};
       
        context.jsscripts = ['searchCustomers.js'];
        
        let mysql = req.app.get('mysql');
        let firstName = req.query.searchFirstName;
        let lastName = req.query.searchLastName;

        console.log(firstName);
        console.log(lastName);

        getCustomersByName(firstName, lastName, res, mysql, context, complete);

        function complete() {
            res.render('Customers', context);
        }
    })

    router.post('/', function(req, res) {
        let mysql = req.app.get('mysql')
        let sql = "INSERT INTO Customers (first_name, last_name, email_address, date_of_birth) VALUES (?,?,?,?)";
        let inserts = [req.body.first_name, req.body.last_name, req.body.email_address, req.body.date_of_birth];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if(error) {
                res.write(JSON.stringify(error))
                res.end();
            } else {
                res.redirect('/Customers')
            }
        })
    })


    return router;
}();