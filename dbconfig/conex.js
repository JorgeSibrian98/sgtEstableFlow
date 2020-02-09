const Sequelize = require('sequelize');
require('dotenv').config()
//Azure DB connection Generic
/*module.exports =  new Sequelize('sigestran', 'user','pssword', {
  host: 'sigestran.database.windows.net',
  dialect: 'mssql',
  dialectOptions: {
    options: {
        encrypt: true,
    }
},

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});*/

//Local db connection
const dbConex = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mssql',
});
module.exports = dbConex;