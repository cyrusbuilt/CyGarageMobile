import {StyleSheet, Platform} from 'react-native';

const MainScreenStyles = StyleSheet.create({
    container: {
        flex: 1
    },
    labelText: {
        fontSize: 15,
        fontFamily: Platform.OS == 'android' ? 'normal' : 'Arial',
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        padding: 10
    },
    statusText: {
        fontSize: 15,
        fontFamily: Platform.OS == 'android' ? 'normal' : 'Arial',
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        padding: 10,
        color: 'red'
    },
    statusContainer: {
        alignItems: 'flex-start',
        flexDirection: 'row'
    }
});

export default MainScreenStyles;