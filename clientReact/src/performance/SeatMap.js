import React, {Component} from 'react';
import './SeatMap.css';
import ScaleToWidthAndZoom from '../utils/ScaleToWidthAndZoom';
import Seat from './Seat';
import MapLabel from './MapLabel';
import Spinner from '../utils/Spinner';
import PropTypes from "prop-types";

class SeatMap extends Component {
    componentWillMount() {
        this.setState({showSeats: false});
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({showSeats: true});
        }, 100);
    }

    render() {
        const {performance, stage, selectedSeats, seatClick} = this.props;
        const {availableSeats, prices} = performance;
        const {width, height, zoomStart, zoomMin, zoomMax, seats, rows, labels, htmls} = stage;
        return (
            <div className="seat-map">
                {this.state.showSeats ? '' : <Spinner/>}
                <ScaleToWidthAndZoom
                    width={width}
                    height={height}
                    zoomStart={zoomStart}
                    zoomMin={zoomMin}
                    zoomMax={zoomMax}>
                    {htmls.map((html, index) => (
                        <MapLabel key={index}
                                  left={html[0]}
                                  top={html[1]}
                                  rotate={html[2]}
                                  html={html[3]}/>
                    ))}
                    {labels.map((label, index) => (
                        <MapLabel key={index}
                                  left={label[0]}
                                  top={label[1]}
                                  rotate={label[2]}
                                  label={label[3]}/>
                    ))}
                    {this.state.showSeats ? rows.map((row, index) => (
                            <MapLabel key={index}
                                      left={row[0]}
                                      top={row[1]}
                                      rotate={row[2]}
                                      row={row[3]}/>
                        )
                    ) : ''
                    }
                    {this.state.showSeats ? seats.map(seat => {
                            const seatId = seat[3];
                            const category = availableSeats[seatId] || 0;
                            const price = prices[category];
                            return (
                                <Seat key={seatId}
                                      left={seat[0]}
                                      top={seat[1]}
                                      rotate={seat[2]}
                                      performanceId={performance.id}
                                      seatId={seatId}
                                      category={category}
                                      price={price}
                                      selected={selectedSeats.indexOf(seatId) >= 0}
                                      seatClick={seatClick}/>
                            );
                        }
                    ) : ''
                    }
                </ScaleToWidthAndZoom>

            </div>
        );
    }
}

SeatMap.propTypes = {
    performance: PropTypes.object.isRequired,
    stage: PropTypes.object.isRequired,
    selectedSeats: PropTypes.array.isRequired,
    seatClick: PropTypes.func.isRequired
};

export default SeatMap;
