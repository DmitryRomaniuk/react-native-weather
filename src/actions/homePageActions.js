import { createAction } from 'redux-actions';
import { AsyncStorage } from "react-native";

export const GET_PREV_POSITION = 'GET_PREV_POSITION';
export const WELCOME_PAGE_LOADED = 'WELCOME_PAGE_LOADED';
export const UPDATE_WEATHER_LIST = 'UPDATE_WEATHER_LIST';
export const UPDATE_USER_POSITION_FROM_SERVER = 'UPDATE_USER_POSITION_FROM_SERVER';
export const HANDLE_ERROR = 'HANDLE_ERROR';

export const welcomePageLoaded = createAction(WELCOME_PAGE_LOADED);
export const updateWeatherList = createAction(UPDATE_WEATHER_LIST);
export const updateUserPositionFromServer = createAction(UPDATE_USER_POSITION_FROM_SERVER);
export const handleError = createAction(HANDLE_ERROR);

export const getPrevPosition = () => (dispatch) => {
    return AsyncStorage.getItem('@PositionStore:position').then(res => {
        return dispatch(createAction(GET_PREV_POSITION)(JSON.parse(res)));
    });
};

export const getLocation = () => (dispatch) => {
    let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    let success = resolve => pos => {
        const crd = pos.coords;
        console.log(`Your current position is:\nLatitude : ${crd.latitude}\nLongitude : ${crd.longitude}\nMore or less ${crd.accuracy} meters.`);
        const url = `http://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&appid=5fa0a1e7c0a14457e91deec1377620b6`;
        return fetch(url)
            .then(res => res.json())
            .then(res => {
                dispatch(updateUserPositionFromServer(res));
                return AsyncStorage.setItem('@PositionStore:position', JSON.stringify(res))
                    .then(() => {return resolve(res)});
            });
    };

    let error = reject => err => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        dispatch(handleError(`App can't get your position`));
        reject(`ERROR(${err.code}): ${err.message}`);
    };

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(success(resolve), error(reject), options);
    })
};

export const getWeatherCities = (listFromState) => (dispatch) => {
        const url = `http://api.openweathermap.org/data/2.5/group?id=${listFromState}&units=metric&appid=5fa0a1e7c0a14457e91deec1377620b6`;
        return fetch(url)
            .then(res => res.json())
            .then(res => {
                dispatch(updateWeatherList(res.list));
                return res.list;
            });
    };

export const positionAndWeatherList = (result) => (dispatch) => {
            let lat = result[0].coord.lat;
            let lon = result[0].coord.lon;
            let cityNearUser;
            result[1].reduce((acc, city, i) => {
                let newAcc = Math.sqrt((city.coord.lat - lat) ** 2 + (city.coord.lon - lon) ** 2);
                if (newAcc < acc) {
                    cityNearUser = i;
                    return newAcc
                }
                return acc;
            }, 1000);
            let newStateWeather = [...result[1]];
            newStateWeather.splice(cityNearUser, 1);
            newStateWeather.unshift(result[1][cityNearUser]);
            dispatch(updateWeatherList([...newStateWeather]));
};
