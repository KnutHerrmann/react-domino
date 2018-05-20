import React, {Component} from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-theme.min.css';
import './App.css';

import {connect} from 'react-redux';
import MenuBar from './MenuBar';
import About from './About';
import Tickets from './Tickets';
import Performance from '../performance/Performance';
import Shows from './Shows';
import Visit from './Visit';
import Home from './Home';
import {
    initConfig,
    readShows,
    readPerformances,
    readStages
} from '../redux/actions';

class App extends Component {
    componentWillMount() {
        let dataUrl = 'http://server1:8088/React/TheaterReactPWA.nsf/data.xsp/data/';
        const curURL = window.location.href;
        if (curURL.indexOf('.nsf') >= 0) {
            dataUrl = curURL.substring(0, curURL.indexOf('.nsf') + 4) + '/data.xsp/data/';
        }
        this.props.dispatch(initConfig({dataUrl}));
        this.props.dispatch(readShows());
        this.props.dispatch(readPerformances());
        this.props.dispatch(readStages());
    }

    render() {
        const {errors} = this.props.state;
        return (
            <Router>
                <div className="app">
                    <MenuBar/>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route path="/shows" component={Shows}/>
                        <Route exact path="/tickets" component={Tickets}/>
                        <Route path="/tickets/:performanceId" component={Performance}/>
                        <Route path="/visit" component={Visit}/>
                        <Route path="/about" component={About}/>
                        <Route path="*" component={Home}/>
                    </Switch>
                    {errors && (
                        <div style={{color: 'red', margin:'1em'}}>
                            {errors.map(error => <div>{error}</div>)}
                        </div>)
                    }
                </div>
            </Router>
        );
    }
}

const mapStateToProps = state => ({state});

export default connect(
    mapStateToProps
)(App);
