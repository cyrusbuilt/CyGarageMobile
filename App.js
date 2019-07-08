
import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import Root from './screens/Root';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  }
});

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Root />
      </View>
    );
  }
}