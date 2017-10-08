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
    StatusBar
} from "react-native";
import { Container, Header, Content, List, ListItem, Item, Icon, Input, Text } from 'native-base';


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
        fontSize: 24,
        width: width,
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
        fontSize: 24,
        fontWeight: "bold",
    }
});

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            coordinates: {
                latitude: "",
                longitude: "",
                accuracy: ""
            },
            error: "",
            weather: [
                {city: "Moskow", temp: "22", id: 1},
                {city: "Minsk", temp: "23", id: 2}
            ],
            isLoaded: false
        };
    }

    static navigationOptions = {
        header: null,
    };

    componentWillMount() {
        StatusBar.setHidden(true);
    }

    componentDidMount() {
        this.location();
        setTimeout(() => {
            const london = {city: "London", temp: "14", id: 3};
            const newState = [...this.state.weather, london];
            this.setState({weather: newState});
        }, 10000);
    }

    onPressItem = city => this.props.navigation.navigate('City', {city});

    location() {
        let options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        let success = pos => {
            const crd = pos.coords;
            console.log("Your current position is:");
            console.log(`Latitude : ${crd.latitude}`);
            console.log(`Longitude: ${crd.longitude}`);
            console.log(`More or less ${crd.accuracy} meters.`);
            this.setState({coordinates: crd});
        };

        let error = err => {
            console.warn(`ERROR(${err.code}): ${err.message}`);
            this.setState({error: `App can't get your position`});
        };

        navigator.geolocation.getCurrentPosition(success, error, options);
    }

    pageLoaded = () => {
        this.setState({isLoaded: true});
    };

    getFilteredCity = () => {
        return [...this.state.weather].filter(e => e.city.toLocaleLowerCase().includes(this.state.text.toLocaleLowerCase()))
    };

    render() {
        let page;
        if (this.state.isLoaded) {
            page = (
                <Container style={styles.container}>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Search" onChangeText={text => this.setState({text})}/>
                    </Item>
                    <Text style={styles.simpleText}>Location: {this.state.text}</Text>
                    <Text style={styles.simpleText}>
                        Coordinates: latitude {this.state.coordinates.latitude}
                    </Text>
                    <Text style={styles.simpleText}>
                        Coordinates: longitude {this.state.coordinates.longitude}
                    </Text>
                    <Text style={styles.simpleText}>
                        Coordinates: accuracy {this.state.coordinates.accuracy}
                    </Text>
                    {this.state.error ? (
                        <Text style={styles.simpleText}>Error {this.state.error}</Text>
                    ) : null}
                    <List
                        dataArray={this.getFilteredCity()}
                        renderRow={(item) => (
                            <ListItem>
                            <Text
                                style={styles.simpleText}
                                keyExtractor={item.id + item.city}
                                id={item.id}
                                onPress={() => this.onPressItem(item)}
                            >{item.city} {item.temp}</Text>
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
                    onLoadEnd={this.pageLoaded}
                />
            );
        }
        return page;
    }
}

export default HomeScreen;