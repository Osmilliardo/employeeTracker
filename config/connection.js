const mysql = require('mysql2')
// const Sequelize = require('sequelize');
require('dotenv').config();

const connection = mysql.createConnection(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host:'locahost',
        dialect:'mysql',
        port: 3306,
    }
);

connection.connect(function (err) {
    if (err) throw err;
});

module.exports = sequelize;