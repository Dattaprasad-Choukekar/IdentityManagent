var express = require('express');
var mongodb = require('mongodb');
var router = express.Router();

router.get('/login', function(req, res) {
	 res.render('login', {'message' : req.flash('error')});
});


router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

router.get('/', function(req, res) {
	 res.render('index', {});
});

router.get('/list_identities', function(req, res) {
    var db = req.db;
    var collection = db.get('identity_collection');
    collection.find({},{},function(e,docs){
        res.render('list_identities', {
            "identities" : docs
        });
    });
});

router.get('/create_identity', function(req, res) {
	res.render('create_identity', {});
});

router.post('/create_identity', function(req, res) {
    var db = req.db;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
	var email = req.body.email;
	var birthDate = req.body.birthDate;

    var collection = db.get('identity_collection');

    collection.insert({
        "firstName" : firstName,
        "lastName" : lastName,
		"email" : email,
		"birthDate" : birthDate,
		
    }, function (err, doc) {
        if (err) {
           res.render('error', { error: err });
        }
        else {
            // And forward to success page
            res.redirect("list_identities");
        }
    });
});

router.get('/update_identity', function(req, res) {
	var db = req.db;
	var identityId = req.query.id;
	var identities = db.get('identity_collection');
	identities.findById(identityId, function(err, doc){
		 if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
		res.render('update_identity', {'identity': doc});
	});	
});

router.post('/update_identity', function(req, res) {
	    // Set our internal DB variable
    	console.log(req.query.id);
	  var firstName = req.body.firstName;
    var lastName = req.body.lastName;
	var email = req.body.email;
	var birthDate = req.body.birthDate;
		
	var db = req.db;
	var identityId = req.query.id;
	var identities = db.get('identity_collection');
	identities.findById(identityId, function(err, doc){
		 if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
		identities.updateById(identityId, { $set: { 'firstName' : firstName, 'lastName' : lastName
		, 'email' : email, 'birthDate' : birthDate


		}}, function(err){
					 if (err) {
						 console.log(err);
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }			
		});
		 res.redirect("list_identities");
	});
});

router.get('/delete_identity', function(req, res) {	
	var identityId = req.query.id;
	var db = req.db;
    // Set our collection
    var collection = db.get('identity_collection');

    // Submit to the DB
    collection.remove({
        "_id" : new mongodb.ObjectID(identityId)
		
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("list_identities");
        }
    });
});

module.exports = router;
