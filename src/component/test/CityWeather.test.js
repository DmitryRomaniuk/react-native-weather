import React from 'react';
import CityWeather from '../CityWeather';
import renderer from 'react-test-renderer';

describe('Test CityWeather component', () => {
    let navigation;

    beforeEach(() => {
        navigation = {
            state: {
                params: {
                    city: {
                        name: '',
                        sys: {country: ''},
                        weather: [{main: '', description: ''}],
                        main: {temp: 286.15, pressure: 101325},
                        wind: {speed: ''},
                    }
                }
            }
        };
    });

    test('renders without crashing', () => {
        const rendered = renderer.create(<CityWeather navigation={navigation}/>).toJSON();
        expect(rendered).toBeTruthy();
    });

    test('renders correctly', () => {
        const tree = renderer.create(
            <CityWeather navigation={navigation}/>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});