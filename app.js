/*
Group 65: app.js
Created: 3/10/
*/
const express = require('express');

const mysql = require('./dbcon.js');
const bodyParser = require('body-parser');
const PORT = 8181;
const app = express();

app.set('port', PORT);
app.set('mysql', mysql);

const handlebars = require('express-handlebars').create( { defaultLayout:'main', } );
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded( { extended : true } ));

app.use('/static', express.static('public'));
app.use('/', express.static('public'));

app.use('/Customers', require('./routes/Customers.js'));
app.use('/Addresses', require('./routes/Addresses.js'));
app.use('/PayMethods', require('./routes/PayMethods.js'));
app.use('/Products', require('./routes/Products.js'));
app.use('/Orders', require('./routes/Orders.js'));
app.use('/CellNumbers', require('./routes/CellNumbers.js'));

app.use('/ProductPrices', require('./routes/ProductPrices.js'));
app.use('/Transactions', require('./routes/Transactions.js'));

app.use('/CustomerAddresses', require('./routes/CustomerAddresses.js'));
app.use('/CustomerPayMethods', require('./routes/CustomerPayMethods.js'));
app.use('/OrderItems', require('./routes/OrderItems.js'));

app.listen(app.get('port'), function()
{
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
