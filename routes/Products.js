
module.exports = function() {
    const express = require('express');
    const router = express.Router();
    const logger = require('../utils/Logger.js');


    function getAllProducts(req, res, mysql, context, complete) {
        let sql = "SELECT * FROM Products;"
        mysql.pool.query(sql, function(error, results, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.products = results;
            complete();
        })
    }


    function getProductsByID(req, res, mysql, context, complete) {
        let sql = "SELECT * FROM Products WHERE product_id = ?";
        let inserts = [req.params.productId];
        
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.products = results;
            complete();
        });
    }


    router.get('/', function(req, res) {

        let mysql = req.app.get('mysql');

        let context = {};
        context.jsscripts = ['createProduct.js', 'searchProducts.js', 'productOptions.js'];
        
        getAllProducts(req, res, mysql, context, complete);
        function complete() {
            res.render('Products', context);
        }
    })

    router.get('/:id', function(req, res) {
        let context = {};
        context.jsscripts = ['createProduct.js', 'searchProducts.js', 'productOptions.js'];
        
        getProductsByID(req, res, mysql, context, complete);
        function complete() {
            res.render('Products', context);
        }
    })


    router.get('/ProductSearch/', function(req, res) {
        let mysql = req.app.get('mysql');
        let sql = "";
        let inserts = [];
    })


    router.post('/', function(req, res) {
        let mysql = req.app.get('mysql');     

        let sql =   "INSERT INTO Products (product_name, color, weight_lbs, volume_cubic_inches, in_stock_qty, reorder_at_qty, is_discontinued) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        let inserts = 
            [
                req.body.product_name,
                req.body.color,
                req.body.weight_lbs,
                req.body.volume_cubic_inches,
                req.body.in_stock_qty,
                req.body.reorder_at_qty,
                0
            ];
        
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error) {
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/Products');
            }
        })


    router.put('/DiscontinueProduct/id', function(req, res) {
        let mysql = req.app.get('mysql');
        let inserts = [req.body.product_id];
        let sql = "UPDATE Products SET is_discontinued = 1 WHERE product_id = ?";
    })
    
    });
    return router;
}();
