import React, {PureComponent} from 'react';
import './Seat.css';
import './SelectedSeat.css';
import Seat from './Seat';
import Strings from '../locale/Strings';
import PropTypes from "prop-types";

class SelectedSeat extends PureComponent {
    static propTypes = {
        performanceId: PropTypes.string.isRequired,
        seatId: PropTypes.string.isRequired,
        category: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
        seatClick: PropTypes.func.isRequired,
    };

    seatClick = () => {
        this.props.seatClick(this.props.performanceId, this.props.seatId);
    };

    render() {
        const {seatId, category, price} = this.props;
        const seatProps = Seat.getSeatProps(seatId);
        return (
            <div className="selected-seat">
                <div className="selected-seat-section">
                    {seatProps.section + ' - ' + seatProps.annotation}
                </div>
                <div className="selected-seat-number">
                    {Strings.row} <b>{seatProps.row}</b> {Strings.seat} <b>{seatProps.seat}</b>
                </div>
                <div className="selected-seat-price">
                    {Strings.getCurrency(price)}
                </div>
                <div
                    className={'selected-seat-category seat-category-' + category}
                    onClick={this.seatClick}>
                    {'X'}
                </div>
            </div>
        );
    }
}


export default SelectedSeat;
