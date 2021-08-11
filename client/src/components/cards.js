import React, { Component } from 'react';
import {Card} from 'react-bootstrap';


var IMG_DEFAULT = {
    "Notable Events": "http://www.history-lab.uom.gr/en/wp-content/uploads/sites/3/2019/10/history-world-map.jpg",
    "Born on this day": "https://about-history.com/wp-content/uploads/2017/06/now-46c78ae9-71a6-4434-b1d8-539705e0771a-1210-680.jpg"
}
export default class ContentCard extends Component {
    constructor(props){
        super(props);
        this.handleShuffle = this.handleShuffle.bind(this);
        this.getDescription = this.getDescription.bind(this);
        this.state = {
            image: '',
            length: this.props.content.length,
            idx: 1,
            title: '',
            year: this.props.content[0].year,
            description: this.props.content[0].text,
            links: this.props.content[0].links,
            wikitext: ''
        }
        //this.getImage();
    }

    componentDidMount(){
        this.getResources();
    }

    componentDidUpdate(prevProps){
        if(this.props.content != prevProps.content){
            this.setState({
                length: this.props.content.length,
                idx: 1,
                title: this.props.content[0].title,
                year: this.props.content[0].year,
                description: this.props.content[0].text,
                links: this.props.content[0].links
            }, this.getResources);
        }

    }

    handleShuffle(fn){
        this.setState(function(state, props){ 
            if(state.idx + 1 < state.length)
                return ({
                    title: props.content[state.idx].title,
                    year: props.content[state.idx].year,
                    description: props.content[state.idx].text,
                    idx: state.idx + 1,
                    links: props.content[state.idx].links
                });
            else
                return ({
                    title: props.content[0].title,
                    year: props.content[0].year,
                    description: props.content[0].text,
                    idx: 1,
                    links: props.content[state.idx].links
                });  
        }, this.getResources);
    }

    async getResources(){
        var numLinks = this.state.links.length;
        var i = 0;
        var response = null;
        
        while(response == null && i < numLinks){
            response = await this.searchImages(this.state.links[i].title);
            i++;
        }
        // Would be better to pass in default image to component
        if(response == null){
            this.setState({image: IMG_DEFAULT[this.props.title]});
        }
        else
            this.setState({image: response.image})

       /* if(this.props.cardTitle == 'Born on this day'){
            response = await this.getDescription(this.state.description);
            console.log(response);
        }*/
    }

    getDescription(searchTerm){/*
        var url = 'http://localhost:3001/api/description?q=' + searchTerm;
        console.log(url);
        return new Promise((resolve, reject) => {
          var xhr = new XMLHttpRequest();
          
          xhr.open("GET", url, true);
          xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
          xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
          xhr.onload = function(){
              if(xhr.status == 200){
                var response = JSON.parse(xhr.responseText);
                console.log(response);
                resolve(response);
              }
              else{
                  reject();
              }
          }
          xhr.send();
      });*/

    }


    searchImages(searchTerm){
        var url = 'http://localhost:3001/api/image?q=' + searchTerm;
        console.log(url);
        return new Promise((resolve, reject) => {
          var xhr = new XMLHttpRequest();
          
          xhr.open("GET", url, true);
          xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
          xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
          xhr.onload = function(){
              if(xhr.status == 200){
                var response = JSON.parse(xhr.responseText);
                if(response.length == 0)
                    response = null;
                console.log('in search image function');
                console.log(response);
                resolve(response);
              }
              else{
                  reject();
              }
          }
          xhr.send();
      });
    }


    render() {
        var subtitleAndText;
        if(this.props.cardTitle == "Born on this day")
            subtitleAndText = (
                <>
                <Card.Subtitle className="mb-2 text-muted">{this.state.description}</Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">{this.state.year}</Card.Subtitle>
                    <Card.Text>
                        {this.state.wikitext}
                    </Card.Text>
                </>
            );
        else
            subtitleAndText = (
                <>
                <Card.Subtitle className="mb-2 text-muted">{this.state.year}</Card.Subtitle>
                    <Card.Text>
                        {this.state.description}
                    </Card.Text>
                </>
                
            );
        return (
            <Card>
                <Card.Img variant="top" src={this.state.image} />
                <Card.Body>
                    <Card.Title>
                        <span>{this.props.cardTitle}</span>
                        <i className="bi bi-arrow-repeat shuffle" onClick={this.handleShuffle}></i>
                    </Card.Title>
                    {subtitleAndText}
                </Card.Body>
            </Card>
        )
    }
}