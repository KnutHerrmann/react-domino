import React, {PureComponent} from 'react';
import PropTypes from "prop-types";

class Position extends PureComponent {
    render() {
        const {left, top, rotate} = this.props;
        const style = {
            position: 'absolute',
            left: left + 'px',
            top: top + 'px'
        };
        if (rotate !== 0) {
            style.transform = 'rotate(' + rotate + 'deg)';
        }
        return (
            <div style={style}>
                {this.props.children}
            </div>
        );
    }
}

Position.defaultProps = {
    top: 0,
    left: 0,
    rotate: 0
};

Position.propTypes = {
    top: PropTypes.number,
    left: PropTypes.number,
    rotate: PropTypes.number
};

export default Position;
