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
            text: "",
            coordinates: {
                latitude: "",
                longitude: "",
                accuracy: ""
            },
            error: "",
            weather: [
                {name: "Moskow", id: 524901, main: {}},
                {name: "London", id: 2643743, main: {}},
                {name: "Paris", id: 2988507, main: {}},
                {name: "New York", id: 5128581, main: {}},
                {name: "Berlin", id: 2950159, main: {}},
                {name: "Roma", id: 3169070, main: {}},
                {name: "Beijing", id: 1816670, main: {}},
                {name: "Minsk", id: 625144, main: {}},
                {name: "Sydney", id: 2147714, main: {}},
            ],
            userPosition: {},
            prevPosition: {},
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
        AsyncStorage.getItem('@PositionStore:position').then(res => {
            if (res !== null) {
                try {
                    this.setState({prevPosition: JSON.parse(res)});
                } catch (error) {
                    console.warn(`error JSON parse from AsyncStorage ${error}`);
                }
            }
        });
        Promise.all([this.location(), this.getWeatherCities()])
            .then(() => {
                let lat = this.state.userPosition.coord.lat;
                let lon = this.state.userPosition.coord.lon;
                let cityNearUser;
                this.state.weather.reduce((acc, city, i) => {
                    let newAcc = Math.sqrt((city.coord.lat - lat) ** 2 + (city.coord.lon - lon) ** 2);
                    if (newAcc < acc) {
                        cityNearUser = i;
                        return newAcc
                    }
                    return acc;
                }, 1000);
                let newArr = [...this.state.weather];
                newArr.splice(cityNearUser, 1);
                newArr.unshift(this.state.weather[cityNearUser]);
                let newStateWeather = [...newArr];
                this.setState({weather: newStateWeather})
            })
    }

    onPressItem = city => this.props.navigation.navigate('City', {city});

    onPressCurrentPosition = () => {
        this.props.navigation.navigate('City', {city: this.state.userPosition});
    };

    getWeatherCities = () => {
        const listFromState = this.state.weather.map(city => city.id).join(',');
        const url = `http://api.openweathermap.org/data/2.5/group?id=${listFromState}&units=metric&appid=5fa0a1e7c0a14457e91deec1377620b6`;
        return fetch(url)
            .then(res => res.json())
            .then(res => {
                this.setState({weather: res.list});
            })
            .catch(e => console.error(e));
    };

    location = () => {
        let options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        let success = resolve => pos => {
            const crd = pos.coords;
            console.log("Your current position is:");
            console.log(`Latitude : ${crd.latitude}`);
            console.log(`Longitude: ${crd.longitude}`);
            console.log(`More or less ${crd.accuracy} meters.`);
            this.setState({coordinates: crd});
            const url = `http://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&appid=5fa0a1e7c0a14457e91deec1377620b6`;
            return fetch(url)
                .then(res => res.json())
                .then(res => {
                    this.setState({userPosition: res});
                    return AsyncStorage.setItem('@PositionStore:position', JSON.stringify(res));
                })
                .then(() => {
                    resolve();
                })
                .catch(e => console.error(e));
        };

        let error = reject => err => {
            console.warn(`ERROR(${err.code}): ${err.message}`);
            this.setState({error: `App can't get your position`});
            reject(`ERROR(${err.code}): ${err.message}`);
        };

        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(success(resolve), error(reject), options);
        })
    };

    pageLoaded = () => {
        this.setState({isLoaded: true});
    };

    getFilteredCity = () => {
        return [...this.state.weather].filter(e => {
            return (this.state.text) ? e.name.toLocaleLowerCase().includes(this.state.text.toLocaleLowerCase()) : true;
        })
    };

    render() {
        let page;
        if (this.state.isLoaded) {
            page = (
                <Container style={styles.container}>
                    <Item>
                        <Icon name="ios-search"/>
                        <Input placeholder="Sort by name" onChangeText={text => this.setState({text})}/>
                    </Item>
                    <Text style={styles.simpleText} onPress={this.onPressCurrentPosition}>Maybe your location
                        is: {this.state.userPosition.name}</Text>
                    <Text style={styles.simpleText} onPress={this.onPressCurrentPosition}>Your previous position
                        was: {(this.state.prevPosition.name) ? this.state.prevPosition.name : ''}</Text>
                    {this.state.error ? (
                        <Text style={styles.simpleText}>Error position {this.state.error}</Text>
                    ) : null}
                    <Text style={styles.simpleText}>
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
                    onLoadEnd={this.pageLoaded}
                />
            );
        }
        return page;
    }
}

export default HomeScreen;