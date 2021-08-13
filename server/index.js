const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const stringSimilarity = require("string-similarity");

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const app = express();

const path = require('path');
var cors = require('cors');
const { query } = require('express');

app.use(cors());

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));


app.get('/weather', async function(req, res){
    var month = req.query.m;
    var day = req.query.d;

    var response = await getWeather(month, day);
    res.status(200).json(response);
});


app.get('/description', async function(req, res){
    var search = req.query.q;
    console.log(search);
    if(search == undefined)
        res.status(200).send("");
    
    var response = await getDescription(search);

    res.status(200).json(response);
});


app.get('/image', async function(req, res){
    var search = req.query.q;
    if(search == undefined)
        search = 'historical';
    var response = await searchImages(search);

    res.status(200).json(response);
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});


const WEATHER = ["rain", "snow", "thunder", "tornado", "hurricane",
                 "high temperature", "low temperature", "hail",
                 "blizzard", "fire"]

function assignTitle(description){
    for(var term of WEATHER){
        var re = new RegExp(term,"g");
        var match = description.match(re);
        
        if(match != null){
            return term;
        }
    }
    return "bad weather";
}

function processWeatherEvents(data){
    const $ = cheerio.load(data);
    const results = {};
    var events = [];

    $('td > div > span').each((_idx, el) => {
        if(($(el).text().length) <= 4){
            var year = $(el).text();
            
            var parentNode = $(el).parent();
            var descriptor = parentNode.children().remove().end().text();
            descriptor = descriptor.substring(3);
            descriptor= descriptor.replace(/ *\([^)]*\) */g, "");
            var newtitle = assignTitle(descriptor);

            events.push({
                year: year,
                text: descriptor,
                links: [{title: newtitle}]
            });
        }
    });
    results.data = events;
    return results;
}

async function getWeather(month, day){
    var url = 'https://www.weatherforyou.com/weather_history/index.php?m=' + month +'&d=' + day + '&y=2020';
	try {
		const { data } = await axios.get(url);
		return processWeatherEvents(data);
	} catch (error) {
		throw error;
	}
};

async function searchImages(query){
    var url = 'https://ddg-image-search.herokuapp.com/search?q=' + query + '&num=' + 1;
	try {
		const { data } = await axios.get(url);
        console.log(data)
		return data[0];
	} catch (error) {
		throw error;
	}
}

async function getDescription(query){
    query = query.replace(/\s+/g, '')
    var url = 'https://wikipedia-summary-scrape.herokuapp.com/' + query;
	try {
		const { data } = await axios.get(url);
        if(data.error)
            return "";
        else if(data.summary.includes("\n"))
		    return data.summary.split('\n')[0];
        else 
            return data.summary
	} catch (error) {
		throw error;
	}
}

process.on('uncaughtException', function (error) {
    console.log(error.stack);
 });

const PORT = process.env.PORT || 3001;
app.listen(process.env.PORT || 3001, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
