export default {
    selectionChange(app, data) {
        app.selection.emit('change', data.type, data.id);
    }
}