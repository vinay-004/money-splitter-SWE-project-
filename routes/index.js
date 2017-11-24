var express = require('express');
var router = express.Router();
var Group = require('../models/group');

// Get Homepage
router.get('/',ensureAuthenticated, function(req, res){
	var GroupQuery = {_id:{$in :req.user.groups}};

	Group.find(GroupQuery,function(err,group){
        var temp =0;
        var frnd = new Array();
        for(var l =0 ;l <req.user.friend.length;l++){
            frnd.push(req.user.friend[l]);
            temp  = parseInt(req.user.friend[l].amount);
            if(temp > 0) {

                frnd[l].button = true;

            }else {
                frnd[l].amount = -temp;
                frnd[l].button = false;
            }
        }
		res.render('index',{
			group : group,
            friend: frnd,
			css: ['dashboard.css', 'bootstrap.css','dashboardimage.css']
		});
	});
	
});




function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;