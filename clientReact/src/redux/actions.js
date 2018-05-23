import fetch from 'isomorphic-fetch';
import Strings from '../locale/Strings';

export const INIT_CONFIG = 'INIT_CONFIG';
export const UPDATE_SHOWS = 'UPDATE_SHOWS';
export const UPDATE_PERFORMANCES = 'UPDATE_PERFORMANCES';
export const UPDATE_STAGES = 'UPDATE_STAGES';
export const SEAT_CLICK = 'SEAT_CLICK';
export const BUY_TICKETS = 'BUY_TICKETS';
export const BUY_TICKETS_OPTIMISTIC = 'BUY_TICKETS_OPTIMISTIC';
export const SHOW_API_ERROR = 'SHOW_API_ERROR';

export const initConfig = (config) => ({type: INIT_CONFIG, config});

export const showApiError = (error) => ({type: SHOW_API_ERROR, error});

export const seatClick = (performanceId, seatId) =>
    ({type: SEAT_CLICK, performanceId, seatId});

const fetchData = (dataType, responseAction) => {
    return (dispatch, getState) => {
        const restDataUrl = getState().config.dataUrl;
        const params = {
            method: 'GET',
            headers: {
                'Accept-Language': Strings.getLanguage(),
                'Accept': 'application/json;charset=utf-8'
            }
        };
        return fetch(restDataUrl + dataType, params)
        .then(response => {
            if (response.ok) {
                if (response.status === 204) {
                    return; // empty response 204 -> No Content -> return nothing
                } else {
                    return response.json();
                }
            }
            throw Error(response.statusText);
        })
        .then(json => {
            dispatch({type: responseAction, json, dataType});
            return json;
        })
        .catch(function (error) {
            console.error(error);
            dispatch(showApiError(error.message + ': ' + dataType));
        });
    };
};

export const readShows = () => fetchData('shows', UPDATE_SHOWS);

export const readPerformances = () => fetchData('performances', UPDATE_PERFORMANCES);

export const readStages = () => fetchData('stages', UPDATE_STAGES);

export const buyTickets = (performanceId, selectedSeats) => {
    return (dispatch, getState) => {
        const restDataUrl = getState().config.dataUrl;
        const params = {
            method: 'POST',
            headers: {
                'Accept-Language': Strings.getLanguage(),
                'Accept': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(selectedSeats)
        };
        // optimistic update
        dispatch({type: BUY_TICKETS_OPTIMISTIC, performanceId, bookedSeats: selectedSeats});
        return fetch(restDataUrl + 'performances/' + performanceId, params)
        .then(response => {
            if (response.ok) {
                if (response.status === 204) {
                    return; // empty response 204 -> No Content -> return nothing
                } else {
                    return response.json();
                }
            }
            throw Error(response.statusText);
        })
        .then(json => {
            dispatch({type: BUY_TICKETS, performanceId, availableSeats: json});
            return json;
        })
        .catch(function (error) {
            console.log(error);
        });
    };
};
