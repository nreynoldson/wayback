import React, { Component } from 'react';
import {Card} from 'react-bootstrap';


IMG_DEFAULT = {
    "Notable Events": "http://www.history-lab.uom.gr/en/wp-content/uploads/sites/3/2019/10/history-world-map.jpg",
    "Born on this day": "https://about-history.com/wp-content/uploads/2017/06/now-46c78ae9-71a6-4434-b1d8-539705e0771a-1210-680.jpg"
}
export default class ContentCard extends Component {
    constructor(props){
        super(props);
        this.handleShuffle = this.handleShuffle.bind(this);
    }

    componentDidMount(){
        this.getImage();
        this.setState({
            length: this.props.content.length,
            idx: 0,
            title: this.props.content[0].title,
            year: this.props.content[0].year,
            description: this.props.content[0].text,
            links: this.props.content[0].links
        })
    }

    componentDidUpdate(prevProps){
        this.getImage();
        if(this.props.content != prevProps){
            this.setState({
                length: this.props.content.length,
                idx: 1,
                title: this.props.content[0].title,
                year: this.props.content[0].year,
                description: this.props.content[0].text,
                links: this.props.content[0].links
            })
        }
    

    }

    handleShuffle(){
        this.setState(function(state, props){ 
            if(state.idx + 1 < state.length)
                return ({
                    title: props.content[state.idx].title,
                    year: props.content[state.idx].year,
                    description: props.content[state.idx].text,
                    idx: state.idx + 1
                });
            else
                return ({
                    title: props.content[0].title,
                    year: props.content[0].year,
                    description: props.content[0].text,
                    idx: 1
                });
        });
    }

    async getImage(){
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
    }

    searchImages(searchTerm){
        var url = 'http://localhost:3000/api/image?q=' + searchTerm;
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
        return (
            <Card>
                <Card.Img variant="top" src={this.state.image} />
                <Card.Body>
                    <Card.Title>
                        <span>{this.props.cardTitle}</span>
                        <i className="bi bi-arrow-repeat shuffle" onClick={this.handleShuffle}></i>
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{this.state.title}</Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">{this.state.year}</Card.Subtitle>
                    <Card.Text>
                        {this.state.description}
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }
}