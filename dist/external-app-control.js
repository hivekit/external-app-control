// src/map.js
var Map = class {
  constructor(app) {
    this.app = app;
  }
  panTo(lat, lng) {
    this.app.sendCommand("panTo", { lat, lng });
  }
  panToEntity(type, id) {
    this.app.sendCommand("panToEntity", { type, id });
  }
};

// src/event-emitter.js
var EventEmitter = class {
  constructor() {
    this.listener = {};
    this.listenerId = 0;
  }
  on(eventName, fn, context, order) {
    if (typeof fn !== "function") {
      throw new Error(`no function for ${eventName}`);
    }
    this.listenerId++;
    if (!this.listener[eventName]) {
      this.listener[eventName] = [];
    }
    this.listener[eventName].push({
      eventName,
      fn,
      context,
      order,
      id: this.listenerId
    });
    this.listener[eventName].sort((a, b) => {
      if (a.order == b.order)
        return 0;
      return a.order > b.order ? 1 : -1;
    });
    return this.listenerId;
  }
  off(eventName, fn, context) {
    if (!this.listener[eventName]) {
      return;
    }
    var i = this.listener[eventName].length;
    while (i--) {
      if (this.listener[eventName][i].fn === fn && this.listener[eventName][i].context === context) {
        this.listener[eventName].splice(i, 1);
      }
    }
    if (this.listener[eventName].length === 0) {
      delete this.listener[eventName];
    }
  }
  removeListenerById(eventName, id) {
    if (!this.listener[eventName]) {
      throw new Error("No listener registered for eventname " + eventName);
    }
    var foundListener = false;
    this.listener[eventName] = this.listener[eventName].filter((listener) => {
      if (listener.id === id) {
        foundListener = true;
        return false;
      } else {
        return true;
      }
    });
    if (!foundListener) {
      throw new Error(`Failed to find listener with id ${id} for event ${eventName}`);
    }
  }
  emit(eventName) {
    if (!this.listener[eventName]) {
      return;
    }
    const args = Array.prototype.slice.call(arguments, 1);
    var last = null;
    var i = 0;
    while (this.listener[eventName] && this.listener[eventName][i]) {
      last = this.listener[eventName][i];
      if (this.listener[eventName][i].fn.apply(this.listener[eventName][i].context, args) === false) {
        return;
      }
      if (this.listener[eventName] && this.listener[eventName][i] === last) {
        i++;
      }
    }
  }
  hasListeners(eventName) {
    return this.listener[eventName] && this.listener[eventName].length > 0;
  }
};

// src/selection.js
var Selection = class extends EventEmitter {
  constructor(app) {
    super();
    this.app = app;
  }
  select(id, type) {
    this.app.sendCommand("select", { id, type });
  }
  deselect() {
    this.app.sendCommand("select", { id: null, type: null });
  }
  async get() {
    return this.app.sendRequest("getSelection", null);
  }
};

// src/object.js
var Object = class {
  constructor(app) {
    this.app = app;
  }
  showPath(objectId, settings) {
    this.app.sendCommand("showPathForObject", { objectId, settings });
  }
  hidePath(objectId) {
    this.app.sendCommand("hidePathForObject", { objectId });
  }
  async isPathVisible(objectId) {
    return await this.app.sendRequest("isPathForObjectVisible", { objectId });
  }
};

// src/app-window.js
var AppWindow = class {
  constructor(app) {
    this.app = app;
  }
  setSize(width, height) {
    this.app.sendCommand("setAppWindowSize", { width, height });
  }
  close() {
    this.app.sendCommand("closeAppWindow");
  }
};

// src/inbound-commands.js
var inbound_commands_default = {
  selectionChange(app, data) {
    app.selection.emit("change", data.type, data.id);
  }
};

// src/index.js
var ExternalAppControl = class {
  constructor(target) {
    this.target = target || null;
    this.map = new Map(this);
    this.selection = new Selection(this);
    this.object = new Object(this);
    this.appWindow = new AppWindow(this);
    this.pendingRequests = {};
    window.addEventListener("message", this.handleMessage.bind(this));
  }
  handleMessage(event) {
    const { command, data, correlationId } = event.data;
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
    if (inbound_commands_default[command]) {
      inbound_commands_default[command](this, data);
    }
  }
  getTarget() {
    if (this.target && this.target.contentWindow) {
      return this.target.contentWindow;
    }
    return window.opener || window.parent;
  }
  sendCommand(command, data) {
    this.getTarget().postMessage({ command, data }, "*");
  }
  async sendRequest(command, data) {
    const correlationId = Math.random().toString(36).substring(2, 15);
    return new Promise((resolve) => {
      this.pendingRequests[correlationId] = resolve;
      this.getTarget().postMessage({ command, data, correlationId }, "*");
    });
  }
};
export {
  ExternalAppControl as default
};
