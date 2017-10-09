import {
    GET_PREV_POSITION,
    UPDATE_WEATHER_LIST,
    UPDATE_USER_POSITION_FROM_SERVER,
    WELCOME_PAGE_LOADED,
    SET_COORDINATES,
} from '../actions/homePageActions';


let initialState = Object.assign({
    text: "",
    coordinates: {
        latitude: "",
        longitude: "",
        accuracy: ""
    },
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
            return Object.assign({}, state, {'prevPosition': action.payload});
        case WELCOME_PAGE_LOADED:
            return Object.assign({}, state, {'isLoaded': true});
        case UPDATE_USER_POSITION_FROM_SERVER:
            return Object.assign({}, state, {'userPosition': action.payload});
        case UPDATE_WEATHER_LIST:
            return Object.assign({}, state, {'weather': action.payload});
        default:
            return state;
    }
};

export default appReducer;