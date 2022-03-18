module.exports = function() {
    const express = require('express');
    const router = express.Router();
    const logger = require('../utils/Logger');


    function getOrderItems(customerId, orderId, res, mysql, context, complete) {
        let sql =   "SELECT OrderItems.order_line_id, Products.product_id, Products.product_name, Products.color, Products.price, Products.weight_lbs, Products.volume_cubic_inches " +
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

            sql =   "SELECT PayMethods.pay_method_id, PayMethods.card_type, PayMethods.last_four_digits, PayMethods.expiration_date " +
                    "FROM PayMethods JOIN CustomerPayMethods ON CustomerPayMethods.customer_id = ?"
            inserts = [customerId];
            mysql.pool.query(sql, inserts, function(error, results, fields){
                if (error) {
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.paymethods = results

                sql =   "SELECT Products.product_id, Products.product_name, Products.color, Products.price, Products.in_stock_qty, Products.is_discontinued " +
                        "FROM Products WHERE in_stock_qty > 0 AND is_discontinued != 1"
                
                    mysql.pool.query(sql, function(error, results, fields) {
                        if (error) {
                            res.write(JSON.stringify(error));
                            res.end();
                        }
                        context.products = results;
                        complete();
                    });
                });
            });
    }


    router.get('/', function(req, res) {
        logger("GET OrderItems/", req);
        context = {}
        context.alertMessage = "To View Order Items: Go To Orders Page and Select \"Edit Items\"";
        context.jsscripts = 
        [
            'addOrderItem.js', 
            'finalizeOrderItems.js',
            'removeOrderItem.js'
        ]
        
        res.render("OrderItems", context)
  
    })


    router.get('/CustomerID/:customerID/OrderID/:orderID', function(req, res) {
        logger("GET OrderItems/CustomerID/:customerID/OrderID/:orderID", req);
        context = {}
        context.jsscripts = 
        [
            'addOrderItem.js', 
            'finalizeOrderItems.js',
            'removeOrderItem.js'
        ]

        if (req.params.customerID && req.params.orderID){
            customerId = req.params.customerID;
            context.customer_id = customerId;

            orderId = req.params.orderID;
            context.order_id = orderId;
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


    router.post('/OrderID/:orderID/AddProduct/:productID', function(req, res) {
        logger("POST OrderItems/AddProduct:productID", req)
        let mysql = req.app.get('mysql');

        let sql = "INSERT INTO OrderItems (order_id, product_id) VALUES (?, ?)"
        let inserts = [req.params.orderID, req.params.productID];

        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if(error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                result = {}
                result.success = true
                res.send(JSON.stringify(result));
            }
        });
    });

    
    router.delete('/OrderLineID/:orderLineId', function(req, res) {
        logger("DELETE OrderItems/RemoveOrderItem/:orderLineId", req);
        let mysql = req.app.get('mysql');
        let sql = "DELETE FROM OrderItems WHERE order_line_id = ?"
        let inserts = [req.params.orderLineId]
        console.log(sql)
        console.log(inserts)
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if(error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.end()
            }
        });
    });

    return router;
}();