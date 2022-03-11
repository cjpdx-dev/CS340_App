const { type } = require('express/lib/response');

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

    if (req.body.checkboxNewAddressFields) {
        // CASE 1: We're using a new address for the billing address, we INSERT the new address,
        // return address_id of that newly INSERTed address (research how to do this), then we call
        // next()
        console.log("Inserting new address")
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
        ];

        console.log("addressInserts: " + addressInserts);
        
        // If any element in addressInserts is undefined, throw error
        if(addressInserts.some(item => item === undefined)) {
            res.write(JSON.stringify("Missing field for INSERT INTO Addresses"))
            res.end();
        }
        // INSERT INTO Addresses, then return the address_id that was generated
        let sql = "INSERT INTO Addresses (first_name, last_name, address1, address2, city, state, zipcode, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?); SELECT LAST_INSERT_ID()"

        console.log(sql);

        sql = mysql.pool.query(sql, addressInserts, function(error, results, fields) {
            if(error) {
                res.write(JSON.stringify(error))
                res.end();
            }

            console.log(results[1][0]['LAST_INSERT_ID()']);
            let addressID = results[1][0]['LAST_INSERT_ID()'];
            res.locals.addressID = addressID;

            let customerAddressInserts = [req.body.customerID, addressID];
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
        })
    } else {

        address_id = req.body.addressID;
        next();
    }

    }, (req, res, next) => {
        console.log("next() Inserting PayMethod")
        
        let mysql = req.app.get('mysql')

        let payMethodInserts = 
        [
            res.locals.addressID,
            req.body.cardType,
            req.body.lastFourDigits,
            req.body.expirationDate 
        ];

        if(payMethodInserts.some(item => item === undefined)) {
            res.write(JSON.stringify("Missing field for INSERT INTO Addresses"))
            res.end();
        }

        let sql =   "INSERT INTO PayMethods (address_id, card_type, last_four_digits, expiration_date) " + 
                    "VALUES (?,?,?,?); SELECT LAST_INSERT_ID();"

        sql = mysql.pool.query(sql, payMethodInserts, function(error, results, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.locals.payMethodID = results[1][0]['LAST_INSERT_ID()'];
                next();
            }
        })


    }, (req, res, next) => {

        console.log("next() Inserting CustomerPayMethod")

        let mysql = req.app.get('mysql')

        let customerPayMethodInserts = [req.body.customerID, res.locals.payMethodID];

        let sql = "INSERT INTO CustomerPayMethods (customer_id, pay_method_id) VALUES (?,?)";

        sql = mysql.pool.query(sql, customerPayMethodInserts, function(error, results, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/PayMethods')
            }
        })
    })
        
    return router;
}();
