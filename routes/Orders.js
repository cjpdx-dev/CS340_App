
module.exports = function() {
    const express = require('express');
    const router = express.Router();
    const logger = require('../utils/Logger.js');

    function getOrdersByID(req, res, mysql, context, complete) {
        let query = "SELECT * FROM Orders WHERE order_id = ?";
        let inserts = [req.params.customer_id];

        mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.orders = results;
            complete();
        });
    }

    router.get('/', function(req, res) {
        let context = {};
        context.jsscripts = ['createOrder.js', 'searchOrders.js', 'orderOptions.js'];
        
        res.render('Orders', context);
    })

    router.get('/:id', function(req, res) {
        let context = {};
        context.jsscripts = ['createOrder.js', 'searchOrders.js', 'orderOptions.js'];
        let mysql = req.app.get('mysql');
        
        getOrdersByID(req, res, mysql, context, complete);
        
        function complete() {
            res.render('Orders', context)
        }
    })

    router.get('/OrderFilterSearch/', function(req, res) {
        let mysql = req.app.get('mysql');

        let sql = "";
        let inserts = [];
    })

    router.post('/:id', function(req, res) {
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO Orders (customer_id, when_created, status, is_closed) VALUES (?, ?, ?, ?)";
        let order_datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let inserts = [req.body.customer_id, order_datetime, "OPEN", false, null];
        
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