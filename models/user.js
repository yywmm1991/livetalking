var mongodb = require('./db');

function User(user){
	this.name = user.name;
	this.password = user.password;
}

module.exports = User;

//save the info of the user
User.prototype.save = function save(callback){
	var user = {
		name: this.name,
		password: this.password
	};
	mongodb.open(function(err, db){
		if(err){
			console.log("user.js mongodb.open error!");
			return callback(err);
		}
		//read users sets
		db.collection('users',function(err, collection){
			if(err){
				mongodb.close();
				console.log("puser.js db.collection error!");
				return callback(err);
			}
			//add user data into db
			collection.insert(
				user, 
				{safe:true}, 
				function(err, user){
					mongodb.close();
					if(err){
						console.log("user.js collection.insert error!");
						return callback(err);
					}
					callback(null,user[0]);
				}
			);
		});
	});
};

//read the info of the user
User.get = function(name, callback){
	//open the database
	mongodb.open(function(err, db){
		if(err){
			console.log("user.get mongodb.open error!");
			return callback(err);
		}
		//read the user set
		db.collection("users", function(err, collection){
			if(err){
				mongodb.close();
				console.log("user.get db.collection error!");
				return callback(err);
			}
			//search for name
			collection.findOne(
				{name:name},
				function(err, user){
					mongodb.close();
					if(err){
						console.log("user.get collection findone error");
						return callback(err);
					}
					callback(null, user);
				}
			);
		});
	});
};