var mongodb = require('./db');

function Topic(topic, name, category){
	this.topic = topic;
	this.name = name;
	this.category = category;
}

module.exports = Topic;

Topic.prototype.save = function(callback){
	var topic = {
		name: this.name,
		topic: this.topic,
		category : this.category,
	};

	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('topics', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.insert(
				topic,
				{safe:true},
				function(err){
					mongodb.close();
					if(err){
						return callback(err);
					}
					callback(null);
				}
			);
		});
	});
};

Topic.get = function( callback){
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('topics', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			collection.find()
			.toArray(function(err, docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null, docs);
			});
		});
	});
};