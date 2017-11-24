var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var User = require('../models/user');
//var uniqueValidator = require('mongoose-unique-validator');
var partnership = mongoose.Schema({

});
var Bill = mongoose.Schema();
// Group Schema
var GroupSchema = mongoose.Schema({
        name:{
            type: String,
           // unique: true
        },
        description :{
            type: String
        },
        owner :{
            type: mongoose.Schema.Types.ObjectId , ref : 'User'
        },
        members :[mongoose.Schema.Types.ObjectId],
        bills:[{
            name : {
                type : String
            },
            paid_By:{
                type:mongoose.Schema.Types.ObjectId, ref :'User'
            },
            amount :{
                type : Number,
                integer :true
            },
            note :{
                type: String
            },
            partners: [{
                id: {
                    type : String
                },
                amount: {
                    type: Number,
                    integer : true
                },
                status: {
                    type: String
                }
            }]
        }]

});
var Group = module.exports = mongoose.model('Group', GroupSchema);

module.exports.createGroup = function(newGroup, callback){
    newGroup.save(callback);
}

module.exports.getGroupById = function(id, callback){
    Group.findById(id, callback);
}

module.exports.getGroupbyname = function(groupName,ownerid , callback){
   Group.findOne({name : groupName, owner: ownerid},callback);
}

module.exports.settlePartnership = function (req,PaidBy ,partnership,callback){

    User.getUserById(PaidBy, function (err,user) {
                if(err){
                    console.log(err);
                    req.flash('error_msg', 'Something went wrong.Try again.');
                    res.redirect('/');
                }
                else if(user===null){
                    console.log('ERROR user not found');
                }
                else if(!(user.email===partnership.id)) {
                    for (var n = 0; n < user.friend.length; n++) {
                        console.log("number of friends " + user.friend.length);
                        if (user.friend[n].email===partnership.id) {
                            var amt = parseInt(user.friend[n].amount - partnership.amount);
                            console.log("amount  :: " + amt);
                            console.log(user.friend[n].email);
                            if (amt > 0) {
                                console.log("amout > 0");
                                User.update(
                                    {$and: [{"friend.email": user.friend[n].email}, {"email": user.email}]},
                                    {
                                        "$set": {"friend.$.action": "You owe you friend"},
                                        "$set": {"friend.$.amount": amt}
                                    },null);
                                User.update(
                                    {$and: [{"friend.email": user.email}, {"email": user.friend[n].email}]},
                                    {
                                        "$set": {"friend.$.action": "Your friend owe you"},
                                        "$set": {"friend.$.amount": -amt}
                                    },callback);

                            } else if (amt < 0) {
                                console.log("amt <0 ");
                                User.update(
                                    {$and: [{"friend.email": user.friend[n].email}, {"email": user.email}]},
                                    {
                                        "$set": {"friend.$.action": "Your friend owe you"},
                                        "$set": {"friend.$.amount": amt}
                                    },null);
                                    User.update(
                                        {$and: [{"friend.email": user.email}, {"email": user.friend[n].email}]},
                                        {
                                            "$set": {"friend.$.action": "You owe you friend"},
                                            "$set": {"friend.$.amount": -amt}
                                        },callback);
                            } else {
                                console.log("amt =0");
                                User.update(
                                    {$and: [{"friend.email": user.friend[n].email}, {"email": user.email}]},
                                    {
                                        "$set": {"friend.$.action": "life is good"},
                                        "$set": {"friend.$.amount": amt}
                                    },null);
                                    User.update(
                                        {$and: [{"friend.email": user.email}, {"email": user.friend[n].email}]},
                                        {
                                            "$set": {"friend.$.action": "life is good"},
                                            "$set": {"friend.$.amount": -amt}
                                        },callback);
                            }

                        }

                    }
                }
            });
}



