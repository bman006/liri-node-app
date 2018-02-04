require("dotenv").config();
var keys = require(`./keys.js`);
var Twitter = require('twitter');

//var spotify = new Spotify(keys.spotify);


//my-tweets----------------node liri.js my-tweets--------------------------------
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
//spotify-this-song--------node liri.js spotify-this-song '<song name here>'-----

//movie-this---------------node liri.js movie-this '<movie name here>'-----------
//do-what-it-says----------node liri.js do-what-it-says--------------------------
