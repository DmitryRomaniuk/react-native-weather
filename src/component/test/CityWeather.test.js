import React from 'react';
import CityWeather from '../CityWeather';
import renderer from 'react-test-renderer';
import { flatMap } from 'lodash';

const query = (node, match) => {
    let result = [];
    let notProcessed = [node];

    while (notProcessed.length) {
        result = [...result, ...notProcessed.filter(match)];
        notProcessed = flatMap(notProcessed, ({children}) => children || []);
    }

    return result;
};

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
            },
            goBack: () => 'go back'
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
        
    test('renders correctly', () => {
        const tree = renderer.create(
            <CityWeather navigation={navigation}/>
        ).toJSON();
        const listText = query(tree, ({type, props}) => type === 'Text' && !!props.onPress);
        expect(listText[0].props.onPress()).toEqual('go back');
    });
});