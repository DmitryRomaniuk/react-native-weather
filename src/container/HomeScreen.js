import React, {Component} from "react";
import {
    StyleSheet,
    TextInput,
    View,
    FlatList,
    SectionList,
    Dimensions,
    WebView,
    AppRegistry,
    AsyncStorage,
    StatusBar
} from "react-native";
import { connect } from 'react-redux';
import {
    Container,
    Header,
    Content,
    Grid,
    Row,
    Col,
    List,
    Body,
    Left,
    Right,
    ListItem,
    Item,
    Icon,
    Input,
    Text
} from 'native-base';
import {
    welcomePageLoaded,
    getPrevPosition,
    getLocation,
    getWeatherCities,
    positionAndWeatherList
} from "../actions/homePageActions";


let {width} = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: 40,
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: 'white',
    },
    textInput: {
        height: 40,
        width: width,
        padding: 10,
        fontSize: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    simpleText: {
        fontSize: 20,
        paddingLeft: 25,
        paddingRight: 20,
        width: width,
        color: 'white',
        backgroundColor: '#62b1f5',
    },
    headerList: {
        fontSize: 20,
        paddingLeft: 25,
        paddingRight: 20,
        width: width,
        color: 'white',
        backgroundColor: '#037aff'
    },
    locationUserText: {
        fontSize: 20,
        paddingLeft: 25,
        paddingRight: 20,
        width: width,
        color: 'white',
        backgroundColor: '#5cb75d',
    },
    item: {
        padding: 10,
        fontSize: 28,
        height: 44,
        width: width
    },
    sectionHeader: {
        width: width,
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 20,
        fontWeight: "bold",
    },
    listItem: {
        width: 0.9 * width,
        justifyContent: 'space-between',
    },
    firstItemBody: {
        fontSize: 20,
    },
    secondItemBody: {
        fontSize: 20,
    },
});

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        };
    }

    static navigationOptions = {
        header: null,
    };

    componentWillMount() {
        StatusBar.setHidden(true);
    }

    componentDidMount() {
        this.props.getPrevPosition();
        const listCitiesIdFromState = this.props.weather.map(city => city.get('id')).join(',');
        Promise.all([this.props.getLocation(), this.props.getWeatherCities(listFromState)])
            .then(result => this.props.positionAndWeatherList(result))
    }

    onPressItem = city => this.props.navigation.navigate('City', {city});

    onPressCurrentPosition = () => {
        this.props.navigation.navigate('City', {city: this.props.userPosition});
    };

    getFilteredCity = () => {
        return this.props.weather.filter(e => {
            return (this.state.text) ? e.get('name').toLocaleLowerCase().includes(this.state.text.toLocaleLowerCase()) : true;
        }).toJS();
    };

    render() {
        let page;
        if (this.props.isLoaded) {
            page = (
                <Container style={styles.container}>
                    <Item>
                        <Icon name="ios-search"/>
                        <Input placeholder="Sort by name" onChangeText={text => this.setState({text})}/>
                    </Item>
                    <Text style={styles.locationUserText} onPress={this.onPressCurrentPosition}>If your location
                        is: {this.props.userPosition.get('name')}? Click here!</Text>
                    <Text style={styles.simpleText} onPress={this.onPressCurrentPosition}>Your previous position
                        was: {(this.props.prevPosition.get('name')) ? this.props.prevPosition.get('name') : ''}</Text>
                    {this.props.error ? (
                        <Text style={styles.simpleText}>Error position {this.props.error}</Text>
                    ) : null}
                    <Text style={styles.headerList}>
                        First on the list is the city closest to you:
                    </Text>
                    <List
                        dataArray={this.getFilteredCity()}
                        renderRow={(item) => (
                            <ListItem style={styles.listItem}
                                      keyExtractor={item.id + item.name}
                                      id={item.id}
                                      onPress={() => this.onPressItem(item)}>
                                <Text style={styles.firstItemBody}>{item.name}</Text>
                                <Text
                                    style={styles.secondItemBody}>{(item.main.temp) ? Math.round(item.main.temp) : ''} &#x2103;</Text>
                            </ListItem>
                        )}
                    />
                </Container>
            );
        } else {
            page = (
                <WebView
                    source={{
                        uri:
                            "https://www.ethode.com/contentAsset/raw-data/84e3be24-58bc-499c-9d50-f8088158f11a/image"
                    }}
                    style={{marginTop: 20, backgroundColor: "#222222"}}
                    onLoadEnd={this.props.welcomePageLoaded}
                />
            );
        }
        return page;
    }
}

const mapStateToProps = state => {  return {
    weather: state.app.get('weather'),
    error: state.app.get('error'),
    userPosition: state.app.get('userPosition'),
    prevPosition: state.app.get('prevPosition'),
    isLoaded: state.app.get('isLoaded'),
}};

export default connect(mapStateToProps, { welcomePageLoaded, getLocation, getWeatherCities, getPrevPosition, positionAndWeatherList })(HomeScreen);