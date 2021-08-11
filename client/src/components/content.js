import React, { Component } from 'react';
import {CardDeck} from 'react-bootstrap';
import ContentCard from '../components/cards';

export default class Content extends Component {
    constructor(props){
        super(props);
    }

    render() {
        console.log(this.props.births);
        console.log(this.props.events);
        console.log(this.props.weather);
        return (
            <div className = "card-wrapper">
                <CardDeck>
                    <ContentCard cardTitle={"Notable Events"} content={this.props.events}></ContentCard>
                    <ContentCard cardTitle={"Born on this day"} content={this.props.births}></ContentCard>
                    <ContentCard cardTitle={"Weather"} content={this.props.weather}></ContentCard>
                </CardDeck>

                <div className="blank"></div>
            </div>
        )
    }
}