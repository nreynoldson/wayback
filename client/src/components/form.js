import React, { Component, Select } from 'react';
import {Form, Button} from 'react-bootstrap';
import {randomDate} from '../utility/randomDate';


export default class DateForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            month: null,
            day: null,
            error: ""
        }
        
        this.handleChange = this.handleChange.bind(this);
        this.dayOnSelect = this.dayOnSelect.bind(this);
        this.monthOnSelect = this.monthOnSelect.bind(this);
        this.handleRandom = this.handleRandom.bind(this)
    }

    handleChange = (e) => {
        e.preventDefault();
        if(this.state.month != null && this.state.day != null){
            if(validDate(this.state.month, this.state.day)){
                this.setState({error: ""})
                this.props.onSubmit(this.state.month, this.state.day);
            }
            else{
                this.setState({error: "error"});
            }
        }
    }

    handleRandom = (e) => {
        e.preventDefault();
        var date = randomDate();
        this.props.onSubmit(date[0], date[1]);
    }

    monthOnSelect(m){
        this.setState({month: m});
    }

    dayOnSelect(d){
        this.setState({day: d});
    }

    render() {
        var msg ="";
        if(this.state.error)
            msg = "Date is not valid."
        return (
            <Form>
                <Form.Group id="select-form">
                    <MonthDropdown error={this.state.error} onSelect={this.monthOnSelect}></MonthDropdown>
                    <DayDropdown error={this.state.error} onSelect={this.dayOnSelect}></DayDropdown>
                    <div>{msg}</div>
                </Form.Group>

                <Form.Group className="buttons">
                    <button className="button"  onClick = {this.handleChange}>GO</button>
                    <button className="button" onClick = {this.handleRandom}>RANDOM</button>
                </Form.Group>
            </Form>
        )
    }
}

function validDate(m, d){
    var valid = true;
    if((m == 4 || m == 6 || m == 9 || m == 11) && d == 31)
        valid = false;
    if(m == 2 && d > 28)
        valid = false
    return valid;
}

class MonthDropdown extends Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e){
        this.props.onSelect(e.target.value)
    }

    render(){
    return(
        <div className="select-wrapper">
            <select className = {this.props.error} onChange={this.handleChange}>
                <option>Month</option>
                <option value='1'>January</option>
                <option value='2'>February</option>
                <option value='3'>March</option>
                <option value='4'>April</option>
                <option value='5'>May</option>
                <option value='6'>June</option>
                <option value='7'>July</option>
                <option value='8'>August</option>
                <option value='9'>September</option>
                <option value='10'>October</option>
                <option value='11'>November</option>
                <option value='12'>December</option>
            </select>
                
        </div>
    )
    }

}

class DayDropdown extends Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e){
        this.props.onSelect(e.target.value)
    }

    render() {
        return (
            <div className="select-wrapper">
                <select className = {this.props.error} onChange={this.handleChange}>
                    <option>Day</option>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                    <option value='6'>6</option>
                    <option value='7'>7</option>
                    <option value='8'>8</option>
                    <option value='9'>9</option>
                    <option value='10'>10</option>
                    <option value='11'>11</option>
                    <option value='12'>12</option>
                    <option value='13'>13</option>
                    <option value='14'>14</option>
                    <option value='15'>15</option>
                    <option value='16'>16</option>
                    <option value='17'>17</option>
                    <option value='18'>18</option>
                    <option value='19'>19</option>
                    <option value='20'>20</option>
                    <option value='21'>21</option>
                    <option value='22'>22</option>
                    <option value='23'>23</option>
                    <option value='24'>24</option>
                    <option value='25'>25</option>
                    <option value='26'>26</option>
                    <option value='27'>27</option>
                    <option value='28'>28</option>
                    <option value='29'>29</option>
                    <option value='30'>30</option>
                    <option value='31'>31</option>
                </select>
            </div>
        )
    }
}
