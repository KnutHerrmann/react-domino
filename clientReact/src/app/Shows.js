import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Link, Route} from 'react-router-dom';
import {Grid, Row, Col} from 'react-bootstrap';
import Show from './Show';
import Strings from '../locale/Strings';

class Shows extends PureComponent {
    render() {
        const {match} = this.props;
        const {shows, showsSorted} = this.props.theater;
        return (
            <div className="home">
                <h2>{Strings.listOfShows}</h2>
                <Grid fluid={true}>
                    <Row>
                        <Col xs={12} md={2}>
                            <br/>
                            {showsSorted.map(showId => {
                                const show = shows[showId];
                                return (
                                    <div key={showId}>
                                        <Link to={`${match.url}/` + showId}>
                                            <h3>{show.title}</h3>
                                        </Link>
                                    </div>
                                );
                            })}
                        </Col>
                        <Col xs={12} md={10}>
                            <Route path={`${match.url}/:showId`} component={Show}/>
                            <Route exact path={match.url} render={() => <p></p>}/>
                        </Col>
                    </Row>
                </Grid>
            </div>

        );
    }
}

const mapStateToProps = state => ({
    theater: state.theater
});

export default connect(
    mapStateToProps
)(Shows);