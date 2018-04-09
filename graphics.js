// function World(stage) {
//     this.things = [];
//     this.zoom = 1;
//     this.offset;
// }
// 
// function Point(x, y) {
//     this.x = x;
//     this.y = y;
// }
// 
// function Thing(data, pos) {
//     this.data = data;
//     this.pos = pos;
// }
// 
// Thing.prototype.render(stage) {
//     this.data.render(stage, pos); // delegate rendering to the thing (probably a node)
// }

function init() {
    var canvas = new fabric.Canvas("nodleCanvas");

    // create a rectangle object
    var rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: 'red',
        width: 20,
        height: 20,
        hasControls: false
    });

    // "add" rectangle onto canvas
    canvas.add(rect);
}