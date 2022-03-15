
module.exports = function() {
    const express = require('express');
    const router = express.Router();
    const logger = require('./Logger.js');

    function getCustomerAddresses(customerID, res, mysql, context, complete) {
        
        inserts = [customerID]
        sql =   "SELECT CustomerAddresses.id, Addresses.address_id, Addresses.address1, Addresses.address2, Addresses.city, Addresses.state, Addresses.zipcode, Addresses.country " +

                "FROM CustomerAddresses JOIN Addresses ON CustomerAddresses.address_id = Addresses.address_id " + 
                
                "WHERE CustomerAddresses.customer_id = ?";
        
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customerAddresses = results;
            complete();
        });
    }
    

    /* Renders the CustomerAddresses page with no results because no CustomerID parameter */
    router.get('/', function(req, res) {
        logger("/GetCustomerAddresses/", req);

        let context = {};
        context.jsscripts = ['searchCustomerAddresses.js', 'createCustomerAddress']

        let mysql = req.app.get('mysql');

        res.render('CustomerAddresses', context)

    })

    /* Returns the CustomerAddresses by CustomerID */
    router.get('/GetCustomerAddresses/:customerID', function(req, res) {
        logger("/GetCustomerAddresses/:customerID", req);

        let context = {}
        context.jsscripts = ['searchCustomerAddresses.js', 'createCustomerAddress']

        let mysql = req.app.get('mysql');
        let customerID = req.params.customerID;

        getCustomerAddresses(customerID, res, mysql, context, complete)

        function complete() {
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            } else {
                res.render('CustomerAddresses', context)
                // if GET from PayMethods (or another page), send results to that page with context
                res.status(202).send(context.customerAddresses);
            }
        }

    })

    return router;
}