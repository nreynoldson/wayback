const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const stringSimilarity = require("string-similarity");

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const app = express();

const path = require('path');
var cors = require('cors')

app.use(cors());

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));


app.get('/api/weather', async function(req, res){
    var month = req.query.m;
    var day = req.query.d;

    var response = await getWeather(month, day);
    res.status(200).json(response);
});

app.get('/api/nutrition', async function(req, res){
    var item = req.query.item;
    var qty = req.query.qty;
    var response = await getNutritionals(item, qty);
    if(response != null)
        res.status(200).json(response);
    else
        res.status(404).json({error: "Ingredient not found"});
});

app.get('/api/description', async function(req, res){
    var search = req.query.q;
    console.log(search);
    if(search == undefined)
        res.status(200).send("");
    
    var response = await getDescription(search);

    res.status(200).json(response);
});


app.get('/api/image', async function(req, res){
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

async function getWeather(month, day){
    var url = 'https://www.weatherforyou.com/weather_history/index.php?m=' + month +'&d=' + day + '&y=2020';
	try {
		const { data } = await axios.get(url);
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

                var obj = {
                    year: year,
                    text: descriptor,
                    links: [
                        {title: newtitle}
                    ]
                }
			    events.push(obj);
            }
		});
        results.data = events;
		return results;
	} catch (error) {
		throw error;
	}
};

async function getDescription(searchTerm){
    var url = 'https://www.weatherforyou.com/weather_history/index.php?m=' + month +'&d=' + day + '&y=2020';
	try {
		const { data } = await axios.get(url);
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

                var obj = {
                    year: year,
                    text: descriptor,
                    links: [
                        {title: newtitle}
                    ]
                }
			    events.push(obj);
            }
		});
        results.data = events;
		return results;
	} catch (error) {
		throw error;
	}
};

/*async function getDescription(searchTerm){
    console.log('in get description');
    var url = "https://wikipedia-summary-scrape.herokuapp.com/" + searchTerm;

    console.log(url);
    return new Promise((resolve, reject) => {
        console.log('resolving promise');
      var xhr = new XMLHttpRequest();
      
      xhr.open("GET", url, true);
      xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
      xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
      xhr.setRequestHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
      xhr.onload = function(){
          console.log(xhr.status);
          console.log(xhr.responseText);
          if(xhr.status == 200){
            console.log(xhr.responseText);
              var response = JSON.parse(xhr.responseText);
               console.log(response);
              if(response.length == 0){
                response = null;
            }
              
              resolve(response[0]);
          }
          else{
              reject();
          }
      }
  
      xhr.send();
  });
}*/

function searchImages(searchTerm){
    var url = 'https://ddg-image-search.herokuapp.com/search?q=' + searchTerm + '&num=' + 1;

    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      
      xhr.open("GET", url, true);
      xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
      xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
      xhr.setRequestHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
      xhr.onload = function(){
          if(xhr.status == 200){
              var response = JSON.parse(xhr.responseText);
              if(response.length == 0){
                response = null;
            }
              
              resolve(response[0]);
          }
          else{
              reject();
          }
      }
  
      xhr.send();
  });
}

const API_URL = "https://api.nal.usda.gov/fdc/";
const API_KEY = "jSPHdduZ8NZjanxjCvpWmjT4bbQQamep8yvcD2gx";

function search(ing){
    url = API_URL + "v1/foods/search/?query=" + ing + "&api_key=" + API_KEY;
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        
        xhr.open("GET", url, true);
        //xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
        xhr.onload = function(){
            if(xhr.status == 200){
                var response = JSON.parse(xhr.responseText);
                resolve(response);
            }
            else{
                reject();
            }
        }
    
        xhr.send();
    });
}


NUTRIENTS = {
    calories: 1008,
    protein: 1003,
    fat: 1004,
    carbs: 1005
}
async function getNutritionals(ing, qty){
    var list = await search(ing);
    console.log(list);
    if(!list.foods.length){
        return null;
    }

    descriptions = []
    //Get the descriptions in an array to find the best match
    for(item of list.foods){
        descriptions.push(item.description)
    }

    var missingNutrient = true;
    var response = {};

    var match = stringSimilarity.findBestMatch(ing, descriptions);
    console.log(match);

    // Get the object containing the best match data
    var ingredient; 
    var index;

    // If no qty is provided, use the default of 100g
    if(!qty)
        qty = 100;

    var firstIteration = true;

    while(missingNutrient){
        console.log("top of while loop")
        if(firstIteration){
            ingredient = list.foods[match.bestMatchIndex];
            index = match.bestMatchIndex;
            firstIteration = false;
        }
        console.log(ingredient);
        var foodNutrients = ingredient.foodNutrients;

        response.item = ingredient.description;

        for(nutrient in NUTRIENTS){
            var result = foodNutrients.filter(obj => {
                return obj.nutrientId == NUTRIENTS[nutrient];
            });
            console.log(result);
            if(!result.length){
                console.log("!result.length");
                // Remove the first best match from the array
                match.ratings.splice(index, 1);
                list.foods.splice(index, 1)

                // Get the second highest match
                bestRating = Math.max.apply(Math, array.map(function(o) { return o.rating; }));
                index = match.ratings.map(function(e) { return e.rating; }).indexOf(bestRating);
                ingredient = list.foods[index];
                console.log(ingredient);
                break;
            }

            response[nutrient] = (result[0].value * qty / 100).toFixed(2);
        }
        missingNutrient = false;
    } 
    console.log(response);
    return response;
}



const PORT = process.env.PORT || 3001;
app.listen(process.env.PORT || 3001, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
