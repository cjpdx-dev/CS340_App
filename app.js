
const express = require('express');
const mysql = require('./dbcon.js');
const bodyParser = require('body-parser');

const PORT = 8181;
const app = express();

app.set('port', PORT);
app.set('mysql', mysql);

const handlebars = require('express-handlebars').create(
{
    defaultLayout:'main',
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded( { extended : true } ));
app.use('/static', express.static('public'));
app.use('/Customers', require('./Customers.js'));
app.use('/', express.static('public'));

app.listen(app.get('port'), function()
{
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});







