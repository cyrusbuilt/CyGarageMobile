import React, {Component} from 'react';
import {SafeAreaView, View, Text} from 'react-native';
import {headerColorStyle, headerTextColorStyle} from '../styles/colors';
import MainScreenStyles from '../styles/mainscreenstyles';
import {displayName} from '../app.json';
import DeviceInfo from 'react-native-device-info';
import NetInfo from "@react-native-community/netinfo";
import SInfo from 'react-native-sensitive-info';
import AlertMessage from '../components/AlertMessage';
import PrimaryButton from '../components/PrimaryButton';
import CyGarageService, {DoorStatus} from '../services/CyGarageService';

const appVersion = "v" + DeviceInfo.getVersion() + "(" + DeviceInfo.getBuildNumber() + ")";

export default class MainScreen extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: `${displayName} ${appVersion}`,
            headerBackTitle: "Home",
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
            address: this.props.navigation.getParam("hostAddress", null),
            port: this.props.navigation.getParam("hostPort", null),
            isConnected: true,
            hasHostConnection: true,
            activateFailed: false,
            doorState: DoorStatus.UNKNOWN,
            firmwareVersion: "unknown"
        };
        this.unsubscribeNetInfoListener = null;
        this.pollTimer = null;
    }

    _startTimer() {
        this.pollTimer = setInterval(() => this._getStatus(), 2000);
    }

    _killTimer() {
        if (this.pollTimer) {
            console.log("Killing timer...");
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }
    }

    _handleConnectivityChange(isConnected) {
        console.log(isConnected ? "Network connection restored." : "WARN: Network connection lost!");

        // Don't keep trying to get status if we aren't connected.
        if (isConnected) {
            if (!this.pollTimer) {
                this._startTimer();
            }
        }
        else {
            this._killTimer();
        }

        this.setState({isConnected: isConnected});
    }

    async _getStatus() {
        const state = await CyGarageService.getDoorState();
        //console.log("Door status result: ", state);
        if (state.status !== 200) {
            console.log("Failed to get door state.");
            this._killTimer();
        }

        let stateActual = state.data;
        switch (stateActual) {
            case DoorStatus.OPEN:
            case DoorStatus.CLOSED:
            case DoorStatus.AJAR:
                break;
            default:
                stateActual = DoorStatus.UNKNOWN;
                break;
        }

        //console.log("Door status = " + stateActual);
        this.setState({doorState: stateActual});
    }

    async componentDidMount() {
        CyGarageService.setHost(this.state.address, this.state.port); // TODO probably don't need this.
        console.log("Adding network event listeners...");
        this._handleConnectivityChange = this._handleConnectivityChange.bind(this);
        this.unsubscribeNetInfoListener = NetInfo.addEventListener(state => {
            this._handleConnectivityChange(state.isConnected);
        });

        this._startTimer();
        const result = await CyGarageService.getFirmwareVersion();
        console.log("Fetch firmware version result: ", result);
        if (result && result.data) {
            this.setState({firmwareVersion: result.data});
        }
    }

    componentWillUnmount() {
        if (this.unsubscribeNetInfoListener) {
            this.unsubscribeNetInfoListener();
        }

        this._killTimer();
    }

    async _activateButtonClick() {
        let result = await CyGarageService.getServerStatus();
        console.log("Get server status result: ", result);
        if (result.status !== 200) {
            this.setState({hasHostConnection: false});
            return;
        }

        result = await CyGarageService.activateDoor();
        console.log("Activate result: ", result);
        if (result.data !== "OK") {
            this.setState({activateFailed: true});
        }
    }

    async _configButtonClick() {
        this._killTimer();
        await SInfo.setItem("forceConfig", "true", {});
        this.props.navigation.navigate("Configure");
    }

    render() {
        const {
            isConnected,
            hasHostConnection,
            activateFailed,
            doorState,
            firmwareVersion
         } = this.state;

        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={MainScreenStyles.container}>
                    {
                        !isConnected && (
                            <AlertMessage message={"Network Connection Lost"}/>
                        )
                    }
                    {
                        !hasHostConnection && (
                            <AlertMessage message={"No connection CyGarage host."} />
                        )
                    }
                    {
                        activateFailed && (
                            <AlertMessage message={"Door activation failed."} />
                        )
                    }
                    <Text style={MainScreenStyles.labelText}>Firmware version: {firmwareVersion}</Text>
                    <View style={MainScreenStyles.statusContainer}>
                        <Text style={MainScreenStyles.labelText}>Door status:</Text>
                        <Text style={MainScreenStyles.statusText}>{doorState}</Text>
                    </View>
                    <PrimaryButton title='Activate' onPress={() => this._activateButtonClick()} />
                    <PrimaryButton title='Configure Connection' onPress={() => this._configButtonClick()} />
                </View>
            </SafeAreaView>
        );
    }
}