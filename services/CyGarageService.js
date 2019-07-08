import axios from 'axios';
import ServiceError from './ServiceError';

export const DoorStatus = Object.freeze({
    AJAR: "AJAR",
    OPEN: "OPEN",
    CLOSED: "CLOSED",
    UNKNOWN: "UNKNOWN"
});

let _endpoint = null;

export default class CyGarageService {
    static setHost(hostAddress, port) {
        _endpoint = `http://${hostAddress}:${port}`;
    }

    static _checkEndpoint() {
        if (!_endpoint) {
            throw ServiceError("host_not_set", "Cannot complete request. Service host not set.");
        }
    }
    
    static async getServerStatus() {
        CyGarageService._checkEndpoint();
        let result = await axios.get(`${_endpoint}/`);
        return result;
    }

    static async getDoorState() {
        CyGarageService._checkEndpoint();
        return await axios.get(`${_endpoint}/device/status`);
    }

    static async getFirmwareVersion() {
        CyGarageService._checkEndpoint();
        // NOTE: We pass an empty transformResponse to disable the default
        // response data parsing and return it unmolested. Otherwise, it
        // trims the decimal off the version value (ie. "1.0" becomes "1").
        return await axios.get(`${_endpoint}/version`, {transformResponse: []});
    }

    static async activateDoor() {
        CyGarageService._checkEndpoint();
        return await axios.post(`${_endpoint}/device/activate`);
    }
}