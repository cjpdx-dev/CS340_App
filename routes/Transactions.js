module.exports = function() {
    const express = require('express');
    const router = express.Router();
    const logger = require('../utils/Logger');

    function getTransactionsByPaymentId(req, res, mysql, context, complete) {
        let sql =   "SELECT * FROM Transactions WHERE Transactions.pay_method_id = ?";
        let inserts = [req.params.paymentId]
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.transactions = results;
            complete();
        });
    }

    router.get('/', function(req, res) {
        context = {}
        context.jsscripts = ['searchTransactions.js']
        res.render("Transactions", context)
    })

    router.get('/PayID/:paymentId', function(req, res) {
        logger("GET Transactions/PayID/:paymentId", req);
        let mysql = req.app.get('mysql');
        context = {}
        context.jsscripts = ['searchTransactions.js']
        getTransactionsByPaymentId(req, res, mysql, context, complete);
        function complete() {
            res.render('Transactions', context)
        }


    });

    router.post('/CreateTransaction/:orderID/PaymentID/:payID', function(req, res) {
        logger("POST Transactions/CreateTransaction/:orderID/PaymentID/:payID", req);
        
        let mysql = req.app.get('mysql');

        if (req.params.orderID && req.params.payID) {
            orderId = req.params.orderID;
            payMethodId = req.params.payID;
        } else {
            res.write(JSON.stringify("Missing POST Transactions/ parameter"));
            res.end();
        }
 
        // Get the total price of all the order items for the order
        let sql =   "SELECT OrderItems.order_id, SUM(Products.price) AS totalPrice " +
                    "FROM OrderItems JOIN Products ON Products.product_id = OrderItems.product_id " +
                    "WHERE OrderItems.order_id = ? " + 
                    "GROUP BY OrderItems.order_id;"

        let inserts = [orderId]

        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error) {
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            } else {
                // Now inserts the new transaction

                let totalPrice = results[0].totalPrice
                let transaction_datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
                inserts = [orderId, payMethodId, totalPrice, transaction_datetime]
                sql = "INSERT INTO Transactions (order_id, pay_method_id, transaction_amount, datetime_charged) VALUES (?, ?, ?, ?)"
                
                sql = mysql.pool.query(sql, inserts, function(error, results, fields){
                    if(error) {
                        console.log(JSON.stringify(error));
                        res.write(JSON.stringify(error));
                        res.end();
                    } else {
                        result = {}
                        result.paymentId = payMethodId
                        res.send(JSON.stringify(result));
                    }
                })
            }
        });
    });
        
    return router;
}();