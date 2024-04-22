export default class Object {
    constructor(app) {
        this.app = app;
    }

    showPath(objectId, settings) {
        this.app.sendCommand('showPathForObject', { objectId, settings });
    }

    hidePath(objectId) {
        this.app.sendCommand('hidePathForObject', { objectId });
    }

    async isPathVisible(objectId) {
        return await this.app.sendRequest('isPathForObjectVisible', { objectId });
    }
}