const mysql = require("mysql");
const express = require('express');
const bodyparser = require('body-parser');
const config = require("./config.js");

// MongoDB for playlist and follow list
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:DropGuys32@cluster0.rxa59.gcp.mongodb.net/GrooveMap?retryWrites=true&w=majority";
var db;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// connection pool (?)
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, database) {
	if(err) throw err;
	db = database.db("GrooveMap");
}); 

var app = express();
app.use(bodyparser.json());

var pool = mysql.createPool(config);

// MySQL Authentication function
function Authenticate(username, password, fn) {
	pool.getConnection((err, connection)=> {
		var user;
		connection.query('SELECT * from Users where username = ' +
		connection.escape(username) + ' and password =' + connection.escape(password),
		function(err, rows) {
			user = rows[0].username;
		});
		if (!user) {
			return fn(new Error('cannot find user'));
		} else {
			return fn(null, user);
		}
		connection.release();
	})
}
/*
    if(!err)
	console.log('Connection established successfully');
    else
	console.log('Connection failed' + JSON.stringify(err, undefined, 2));
*/

/////////////////////
/* MongoDB test    */
/////////////////////
/*
app.get('/mongo_test', async function(req, res){
	try {
		const connect = await client.connect();
		const collection = client.db("GrooveMap").collection("test");
		// perform actions on the collection object
		const testFind = await collection.find().toArray().then(results =>{
			res.send(results)
		});
	}
	catch(err) {
		console.log(err);
	}
});
*/

/////////////////////
/* MySQL test      */
/////////////////////
app.get('/', function(req, res){
    pool.getConnection((err, connection)=> {
		connection.release();
    	if(!err)
            res.send('Hello there.');
    })
});


//**************** ALBUMS ****************//
// Get all albums
app.get('/albums', (req, res) =>{
    pool.getConnection((err, connection)=> {
        connection.query('SELECT albumName FROM Music.Albums', (qerr, rows, fields) =>{
	    if(!qerr)
	        res.send(rows);
	    else
	        console.log(qerr);
		})
		connection.release();
    })
});

//**************** TRACKS ****************//
// Get all tracks
app.get('/tracks', (req, res) =>{
    pool.getConnection((err, connection)=> {
        connection.query('SELECT trackName, trackNumber, trackID, trackUri, albumID FROM Tracks', (qerr, rows, fields) =>{
	    if(!qerr)
	        res.send(rows);
	    else
	        console.log(qerr);
		})
		connection.release();
    })
});

// Get all tracks of one artist
app.get('/getTracksByArtist/:id', (req, res) =>{
	pool.getConnection((err, connection)=> {
		let currArtist = req.params.id;
		var sql = "CALL getTrackCountByArtist(?);";
		connection.query(sql, [currArtist], (qerr, rows, fields) =>{
			if(!qerr)
				res.send(rows);
			else
				console.log(qerr);
		})
		connection.release();
    })
});

// Get track name of a track
app.get('/getTrackName/:id', (req, res) =>{
	pool.getConnection((err, connection)=> {
		let trackID = req.params.id;
		var sql = "SELECT trackName FROM Tracks WHERE trackID = ?;";
		connection.query(sql, [trackID], (qerr, rows, fields) =>{
			if(!qerr)
				res.send(rows);
			else
				console.log(qerr);
		})
		connection.release();
    })
});

// Get album image of a track
app.get('/getTrackImage/:id', (req, res) =>{
	pool.getConnection((err, connection)=> {
		let trackID = req.params.id;
		var sql = "SELECT AL.albumImage FROM Tracks T NATURAL JOIN Albums AL WHERE T.trackID = ?;";
		connection.query(sql, [trackID], (qerr, rows, fields) =>{
			if(!qerr)
				res.send(rows);
			else
				console.log(qerr);
		})
		connection.release();
    })
});

//**************** PLAYLIST ****************//
// Get playlist by userID
app.get('/playlist/:id', async function(req, res){
	try {
		//const connect = await client.connect();
		//const collection = client.db("GrooveMap").collection("userPlaylist");
		// perform actions on the collection object
		let currUser = req.params.id;
		currUser = parseInt(currUser, 10);
		var pipeline = [
			{ $match: {
				"userID": currUser
			}}
		];
		const Find = await db.collection("userPlaylist").aggregate(pipeline).toArray().then(results =>{
			res.status(200),
			res.send(results)
		});
	}
	catch(err) {
		console.log(err);
	}
});

