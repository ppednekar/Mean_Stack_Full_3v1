const moongoose = require('mongoose');
var Schema = moongoose.Schema;


var CustomerSchema = new Schema({
    name :{
        type : String,
        required : true
    },
    gender :{
        type : String,
        required : true
    },

    address :{
        type : String,
        required : true
    },

    city :{
        type : String,
        required : true
    },

    state :{
        type : String,
        required : true
    },

    country :{
        type : String,
        required : true
    },
    photo :{
        type : String,
        required : true
    },

    hobbies :{
        type : String,
        required : true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// 1st param - name <String> model name
// 2nd param - [schema] <Schema> schema name
// 3rd param - [collection] <String> collection name (optional, induced from model name)
module.exports = moongoose.model('Customer', CustomerSchema, 'customers');

