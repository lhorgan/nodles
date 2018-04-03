function World(stage) {
    this.things = [];
    this.zoom = 1;
    this.offset;
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Thing(data, pos) {
    this.data = data;
    this.pos = pos;
}

Thing.prototype.render(stage) {
    this.data.render(stage); // delegate rendering to the thing (probably a node)
}
