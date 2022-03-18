
module.exports = function() {
    const express = require('express');
    const router = express.Router();
    const logger = require('../utils/Logger.js');

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
            context.customerID = customerID;
            complete();
        });
    }
    

    /* Renders the CustomerAddresses page with no results because no CustomerID parameter */
    router.get('/', function(req, res) {
        logger("CustomerAddresses/", req);

        let context = {};
        context.jsscripts = []
        let mysql = req.app.get('mysql');

        res.render('CustomerAddresses', context)

    })

    /* Returns the CustomerAddresses by CustomerID */
    router.get('/:customerID', function(req, res) {
        logger("/:customerID", req);

        let context = {}
        context.jsscripts = []

        let mysql = req.app.get('mysql');
        let customerID = req.params.customerID;

        getCustomerAddresses(customerID, res, mysql, context, complete)

        function complete() {
            res.render('CustomerAddresses', context)
        }

    })

    return router;
}();