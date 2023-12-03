export default class AppWindow {
    constructor(app) {
        this.app = app;
    }

    setSize(width, height) {
        this.app.sendCommand('setAppWindowSize', { width, height });
    }

    close() {
        this.app.sendCommand('closeAppWindow');
    }
}