// create new empty playlist
app.post('/addPlaylist', (req, res)=>{
	var ID;
	let Name = req.body.playlistName;
	let currUser = req.body.userID;
	pool.getConnection((err, connection)=> {
		var sql = "INSERT IGNORE INTO Playlist (playlistName, userID) VALUES (?, ?);";
		connection.query(sql, [Name, currUser], (qerr, rows, fields) =>{
			if(qerr)
				console.log(qerr);
		})
		var getID = "SELECT playlistID FROM Playlist WHERE playlistName = ? AND userID = ?;";
		connection.query(getID, [Name, currUser], async function(qerr, rows, fields){
			if(qerr)
				console.log(qerr);
			else if(rows[0]){
				ID = rows[0].playlistID;
				// add entry in mongodb
				try {
					if(ID != null){
						currUser = parseInt(currUser, 10);
						var query = {
							userID: currUser,
							name: Name,
							playlistID: ID
						};
						var pipeline = {$set:{
							userID: currUser,
							playlistID: ID,
							name: Name,
							trackID: []
						}};
						const Find = await db.collection("userPlaylist").updateOne(query, pipeline, {upsert: true});
						res.json({ "playlistID": ID});
					}
				}
				catch(merr) {
					console.log(merr);
				}
			}
		})
		connection.release();
    });
});

// delete a playlist by playlistID
app.post('/delPlaylist', async function(req, res){
	let ID = req.body.playlistID;
	pool.getConnection((err, connection)=> {
		var sql = "DELETE FROM Playlist WHERE playlistID = ?;";
		connection.query(sql, [ID], (qerr, rows, fields) =>{
			if(qerr)
				console.log(qerr);
		})
		connection.release();
    });
	// delete entry in mongodb
	try {
		var pipeline = {
			playlistID: ID
		};
		const Find = await db.collection("userPlaylist").remove(pipeline);
		res.status(200);
	}
	catch(err) {
		console.log(err);
	}
});

// add tracks to a playlist
app.post('/addToPlaylist', async function(req, res){
	try {
		//const connect = await client.connect();
		//const collection = client.db("GrooveMap").collection("userPlaylist");
		// perform actions on the collection object
		let currUser = req.body.userID;
		let playlistID = req.body.playlistID;
		let tracks = req.body.trackID
		currUser = parseInt(currUser, 10);
		playlistID = parseInt(playlistID, 10);
		var query = {"userID": currUser, "playlistID": playlistID};
		var update = {
      		$push: { "trackID": {$each: tracks} }
		};
			
		const Find = await db.collection("userPlaylist").updateOne(query, update, {$setOnInsert: {"$trackID":tracks}}, {upsert:true});			res.status(200),
		res.status(200).end();
	}
	catch(err) {
		console.log(err);
	}
});

// delete tracks from a playlist
app.post('/delFromPlaylist', async function(req, res){
	try {
		//const connect = await client.connect();
		//const collection = client.db("GrooveMap").collection("userPlaylist");
		// perform actions on the collection object
		let currUser = req.body.userID;
		let playlistID = req.body.playlistID;
		let tracks = req.body.trackID
		currUser = parseInt(currUser, 10);
		playlistID = parseInt(playlistID, 10);
		var query = {"userID": currUser, "playlistID": playlistID};
		var del = {
      		$pull: { trackID: {$in: tracks} }
		};
			
		const Find = await db.collection("userPlaylist").updateOne(query, del, {upsert:true});
		res.status(200).end();
	}
	catch(err) {
		console.log(err);
	}
});

//**************** LOCATION ****************//
// Get location by userID
app.get('/locations/:id', (req, res) =>{
	pool.getConnection((err, connection)=> {
		let currUser = req.params.id;
		var sql = "CALL getLocationByUser(?);";
		connection.query(sql, [currUser], (qerr, rows, fields) =>{
			if(!qerr)
				res.send(rows);
			else
				console.log(err);
		})
		connection.release();
    })
});

// Insert new location given userID and trackID
app.post('/addlocation', (req, res) =>{
	pool.getConnection((err, connection)=>{
		let currUser = req.body.userID;
		let currTrack = req.body.trackID;
		let lat = req.body.latitude;
		let long = req.body.longitude;
		var sql = `SET @trackID = ?; SET @userID = ?; SET @latitude = ?; SET @longitude = ?;
			CALL addLocation(@userID, @trackID, @latitude, @longitude);`;
		connection.query(sql, [currTrack, currUser, lat, long], (qerr, rows, fields) =>{
			if(!qerr)
				res.json({ query: "Success"});
			else{
				console.log(qerr);
				res.json({ query: "Failed"});
			}
		})
		connection.release();
	})
});

// Update location given all attributes of a location entry.
app.post('/updatelocation', (req, res) =>{
	pool.getConnection((err, connection)=>{
		let locationID = req.body.locationID;
		let currUser = req.body.userID;
		let currTrack = req.body.trackID;
		let lat = req.body.latitude;
		let long = req.body.longitude;
		var sql = `UPDATE Location 
			SET trackID = ?, userID = ?, latitude = ?, longitude = ?
			WHERE locationID = ?;`;
		connection.query(sql, [currTrack, currUser, lat, long, locationID], (qerr, rows, fields) =>{
			if(!qerr)
				res.json({ query: "Success"});
			else{
				console.log(qerr);
				res.json({ query: "Failed"});
			}
		})
		connection.release();
	})
});

