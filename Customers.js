
module.exports = function() {
    const express = require('express');
    const router = express.Router();

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

        if (firstName !== null && lastName !== null) {
            sql = "SELECT * FROM Customers WHERE first_name = ? AND last_name = ?";
            inserts = [firstName, lastName];
        }
        else if (firstName === null && lastName !== null) {
            sql = "SELECT * FROM Customers WHERE last_name = ?";
            inserts = [lastName];
        }
        else if (lastName === null && firstName !== null) {
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
        console.log("Called router.get(Customers/")
        console.log(req.params)
        let context = {};
        context.jsscripts = ['search_customers.js'];
        let mysql = req.app.get('mysql');
        getCustomers(res, mysql, context, complete);
        function complete() {
            res.render('Customers', context)
        }
    })

    router.get('/searchId/:id', function(req, res) {
        console.log("Called router.get(Customers/:id)")
        
        console.log(req.body)
        
        let context = {};
        context.jsscripts = ['search_customers.js'];
        // context.jsscripts = ?
        let mysql = req.app.get('mysql');
        let id = req.params.id;

        getCustomerByID(id, res, mysql, context, complete);
        function complete() {
            res.render('Customers', context);
        }
    })

    router.get('/searchName/:searchFirstName/:searchLastName', function(req, res) {
        console.log("Called router.get(Customers/:firstName/:lastName)")
        console.log(req.body)
        let context = {};
        context.jsscripts = ['search_customers.js'];
        let mysql = req.app.get('mysql');

        let firstName = req.body.searchFirstName;
        let lastName = req.body.searchLastName;

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