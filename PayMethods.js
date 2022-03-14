const { type, redirect } = require('express/lib/response');

module.exports = function() {
    const express = require('express');
    const router = express.Router();

    const logger = require('./Logger.js');

    function getPayMethods(res, mysql, context, complete) {
        mysql.pool.query("SELECT * FROM PayMethods", function(error, results, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.paymethods = results;
            complete();
        });
    }

    function getPayMethodByID(id, res, mysql, context, complete) {
        inserts = [id];
        sql =   "SELECT CustomerPayMethods.id, Addresses.first_name, Addresses.last_name, PayMethods.card_type, PayMethods.last_four_digits, PayMethods.expiration_date " +
                "FROM CustomerPayMethods JOIN PayMethods ON CustomerPayMethods.pay_method_id = PayMethods.pay_method_id " + 
                "JOIN Addresses ON PayMethods.address_id = Addresses.address_id WHERE PayMethods.pay_method_id = ?";

        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.paymethods = results;
            complete();                
            
        });
    }

    function getPayMethodsByCustomerID(customerID, res, mysql, context, complete) {
        inserts = [customerID];
        sql =   "SELECT CustomerPayMethods.id, Addresses.first_name, Addresses.last_name, PayMethods.card_type, PayMethods.last_four_digits, PayMethods.expiration_date " +
                "FROM CustomerPayMethods JOIN PayMethods ON CustomerPayMethods.pay_method_id = PayMethods.pay_method_id " + 
                "JOIN Addresses ON PayMethods.address_id = Addresses.address_id WHERE CustomerPayMethods.customer_id = ?";

        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.paymethods = results;
            complete();                
            
        });
        
    }

    function getCustomerAddresses(customerID, res, mysql, context, complete) {
        
        inserts = [customerID]
        sql =   "SELECT CustomerAddresses.id, Addresses.address1, Addresses.address2, Addresses.city, " + 
                        "Addresses.state, Addresses.zipcode, Addresses.country " +

                "FROM CustomerAddresses JOIN Addresses ON CustomerAddresses.address_id = Addresses.address_id " + 
                "WHERE CustomerAddresses.id = ?";
        
            mysql.pool.query(sql, inserts, function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.customerAddresses = results;
                complete();
            });
    }

    function postCustomerAddressWithAddressID(req, res, mysql, complete) {

    }

    router.get('/', function(req, res) {
        logger("GET /PayMethods", req);
        
        let context = {};
        context.jsscripts = ['searchPayMethods.js', 'createPayMethod.js', 'searchCustomerAddresses.js'];

        let mysql = req.app.get('mysql');

        getPayMethods(res, mysql, context, complete);

        function complete() {
            res.render('PayMethods', context)
        }
    })

    router.get('/GetCustomerAddresses/:customerID', function(req, res) {
        logger("GET /GetCustomerAddresses/:customerID", req);
        let context = {}
        context.jsscripts = ['searchPayMethods.js', 'createPayMethod.js', 'searchCustomerAddresses.js'];

        let mysql = req.app.get('mysql')
        let customerID = req.params.customerID;

        inserts = [customerID]
        sql =   "SELECT CustomerAddresses.id, Addresses.address_id, Addresses.address1, Addresses.address2, Addresses.city, Addresses.state, Addresses.zipcode, Addresses.country " + 
                "FROM CustomerAddresses JOIN Addresses ON CustomerAddresses.address_id = Addresses.address_id " + 
                "WHERE CustomerAddresses.customer_id = ?;" 

        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400); 
                res.end(); 
            } else{
                console.log(JSON.stringify(results))
                res.status(202).send(results);
            }
        })

    })

    router.get('/SearchPayMethodID/:id', function(req, res) {
        logger("GET /PayMethods/SearchPayMethodID/:id)", req);

        let context = {}
        context.jsscripts = ['searchPayMethods.js', 'createPayMethod.js', 'searchCustomerAddresses.js'];

        let mysql = req.app.get('mysql');
        let id = req.params.id;

        getPayMethodByID(id, res, mysql, context, complete);

        function complete() {
            res.render('PayMethods', context)
        }
    })

    router.get('/CreateByCustomerID/:customerID', function(req, res) {
        logger("GET /PayMethods/CreateByCustomerID/:customerID", req);

        let context = {}
        context.jsscripts = ['searchPayMethods.js', 'createPayMethod.js', 'searchCustomerAddresses.js'];

        let mysql = req.app.get('mysql')
        let customerID = req.params.customerID;

        getCustomerAddresses(customerID, res, mysql, context, complete);
        
        function complete() {
            res.render('PayMethods', context)
        }
    })

    router.get('/SearchCustomerID/:customerID', function(req, res) {
        
        logger("GET PayMethods/SearchCustomerID/:customerID", req);
        
        let context = {}
        context.jsscripts = ['searchPayMethods.js', 'createPayMethod.js', 'searchCustomerAddresses.js'];

        let mysql = req.app.get('mysql');
        let customerID = req.params.customerID;
        
        getPayMethodsByCustomerID(customerID, res, mysql, context, complete);

        function complete() {
            res.render('PayMethods', context)
        }
    })

    router.post('/', function(req, res, next) {
        logger("POST PayMethods/", req);

        let mysql = req.app.get('mysql')

        if(req.body.selectAddress) {
            if(req.body.selectAddress != "default"){
                postCustomerAddressWithAddressID(req, res, mysql, complete)
                function complete() {
                    redirect('PayMethods');
                }
            }
        }


        
    return router;
}();
