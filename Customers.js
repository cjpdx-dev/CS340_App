
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

    router.get('/', function(req, res) {
        let context = {};
        context.jsscripts = ['search_customers.js'];
        let mysql = req.app.get('mysql');
        getCustomers(res, mysql, context, complete);
        function complete() {
            res.render('Customers', context)
        }
    })

    router.get('/', function(req, res) {
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO Customers (first_name, last_name, "
    })


    return router;
}();