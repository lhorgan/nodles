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
    
    var node1 = new Nodle();
    var x = new Port();
    x.port = node1;
    var y = new Port();
    y.port = node1;
    var z = new Port();
    z.port = node1;
    node1.in = {"x": x, "y": y};
    node1.out = {"z": z};
    
    var renderedNode = node1.render();

    // "add" rectangle onto canvas
    canvas.add(renderedNode);
}