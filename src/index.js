import Map from './map.js'
export default class ExternalAppControl {
    constructor() {
        this.map = new Map(this);
    }

    sendCommand(command, data) {
        const target = window.parent || window.opener;
        target.postMessage({ command, data }, '*');
    }
}