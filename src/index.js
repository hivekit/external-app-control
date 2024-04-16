import Map from './map.js'
import Selection from './selection.js';
import AppWindow from './app-window.js';
import inboundCommands from './inbound-commands.js';

export default class ExternalAppControl {
    constructor(target) {
        this.target = target || null;
        this.map = new Map(this);
        this.selection = new Selection(this);
        this.appWindow = new AppWindow(this);
        this.pendingRequests = {};
        window.addEventListener('message', this.handleMessage.bind(this));
    }

    handleMessage(event) {
        const { command, data, correlationId } = event.data;
        // TODO check origin
        if (correlationId) {
            const resolve = this.pendingRequests[correlationId];

            if (resolve) {
                resolve(data);
                delete this.pendingRequests[correlationId];
            }
        }
        if (!command) {
            return;
        }

        if (inboundCommands[command]) {
            inboundCommands[command](this, data);
        }
    }

    getTarget() {
        if (this.target && this.target.contentWindow) {
            return this.target.contentWindow;
        }
        return window.opener || window.parent;
    }
    sendCommand(command, data) {
        this.getTarget().postMessage({ command, data }, '*');
    }

    async sendRequest(command, data) {
        const correlationId = Math.random().toString(36).substring(2, 15);
        return new Promise(resolve => {
            this.pendingRequests[correlationId] = resolve;
            this.getTarget().postMessage({ command, data, correlationId }, '*');
        })
    }
}