import React, {PureComponent} from 'react';
import './MapLabel.css';
import Position from '../utils/Position';
import Strings from '../locale/Strings';

class MapLabel extends PureComponent {
    render() {
        const {left, top, rotate, label, row, html} = this.props;
        let content = '';
        if (label) {
            content = <div className="map-label">
                {Strings[label] || label}
            </div>;
        } else if (row) {
            content = <div className="map-label-row">
                {row}
            </div>;
        } else if (html) {
            content = <div dangerouslySetInnerHTML={{__html: html}}/>;
        }
        return (
            <Position left={left}
                      top={top}
                      rotate={rotate}>
                {content}
            </Position>
        );
    }
}

export default MapLabel;
