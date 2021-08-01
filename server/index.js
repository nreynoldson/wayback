const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const app = express();


const router = express.Router();

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
                    year: year,
                    descriptor: descriptor
                }
			    events.push(obj);
            }
		});
        results.data = events;
        console.log(results);
		return results;
	} catch (error) {
		throw error;
	}
};


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
                var ingredient = response.foods[0];
                console.log(ingredient);
                resolve(ingredient);
            }
            else{
                reject();
            }
        }
    
        xhr.send();
    });
}

async function getNutritionals(ing, qty){
    var ingredient = await search(ing);
    if(!qty)
        qty = 100;
    var nutrients = ingredient.foodNutrients;
    var nutritionals = {
        item: ingredient.description,
        protein: nutrients[0].value * qty/100,
        fat: nutrients[1].value * qty/100,
        carbs: nutrients[2].value * qty/100,
        calories: nutrients[3].value * qty/100
    };
    console.log(nutritionals);

    return nutritionals;
}

router.get('/api/weather', async function(req, res){
    var month = req.query.m;
    var day = req.query.d;

    var response = await getWeather(month, day);
    res.status(200).json(response);
});

router.get('/api/nutrition', async function(req, res){
    var item = req.query.item;
    var qty = req.query.qty;
    var response = await getNutritionals(item, qty);
    console.log(response);
    
    //console.log(response);
    res.status(200).json(response);
});

app.use('/', router);

const PORT = process.env.PORT || 3001;
app.listen(process.env.PORT || 3001, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
