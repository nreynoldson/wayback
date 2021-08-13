import React, { Component } from 'react';
import {CardDeck} from 'react-bootstrap';
import ContentCard from '../components/cards';
import { randomInRange } from '../utility/dateFunctions';
import { TailSpin } from 'react-loading-icons';

export default class Content extends Component {
    constructor(props){
        super(props);
        this.state = {
            events: null,
            people: null,
            weather: null,
            eImg: null,
            pImg: null,
            wImg: null,
            eIdx: 0,
            pIdx: 0,
            wIdx: 0,
            description: null,
            imagesLoaded: false,
            eContent: null,
            pContent: null,
            wContent: null
        }
        this.updateImage = this.updateImage.bind(this);
        this.getAllResources =this.getAllResources.bind(this)
        this.getCorrectData = this.getCorrectData.bind(this);
        this.initializeIndices = this.initializeIndices.bind(this);
        this.searchImages = this.searchImages.bind(this);
        this.setNewContent = this.setNewContent.bind(this);
        this.onShuffle = this.onShuffle.bind(this);
        this.getRandomIndex = this.getRandomIndex.bind(this);
        this.requestDescription = this.requestDescription.bind(this);
        this.checkImagesLoaded = this.checkImagesLoaded.bind(this);
    }

    getCorrectData(type){
        if(type == 'event')
            return this.props.events;
        else if(type == 'person')
            return this.props.births;
        else
            return this.props.weather;
        
    }

    onShuffle(type){
        //console.log('in on shuffle: type: ' + type);
        this.setNewContent(type);
        //console.log('exiting set card state')
        //console.log('state after exiting setcardstate:   ')
        //console.log(this.state)
       // this.updateImage(type);
        //console.log("state after update image:  ")
        //console.log(this.state);

    }

    getRandomIndex(content){
        return randomInRange(0, content.length - 1);
    }

    setNewContent(type){
        var i;
        if(type == 'event'){
            i = this.getRandomIndex(this.props.events);
            this.setState({eImg: null, eContent: this.props.events[i]}, 
                ()=> {this.updateImage(type)});
        }
        else if(type == 'person'){
            i = this.getRandomIndex(this.props.births);
            this.setState({pImg: null, description: null, pContent: this.props.births[i]}, 
                ()=> {this.updateImage(type)});
            }
        else{
            i = this.getRandomIndex(this.props.weather);
            this.setState({wImg: null, wContent: this.props.weather[i]}, 
                ()=> {this.updateImage(type)});
            }
        
        
            
    }

    initializeIndices(mount){
        console.log('in initialize indices');
        console.log(this.props.events);
        console.log(this.props.births);
        console.log(this.props.births);
        var e = randomInRange(0, (this.props.events.length - 1));
        var p = randomInRange(0, (this.props.births.length - 1));
        var w = randomInRange(0, (this.props.weather.length - 1))
        
        if(mount)
            this.setState({
                eIdx: e, eContent: this.props.events[e],
                pIdx: p, pContent: this.props.births[p], 
                wIdx: w, wContent: this.props.weather[w]},
                this.getAllResources);
        else
            this.setState({
                eIdx: e, eContent: this.props.events[e],
                pIdx: p, pContent: this.props.births[p], 
                wIdx: w, wContent: this.props.weather[w], 
                eImg: null, pImg: null, wImg: null,
                description: null, imagesLoaded: false},
                this.getAllResources);
    }

    async updateImage(type){
        //console.log('in update image')
        var image = new Image();
        var search;

        if(type == 'event'){
            image.onload = () => {this.setState({eImg: image})};
            search = this.state.eContent.links[0].title;
        }
        else if(type == 'person'){
            image.onload = () => {this.setState({pImg: image})}; 
            search = this.state.pContent.links[0].title;
        }
        else{
            image.onload = () => {this.setState({wImg: image})};
            search = this.state.wContent.links[0].title;
        }
        var imgObj = await this.searchImages(search);
        //console.log("imgObj recieved back")
        //console.log(imgObj);
        image.src = imgObj.image;
        if(type == 'person'){
            var perDesc = await this.requestDescription(this.state.pContent.links[0].title);
            this.setState({description: perDesc});
        }
        //console.log('exiting update image')
    }

    async getAllResources(){
        let [eventRes, personRes, weatherRes, descRes] =
            await Promise.all([
                this.searchImages(this.state.eContent.links[0].title), 
                this.searchImages(this.state.pContent.links[0].title),
                this.searchImages(this.state.wContent.links[0].title),
                this.requestDescription(this.state.pContent.links[0].title)
            ]);

        this.setState({
            description: descRes
        });

        var event = new Image();
        event.src = eventRes.image;
        event.onload = () => {
            this.setState({eImg: event})};

        var person = new Image();
        person.src = personRes.image;
        person.onload = () => {
            this.setState({pImg: person})};

        var weather = new Image();
        weather.src = weatherRes.image;
        weather.onload = () => {
            this.setState({wImg: weather})};
    }


    async componentDidMount(){
        this.initializeIndices(true);
    }

    async componentDidUpdate(prevProps){
        if(this.props.events != prevProps.events){
            this.initializeIndices(false);
        }
        if(!this.state.imagesLoaded)
            this.checkImagesLoaded();
    }
    
    async searchImages(searchTerm){
        //console.log("searching images");
        var path = '/image?q=' + searchTerm;
        var response = await fetch(path);
        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
      }
      var data = await response.json();
      //console.log('returning images');
      return data;
    }

    async requestDescription(query){
        var path = '/description?q=' + query;
        //console.log(path);
        var response = await fetch(path);
        if (!response.ok) {
          const message = `An error has occured: ${response.status}`;
          throw new Error(message);
        }
        var description = await response.json();
        return description;
    }

    checkImagesLoaded(){
        if(this.state.eImg && this.state.pImg && this.state.wImg && this.state.description !=null)
            this.setState({imagesLoaded: true});
    }

    render() {

        if(this.state.imagesLoaded)
            return (
                <div className = "card-wrapper">
                <CardDeck>
                    <ContentCard onShuffle= {this.onShuffle} type = {"event"} description = {""} image = {this.state.eImg} cardTitle={"Notable Events"} content={this.state.eContent}></ContentCard>
                    <ContentCard onShuffle= {this.onShuffle} type = {"person"} description = {this.state.description} image = {this.state.pImg} cardTitle={"Born on this day"} content={this.state.pContent}></ContentCard>
                    <ContentCard onShuffle= {this.onShuffle} type = {"weather"} description = {""} image = {this.state.wImg} cardTitle={"Weather"} content={this.state.wContent}></ContentCard>
                </CardDeck>
                <span hidden>{this.props.date}</span>
                <div className="blank"></div>
            </div>
            );
        else
            return(<TailSpin stroke="#000000" strokeOpacity={.75} speed={.75} />);
    }
}