
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

    router.post('/', function(req, res) {
        logger("PUT Addresses/", req); 

        let mysql = req.app.get('mysql')

        // Using a ternary operator here for address2 NULL/undefined
        let inserts = [ req.body.firstName, 
                    req.body.lastName, 
                    req.body.address1,
                    ( (!req.body.address2) ? 'NULL' : req.body.address2), 
                    req.body.city, 
                    req.body.state, 
                    req.body.zipcode, 
                    req.body.country
                ];
        
        let sql = "INSERT INTO Addresses (first_name, last_name, address1, address2, city, state, zipcode, country) VALUES (?,?,?,?,?,?,?,?)";

        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
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