// Delete location given a locationID
app.post('/deletelocation', (req, res) =>{
	pool.getConnection((err, connection)=>{
		let locationID = req.body.locationID;
		var sql = `DELETE FROM Location WHERE locationID = ?;`;
		connection.query(sql, [locationID], (qerr, rows, fields) =>{
			if(!qerr)
				res.json({ query: "Success"});
			else{
				console.log(qerr);
				res.json({ query: "Failed"});
			}
		})
		connection.release();
	})
});

//**************** USERS ****************//
// Get user table (username and password)
app.get('/userTable', (req, res) =>{
	pool.getConnection((err, connection)=> {
		var sql = `SELECT U.* FROM Users U;`;
		connection.query(sql, (qerr, rows, fields) =>{
			if(!qerr)
				res.send(rows);
			else
				console.log(err);
		})
		connection.release();
    })
});

// Sign-up a new user
app.post('/signup', (req, res) =>{
	pool.getConnection((err, connection)=> {
		let username = req.body.userName;
		let password = req.body.userPassword;
		let display = req.body.displayName;
		let image = req.body.userImage;
		var sql = `INSERT INTO Users (displayName, userName, userPassword, userImage) VALUES (?,?,?,?);`;
		connection.query(sql, [display, username, password, image], (qerr, rows, fields) =>{
			if(!qerr)
				res.send(rows);
			else{
				console.log(qerr);
			}
		})
		connection.release();
    })
});

// Get ranking of tagged artists grouped by users
app.get('/userArtistRank', (req, res) =>{
	pool.getConnection((err, connection)=> {
		var sql = `SELECT U.userID, U.displayName, count(L.trackID)
			FROM Location L NATURAL JOIN Users U
			GROUP BY U.userID;`;
		connection.query(sql, (qerr, rows, fields) =>{
			if(!qerr)
				res.send(rows);
			else
				console.log(err);
		})
		connection.release();
    })
});


//**************** FOLLOWERS ****************//
// Get a user's followers
app.get('/getFollowers/:id', (req, res) =>{
	pool.getConnection((err, connection)=> {
		var currUser = req.params.id;
		var sql = `SELECT followerID
			FROM follow
			WHERE followedID = ?;`;
		connection.query(sql, [currUser], (qerr, rows, fields) =>{
			if(!qerr)
				res.send(rows);
			else
				console.log(err);
		})
		connection.release();
    })
});

// Get a user's following list
app.get('/getFollowing/:id', (req, res) =>{
	pool.getConnection((err, connection)=> {
		var currUser = req.params.id;
		var sql = `SELECT followedID
			FROM follow
			WHERE followerID = ?;`;
		connection.query(sql, [currUser], (qerr, rows, fields) =>{
			if(!qerr)
				res.send(rows);
			else
				console.log(err);
		})
		connection.release();
    })
});

// Add a follower of a user.
app.post('/addFollowing', (req, res) =>{
	pool.getConnection((err, connection)=> {
		var currUser = req.body.followerID;
		var followed = req.body.followedID;
		var sql = `INSERT IGNORE INTO follow VALUES (?, ?);`;
		connection.query(sql, [currUser, followed], (qerr, rows, fields) =>{
			if(!qerr)
				res.send(rows);
			else
				console.log(err);
		})
		connection.release();
    })
});

// Delete a follower of a user.
app.post('/unFollow', (req, res) =>{
	pool.getConnection((err, connection)=> {
		var currUser = req.body.followerID;
		var followed = req.body.followedID;
		var sql = `DELETE FROM follow WHERE followedID = ? AND followerID = ?;`;
		connection.query(sql, [followed, currUser], (qerr, rows, fields) =>{
			if(!qerr)
				res.send(rows);
			else
				console.log(err);
		})
		connection.release();
    })
});


//**************** SEARCH ****************//
app.post('/search', (req, res) =>{
	pool.getConnection((err, connection)=> {
		var keyword = req.body.keyword;
		var sql = `SET @keyword = ?;
			SELECT T.*, AL.albumImage
			FROM Tracks T NATURAL JOIN Albums AL NATURAL JOIN Artists AR
			WHERE T.trackName LIKE CONCAT('%', @keyword, '%') 
				OR AL.albumName LIKE CONCAT('%', @keyword, '%')
				OR AR.artistName LIKE CONCAT('%', @keyword, '%');`;
		connection.query(sql, [keyword], (qerr, rows, fields) =>{
			if(!qerr)
				res.send(rows);
			else
				console.log(err);
		})
		connection.release();
    })
});


const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
