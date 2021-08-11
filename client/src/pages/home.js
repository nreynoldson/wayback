import React, { Component } from 'react';
import CustomNav from '../components/navbar';
import Footer from '../components/footer';
import Content from '../components/content';
import {Container, Row, Col} from 'react-bootstrap';
import {getNextDay, getPrevDay} from '../utility/dateFunctions';
import DateForm from '../components/form';
import './App.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const MONTHS = ['null', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default class Home extends Component {
    constructor(props){
      super(props)
      this.state ={
          date: null,
          eventView: false,
          events: [],
          births: [],
          deaths: []
  
      }
      this.onSubmit = this.onSubmit.bind(this);
      this.requestEvent = this.requestEvent.bind(this);
      this.requestWeather = this.requestWeather.bind(this);
      this.previousDate = this.previousDate.bind(this);
      this.nextDate = this.nextDate.bind(this);
    }

    async onSubmit(m, d){
        var events = await this.requestEvent(m, d);
        var weather = await this.requestWeather(m, d);
        this.setState({
            month: m,
            day: d, 
            eventView: true,
            events: events.data.Events,
            births: events.data.Births,
            deaths: events.data.Deaths,
            weather: weather.data
        });

    }

    requestEvent(month, day){
        var url = 'http://history.muffinlabs.com/date/' + month + '/' + day;
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            
            xhr.open("GET", url, true);
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



    async requestWeather(month, day){
      /*
      var url = 'http://localhost:3001/api/weather?m=' + month + '&d=' + day;
      return new Promise((resolve, reject) => {
          var xhr = new XMLHttpRequest();
          
          xhr.open("GET", url, true);
          xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
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
      });*/
      var path = '/api/weather?m=' + month +'&d=' + day;
      console.log(path);
      var response = await fetch(path);
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      var weather = await response.json();
      return weather;
    
  }

  previousDate(){
    var date = getPrevDay(this.state.month, this.state.day);
    this.onSubmit(date[0], date[1]);
  }

  nextDate(){
    var date = getNextDay(this.state.month, this.state.day);
    this.onSubmit(date[0], date[1]);
  }


    render(){
        var dayEnding;
        if(this.state.day == 1 || this.state.day == 21 || this.state.day == 31)
            dayEnding = 'st';
        else if(this.state.day == 2 || this.state.day == 22)
            dayEnding = 'nd';
        else if(this.state.day == 3 || this.state.day == 23)
            dayEnding = 'rd';
        else
            dayEnding = 'th';


        var eventCards;
        if(this.state.eventView){
          console.log(this.state.events);
            eventCards = (
            <div>
              <Row className="divider"><i className="bi bi-caret-left" onClick={this.previousDate}></i>
              <div className="horizontal-dotted-line"></div>
              <i className="bi bi-caret-right" onClick={this.nextDate}></i>
              </Row>
              <Row><Col className="col">
            <h1 className="title">{MONTHS[this.state.month]} {this.state.day}{dayEnding} </h1>
            
            </Col>
          </Row>
          <Row>
            <Col className="col">
            <Content className ="content" date={this.state.date}
            events={this.state.events}
            births={this.state.births}
            deaths={this.state.deaths}
            weather={this.state.weather}
            ></Content>
            </Col>
          </Row></div>);
        }
        else{
            eventCards = (<div></div>);
        }
    return (
      <div>
        <CustomNav />
        <Container fluid className="center-content">
          <Row className="inputRow"> 
            <Col>
              <div className='textbox'>
                <h1 className="title">Way Back</h1>
                <p id="home-copy">Find out what happened on any day in history</p>
                <DateForm onSubmit = {this.onSubmit}></DateForm>
              </div>
            </Col>
          </Row>
        {eventCards}
        </Container>
        <Footer />
      </div>
    );
  }}