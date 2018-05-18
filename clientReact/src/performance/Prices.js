import React from 'react';
import './Seat.css';
import './Prices.css';
import Strings from '../locale/Strings';
import PropTypes from "prop-types";

const Prices = ({prices}) => (
    <div className="prices">
        {Object.keys(prices).map((category) => (
            <div className={'prices-price seat-category-' + category} key={category}>
                {Strings.price + ' ' + Strings.getCurrency(prices[category])}
            </div>
        ))}
    </div>
);

Prices.propTypes = {
    prices: PropTypes.object.isRequired,
};

export default Prices;