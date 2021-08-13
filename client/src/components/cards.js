import React, { Component } from 'react';
import {Card} from 'react-bootstrap';
import { TailSpin } from 'react-loading-icons';

export default class ContentCard extends Component {
    constructor(props){
        super(props);
        this.handleShuffle = this.handleShuffle.bind(this);
    }
    
    handleShuffle(){
        this.props.onShuffle(this.props.type);
    }

    render() {
        console.log("in card render " + this.props.cardTitle);
        console.log(this.props.content);
        
        var subtitleAndText;
        if(this.props.cardTitle == "Born on this day")
            subtitleAndText = (
                <>
                <Card.Subtitle className="mb-2 text-muted">{this.props.content.links[0].title}</Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">{this.props.content.year}</Card.Subtitle>
                    <Card.Text>
                        {this.props.description}
                    </Card.Text>
                </>
            );
        else
            subtitleAndText = (
                <>
                <Card.Subtitle className="mb-2 text-muted">{this.props.content.year}</Card.Subtitle>
                    <Card.Text>
                        {this.props.content.text}
                    </Card.Text>
                </>
                
            );
           // console.log("image obj in card: ");
            //console.log(this.props.image );
        if(this.props.image != null && this.props.description != null)
        return (
            
            <Card>
                <Card.Img variant="top" src={this.props.image.src}/>
                <Card.Body>
                    <Card.Title>
                        <span>{this.props.cardTitle}</span>
                        <i className="bi bi-arrow-repeat shuffle" onClick={this.handleShuffle}></i>
                    </Card.Title>
                    {subtitleAndText}
                </Card.Body>
            </Card>
        )
        else
        return (
            <Card>
               <div className="spinner-wrapper">
               <TailSpin stroke="#FFFFFF" strokeOpacity={.75} speed={.75} />
               </div>

            </Card>
        )
    }
}