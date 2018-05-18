import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import './Tickets.css';
import Strings from '../locale/Strings';

class Tickets extends Component {
    render() {
        const {performances, performancesSorted, shows, stages} = this.props.theater;
        return (
            <div className="tickets">
                <h2>{Strings.tickets}</h2>
                <table>
                    <thead>
                    <tr>
                        <th>{Strings.date}</th>
                        <th>{Strings.time}</th>
                        <th>{Strings.tickets}</th>
                        <th>{Strings.stage}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {performancesSorted.map((performanceId) => {
                        const performance = performances[performanceId];
                        const {showId, stageId, date, time} = performance;
                        const show = shows[showId];
                        const stage = stages[stageId];
                        return (
                            <tr key={performance.id}>
                                <td>
                                    <Link to={'/tickets/' + performanceId} style={{color: '#9b0000'}}>
                                        {Strings.getDate(date)}
                                    </Link>
                                </td>
                                <td>
                                    <Link to={'/tickets/' + performanceId} style={{color: '#9b0000'}}>
                                        {Strings.getTime(date + ' ' + time)}
                                    </Link>
                                </td>
                                <td>
                                    <Link to={'/shows/' + show.id}>
                                        {show.title}
                                    </Link>
                                </td>
                                <td>{stage ? stage.name : '...'}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    theater: state.theater
});

export default connect(
    mapStateToProps
)(Tickets);