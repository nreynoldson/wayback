import React, { Component } from 'react';
import {Nav, Navbar} from 'react-bootstrap';

import logo from './black-logo.svg';

export default class CustomNav extends Component {
    render() {
        return (

            <Navbar className="custom-navbar" expand="md">
            <Navbar.Brand href="#home">
                <div className="icon-wrapper">
                <img className="icon" src="/icons/history.png"></img>
                </div>
                <h3>Way Back</h3>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                <Nav.Link className="nav-item" href="#home">Home</Nav.Link>
                <Nav.Link className="nav-item" href="#generator">Contact</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            </Navbar>

        )
    }
}