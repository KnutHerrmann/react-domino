import React, {PureComponent} from 'react';
import {Button} from 'react-bootstrap';
import './SelectedSeats.css';
import SelectedSeat from './SelectedSeat';
import Strings from '../locale/Strings';
import PropTypes from "prop-types";

class SelectedSeats extends PureComponent {
    static propTypes = {
        performance: PropTypes.object.isRequired,
        selectedSeats: PropTypes.array.isRequired,
        seatClick: PropTypes.func.isRequired,
        buyTickets: PropTypes.func.isRequired,
    };

    buyTickets = () => {
        this.props.buyTickets(this.props.performance.id, this.props.selectedSeats);
    };

    render() {
        const {performance, selectedSeats, seatClick} = this.props;
        const {availableSeats, prices} = performance;
        if (selectedSeats.length === 0) {
            return null;
        }
        let total = 0;
        const seatList = selectedSeats.map((seatId, index) => {
            const category = availableSeats[seatId] || 0;
            const price = prices[category];
            total += price;
            return (
                <SelectedSeat key={index}
                              performanceId={performance.id}
                              seatId={seatId}
                              category={category}
                              price={price}
                              seatClick={seatClick}/>);
        });
        return (
            <div className="selected-seats">
                {seatList}
                <div className="selected-seats-total">
                    <div className="selected-seats-total-label">{Strings.total}</div>
                    <div className="selected-seats-total-price">{Strings.getCurrency(total)}</div>
                </div>
                <Button bsStyle="primary" onClick={this.buyTickets}>{Strings.buy}</Button>
                <br/><br/>
            </div>
        );
    }
}

export default SelectedSeats;