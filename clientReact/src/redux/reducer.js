import {
    INIT_CONFIG,
    UPDATE_SHOWS,
    UPDATE_PERFORMANCES,
    UPDATE_STAGES,
    SEAT_CLICK,
    BUY_TICKETS,
    BUY_TICKETS_OPTIMISTIC,
    SHOW_API_ERROR
} from './actions';

const initialState = {
    config: {},
    theater: {
        performances: {},
        performancesSorted: [],
        shows: {},
        showsSorted: [],
        stages: {},
        stagesSorted: []
    },
    selectedSeats: {}
};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case INIT_CONFIG: {
            const {config} = action;
            return ({...state, config: {...state.config, ...config}});
        }
        case UPDATE_SHOWS: {
            const {json} = action;
            const shows = {};
            const showsSorted = json.map(show => {
                shows[show.id] = show;
                return show.id;
            });
            return ({...state, theater: {...state.theater, shows, showsSorted}});
        }
        case UPDATE_PERFORMANCES: {
            const {json} = action;
            const performances = {};
            const performancesSorted = json.map(performance => {
                performances[performance.id] = performance;
                return performance.id;
            });
            return ({...state, theater: {...state.theater, performances, performancesSorted}});
        }
        case UPDATE_STAGES: {
            const {json} = action;
            const stages = {};
            const stagesSorted = json.map(stage => {
                stages[stage.id] = stage;
                return stage.id;
            });
            return ({...state, theater: {...state.theater, stages, stagesSorted}});
        }
        case SEAT_CLICK: {
            const {performanceId, seatId} = action;
            const selectedSeatsPerformance = state.selectedSeats.hasOwnProperty(performanceId) ? [...state.selectedSeats[performanceId]] : [];
            if (selectedSeatsPerformance.indexOf(seatId) >= 0) {
                selectedSeatsPerformance.splice(selectedSeatsPerformance.indexOf(seatId), 1);
            } else {
                selectedSeatsPerformance.push(seatId);
            }
            const selectedSeats = {...state.selectedSeats};
            selectedSeats[performanceId] = selectedSeatsPerformance;
            return ({...state, selectedSeats});
        }

        case BUY_TICKETS: {
            const {performanceId, availableSeats} = action;
            const performances = {...state.theater.performances};
            performances[performanceId] = {...performances[performanceId], availableSeats};
            const selectedSeats = {...state.selectedSeats};
            selectedSeats[performanceId] = [];
            return ({...state, theater: {...state.theater, performances}, selectedSeats});
        }

        case BUY_TICKETS_OPTIMISTIC: {
            const {performanceId, bookedSeats} = action;
            const performances = {...state.theater.performances};
            const availableSeats = {...performances[performanceId].availableSeats};
            bookedSeats.map(seat => delete availableSeats[seat]);
            performances[performanceId] = {...performances[performanceId], availableSeats};
            const selectedSeats = {...state.selectedSeats};
            selectedSeats[performanceId] = [];
            return ({...state, theater: {...state.theater, performances}, selectedSeats});
        }

        case SHOW_API_ERROR: {
            const {error} = action;
            return ({...state, errors: [...state.errors || [], error]});
        }

        default:
            return state;
    }
}

export default reducer;