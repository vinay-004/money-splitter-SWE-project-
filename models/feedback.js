var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


// User Schema
var FeedbackSchema = mongoose.Schema({
    name : {
        type :String
    },
    message :{
        type: String
    }
});

var Feedback = module.exports = mongoose.model('Feedback', FeedbackSchema);

