
module.exports = function() {
    const express = require('express');
    const router = express.Router();
    const logger = require('./Logger.js');
    

    function getAddresses(res, mysql, context, complete) {
        mysql.pool.query("SELECT * FROM Addresses", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.addresses = results;
            complete();
        });
    }

    function getAddressByID(id, res, mysql, context, complete) {
        
        inserts = [id]
        sql = "SELECT * FROM Addresses WHERE address_id = ?";
        
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.addresses = results;
            complete();
        });
    }

    router.get('/', function(req, res) {

        logger("router.get(/Addresses/)", req); 

        let context = {};
        context.jsscripts = ['searchAddresses.js'];

        let mysql = req.app.get('mysql');
        getAddresses(res, mysql, context, complete);
        
        function complete() {
            res.render('Addresses', context)
        }
    })

    router.get('/searchAddressID/:id', function(req, res) {

        logger("router.get(Addresses/searchAddressID/:id)", req); 

        let context = {};
        context.jsscripts = ['searchAddresses.js'];

        let mysql = req.app.get('mysql');
        let id = req.params.id;
        console.log(id)
        getAddressByID(id, res, mysql, context, complete);
        
        function complete() {
            res.render('Addresses', context)
        }
    })

    router.post('/', function(req, res, next) {
        logger("POST Addresses/", req); 

        let mysql = req.app.get('mysql')

        let customerInserts = [req.body.customerID];

        if(customerInserts[0] === undefined){
            res.write(JSON.stringify("Missing field for CustomerID"))
            res.end();
        }

        // Validate CustomerID
        let sql = "SELECT * FROM Customers WHERE Customers.customer_id = ?";
        sql = mysql.pool.query(sql, customerInserts, function(error, results, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            } else {

                if(results){
                    next()
                } else {
                    res.write(JSON.stringify("No Customer ID Found"));
                    res.end();
                }
                
            }
        })

    }, (req, res, next) => {

        let addressInserts = 
        [ 
            req.body.firstName, 
            req.body.lastName, 
            req.body.address1,
            ( (!req.body.address2) ? 'NULL' : req.body.address2), 
            req.body.city, 
            req.body.state, 
            req.body.zipcode, 
            req.body.country
        ];

        // If any element in addressInserts is undefined, throw error
        if(addressInserts.some(item => item === undefined)) {
            res.write(JSON.stringify("Missing field for INSERT INTO Addresses"))
            res.end();
        }

        let mysql = req.app.get('mysql')

        sql = "INSERT INTO Addresses (first_name, last_name, address1, address2, city, state, zipcode, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?); SELECT LAST_INSERT_ID()"
    
        sql = mysql.pool.query(sql, addressInserts, function(error, results, fields) {
            if(error) {
                res.write(JSON.stringify(error))
                res.end();
            } else {
                let addressID = results[1][0]['LAST_INSERT_ID()'];
                res.locals.addressID = addressID;
                next()
            }
        })
    
    }, (req, res, next) => {

        let mysql = req.app.get('mysql')
        let customerAddressInserts = [req.body.customerID, res.locals.addressID];
        let sql = "INSERT INTO CustomerAddresses (customer_id, address_id) VALUES (?,?)";
        sql = mysql.pool.query(sql, customerAddressInserts, function(error, results, fields) {
            if(error) {
                res.write(JSON.stringify(error))
                res.end();
            } else {
                res.redirect('/Addresses')
            }
        })
    })


    return router;
}();
