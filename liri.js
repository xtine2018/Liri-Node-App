require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var request = require('request');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var action = process.argv[2];
var parameter = process.argv[3];


function switchCase() {
  switch (action) {
    case 'concert-this':
      bandsInTown(parameter);                   
      break;                          
    case 'spotify-this-song':
      spotifySong(parameter);
      break;
    case 'movie-this':
      movieInfo(parameter);
      break;
    case 'do-what-it-says':
      getRandom();
      break;
  }
};

function bandsInTown(parameter){

if (action === 'concert-this') {
	var concert="";
	for (var i = 3; i < process.argv.length; i++) {
		concert+=process.argv[i];
	}
	console.log(concert);
}
else
{
	concert = parameter;
}

var queryUrl = "https://rest.bandsintown.com/artists/"+concert+"/events?app_id=codingbootcamp";
request(queryUrl, function(error, response, body) {
  if (!error && response.statusCode === 200) {

    var JS = JSON.parse(body);
    for (i = 0; i < JS.length; i++){
      var dTime = JS[i].datetime;
        var month = dTime.substring(5,7);
        var year = dTime.substring(0,4);
        var day = dTime.substring(8,10);
        var dateForm = month + "/" + day + "/" + year
      console.log("***************");
      console.log("Date: " + dateForm);
      console.log("Name: " + JS[i].venue.name);
      console.log("City: " + JS[i].venue.city);
      if (JS[i].venue.region !== "") {
        console.log("Country: " + JS[i].venue.region);
      }
      console.log("Country: " + JS[i].venue.country);
    }
  }
});
}

function spotifySong(parameter) {
  var searchSong;
  if (parameter === undefined) {
    searchSong = "The Sign Ace of Base";
  } else {
    searchSong = parameter;
  }

  spotify.search({
    type: 'track',
    query: searchSong
  }, function(error, data) {
    if (error) {
      console.log('Error occurred: ' + error);
      return;
    } else {
      console.log("***************");
      console.log("Artist: " + data.tracks.items[0].artists[0].name);
      console.log("Song: " + data.tracks.items[0].name);
      console.log("Preview: " + data.tracks.items[3].preview_url);
      console.log("Album: " + data.tracks.items[0].album.name);
      
    }
  });
};
function movieInfo(parameter) {
  var findMovie;
  if (parameter === undefined) {
    findMovie = "Mr. Nobody";
  } else {
    findMovie = parameter;
  };

  var queryUrl = "http://www.omdbapi.com/?t=" + findMovie + "&y=&plot=short&apikey=trilogy";
  request(queryUrl, function(err, res, body) {
  	var bodyOf = JSON.parse(body);
    if (!err && res.statusCode === 200) {
      console.log("***************");
      console.log("Title: " + bodyOf.Title);
      console.log("Release Year: " + bodyOf.Year);
      console.log("IMDB Rating: " + bodyOf.imdbRating);
      console.log("Rotten Tomatoes Rating: " + bodyOf.Ratings[1].Value); 
      console.log("Country: " + bodyOf.Country);
      console.log("Language: " + bodyOf.Language);
      console.log("Plot: " + bodyOf.Plot);
      console.log("Actors: " + bodyOf.Actors);
    }
  });
};

function getRandom() {
fs.readFile('random.txt', "utf8", function(error, data){
    if (error) {
        return console.log(error);
      }

    var dataArr = data.split(",");
    
    if (dataArr[0] === "spotify-this-song") 
    {
      var songcheck = dataArr[1].trim().slice(1, -1);
      spotifySong(songcheck);
    } 
    else if (dataArr[0] === "concert-this") 
    { 
      if (dataArr[1].charAt(1) === "'")
      {
      	var dLength = dataArr[1].length - 1;
      	var data = dataArr[1].substring(2,dLength);
      	console.log(data);
      	bandsInTown(data);
      }
      else
      {
	      var bandName = dataArr[1].trim();
	      console.log(bandName);
	      bandsInTown(bandName);
	  }
  	  
    } 
    else if(dataArr[0] === "movie-this") 
    {
      var movie_name = dataArr[1].trim().slice(1, -1);
      movieInfo(movie_name);
    } 
    
    });

};

// function logIt(dataToLog) {

// 	console.log(dataToLog);

// 	fs.appendFile('log.txt', dataToLog + '\n', function(err) {
		
// 		if (err) return logIt('Error logging data to file: ' + err);	
// 	});
// }


switchCase();