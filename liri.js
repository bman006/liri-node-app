require("dotenv").config();
var keys = require(`./keys.js`);
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require(`fs`);




//my-tweets----------------node liri.js my-tweets--------------------------------//
function myTweets() {
    var client = new Twitter(keys.twitter);
    client.get('statuses/user_timeline', {q: 'node.js', count: 20}, function(error, tweets, response) {
        
        //Store JSON and convert to array
        var tweetResponse = JSON.stringify(tweets);
        tweetResponse = JSON.parse(tweetResponse);
        
        for (var i = 0; i < tweetResponse.length; i++) {
            //Get time of tweet
            var time = tweetResponse[i].created_at;
            //Get tweet text
            var text = tweetResponse[i].text;
            console.log(`${time} / ${text}`);
        }
    });
}
//-------------------------------------------------------------------------------//

//spotify-this-song--------node liri.js spotify-this-song '<song name here>'-----//
var spotify = new Spotify(keys.spotify);

//Set default song and/or enter user input into variable
var songToSearch = ``;
if (process.argv[3] === undefined) {
    fs.readFile("random.txt", "utf8", function(error, data) {
        songToSearch = data.split(`"`)[1];
    });
}
else {
    songToSearch = process.argv[3];
}

//search: function({ type: 'artist OR album OR track', query: 'My search query', limit: 20 }, callback);
spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
   
  console.log(data); 
  });
















//movie-this---------------node liri.js movie-this '<movie name here>'-----------
//do-what-it-says----------node liri.js do-what-it-says--------------------------
