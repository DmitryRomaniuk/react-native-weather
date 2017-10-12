import {createAction} from 'redux-actions';
import {AsyncStorage as storage} from 'react-native';
import MockAsyncStorage from 'mock-async-storage';
import * as actions from '../homePageActions';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock'

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('test appReducer', () => {
    afterEach(() => {
        fetchMock.restore();
        storage.clear().then(() => jest.unmock('AsyncStorage'));
        global.navigator.geolocation = {
            getCurrentPosition: jest.unmock(),
            watchPosition: jest.unmock()
        };
    });

    test('getWeatherCities action', () => {
        const mockData = [{
            name: "Moskow",
            id: 524901,
            main: {temp: 300.15, pressure: 1007, humidity: 74, temp_min: 300.15, temp_max: 300.15},
        },];
        fetchMock.get(`http://api.openweathermap.org/data/2.5/group?id=878&units=metric&appid=5fa0a1e7c0a14457e91deec1377620b6`,
            JSON.stringify(mockData));
        const store = mockStore();
        return store.dispatch(actions.getWeatherCities(878))
            .then(() => {
                expect(store.getActions()).toEqual([
                    {type: actions.UPDATE_WEATHER_LIST},
                ])
            })
    });

    test('getPrevPosition action successfully', () => {
        const mock = () => {
            const mockImpl = new MockAsyncStorage();
            jest.mock('AsyncStorage', () => mockImpl);
        };
        mock();
        const store = mockStore();
        return storage.setItem('@PositionStore:position', JSON.stringify({pos: 'pos'}))
            .then(() => {
                return store.dispatch(actions.getPrevPosition());
            })
            .then(value => {
                expect(value).toEqual({type: actions.GET_PREV_POSITION, "payload": {"pos": "pos"}})
            })
    });

    test('getLocation action success', () => {
        const mockData = [{
            name: "Moskow",
            id: 524901,
            main: {temp: 300.15, pressure: 1007, humidity: 74, temp_min: 300.15, temp_max: 300.15},
        },];
        const url = `http://api.openweathermap.org/data/2.5/weather?lat=10&lon=10&appid=5fa0a1e7c0a14457e91deec1377620b6`;
        fetchMock.get(url, {serverMessage: mockData});
        global.navigator.geolocation = {
            getCurrentPosition: jest.fn((success, error, options) => success({
                coords: {
                    latitude: 10,
                    longitude: 10,
                    accuracy: 10
                }
            })),
            watchPosition: jest.fn()
        };
        const store = mockStore();
        const mock = () => {
            const mockImpl = new MockAsyncStorage();
            jest.mock('AsyncStorage', () => mockImpl);
        };
        mock();
        return store.dispatch(actions.getLocation())
            .then(() => {
                expect(store.getActions()).toEqual([{
                    "payload": {
                        "serverMessage": [{
                            "id": 524901,
                            "main": {
                                "humidity": 74,
                                "pressure": 1007,
                                "temp": 300.15,
                                "temp_max": 300.15,
                                "temp_min": 300.15
                            },
                            "name": "Moskow"
                        }]
                    }, "type": actions.UPDATE_USER_POSITION_FROM_SERVER
                }])
            })
    });

    test('getLocation action error', () => {
        const mockData = [{
            name: "Moskow",
            id: 524901,
            main: {temp: 300.15, pressure: 1007, humidity: 74, temp_min: 300.15, temp_max: 300.15},
        },];
        const url = `http://api.openweathermap.org/data/2.5/weather?lat=10&lon=10&appid=5fa0a1e7c0a14457e91deec1377620b6`;
        fetchMock.get(url, {serverMessage: mockData});
        global.navigator.geolocation = {
            getCurrentPosition: jest.fn((success, error, options) => error({
                code: 999,
                message: 'error from test'
            })),
            watchPosition: jest.fn()
        };
        const store = mockStore();
        const mock = () => {
            const mockImpl = new MockAsyncStorage();
            jest.mock('AsyncStorage', () => mockImpl);
        };
        mock();
        return store.dispatch(actions.getLocation())
            .catch(() => {
                expect(store.getActions()).toEqual([{"payload": "App can't get your position", "type": "HANDLE_ERROR"}])
            })
    });

    test('positionAndWeatherList action', () => {
        const store = mockStore();
        store.dispatch(actions.positionAndWeatherList([{coord: {lat: 10, lon: 10}}, [{
            coord: {
                lat: 30,
                lon: 30
            }
        }, {
            coord: {
                lat: 40,
                lon: 40
            }
        }, {coord: {lat: 20, lon: 20}}]]));
        expect(store.getActions()).toEqual([{
            "payload": [{"coord": {"lat": 20, "lon": 20,},}, {"coord": {"lat": 30, "lon": 30,},}, {
                "coord": {
                    "lat": 40,
                    "lon": 40,
                },
            }],
            "type": "UPDATE_WEATHER_LIST",
        },]);
    })
});
