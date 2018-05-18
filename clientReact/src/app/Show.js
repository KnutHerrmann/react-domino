import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import Strings from '../locale/Strings';

class Show extends React.PureComponent {
    render() {
        const {match, theater} = this.props;
        const {showId} = match.params;
        const {shows, performances, performancesSorted, stages} = theater;
        const show = shows[showId];
        if (!show) {
            return null;
        }
        const {title, subtitle, description} = show;
        return (
            <div>
                <h2>{title}</h2>
                <div>{subtitle}</div>
                <br/>
                {performancesSorted.map(performanceId => {
                    const performance = performances[performanceId];
                    const {date, time, stageId} = performance;
                    const stage = stages[stageId];
                    if (performance['showId'] === showId) {
                        return (
                            <Link to={'/tickets/' + performanceId} key={performanceId} style={{color: '#9b0000'}}>
                                <div>{Strings.getDateTime(date + ' ' + time) + ' ... ' + (stage && stage.name)}</div>
                            </Link>
                        );
                    }
                    return null;
                })}
                <br/>
                <div dangerouslySetInnerHTML={{__html: description}}/>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    theater: state.theater
});

export default connect(
    mapStateToProps
)(Show);