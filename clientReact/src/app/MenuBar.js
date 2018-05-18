import React from 'react';
import {Link, Route} from 'react-router-dom';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import './MenuBar.css';
import Strings from '../locale/Strings';

const MenuBar = () => (
    <Navbar fluid collapseOnSelect>
        <Navbar.Header>
            <Navbar.Brand>
                <Link to="/">{Strings.theaterName}</Link>
            </Navbar.Brand>
            <Navbar.Toggle/>
        </Navbar.Header>
        <Navbar.Collapse>
            <Nav>
                <NavItem><LinkBootstrap to="/shows" label={Strings.shows}/></NavItem>
                <NavItem><LinkBootstrap to="/tickets" label={Strings.tickets}/></NavItem>
                <NavItem><LinkBootstrap to="/visit" label={Strings.visit}/></NavItem>
                <NavItem><LinkBootstrap to="/about" label={Strings.about}/></NavItem>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);

const LinkBootstrap = ({to, label}) => (
    <Route path={to} children={({match}) => (
        <li className={match ? 'active' : ''}>
            <Link to={to}>{label}</Link>
        </li>
    )}/>
);

export default MenuBar;
