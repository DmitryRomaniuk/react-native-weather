import React from 'react';
import { StackNavigator } from "react-navigation";
import HomeScreen from "./src/container/HomeScreen";
import CityWeather from "./src/container/CityWeather";

const WrappedApp = StackNavigator({
    Home: { screen: HomeScreen },
    City: { screen: CityWeather },
});

export default class App extends React.Component {

    async componentWillMount() {
        await Expo.Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
            'Ionicons': require('@expo/vector-icons/fonts/Ionicons.ttf'),
        });
    }

    render() {
        return <WrappedApp />;
    }
}
