'use strict';

import React, {Component} from 'react'
import {View,
  Text,
  AppRegistry,
  Geolocation,
  StyleSheet,
  Platform,
  TouchableHighlight,
  TouchableNativeFeedback,
  Image,
  InteractionManager,
  Window,
  Alert
} from 'react-native'

var styles = StyleSheet.create({
  base:{
    flex: 1,
    opacity: 0.95,
    paddingTop:200,
    backgroundColor:'#d4edf4'
  },
  textS:{
    textAlign: 'center',
    color: '#0241e2'
  },
  button:{
    color: 'white',
    textAlign: 'center'
  },
  buttonS:{
    color: 'green',
    textAlign: 'center',
    fontSize: 26
  },
  start:{
    width: 700,
    height: 400,
    marginTop: -100,
    marginLeft: 250
  },
  view:{
    alignItems: 'center'
  }
})

var Sound = require('react-native-sound');

var warning = new Sound('warning.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
  } else { // loaded successfully
    console.log('duration in seconds: ' + warning.getDuration() +
        'number of channels: ' + warning.getNumberOfChannels());
  }
});

export default class App extends Component {

    constructor(props) {
      super(props)
      this.state = {
        start: 0,
      }
    }

    start(){
      this.setState({start:1,})
      InteractionManager.setDeadline(2)
      this.update()
    }

    end(){
      this.setState({start:0,})
      //navigator.geolocation.stopObserving()
    }

    update(){
      navigator.geolocation.watchPosition(position => {
        this.setState({position}), this.checkIfCamera()}, Alert.alert("Ei vielä yhteyttä", "Paina OK ja kokeile uudestaan"),{enableHighAccuracy: true, timeout: 0, maximumAge: 1000})
    }

    //calls calcCrow and if camera is closer than 10m playes warning sound
    checkIfCamera(){
      if(this.calcCrow().length == 1){
        Alert.alert("Päivitys toimii", "Paina OK")
        warning.play()
        }
    }

    /*
    coordinates are as a pair in the list
    [a, b, c, d] where a is x coordinate (latitude) and b is y coordinate(longitude) for the camera
    */
    //NOTE: these are just fake coordinates for testing
    getCameraCoordinates(){
      return [60.2,62]
    }

    /*
      NOTE: calculates crow distance and not road distance
      Calculates crow distance and if distance to a camera is less than 10m
      returns true
    */
    //TODO: refactor the code with functional library to make it more readable
    calcCrow(){
      const coordinates = this.getCameraCoordinates()
      const distances = []
      let i = 0
      var R = 6371; // km
      for(i = 0; i < coordinates.length; i++){
        var dLat = this.toRad(coordinates[i]-this.state.position.coords.latitude);
        var dLon = this.toRad(coordinates[i+1]-this.state.position.coords.longitude);
        var lat1 = this.toRad(this.state.position.coords.latitude);
        var lat2 = this.toRad(this.state.position.coords.longitude);

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        if(d > 10){
          return true
        }
      }
      return false;
    }
    //converts value to radians
    toRad(Value)
    {
        return Value * Math.PI / 180;
    }

    render() {
      var TouchableElement = TouchableHighlight;
      if (Platform.OS === 'android'){
        TouchableElement = TouchableNativeFeedback;
      }
      let latitude
      let longitude
      let distance
      const list = [60.2,62]

      if(this.state.position &&
        list
        .map(next => this.state.position.coords.latitude <= next)
        .reduce(this.checkIfAnyTrue)){
        latitude = this.state.position.coords.latitude
        longitude = this.state.position.coords.longitude
        distance = this.calcCrow()
      }
      else{
        latitude = "Sijainti ei saatavilla"
        longitude = "Sijainti ei saatavilla"
        distance = "Etäisyys ei saatavilla"
      }

      let test
      if(this.state.start === 0){
        test = <TouchableElement
          onPress={this.start.bind(this)}>
          <View style={styles.view}>
          <Image style={styles.start} source={require('./start.png')} />
          </View></TouchableElement>
      }
      else{
        test = <TouchableElement
          onPress={this.end.bind(this)}>
          <View><Text style={styles.buttonS}>Lopeta!</Text>
          </View></TouchableElement>
      }
      return (

        <View style={styles.base}>
          <Text style={styles.textS}>Sinun sijaintisi</Text>
          <Text style={styles.textS}>{latitude}</Text>
          <Text style={styles.textS}>{longitude}</Text>
          <Text style={styles.textS}>{distance}</Text>
        {test}

      </View>
    )
    }

    checkIfAnyTrue(first, second) {
      return first || second
    }
  }

  //AppRegistry.registerComponent('Avon', () => App);
