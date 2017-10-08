import React, {Component} from "react";
import {
    StyleSheet,
    View,
    StatusBar
} from "react-native";
import {Container, Content, Header, Title, Body, Item, Left, Input, Icon, Button, Text} from 'native-base';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: 40,
        alignItems: "center",
        justifyContent: "flex-start"
    },
    simpleText: {
        fontSize: 24
    },
});

export default class CityWeather extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
        };
    }

    static navigationOptions = {
        header: null,
    };

    componentWillMount() {
        StatusBar.setHidden(true);
    }

    componentDidMount() {
        this.getWeatherInfo();
    }

    getWeatherInfo = () => {

    };

    goBack = () => {
        this.props.navigation.goBack();
    };

    render() {
        return (
            <Container>
                <Header searchBar rounded>
                    <Left>
                        <Button transparent onPress={this.goBack}>
                            <Icon name='arrow-back'/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>Weather {this.props.navigation.state.params.city.city}</Title>
                    </Body>
                </Header>
                <Content>
                    <Text>{JSON.stringify(this.props)}</Text>
                </Content>
            </Container>
        );
    }
}