import {createAppContainer, createStackNavigator, createSwitchNavigator} from 'react-navigation';
import MainScreen from './MainScreen';
import ConfigurationScreen from './ConfigurationScreen';

const rootStack = createStackNavigator(
    {
        Main: {
            screen: MainScreen
        },
        Configure: {
            screen: ConfigurationScreen
        }
    },
    {
        initialRouteName: 'Configure'
    }
)

const Root = createAppContainer(createSwitchNavigator(
    {
        App: rootStack
    }
));

export default Root;