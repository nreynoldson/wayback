import React, { Component } from 'react';
import {Card, CardDeck} from 'react-bootstrap';

const PEOPLE = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Queen_Victoria_by_Bassano.jpg/850px-Queen_Victoria_by_Bassano.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Shakespeare.jpg/440px-Shakespeare.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Charles_Darwin_seated_crop.jpg/440px-Charles_Darwin_seated_crop.jpg"
]

const DESCRIPTORS = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque arcu nulla, rhoncus accumsan urna in, posuere scelerisque arcu. Cras consectetur imperdiet nisi id condimentum. Donec rutrum mattis orci at commodo.",
    "Suspendisse tempor scelerisque feugiat. Proin pellentesque neque ut condimentum ultricies. Sed nec magna non elit lobortis lacinia a dictum augue. Nam rhoncus sapien massa, et volutpat quam pulvinar eget. ",
    "Donec suscipit laoreet augue, vel lacinia mi ultrices et. Proin egestas quam ac metus accumsan, id rutrum sapien gravida. Aliquam ullamcorper felis et lorem porttitor accumsan nec ut ex. "
]

const EVENTS = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/MSH80_st_helens_eruption_plume_07-22-80.jpg/340px-MSH80_st_helens_eruption_plume_07-22-80.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Woodstock_redmond_stage.JPG/500px-Woodstock_redmond_stage.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/War_of_1812_Montage.jpg/600px-War_of_1812_Montage.jpg"
]
var NUM = 0;

export default class Content extends Component {
    constructor(props){
        super(props);
        this.state = {
            personImg: '',
            eventImg: '',
            weatherImg: '',
            personDesc: ''
        }
        this.getImages = this.getImages.bind(this);
        this.searchImages = this.searchImages.bind(this);
    }

    searchImages(searchTerm){
        var url = 'http://ddg-image-search.herokuapp.com/search?q=' + searchTerm + '&num=' + 1;
        console.log(url);
        return new Promise((resolve, reject) => {
          var xhr = new XMLHttpRequest();
          
          xhr.open("GET", url, true);
          xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
          xhr.onload = function(){
              if(xhr.status == 200){
                  var response = JSON.parse(xhr.responseText);
                  if(!Object.keys(response.data).length){
                    response = null;
                }
                  
                  console.log(response)
                  resolve(response);
              }
              else{
                  reject();
              }
          }
      
          xhr.send();
      });
    }

    async getImages(){
        var eLinks = this.props.events[0].links.length;
        var i = 0
        var event = null;
        while(event == null && i < eLinks){
            event = await this.searchImages(this.props.events[0].links[i].title);
            i++;
        }
        if(event == null)
            event.url = "http://www.history-lab.uom.gr/en/wp-content/uploads/sites/3/2019/10/history-world-map.jpg";
        

        console.log(event);

        var pLinks = this.props.people[0].links.length;
        i = 0;
        var person = null;
        
        while(person == null && i < pLinks){
            var person = await this.searchImages(this.props.births[0].links[0].title);
            i++;
        }
        
        if(person == null){
            person.url = "https://about-history.com/wp-content/uploads/2017/06/now-46c78ae9-71a6-4434-b1d8-539705e0771a-1210-680.jpg";
        }

        console.log(person);
        if(this.event != null && this.person != null)
            this.setState({personImg: person.url, eventImg: event.url});

    }

    getDescription(){
        //TODO:  should be implemented with group members wikipedia scraper microservice
        return DESCRIPTORS[NUM];
    }

    componentDidMount(){
        this.getImages();
        var personDescription = this.getDescription();
        var weather = selectWeatherImg(this.props.weather.data[0].descriptor);
        this.setState({weatherImg: weather, personDesc: personDescription});
    }

    componentDidUpdate(prevProps){
        if(this.props.births != prevProps.births){
            this.getImages();
            var weather = selectWeatherImg(this.props.weather.data[0].descriptor);
            var personDescription = this.getDescription();
            this.setState({weatherImg: weather, personDesc: personDescription});
        
        }
    }
    render() {
        return (
            <div className = "card-wrapper">
            <CardDeck>
                <Card>
                    <Card.Img variant="top" src={this.state.personImg} />
                    <Card.Body>
                    <Card.Title>Born on this day</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{this.props.births[0].links[0].title}</Card.Subtitle>
                        <Card.Subtitle className="mb-2 text-muted">b. {this.props.births[0].year}</Card.Subtitle>
                        {this.state.personDesc}
                        <Card.Text>
                        
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Img variant="top" src={this.state.eventImg} />
                    <Card.Body>
                    <Card.Title>Notable Events</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{this.props.events[0].year}</Card.Subtitle>
                    
                        <Card.Text>
                        {this.props.events[0].text}
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Img variant="top" src={this.state.weatherImg} />
                    <Card.Body>
                    <Card.Title>Weather</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{this.props.weather.data[0].year}</Card.Subtitle>
                    <Card.Text>
                        {this.props.weather.data[0].descriptor}
                    </Card.Text>
                    </Card.Body>
                </Card>
                </CardDeck>

                <div className="blank"></div>
            </div>
        )
    }
}

const WEATHER = {
    "rain": "https://www.thestatesman.com/wp-content/uploads/2019/09/rains-2.jpg",
    "snow": "https://s.w-x.co/ap931222777291_980x551_0.jpg",
    "thunder": "https://static01.nyt.com/images/2020/02/06/climate/06CLI-LIGHTNING/06CLI-LIGHTNING-superJumbo.jpg",
    "tornado": "https://media.npr.org/assets/img/2011/06/17/chickasha-tornado-7f26ff937f86fd1f4d0025d734e6e34c89994508-s1200.webp",
    "hurricane": "https://swwc.com/wp-content/uploads/hurricane-picture-1024x683.jpg",
    "high": "https://www.wnct.com/wp-content/uploads/sites/99/2019/07/Sunlight.jpeg?w=1752&h=986&crop=1",
    "low": "https://s.w-x.co/util/image/w/0203blowingsnow.jpg?v=at&w=1280&h=720",
    "hail": "https://westernfinancialgroup.ca/get/files/image/galleries/Hail_Home_Insurance_Blog.jpg",
    "sun": "https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/01/sunlight-732x549.jpg",
    "blizzard": "https://www.farmersalmanac.com/wp-content/uploads/2021/01/blizzard-man-walking-winter-as_289632411.jpeg",
    "spring": "https://blog.tours4fun.com/wp-content/uploads/2020/04/mount-rainier-meadow.jpg",
    "summer": "https://livability.com/sites/default/files/LakeMIBeach.jpg",
    "fall": "https://www.discovermuskoka.ca/content/uploads/fall-scenic-background.jpg",
    "winter": "https://www.wearecentralpa.com/wp-content/uploads/sites/69/2021/01/AdobeStock_133146697.jpeg?w=1752&h=986&crop=1",
    "default": "https://scied.ucar.edu/sites/default/files/images/large_image_for_image_content/weather_0.jpg"
}

function selectWeatherImg(description){
    console.log('in select weather img')
    console.log(description);
    for(var term in WEATHER){
        console.log(term)
        var re = new RegExp(term,"g");
        var match = description.match(re);
        console.log(match)
        if(match != null){
            console.log('returning ' + term + ' at : ' + WEATHER[term]);
            return WEATHER[term];
        }
    }
    return WEATHER['default'];
}