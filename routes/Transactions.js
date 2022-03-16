module.exports = function() {
    const express = require('express');
    const router = express.Router();
    const logger = require('../utils/Logger');

    router.get('/', function(req, res) {
        context = {}
        res.render("Transactions", context)
    })

    return router;
}();