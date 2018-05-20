import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import './Home.css';
import {Link} from 'react-router-dom';
import Spinner from '../utils/Spinner';
import Strings from '../locale/Strings';

class Home extends PureComponent {
    render() {
        const {theater, isError} = this.props;
        const {performances, performancesSorted, shows, stages} = theater;
        return (
            <div className="home">
                <h2>{Strings.welcome}</h2>
                {performancesSorted.length <= 0
                    ? !isError && <Spinner/>
                    : performancesSorted.map((performanceId, index) => {
                        if (index >= 3) {
                            return null;
                        }
                        const performance = performances[performanceId];
                        const {showId, stageId, date, time} = performance;
                        const show = shows[showId];
                        const {title, subtitle} = show;
                        const stage = stages[stageId];
                        return (
                            <div className="home-performance"
                                 style={{
                                     marginLeft: (index * 40) + 'px',
                                     width: 'calc(100% - ' + (3 * 40) + 'px)'
                                 }}
                                 key={performance.id}>
                                <Link to={'/tickets/' + performanceId} style={{color: '#9b0000'}}>
                                    {Strings.formatString(
                                        Strings.welcomePerformanceDateTime,
                                        Strings.getWeekday(date),
                                        Strings.getDate(date),
                                        Strings.getTime(date + ' ' + time))}
                                </Link>
                                <Link to={'/shows/' + show.id}>
                                    <h3>{title}</h3>
                                </Link>
                                <div>{subtitle}</div>
                                <div>{stage ? stage.name : '...'}</div>
                            </div>
                        );
                    })}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    theater: state.theater,
    isError: state.errors && state.errors.length > 0
});

export default connect(
    mapStateToProps
)(Home);
