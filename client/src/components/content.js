import React, { Component } from 'react';
import {CardDeck} from 'react-bootstrap';
import ContentCard from '../components/cards';

export default class Content extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div className = "card-wrapper">
                <CardDeck>
                    <ContentCard title={"Born on this day"} content={this.props.events}></ContentCard>
                    <ContentCard title={"Notable Events"} content={this.props.births}></ContentCard>
                    <ContentCard title={"Weather"} content={this.props.weather}></ContentCard>
                </CardDeck>

                <div className="blank"></div>
            </div>
        )
    }
}