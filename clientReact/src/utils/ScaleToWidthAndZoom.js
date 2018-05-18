import React, { PureComponent } from 'react';
import Measure from 'react-measure';
import PropTypes from "prop-types";

class ScaleToWidthAndZoom extends PureComponent {
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        zoomStart: PropTypes.number,
        zoomMin: PropTypes.number,
        zoomMax: PropTypes.number
    };

    constructor (props) {
        super();
        this.state = {
            id: Math.random().toString(36).substr(2, 10),
            height: 0,
            scaleWidth: 1,
            previousScaleWidth: 0,
            scaleZoom: props.zoomStart,
            origin: {x: 0, y: 0},
            zoom: !(props.zoomStart === props.zoomMin && props.zoomMin === props.zoomMax)
        };
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
    }

    handleWheel (event) {
        let nodeZoomer = event.target;
        while (nodeZoomer.id !== this.state.id && nodeZoomer.parentNode) {
            nodeZoomer = nodeZoomer.parentNode;
        }
        const rectZoomer = nodeZoomer.getBoundingClientRect();
        const mouseInRect = {x: event.pageX - rectZoomer.left, y: event.pageY - rectZoomer.top};
        let scaleZoom = this.state.scaleZoom - event.deltaY / (event.deltaMode === 0 ? 1000 : 100) / this.state.scaleWidth;
        if (scaleZoom < this.props.zoomMin) {
            scaleZoom = this.props.zoomMin;
        } else if (scaleZoom > this.props.zoomMax) {
            scaleZoom = this.props.zoomMax;
        }
        if (scaleZoom !== this.state.scaleZoom) {
            const origin = {
                x: (mouseInRect.x - (mouseInRect.x - this.state.origin.x) * scaleZoom / this.state.scaleZoom),
                y: (mouseInRect.y - (mouseInRect.y - this.state.origin.y) * scaleZoom / this.state.scaleZoom)
            };
            this.setState({...this.state, scaleZoom, origin});
        }
        event.preventDefault();
    }

    handleMouseDown (event) {
        const mouseDown = {x: event.pageX, y: event.pageY, origin: {...this.state.origin}};
        this.setState({...this.state, mouseDown});
        event.preventDefault();
    }

    handleMouseUp (event) {
        const mouseDown = null;
        this.setState({...this.state, mouseDown});
        event.preventDefault();
    }

    handleMouseMove (event) {
        if (this.state.mouseDown) {
            const origin = {
                x: this.state.mouseDown.origin.x - (this.state.mouseDown.x - event.pageX),
                y: this.state.mouseDown.origin.y - (this.state.mouseDown.y - event.pageY)
            };
            this.setState({...this.state, origin});
        }
        event.preventDefault();
    }

    render () {
        const onMeasure = (dimensions) => {
            const scaleWidth = dimensions.width / this.props.width;
            if (scaleWidth !== this.state.previousScaleWidth) {
                this.setState({
                    ...this.state,
                    height: this.props.height * scaleWidth,
                    scaleWidth,
                    previousScaleWidth: this.state.scaleWidth
                });
            }
        };
        const styleTranslate = {
            width: this.props.width + 'px',
            height: this.props.height + 'px',
            transform: 'translate(' + this.state.origin.x + 'px, ' + this.state.origin.y + 'px)'
        };
        const styleScale = {
            transform: 'scale(' + this.state.scaleWidth * this.state.scaleZoom + ')',
            position: 'absolute'
        };
        return (
            <Measure
                onMeasure={onMeasure}>
                <div id={this.state.id} style={{width: '100%', height: this.state.height + 'px', overflow: 'hidden'}}
                     onWheel={this.state.zoom ? this.handleWheel : null}
                     onMouseDown={this.state.zoom ? this.handleMouseDown : null}
                     onMouseUp={this.state.zoom ? this.handleMouseUp : null}
                     onMouseMove={this.state.zoom ? this.handleMouseMove : null}>
                    <div style={styleTranslate}>
                        <div style={styleScale}>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </Measure>
        );
    }
}

ScaleToWidthAndZoom.defaultProps = {
    zoomStart: 1,
    zoomMin: 0.2,
    zoomMax: 5
};


export default ScaleToWidthAndZoom;
