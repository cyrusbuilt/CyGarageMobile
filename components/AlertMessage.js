import React, {Component} from 'react';
import {Platform, Text, View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

const AlertStyles = StyleSheet.create({
    container: {
        height: 40,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: 'blue',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#ADD8E6',
        paddingLeft: 10,
        paddingRight: 10
    },
    messageText: {
        flex: 1,
        color: 'black',
        fontFamily: Platform.OS == 'android' ? 'normal' : 'Arial',
        fontSize: 18,
        fontWeight: 'bold',
        paddingLeft: 5,
        flexWrap: 'wrap'
    }
});

/**
 * A component for displaying an on-page alert message.
 * 
 * Example usage:
 * 
 * ```
 * import AlertMessage from '../components/AlertMessage';
 * ...
 * <AlertMessage message={"Hello World!"}/>
 * 
 * // Get rid of the rounded edges
 * <AlertMessage message={"Foo"} containerStyle={{borderRadius: 0}}/>
 * 
 * // Make the background color yellow and the text color red.
 * <AlertMessage message={"Bar"} containerStyle={{backgroundColor: 'yellow'}} textStyle={{color: 'red'}}/>
 * ```
 */
export default class AlertMessage extends Component {
    render() {
        const message = this.props.message;
        const containerStyle = [AlertStyles.container, this.props.containerStyle];
        const textStyle = [AlertStyles.messageText, this.props.textStyle];
        return (
            <View style={containerStyle}>
                <Text style={textStyle}>{message}</Text>
            </View>
        );
    }
}

AlertMessage.propTypes = {
    // The message text to display (Required).
    message: PropTypes.string.isRequired,

    // An optional style object to override the default container style.
    containerStyle: PropTypes.object,

    // An optional style object to override the default text style.
    textStyle: PropTypes.object
};