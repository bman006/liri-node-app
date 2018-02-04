require("dotenv").config();
var fs = require(`fs`);
var keys = require(`./keys.js`);
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');

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
var movieToSearch = process.argv[2];
var requestURLOMDB = `http://www.omdbapi.com/?apikey=${keys.OMDB.key}&t=${movieToSearch}`
request(requestURLOMDB, function (error, response, body) {
    if (response.statusCode != 200) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    }
    else {
        //Parse response
        var movieResponse = JSON.parse(body);
        //Get all wanted values from JSON response
        var title = movieResponse.Title;
        var year = movieResponse.Year;
        for (var i = 0; i < movieResponse.Ratings.length; i++) {
            var thisOne = movieResponse.Ratings[i];
            if (thisOne.Source === `Internet Movie Database`) {
                var ratingIMDB = thisOne.Value;
            }
            else if (thisOne.Source === `Rotten Tomatoes`) {
                var ratingRT = thisOne.Value;
            }
        }
        var country = movieResponse.Country;
        var language = movieResponse.Language;
        var plot = movieResponse.Plot;
        var actors = movieResponse.Actors;
        displayOMDBInfo(title, year, ratingIMDB, ratingRT, country, language, plot, actors);
    }
});
function displayOMDBInfo(title, year, ratingIMDB, ratingRT, country, language, plot, actors) {
    console.log(`Title:                     ${title}`);
    console.log(`Year:                      ${year}`);
    console.log(`IMDB Rating:               ${ratingIMDB}`);
    console.log(`Rotten Tomatoes Rating:    ${ratingRT}`);
    console.log(`Country:                   ${country}`);
    console.log(`Language:                  ${language}`);
    console.log(`Plot:                      ${plot}`);
    console.log(`Actors:                    ${actors}`);
}
//-------------------------------------------------------------------------------//

//do-what-it-says----------node liri.js do-what-it-says--------------------------//
//-------------------------------------------------------------------------------//