const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yik4rws.mongodb.net/MaterialSharing?retryWrites=true&w=majority`, (err) =>{
    if(err)
        console.log(err);
    else
        console.log('Connected to DB :)');
});