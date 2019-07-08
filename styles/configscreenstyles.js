import {StyleSheet, Platform} from 'react-native';

const ConfigScreenStyles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 10
    },
    appName: {
        fontSize: 28,
        fontFamily: Platform.OS == 'android' ? 'normal' : 'Arial',
        fontWeight: 'bold',
        padding: 20,
        alignSelf: 'center'
    },
    labelText: {
        fontSize: 15,
        fontFamily: Platform.OS == 'android' ? 'normal' : 'Arial',
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        padding: 10
    }
});

export default ConfigScreenStyles;