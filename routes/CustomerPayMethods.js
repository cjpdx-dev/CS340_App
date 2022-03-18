
module.exports = function() {
    const express = require('express');
    const router = express.Router();
    const logger = require('../utils/Logger.js');

    function getCustomerPayMethods(customerID, res, mysql, context, complete) {
        
        inserts = [customerID]
        sql =   "SELECT CustomerPayMethods.id, PayMethods.pay_method_id, PayMethods.card_type, PayMethods.last_four_digits, PayMethods.expiration_date " +

                "FROM CustomerPayMethods JOIN PayMethods ON CustomerPayMethods.pay_method_id = PayMethods.pay_method_id " + 
                
                "WHERE CustomerPayMethods.customer_id = ?";
        
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customerPayMethods = results;
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

        res.render('CustomerPayMethods', context)

    })

    /* Returns the CustomerAddresses by CustomerID */
    router.get('/:customerID', function(req, res) {
        logger("/:customerID", req);

        let context = {}
        context.jsscripts = []

        let mysql = req.app.get('mysql');
        let customerID = req.params.customerID;

        getCustomerPayMethods(customerID, res, mysql, context, complete)
        function complete() {
            console.log(context)
            res.render('CustomerPayMethods', context)
        }
        

    })

    return router;
}();