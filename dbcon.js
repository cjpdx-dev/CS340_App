const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_jacobsc2',
  password        : '8173',
  database        : 'cs340_jacobsc2'
});
module.exports.pool = pool;
