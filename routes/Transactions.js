module.exports = function() {
    const express = require('express');
    const router = express.Router();
    const logger = require('../utils/Logger');

    router.get('/', function(req, res) {
        context = {}
        res.render("Transactions", context)
    })

    router.post('/CreateTransaction/:orderID/PaymentID/:payID', function(req, res) {
        logger("POST Transactions/CreateTransaction/:orderID/PaymentID/:payID", req);
        
        context = {}

        sql = "INSERT INTO Transactions "
        
        res.render('Transactions', context)
    })

    return router;
}();