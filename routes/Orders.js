
module.exports = function() {
    const express = require('express');
    const router = express.Router();
    const logger = require('../utils/Logger.js');

    /* 
    function getAllOrders()
    */
    function getAllOrders(req, res, mysql, context, complete) {
        let sql =   "SELECT Orders.order_id, Customers.customer_id, Customers.first_name, Customers.last_name, Orders.when_created, " + 
                    "Orders.order_status, Orders.is_closed, Orders.when_closed " +  
                    "FROM Orders JOIN Customers WHERE Orders.customer_id = Customers.customer_id";
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.orders = results;
            complete();
        });
    }


    /*
    function getOrdersByID()
    */
    function getOrdersByID(req, res, mysql, context, complete) {
        let sql =   "SELECT Orders.order_id, Customers.customer_id, Customers.first_name, Customers.last_name, Orders.when_created, " + 
                    "Orders.order_status, Orders.is_closed, Orders.when_closed " +  
                    "FROM Orders JOIN Customers WHERE Orders.order_id = ? AND Orders.customer_id = Customers.customer_id ";
        let inserts = [req.query.inputOrderId];

        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.orders = results;
            complete();
        });
    }


    /*
    Entry route for Orders 
    */
    router.get('/', function(req, res) {
        logger("GET Orders/", req);
        let context = {};
        let mysql = req.app.get('mysql');
        context.jsscripts = ['createOrder.js', 'searchOrders.js', 'orderOptions.js'];
        getAllOrders(req, res, mysql, context, complete)
        function complete() {
            res.render('Orders', context)
        }
    })


    /*
    Route for SearchOrderID 
    */
    router.get('/SearchOrderID', function(req, res) {
        logger("GET Orders/SearchOrderID", req);
        let context = {};
        context.jsscripts = ['createOrder.js', 'searchOrders.js', 'orderOptions.js'];
        let mysql = req.app.get('mysql');
        
        getOrdersByID(req, res, mysql, context, complete);
        
        function complete() {
            res.render('Orders', context)
        }
    })


    /*

    */
    router.get('/OrderFilterSearch/', function(req, res) {
        let mysql = req.app.get('mysql');

        let sql = "";
        let inserts = [];
    })

    
    /*
    POST Route for inserting into Orders
    */
    router.post('/', function(req, res) {
        logger("POST Orders/", req);
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO Orders (customer_id, when_created, order_status, is_closed) VALUES (?, ?, ?, ?)";
        let order_datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let inserts = [req.body.newOrderCustomerID, order_datetime, "OPEN", false, null];
        
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/Orders');
            }
        });
    });
    
    return router;
}();
