var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');
var Topic = require('../models/topic.js');
var flag = 0;

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index.ejs', {
		title: 'Homepage', 
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});

router.get('/reg', checkNotLogin);
router.get('/reg', function(req, res){console.log(req);
	res.render('reg.ejs', {
		title: "Register",
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});

router.post('/reg', checkNotLogin);
router.post('/reg', function(req, res){
	var name = req.body.name;
	var password = req.body.password;
	var confirm = req.body.confirm;
	//check the passwords
	if(password != confirm){
		req.flash('error', 'the password does not consist');
		console.log("password conflict!");
		return res.redirect('/reg');
	}
	//produce md5
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('hex');
	var newUser = new User({
		name: name,
		password: password,
	});
	//check the user whether exist
	User.get(newUser.name, function(err, user){
		if(err){
			req.flash("error", err);
			console.log("get error!");
			return res.redirect("/");
		}
		if(user){
			req.flash('error', 'the user name conflict');
			console.log("user exist!");
			return res.redirect('/reg');
		}
		//if does not exist, than creat a new user
		newUser.save(function(err, user){
			if(err){
				req.flash('error', err);
				console.log("save error!");
				return res.redirect('/reg');
			}
			req.session.user = user;
			req.flash('success', user+" register success");
			res.redirect('/login');
		});
	});
});

//router.get('/login', checkLogin);
router.get('/login', function(req, res){
	res.render('login.ejs', {
		title: "Login",
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});

router.post('/login', checkNotLogin);
router.post('/login', function(req, res){
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest("hex");

	User.get(req.body.name, function(err, user){
		if(!user){
			req.flash('error', 'user does not exist');
			return res.redirect('/login');
		}
		if(user.password != password){
			req.flash('error', 'user name or password does not consist');
			return res.redirect('/login');
		}
		req.session.user = user;
		req.flash('success', 'login success!');
		res.redirect('/');
	});
});

//router.get('/post', checkLogin);
router.get('/post', function(req, res){
	Post.get(null, function(err, posts){
		if(err){
			posts = [];
		}
		res.render('post', {
			title: 'home',
			user: req.session.user,
			posts: posts,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
});

router.get('/post/get', function(req, res){
	Post.get(null, function(err, posts){
		if(err){
			posts = [];
		}
		// while(posts[0].time.iden === flag){
		// 	setTimeout(function(){},1000);
		// }
		// flag = posts[0].time.iden;
		res.send(posts);
	});
});

//router.post('/post', checkNotLogin);
router.post('/post', function(req, res){
	var currentUser = req.session.user;
	var post = new Post(currentUser.name, req.body.title, req.body.post);
	// flag = post.time.iden;
	post.save(function(err){
		if(err){
			req.flash('error', err);
			return res.redirect('/');
		}
		req.flash('success', "success in publish");
		res.redirect('/post');
	});
});

router.get('/topics', function(req, res){
	Topic.get( function(err, topics){
		// while(posts[0].time.iden === flag){
		// 	setTimeout(function(){},1000);
		// }
		// flag = posts[0].time.iden;
		//res.send(topics);
		res.render('topics.ejs', {
		title: 'Topics', 
		user: req.session.user,
		topics: topics,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
	});
});

router.get('/topic', function(req, res, next) {
	res.render('topic.ejs', {
		title: 'TopicCreate', 
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});

router.post('/topic', function(req, res){
	var currentUser = req.session.user;
	var topic = new Topic(req.body.topic, currentUser.name, req.body.category);
	// flag = post.time.iden;
	topic.save(function(err){
		if(err){
			req.flash('error', err);
			return res.redirect('/');
		}
		req.flash('success', "success in publish");
		res.redirect('/');
	});
});

//router.get('/logout', checkLogin);
router.get('/logout', function(req, res){
	req.session.user = null;
	req.flash('success', 'logout successfully');
	res.redirect('/');
});

router.get('/home', function(req, res){
	Post.get(null, function(err, posts){
		if(err){
			posts = [];
		}
		res.render('home', {
			title: 'home',
			user: req.session.user,
			posts: posts,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
});

function checkNotLogin(req,res,next){
	if(req.session.user){
		req.flash("error", "already login");
		console.log("already login!");
		return res.redirect('/');
	}
	next();
}

function checkLogin(req,res,next){
	if(!req.session.user){
		req.flash('error', "please login");
		console.log("please login!");
		return res.redirect('/login');
	}
	next();
}

module.exports = router;
