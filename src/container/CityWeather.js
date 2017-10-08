import React, {Component} from "react";
import {
    StyleSheet,
    View,
    Dimensions,
    StatusBar
} from "react-native";
import {
    Container,
    Content,
    Header,
    Grid,
    Col,
    Row,
    Title,
    Body,
    Item,
    Left,
    Right,
    Input,
    Icon,
    Button,
    Text
} from 'native-base';

let {width} = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: 40,
        alignItems: "center",
        justifyContent: "flex-start"
    },
    firstColumn: {
        alignItems: 'flex-start',
        justifyContent: "flex-start",
        width: 0.4 * width,
    },
    secondColumn: {
        alignItems: 'center',
        justifyContent: "center",
    },
    textColumn: {
        fontSize: 24,
    },
});

export default class CityWeather extends Component {
    constructor(props) {
        super(props);
        this.weather = this.props.navigation.state.params.city;
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
                    <Title>Weather {this.props.navigation.state.params.city.name}</Title>
                    </Body>
                </Header>
                <Content>
                    <Grid>
                        <Row>
                            <Col style={styles.firstColumn}>
                                <Text style={styles.textColumn}>Country</Text>
                            </Col>
                            <Col style={styles.secondColumn}>
                                <Text style={styles.textColumn}>{this.weather.sys.country}</Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={styles.firstColumn}>
                                <Text style={styles.textColumn}>City</Text>
                            </Col>
                            <Col style={styles.secondColumn}>
                                <Text style={styles.textColumn}>{this.weather.name}</Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={styles.firstColumn}>
                                <Text style={styles.textColumn}>{this.weather.weather[0].main}</Text>
                            </Col>
                            <Col style={styles.secondColumn}>
                                <Text style={styles.textColumn}>{this.weather.weather[0].description}</Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={styles.firstColumn}>
                                <Text style={styles.textColumn}>Temperature</Text>
                            </Col>
                            <Col style={styles.secondColumn}>
                                <Text
                                    style={styles.textColumn}>{(this.weather.main.temp > 150) ? this.weather.main.temp - 273.15 : this.weather.main.temp} &#x2103;</Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={styles.firstColumn}>
                                <Text style={styles.textColumn}>Pressure</Text>
                            </Col>
                            <Col style={styles.secondColumn}>
                                <Text
                                    style={styles.textColumn}>{Math.round(this.weather.main.pressure * 100 * 760 / 101325)}
                                    mmHg</Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={styles.firstColumn}>
                                <Text style={styles.textColumn}>Wind</Text>
                            </Col>
                            <Col style={styles.secondColumn}>
                                <Text style={styles.textColumn}>{this.weather.wind.speed} m/s</Text>
                            </Col>
                        </Row>
                    </Grid>
                </Content>
            </Container>
        );
    }
}