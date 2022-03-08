
module.exports = function() {
    const express = require('express');
    const router = express.Router();

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
        context.jsscripts = ['create_order.js, search_orders.js, cancel_order.js'];
        let mysql = req.app.get('mysql');
        getOrdersByID(req, res, mysql, context, complete);
        function complete() {
            res.render('Orders', context)
        }
    })

    router.post('/', function(req, res) {
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO Orders (customer_id, when_created, status, is_closed) VALUES (?, ?, ?, ?)";
        let inserts = [req.body.customer_id, req.body.when_created, req.body.status, req.body.is_closed];
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
