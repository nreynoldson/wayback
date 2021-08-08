const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

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
    console.log(response);
    
    //console.log(response);
    res.status(200).json(response);
});

app.get('/api/image', async function(req, res){
    var search = req.query.q;
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
            return WEATHER[term];
        }
    }
    return "weather";
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
                
                var obj = {
                    title: '',
                    year: year,
                    text: descriptor,
                    links: [{title: assignTitle(descriptor)}]
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


function searchImages(searchTerm){
    var url = 'https://ddg-image-search.herokuapp.com/search?q=' + searchTerm + '&num=' + 1;
    console.log(url);
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
              
              console.log(response)
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
    console.log("in search");
    url = API_URL + "v1/foods/search/?query=" + ing + "&api_key=" + API_KEY;
    console.log(url);
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        
        xhr.open("GET", url, true);
        //xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
        xhr.onload = function(){
            if(xhr.status == 200){
                var response = JSON.parse(xhr.responseText);
                var ingredient;
                for(item of response.foods){
                    if(item.dataType !== 'Branded'){
                        ingredient = item;
                        break;
                    }
    
                }
                resolve(ingredient);
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
    var ingredient = await search(ing);
    console.log(ingredient);
    if(!qty)
        qty = 100;
    var foodNutrients = ingredient.foodNutrients;

    response.item = ingredient.description;
    var response = {};
    for(nutrient in NUTRIENTS){
        console.log(nutrient)
        console.log(NUTRIENTS[nutrient]);
        var result = foodNutrients.filter(obj => {
            return obj.nutrientId == NUTRIENTS[nutrient];
        });
        response[nutrient] = (result[0].value * qty / 100).toFixed(2);
    }
    
    console.log(response);

    return response;
}



const PORT = process.env.PORT || 3001;
app.listen(process.env.PORT || 3001, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
