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
function spotifyThisSong() {
    var spotify = new Spotify(keys.spotify);
    
    //Set default song and/or enter user input into variable
    if (process.argv[2] === undefined) {
        useDefaultSong();
    }
    else {
        spotifySearch(process.argv[3]);
    }
    
    //search: function({ type: 'artist OR album OR track', query: 'My search query', limit: 20 }, callback);
    function spotifySearch(track) {
        spotify.search({ type: `track`, query: track }, function(err, data) {
            if (err) {
                    return console.log('Error occurred: ' + err);
            }
            var spotifyResponse = JSON.stringify(data, null, 2);
            spotifyResponse = JSON.parse(spotifyResponse);
            spotifyResponse = spotifyResponse.tracks.items;
    
            var songArtist = spotifyResponse[0].artists[0].name;
            var songName = spotifyResponse[0].name;
            var songLink = spotifyResponse[0].preview_url;
            var songAlbum = spotifyResponse[0].album.name;
    
            displaySpotifyInfo(songArtist, songName, songLink, songAlbum);
        });
    }
            
    function useDefaultSong() {
        var defaultSong;
        fs.readFile(`random.txt`, `utf8`, function(error, data) {
            defaultSong = data.split(`"`)[1];
            spotifySearch(defaultSong);
        });
    }
    function displaySpotifyInfo(artist, track, link, album) {
        console.log(`${artist}`);
        console.log(`${album}`);
        console.log(`${track}`);
        console.log(`${link}`);
    }
}
//-------------------------------------------------------------------------------//

//movie-this---------------node liri.js movie-this '<movie name here>'-----------//
//-------------------------------------------------------------------------------//

//do-what-it-says----------node liri.js do-what-it-says--------------------------//
//-------------------------------------------------------------------------------//