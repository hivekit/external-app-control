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

#### `async ctrl.selection.get()`
Get the currently selected entity. Returns an object with `id` and `type` properties.

#### `ctrl.selection.on('change', (id, type) => {})`
Listen to selection changes in the Hivekit app.

### Object
#### `ctrl.object.showPath(objectId, settings)`
Show the path an object has taken. Settings is an object with the following properties:
```javascript
{
    // 'arrow' or 'line'
    type: 'arrow', 

    // the timespan in milliseconds before now
    timespan: 1000 * 60 * 60 * 24, // one day

    // the following settings only apply if type==='arrow'

    // how the color of the path is determined. Options are:
    // - 'speed'  color is determined by the speed of the object ranging red-yellow-green
    // - 'category' color is based on the object's category color
    colorType: 'speed', 

    // If colorType==='speed', the following settings determines the range of speeds for the coloring
    speed: { min: 0, max: 10 }
}
```

#### `ctrl.object.hidePath(objectId)`
Hide the path of an object.

#### `async ctrl.object.isPathVisible(objectId)`
Returns true if there is a path visible for the object with the given id.