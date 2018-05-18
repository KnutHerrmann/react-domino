import fetch from 'isomorphic-fetch';
import Strings from '../locale/Strings';

export const INIT_CONFIG = 'INIT_CONFIG';
export const UPDATE_SHOWS = 'UPDATE_SHOWS';
export const UPDATE_PERFORMANCES = 'UPDATE_PERFORMANCES';
export const UPDATE_STAGES = 'UPDATE_STAGES';
export const SEAT_CLICK = 'SEAT_CLICK';
export const BUY_TICKETS = 'BUY_TICKETS';

export const initConfig = (config) => ({type: INIT_CONFIG, config});

export const seatClick = (performanceId, seatId) =>
    ({type: SEAT_CLICK, performanceId, seatId});

const fetchData = (dataType, dataId, responseAction, payload) => {
    const body = payload ? JSON.stringify(payload) : '';
    return (dispatch, getState) => {
        const restDataUrl = getState().config.dataUrl;
        let params = {
            method: 'GET',
            headers: {
                'Accept-Language': Strings.getLanguage(),
                'Accept': 'application/json;charset=utf-8'
            }
        };
        if (payload) {
            params = {
                method: 'POST',
                headers: {
                    'Accept-Language': Strings.getLanguage(),
                    'Accept': 'application/json;charset=utf-8'
                },
                body
            };
        }
        return fetch(restDataUrl + dataType + (dataId ? '/' + dataId : ''), params)
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
            dispatch({type: responseAction, json, dataType, dataId});
            return json;
        })
        .catch(function (error) {
            console.error(error);
        });
    };
};

export const readShows = () => fetchData('shows', '', UPDATE_SHOWS);

export const readPerformances = () => fetchData('performances', '', UPDATE_PERFORMANCES);

export const readStages = () => fetchData('stages', '', UPDATE_STAGES);

export const buyTickets = (performanceId, selectedSeats) => fetchData('performances', performanceId, BUY_TICKETS, selectedSeats);

