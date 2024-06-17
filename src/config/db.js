require('dotenv').config();
const mongoose =require('mongoose');

const DB_CONN_STRING=process.env.DB_CONN_STRING;
if(!DB_CONN_STRING){
    console.error('Error:Missing DB_CONN_STRING Iin environment variables');
    process.exit(1);
}

mongoose.connect(DB_CONN_STRING,
    {
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const DB=mongoose.connection;

DB.on('error',(error)=>{
    console.error('Error connection to the database:',error);
});

DB.once('open',()=>{
    console.log('Connected to the database succesfully');
});

module.exports=DB;