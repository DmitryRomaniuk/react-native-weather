import Immutable from "immutable";
import { Map, List } from "immutable";

import {
    GET_PREV_POSITION,
    UPDATE_WEATHER_LIST,
    UPDATE_USER_POSITION_FROM_SERVER,
    WELCOME_PAGE_LOADED,
    HANDLE_ERROR
} from '../actions/homePageActions';


let initialState = Immutable.fromJS({
    text: "",
    error: "",
    weather: [
        {name: "Moskow", id: 524901, main: {}},
        {name: "London", id: 2643743, main: {}},
        {name: "Paris", id: 2988507, main: {}},
        {name: "New York", id: 5128581, main: {}},
        {name: "Berlin", id: 2950159, main: {}},
        {name: "Roma", id: 3169070, main: {}},
        {name: "Beijing", id: 1816670, main: {}},
        {name: "Minsk", id: 625144, main: {}},
        {name: "Sydney", id: 2147714, main: {}},
    ],
    userPosition: {},
    prevPosition: {},
    isLoaded: false
});

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PREV_POSITION:
            return state.set('prevPosition', Immutable.fromJS(action.payload));
        case WELCOME_PAGE_LOADED:
            return state.set('isLoaded', true);
        case UPDATE_USER_POSITION_FROM_SERVER:
            return state.set('userPosition', Immutable.fromJS(action.payload));
        case HANDLE_ERROR:
            return state.set('error', action.payload);
        case UPDATE_WEATHER_LIST:
            return state.set('weather', Immutable.fromJS(action.payload));
        default:
            return state;
    }
};

export default appReducer;