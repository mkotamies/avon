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
    backgroundColor:'black'
  },
  textS:{
    textAlign: 'center',
    color: 'white'
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

class TestClass extends Component {

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
      /*InteractionManager.setDeadline(2)
      InteractionManager.runAfterInteractions(() => {
        navigator.geolocation.getCurrentPosition(position => {
          this.setState({position})
        })
      });*/
      navigator.geolocation.watchPosition(position => {
        this.setState({position}), this.checkIfCamera()}, Alert.alert("Ei vielä yhteyttä", "Paina OK ja kokeile uudestaan"),{enableHighAccuracy: true, timeout: 0, maximumAge: 1000})
    }

    //play warning sound when distance to camera is less than 10m
    //currently distance here is only for testing
    checkIfCamera(){
      if(this.calcCrow() > 200){
        warning.play()
      }
    }
    //calculates crow distance
    calcCrow()
    {
      var R = 6371; // km
      var dLat = this.toRad(62.0-this.state.position.coords.latitude);
      var dLon = this.toRad(24.0-this.state.position.coords.longitude);
      var lat1 = this.toRad(this.state.position.coords.latitude);
      var lat2 = this.toRad(62.0);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;
      return d;
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
      let a
      let b
      let c
      const list = [60.2,62]

      if(this.state.position &&
        list
        .map(next => this.state.position.coords.latitude <= next)
        .reduce(this.checkIfAnyTrue)){
        a = this.state.position.coords.latitude
        b = this.state.position.coords.longitude
        c = this.calcCrow()
      }
      else{
        a = "Sijainti ei saatavilla"
        b = "Sijainti ei saatavilla"
        c = "Etäisyys ei saatavilla"
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
          <Text style={styles.textS}>{a}</Text>
          <Text style={styles.textS}>{b}</Text>
          <Text style={styles.textS}>{c}</Text>
        {test}

      </View>
    )
    }

    checkIfAnyTrue(first, second) {
      return first || second
    }
  }

  AppRegistry.registerComponent('Avon', () => TestClass);
