import React, {Component} from 'react';
import {Alert, View, ActivityIndicator, Text} from 'react-native';
import {headerColorStyle, headerTextColorStyle} from '../styles/colors';
import ConfigScreenStyles from '../styles/configscreenstyles';
import {NavigationActions, StackActions} from 'react-navigation';
import PrimaryButton from '../components/PrimaryButton';
import TextEntry from '../components/TextEntry';
import SInfo from 'react-native-sensitive-info';
import {name as appName} from '../app.json'
import CyGarageService from '../services/CyGarageService';

export default class ConfigurationScreen extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: "Configuration Settings",
            headerStyle: {
                backgroundColor: headerColorStyle
            },
            headerTitleStyle: {
                color: headerTextColorStyle
            }
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            hasInitialized: false,
            address: null,
            port: null
        };
    }

    _goToMain(address, port) {
        this.setState({hasInitialized: true});
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: "Main",
                    params: {
                        hostAddress: address,
                        hostPort: port
                    }
                })
            ]
        });

        this.props.navigation.dispatch(resetAction);
    }

    componentDidMount() {
        SInfo.getItem("forceConfig", {}).then(forceConfig => {
            SInfo.getItem("hostAddress", {}).then(hostAddress => {
                if (hostAddress) {
                    console.log("Retrieved host address: " + hostAddress);
                    SInfo.getItem("hostPort", {}).then(hostPort => {
                        console.log("Retrieved host port: " + hostPort);
                        let port = 80;
                        if (hostPort) {
                            port = hostPort;
                        }

                        if (forceConfig === "false") {
                            this._goToMain(hostAddress, port);
                            return;
                        }

                        this.setState({hasInitialized: true, address: hostAddress, port: port});
                    });
                }
                else {
                    this.setState({hasInitialized: true});
                }
            });
        });
    }

    async saveSettings() {
        console.log("Saving settings...");
        SInfo.setItem("hostAddress", this.state.address, {});
        SInfo.setItem("hostPort", this.state.port, {});
        CyGarageService.setHost(this.state.address, this.state.port);
        try {
            const result = await CyGarageService.getServerStatus();
            if (result.status !== 200) {
                Alert.alert(
                    'Connection Failed',
                    'Cannot connect to the specified host on the specified port.'
                );
                return;
            }
        }
        catch (e) {
            console.log(e);
            Alert.alert(e.name, e.message);
            return;
        }

        SInfo.setItem("forceConfig", "false", {});
        this._goToMain(this.state.address, this.state.port);
    };

    render() {
        const {
            address,
            port
        } = this.state;
        return (
            <View style={ConfigScreenStyles.container}>
                <Text style={ConfigScreenStyles.appName}>{appName}</Text>
                <Text style={ConfigScreenStyles.labelText}>Host Address (Hostname or IP):</Text>
                <TextEntry
                    placeHolder="Host Address (Hostname or IP)"
                    onChangeText={(text) => this.setState({address: text})}
                    value={address || undefined}
                />
                <Text style={ConfigScreenStyles.labelText}>Port (ie. 80):</Text>
                <TextEntry
                    placeHolder="Port (ie. 80)"
                    onChangeText={(text) => this.setState({port: text})}
                    value={port || undefined}
                />
                <ActivityIndicator size='large' color='#05a5d1' animating={!this.state.hasInitialized} />
                {
                    this.state.hasInitialized && (
                        <PrimaryButton title='Save Settings' onPress={() => this.saveSettings()} />
                    )
                }
            </View>
        );
    }
}