import React from 'react';
import {OverlayTrigger, Popover} from 'react-bootstrap';
import PropTypes from "prop-types";

class Tooltip extends React.PureComponent {
    constructor() {
        super();
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
    }

    handleMouseDown() {
        //noinspection JSUnresolvedVariable
        this.refs.overlayTrigger.hide();
    }

    handleWheel() {
        //noinspection JSUnresolvedVariable
        this.refs.overlayTrigger.hide();
    }

    render() {
        const popoverTop =
            <Popover id="popover" title={this.props.title}>
                {this.props.tooltip}
            </Popover>;
        return (
            <OverlayTrigger ref="overlayTrigger" placement={this.props.placement} overlay={popoverTop} delayShow={500}>
                <div onMouseDown={this.handleMouseDown}
                     onWheel={this.handleWheel}>
                    {this.props.children}
                </div>
            </OverlayTrigger>
        );
    }
}

Tooltip.defaultProps = {
    placement: "top"
};

Tooltip.propTypes = {
    title: PropTypes.string,
    tooltip: PropTypes.object,
    placement: PropTypes.string
};

export default Tooltip;
