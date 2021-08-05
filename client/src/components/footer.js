import React, { Component } from 'react';
import {Nav, Navbar} from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import logo from './white-logo.svg';
import facebook from './facebook-icon.svg';
import insta from './insta-icon.svg';
import twitter from './twitter-icon.svg';

export default class Footer extends Component {
    render() {
        return (

            <Navbar className="footer">

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            {/*<Navbar.Collapse id="basic-navbar-nav">*/}
            <Nav className="flex-column footer-menu">
                <Nav className="footer-row">
                    <Nav.Link className="footer-item" href="#home">Contact</Nav.Link>
                    <Nav.Link className="footer-item" href="#generator">Terms of Service</Nav.Link>
                    <Nav.Link className="footer-item" href="#generator">Privacy Policy</Nav.Link>
                </Nav>
                <Nav className="footer-row">
                    <hr></hr>
                    <Nav.Link className="footer-item social-media" href="#home"><img className="nav-logo" src={insta}></img></Nav.Link>
                    <Nav.Link className="footer-item social-media" href="#generator"><img className="nav-logo" src={twitter}></img></Nav.Link>
                    <Nav.Link className="footer-item social-media" href="#generator"><img className="nav-logo" src={facebook}></img></Nav.Link>
                    <hr></hr>
                </Nav>
                <p className="footer-item">&#169; 2021 Way Back</p>
            </Nav>
            {/*</Navbar.Collapse>*/}
            </Navbar>


        )
    }
}
