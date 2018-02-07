require("dotenv").config();
var fs = require(`fs`);
var keys = require(`./keys.js`);
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');

var argumentArray = process.argv;
var userRequest = argumentArray[2];
var searchItem;
//If there are multiple words to the search input, merge them into a single string
if (argumentArray[3] != undefined) {
    searchItem = argumentArray;
    searchItem = searchItem.slice(3);
    searchItem = searchItem.join(` `);
}

function checkWhichOneToRun(userRequest, searchItem) {
    if (userRequest === `my-tweets`) {
        myTweets();
    }
    else if (userRequest === `spotify-this-song`) {
        spotifyThisSong(searchItem);
    }
    else if (userRequest === `movie-this`) {
        movieThis(searchItem);
    }
    else if (userRequest === `do-what-it-says`) {
        fs.readFile(`random.txt`, `utf8`, function(error, data) {
            userRequest = data.split(`,`)[0];
            searchItem = data.split(`,`)[1];
            userRequest = userRequest.trim();
            checkWhichOneToRun(userRequest, searchItem);
        });
    }
    else {
        console.log(`That was not a valid request`);
    }
}

//my tweets----------------node liri.js my-tweets--------------------------------//
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
//------------------------------------------------------------------------------//

//spotify this song--------node liri.js spotify-this-song '<song name here>'-----//
function spotifyThisSong(track) {
    //Set default song and/or enter user input into variable
    if (track === undefined) {
        useDefaultSong();
    }
    else {
        spotifySearch(track);
    }
}
//Fetch a default song stored in a .txt file
function useDefaultSong() {
    var defaultSong;
    fs.readFile(`defaultSpotifySong.txt`, `utf8`, function(error, data) {
        spotifySearch(data);
    });
}
//search: function({ type: 'artist OR album OR track', query: 'My search query', limit: 20 }, callback);
function spotifySearch(track) {
    var spotify = new Spotify(keys.spotify);
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
//Display all info in the console
function displaySpotifyInfo(artist, track, link, album) {
    console.log(`Artist:        ${artist}`);
    console.log(`Album:         ${album}`);
    console.log(`Song:          ${track}`);
    console.log(`Preview Link:  ${link}`);
}
//------------------------------------------------------------------------------//
//movie this---------------node liri.js movie-this '<movie name here>'-----------//
function movieThis(movie) {
    var queryURL = `http://www.omdbapi.com/?apikey=${keys.OMDB.key}&t=${movie}`
    request(queryURL, function (error, response, body) {
        if (response.statusCode != 200) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        }
        else {
            //Parse response
            var movieResponse = JSON.parse(body);
            if (movieResponse.Error === `Movie not found!`) {
                console.log(movieResponse.Error);
            }
            else {
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
        }
    });
}
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
//Run the program
checkWhichOneToRun(userRequest, searchItem);