import Immutable from "immutable";
import { Map, List } from "immutable";

import {
    GET_PREV_POSITION,
    UPDATE_WEATHER_LIST,
    UPDATE_USER_POSITION_FROM_SERVER,
    WELCOME_PAGE_LOADED,
    HANDLE_ERROR
} from '../../actions/homePageActions';

import appReducer from '../../reducers/homePageReducers'

describe('test appReducer', () => {
    let initialState = Immutable.fromJS({
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

    test('should return the initial state', () => {
        expect(appReducer(undefined, {})).toEqual(initialState)
    });

    test('should return the updated prevPosition state', () => {
        let payload = {a : 'a'};
        expect(appReducer(initialState, {type:GET_PREV_POSITION, payload: payload}))
            .toEqual(initialState.set('prevPosition', Immutable.fromJS(payload)))
    });

    test('should return the updated weather state', () => {
        let payload = [{a : 'a'}];
        expect(appReducer(initialState, {type:UPDATE_WEATHER_LIST, payload: payload}))
            .toEqual(initialState.set('weather', Immutable.fromJS(payload)))
    });

    test('should return the updated userPosition state', () => {
        let payload = {a : 'a'};
        expect(appReducer(initialState, {type:UPDATE_USER_POSITION_FROM_SERVER, payload: payload}))
            .toEqual(initialState.set('userPosition', Immutable.fromJS(payload)))
    });

    test('should return the updated isLoaded state', () => {
        expect(appReducer(initialState, {type:WELCOME_PAGE_LOADED}))
            .toEqual(initialState.set('isLoaded', true))
    });

    test('should return the updated error state', () => {
        expect(appReducer(initialState, {type:HANDLE_ERROR, payload: 'error'}))
            .toEqual(initialState.set('error', 'error'))
    });
});