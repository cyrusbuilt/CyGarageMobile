import React, {Component} from 'react';
import {StyleSheet, KeyboardAvoidingView, TextInput} from 'react-native';

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: 'white',
    },
    textInput: {
        fontSize: 16,
        backgroundColor: 'white',
        textAlignVertical: 'top',
        includeFontPadding: false,
        alignSelf: 'stretch',
    }
});

export default class TextEntry extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <TextInput style={[styles.textInput, this.props.style]} {...this.props} />
            </KeyboardAvoidingView>
        );
    }
}