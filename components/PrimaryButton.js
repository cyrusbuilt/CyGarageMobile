import React, {Component} from 'react';
import {Text, Platform, TouchableOpacity, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  touchable: {
    backgroundColor: "#6D9C4D",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10
  },
  buttonText: {
    color: 'white',
    fontFamily: Platform.OS == 'android' ? 'normal' : 'Arial',
    fontWeight: 'bold'
  }
});

export default class PrimaryButton extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={styles.touchable}>
        <Text style={styles.buttonText}>{this.props.title}</Text>
      </TouchableOpacity>
    );
  }
}