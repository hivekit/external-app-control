# Hivekit External App Control
This library allows you to interact with [Hivekit](https://hivekit.io/) applications running in an iFrame or with a parent Hivekit application if your app is running in an iFrame within Hivekit.

## Installation
```bash
npm install @hivekit/external-app-control
yarn add @hivekit/external-app-control
```

## Usage
```javascript
import { ExternalAppControl } from '@hivekit/external-app-control';

const hivekitApp = new ExternalAppControl(document.getElementById('hivekit-iframe'));

// pan map to lat, lon
hivekitApp.map.panTo(51.5079, -0.1280);

// select an object with id rider/213
hivekitApp.selection.select('rider/213','object');

// listen to selection changes in the Hivekit app
hivekitApp.selection.on('change', (id, type) => {
  console.log(`Selected ${type} with id ${id}`);
});
```

## API
### Constructor
#### `const ctrl = new ExternalAppControl(frameElement)`
If frame element is omitted, the library will assume that it is running in an iFrame within Hivekit or a window opened by Hivekit and will try to communicate with `window.opener || window.parent`.

### Map
#### `ctrl.map.panTo(lat, lon)`
Pan the map to the given latitude and longitude.

#### `ctrl.map.panToEntity(type, id)`
Pan the map to the entity with the given type and id. Type can be `'object'`, `'area'` or `'task'`.

### Selection
#### `ctrl.selection.select(id, type)`
Select the entity with the given type and id. Type can be `'object'`, `'area'`, `'instruction'` or `'task'`.

#### `ctrl.selection.deselect()`
Deselect the currently selected entity.

#### `ctrl.selection.get()`
Get the currently selected entity. Returns an object with `id` and `type` properties.

#### `ctrl.selection.on('change', (id, type) => {})`
Listen to selection changes in the Hivekit app.
