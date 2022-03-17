module.exports = function() {
    const express = require('express');
    const router = express.Router();
    const logger = require('../utils/Logger');


    function getOrderItems(customerId, orderId, res, mysql, context, complete) {
        let sql =   "SELECT Products.product_id, Products.product_name, Products.color, Products.price, Products.weight_lbs, Products.volume_cubic_inches " +
                    "FROM Products JOIN OrderItems ON Products.product_id = OrderItems.product_id " +
                                    "JOIN Orders ON OrderItems.order_id = Orders.order_id " +
                                    "WHERE Orders.order_id = ?"
        inserts = [orderId];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.orderItems = results;
            context.customerId = customerId;
            complete();
        });
    }


    router.get('/', function(req, res) {
        logger("GET OrderItems/", req);
        context = {}
        context.alertMessage = "To View Order Items: Go To Orders Page and Select \"Edit Items\"";
        context.jsscripts = 
        [
            'addOrderItem.js', 
            'loadOrderItems.js', 
            'addOrderItem.js', 
            'loadCustomerPayMethods.js', 
            'finalizeOrderItems'
        ]
        
        res.render("OrderItems", context)
  
    })


    router.get('/CustomerID/:customerID/OrderID/:orderID', function(req, res) {
        logger("GET OrderItems/CustomerID/:customerID/OrderID/:orderID", req);
        context = {}
        context.jsscripts = 
        [
            'addOrderItem.js', 
            'loadOrderItems.js', 
            'addOrderItem.js', 
            'loadCustomerPayMethods.js', 
            'finalizeOrderItems'
        ]

        if (req.params.customerID && req.params.orderID){
            customerId = req.params.customerID;
            orderId = req.params.orderID;
        } else {
            res.write(JSON.stringify("error: a query parameter was missing for route /CustomerID/:customerID/OrderID/:orderID"));
            res.end();
        }

        let mysql = req.app.get('mysql');

        getOrderItems(customerId, orderId, res, mysql, context, complete)
        function complete() {
            res.render("OrderItems", context)
        }
    })


    router.post('/CustomerID/:customerID/OrderID/:orderID', function(req, res) {
        logger("POST OrderItems/CustomerID/:customerID/OrderID/:orderID")
    })

    return router;
}();