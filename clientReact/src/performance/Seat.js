import React, {PureComponent} from 'react';
import './Seat.css';
import Position from '../utils/Position';
import Tooltip from '../utils/Tooltip';
import Strings from '../locale/Strings';
import PropTypes from "prop-types";

class Seat extends PureComponent {

    static getSeatProps(seatId) {
        const part = seatId.split('_');
        const section = Strings[part[0]];
        const annotation = Strings[part[1]];
        const row = part[2];
        const seat = part[3];
        return {section, annotation, row, seat};
    }

    seatClick = () => {
        const {category, seatId, performanceId, seatClick} = this.props;
        if (category) {
            seatClick(performanceId, seatId);
        }
    };

    render() {
        const {left, top, rotate, seatId, category, price, selected} = this.props;
        const seatProps = Seat.getSeatProps(seatId);
        const tooltip =
            <div>
                {seatProps.section + ' - ' + seatProps.annotation}<br/>
                {Strings.row + ': ' + seatProps.row}<br/>
                {Strings.seat + ': ' + seatProps.seat}<br/>
                {(category === 0 ? Strings.sold : (Strings.price + ': ' + Strings.getCurrency(price)))}
            </div>;
        return (
            <Position key={seatId}
                      left={left}
                      top={top}
                      rotate={rotate}>
                <Tooltip title={Strings.seatInfo}
                         tooltip={tooltip}>
                    <div className={'seat seat-category-' + category + (selected ? ' seat-selected' : '')
                    + (category !== 0 ? ' seat-clickable' : '')}
                         onClick={this.seatClick}>
                        {seatProps.seat}
                    </div>
                </Tooltip>
            </Position>
        );
    }

}

Seat.propTypes = {
    performanceId: PropTypes.string.isRequired,
    seatId: PropTypes.string.isRequired,
    category: PropTypes.number.isRequired,
    price: PropTypes.number,
    selected: PropTypes.bool.isRequired,
    seatClick: PropTypes.func.isRequired
};

export default Seat;
