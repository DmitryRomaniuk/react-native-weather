import React from 'react';
import CityWeather from '../CityWeather';
// import Enzyme from 'enzyme';
// import { shallow, mount, render } from 'enzyme';
// import sinon from 'sinon';
// import Adapter from 'enzyme-adapter-react-16';
// Enzyme.configure({ adapter: new Adapter() });

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

    // it('should call goBack', () => {
    //     let component = shallow(<CityWeather navigation={navigation}/>);
    //     const instance = component.instance();
    //     const handleClickSpy = sinon.spy(instance, 'goBack');
    //     component.find('button').simulate('click');
    //     expect(handleClickSpy.called).to.equal(true);
    // });
});