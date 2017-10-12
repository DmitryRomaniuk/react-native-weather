import React from 'react';
import { BackHandler } from "react-native";
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
import { addNavigationHelpers, NavigationActions, StackNavigator } from 'react-navigation';

import applicationReducer from './src/reducers/homePageReducers'

import Home from "./src/container/HomeScreen";
import CityWeather from "./src/component/CityWeather";

const AppNavigator = StackNavigator({
    Home: { screen: Home },
    City: { screen: CityWeather },
});

const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('Home'));

const navReducer = (state = initialState, action) => {
    const nextState = AppNavigator.router.getStateForAction(action, state);
    return nextState || state;
};
const appReducer = combineReducers({
    nav: navReducer,
    app: applicationReducer,
});

const store = createStore(
    appReducer,
    compose(applyMiddleware(thunk))
);

class App extends React.Component {

    async componentWillMount() {
        await Expo.Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
            'Ionicons': require('@expo/vector-icons/fonts/Ionicons.ttf'),
        });
    }

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    onBackPress = () => {
        const { dispatch, nav } = this.props;
        if (nav.index === 0) {
            return false;
        }
        dispatch(NavigationActions.back());
        return true;
    };

    render() {
        const { dispatch, nav } = this.props;
        const navigation = addNavigationHelpers({
          dispatch,
          state: nav
        });
    
        return <AppNavigator navigation={navigation} />;
    }
}

const mapStateToProps = (state) => ({
    nav: state.nav
});

const AppWithNavigationState = connect(mapStateToProps)(App);

export default class Root extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <AppWithNavigationState />
            </Provider>
        );
    }
}