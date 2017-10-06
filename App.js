import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    FlatList,
    SectionList,
    Dimensions
} from 'react-native';

export default class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          text: '',
          coordinates: {
            latitude: '',
            longitude: '',
            accuracy: '',
          },
          error: '',
          weather: [
            {city:'Moskow',temp:'22',id: 1},
            {city:'Minsk',temp:'23',id:2},
          ]
        };
    }

    componentDidMount() {
        this.location();
        setTimeout(()=> {
            const london = {city:'London', temp:'14',id: 3}
            const newState = [...this.state.weather,london]
            this.setState({weather: newState});
        },10000)
    }


    onPressItem = (text) => {
        this.setState({text});
    };

    location() {
        let options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          };
          
        let success = (pos) => {
            const crd = pos.coords;
            console.log('Your current position is:');
            console.log(`Latitude : ${crd.latitude}`);
            console.log(`Longitude: ${crd.longitude}`);
            console.log(`More or less ${crd.accuracy} meters.`);
            this.setState({coordinates: crd})
        };
        
        let error = (err) => {
            console.warn(`ERROR(${err.code}): ${err.message}`);
            this.setState({error: `App can't get your position`})
        };
        
        navigator.geolocation.getCurrentPosition(success, error, options);
    }

    render() {
        return ( <View style = {styles.container} >
                <TextInput
                    style={styles.textInput}
                    placeholder="Type here city"
                    onChangeText={(text) => this.setState({text})}
                />
                <Text style={styles.simpleText} >Location: {this.state.text}</Text>
                <Text style={styles.simpleText} >Coordinates: latitude {this.state.coordinates.latitude}</Text>
                <Text style={styles.simpleText} >Coordinates: longitude {this.state.coordinates.longitude}</Text>
                <Text style={styles.simpleText} >Coordinates: accuracy {this.state.coordinates.accuracy}</Text>
                {(this.state.error) ? <Text style={styles.simpleText} >Error {this.state.error}</Text> : null}
                <FlatList
                numColumns={1}
                data={[...this.state.weather]}
                renderItem={({item}) => (<Text style={styles.simpleText} keyExtractor={item.id} 
                    id={item.id} onPress={() => this.onPressItem(item.city)}>{item.city} {item.temp}</Text>)}
              />
            </View>
        );
    }
}

var {width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    textInput: {
        height: 40,
        width: width,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    simpleText: {
        fontSize: 24,
    },
    item: {
      padding: 10,
      fontSize: 28,
      height: 44,
      width: width,
    },
    sectionHeader: {
      width: width,
      paddingTop: 2,
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 2,
      fontSize: 24,
      fontWeight: 'bold',
      backgroundColor: 'rgba(247,247,247,1.0)',
    },
});