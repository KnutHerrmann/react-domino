import React, {PureComponent} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import SeatMap from './SeatMap';
import SelectedSeats from './SelectedSeats';
import Prices from './Prices';
import {seatClick, buyTickets} from '../redux/actions';
import Spinner from '../utils/Spinner';
import Strings from '../locale/Strings';

class TicketsPerformance extends PureComponent {

    render() {
        const {match, theater, selectedSeats, seatClick, buyTickets} = this.props;
        const {performanceId} = match.params;
        const {performances, shows, stages} = theater;
        if (Object.keys(performances).length === 0 || Object.keys(shows).length === 0 || Object.keys(stages).length === 0) {
            return <Spinner/>;
        }
        const performance = performances[performanceId];
        if (!performance) {
            return <Redirect to="/tickets"/>;
        }
        const {showId, stageId, date, time} = performance;
        const show = shows[showId];
        const stage = stages[stageId];
        const selectedSeatsPerformance = selectedSeats[performanceId] || [];
        return (
            <Grid fluid={true}>
                <Row>
                    <Col xs={12} md={7}>
                        <div>
                            <SeatMap
                                performance={performance}
                                stage={stage}
                                selectedSeats={selectedSeatsPerformance}
                                seatClick={seatClick}/>
                            <Prices prices={performance.prices}/>
                        </div>
                    </Col>
                    <Col xs={12} md={5}>
                        <h2>{Strings.tickets}</h2>
                        <h4>{show.title}</h4>
                        <h4>{Strings.getDateTime(date + ' ' + time) + ' ... ' + stage.name}</h4>
                        {selectedSeatsPerformance.length > 0 ? <SelectedSeats
                            performance={performance}
                            selectedSeats={selectedSeatsPerformance}
                            seatClick={seatClick}
                            buyTickets={buyTickets}/> : <p><br/><br/>{Strings.select}</p>
                        }
                    </Col>
                </Row>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({
    selectedSeats: state.selectedSeats,
    theater: state.theater
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({seatClick, buyTickets}, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TicketsPerformance);