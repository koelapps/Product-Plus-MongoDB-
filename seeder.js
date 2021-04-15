const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config({path:'./config/config.env'});

const Auth = require('./models/Auth');


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });
  
//const auths = JSON.parse(
   // fs.readFileSync(`${__dirname}/_data/auths.json`,'utf-8'));

const importData = async () => {

}


 const deleteData = async () => {
        try {
            await Auth.deleteMany();
    
            console.log('Data Destroyed...'.red.inverse);
            process.exit();
        } catch (err) {
            console.error(err);
        }
    };

if(process.argv[2] === '-i'){
    importData();
} else if(process.argv[2] === '-d'){
    deleteData();
};