require('dotenv').config();
module.exports={
    DB_CONN_STRING:process.env.DB_CONN_STRING,
    JWT_KEY:process.env.JWT_KEY
};