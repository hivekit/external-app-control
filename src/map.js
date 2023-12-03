export default class Map {
    constructor(app) {
        this.app = app;
    }

    panTo(lat, lng) {
        this.app.sendCommand('panTo', { lat, lng });
    }

    panToEntity(type, id) {
        this.app.sendCommand('panToEntity', { type, id });
    }
}