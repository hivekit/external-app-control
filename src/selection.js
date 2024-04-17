import EventEmitter from "./event-emitter";

export default class Selection extends EventEmitter {
    constructor(app) {
        super();
        this.app = app;
    }

    select(id, type) {
        this.app.sendCommand('select', { id, type });
    }

    deselect() {
        this.app.sendCommand('select', { id: null, type: null });
    }

    async get() {
        return this.app.sendRequest('getSelection', null);
    }
}