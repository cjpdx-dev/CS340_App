const { type, redirect } = require('express/lib/response');

module.exports = function() {
    const express = require('express');
    const router = express.Router();
    const customerAddresses = require('./CustomerAddresses.js');
    const logger = require('../utils/Logger.js');

    function getAllPayMethods(res, mysql, context, complete) {

        let sql =   "SELECT PayMethods.pay_method_id, Addresses.first_name, Addresses.last_name, PayMethods.card_type, PayMethods.last_four_digits, PayMethods.expiration_date " +
                    
                    "FROM PayMethods JOIN Addresses ON PayMethods.address_id = Addresses.address_id"
        
        mysql.pool.query(sql, function(error, results, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.paymethods = results;
            complete();
        });
    }


    function getPayMethodByID(payMethodID, res, mysql, context, complete) {

        inserts = [payMethodID];

        sql =   "SELECT CustomerPayMethods.id, Addresses.first_name, Addresses.last_name, PayMethods.card_type, PayMethods.last_four_digits, PayMethods.expiration_date " +
                
                "FROM CustomerPayMethods JOIN PayMethods ON CustomerPayMethods.pay_method_id = PayMethods.pay_method_id " + 
                
                                        "JOIN Addresses ON PayMethods.address_id = Addresses.address_id " +
                
                                        "WHERE PayMethods.pay_method_id = ?";

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
                
                                        "JOIN Addresses ON PayMethods.address_id = Addresses.address_id " +
                
                                        "WHERE CustomerPayMethods.customer_id = ?";

        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            } else {
                context.paymethods = results;

                inserts = [customerID]

                sql =   "SELECT CustomerAddresses.id, Addresses.address_id, Addresses.address1, Addresses.address2, Addresses.city, Addresses.state, Addresses.zipcode, Addresses.country " +

                        "FROM CustomerAddresses JOIN Addresses ON CustomerAddresses.address_id = Addresses.address_id " + 
                
                                                "WHERE CustomerAddresses.customer_id = ?";
                
                mysql.pool.query(sql, inserts, function(error, results, fields) {
                    if(error){
                        res.write(JSON.stringify(error));
                        res.end();
                    }
                    else {
                        context.customerAddresses = results;
                        context.customerID = customerID;
                        console.log(context)
                        complete()
                    }

                })
            }              
        });
        
    }

    router.get('/', function(req, res) {
        logger("GET /PayMethods", req);
        
        let context = {};
        context.jsscripts = ['searchPayMethods.js', 'createPayMethod.js', 'searchCustomerAddresses.js'];

        let mysql = req.app.get('mysql');

        getAllPayMethods(res, mysql, context, complete);

        function complete() {
            res.render('PayMethods', context)
        }
    })

    /* Returns PayMethods associated with CustomerID */
    router.get('/:customerID', function(req, res) {
        logger("GET /PayMethods/:customerID", req);

        let context = {}
        let mysql = req.app.get('mysql')
        
        context.jsscripts = ['searchPayMethods.js', 'createPayMethod.js', 'searchCustomerAddresses.js'];
        customerID = req.params.customerID
        getPayMethodsByCustomerID(customerID, res, mysql, context, complete)
        function complete(){
            res.render('PayMethods', context)
        }
    });


    /* Returns all PayMethods based on pay_method_id */
    router.get('/SearchByPayMethodID/:id', function(req, res) {
        logger("GET /PayMethods/SearchPayMethodID/:id)", req);

        let context = {}
        context.jsscripts = ['searchPayMethods.js', 'createPayMethod.js', 'searchCustomerAddresses.js'];

        let mysql = req.app.get('mysql');
        let payMethodID = req.params.id;

        getPayMethodByID(payMethodID, res, mysql, context, complete);

        function complete() {
            res.render('PayMethods', context)
        }
    })

    router.get('/SearchByCustomerID/:customerID', function(req, res) {
        
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
        res.locals.customerId = req.body.inputCustomerID;

        if(req.body.selectAddress != "default" && !req.body.checkboxNewAddressFields){
            res.locals.addressId = req.body.selectAddress;
            next()

        } else if (req.body.checkboxNewAddressFields) {
            
            let addressInserts = 
            [
                req.body.firstName, 
                req.body.lastName, 
                req.body.address1,
                ( (!req.body.address2) ? "NULL" : req.body.address2), 
                req.body.city, 
                req.body.state, 
                req.body.zipcode, 
                req.body.country
            ]

            if(addressInserts.some(item => item === undefined)) {
                res.write(JSON.stringify("MISSING field for INSERT INTO Addresses"))
                res.end();
            }

            let sql = "INSERT INTO Addresses (first_name, last_name, address1, address2, city, state, zipcode, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"

            sql = mysql.pool.query(sql, addressInserts, function(error, results, fields) {
                if(error) {
                    res.write(JSON.stringify(error))
                    res.end();
                }
                else {
                    res.locals.addressId = results.insertId;
                    next();
                }
            })

        } else {
            res.write(JSON.stringify("Could not POST to PayMethods"))
            res.end();
        }

    }, (req, res, next) => {

        let mysql = req.app.get('mysql');

        if(req.body.selectAddress != "default" && !req.body.checkboxNewAddressFields) {
            next()
        }

        let addressId = res.locals.addressId;
        let customerAddressInserts = [res.locals.customerId, addressId];
        let sql = "INSERT INTO CustomerAddresses (customer_id, address_id) VALUES (?,?)";
        
        sql = mysql.pool.query(sql, customerAddressInserts, function(error, results, fields) {
            if(error) {
                console.log("error")
                res.write(JSON.stringify(error));
                res.end();
            }
            else {
                next();
            } 
        })

    
    }, (req, res, next) => {
        console.log("next() Inserting PayMethod")

        let mysql = req.app.get('mysql')

        let payMethodInserts = 
        [
            res.locals.addressId,
            req.body.cardType,
            req.body.lastFourDigits,
            req.body.expirationDate 
        ];

        if(payMethodInserts.some(item => item === undefined)) {
            res.write(JSON.stringify("Missing field for INSERT INTO Addresses"))
            res.end();
        }

        sql =   "INSERT INTO PayMethods (address_id, card_type, last_four_digits, expiration_date) " + 
                    "VALUES (?,?,?,?);"

        sql = mysql.pool.query(sql, payMethodInserts, function(error, results, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.locals.payMethodID = results.insertId;
                next();
            }
        })


    }, (req, res, next) => {

        console.log("next() Inserting CustomerPayMethod")

        let mysql = req.app.get('mysql')

        let customerPayMethodInserts = [res.locals.customerId, res.locals.payMethodID];

        let sql = "INSERT INTO CustomerPayMethods (customer_id, pay_method_id) VALUES (?,?)";

        sql = mysql.pool.query(sql, customerPayMethodInserts, function(error, results, fields) {
            if(error) {
                console.log("ERROR")
                res.write(JSON.stringify(error));
                res.end();
            }
        })

        res.redirect('/PayMethods')
    })

    return router;
}();
