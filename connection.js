const mongoose = require('mongoose');
const { config } = require('./config');

class DB {
    static async connect() {
       try{
        // console.log(config.env.database.uri);
        await mongoose.connect(config.env.database.uri);
           console.log('Connected to ' + config.env.database.name);
       }catch(err){
              console.log('Error connecting to database: ' + err);
              process.exit(1);
       }
    }
}

module.exports = DB;