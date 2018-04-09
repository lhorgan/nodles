Nodle.prototype.render = function() {
    var portHeight = 10;
    var portSpacing = 5;

    var groupArr = [];
    var _this = this;

    var height = Math.max(Object.keys(this.in).length, Object.keys(this.out).length) * (portHeight + portSpacing) - portSpacing;
    console.log("my height is " + height);

    var offX = 50;
    var offY = 50;
    var box = new fabric.Rect({
        left: offX,
        top: offY,
        height: height,
        width: 50,
        fill: "white",
        stroke: "black",
        strokeWidth: 1,
        hasControls: false
    });

    box.on("mousedblclick", function(e) {
        console.log(this);
    });

    var group = new fabric.Group([box], {
        subTargetCheck: true
    });
    group.hasControls = false;

    var portX = offX;
    var portY = offY;
    for(var key in this.in) {
        var port = this.in[key].render();
        port.left = portX;
        port.top = portY;

        portY += portHeight + portSpacing;

        group.addWithUpdate(port);
    }

    portX = offX + 50 - portHeight;
    portY = offY;
    for(var key in this.out) {
        var port = this.out[key].render();
        port.left = portX;
        port.top = portY;

        portY += portHeight + portSpacing;

        group.addWithUpdate(port);
    }

    return group;
}

Port.prototype.render = function() {
    var _this = this;

    var rect = new fabric.Rect({
        width: 10,
        height: 10
    });

    rect.on("mousedblclick", function() {
        alert(_this);
    });

    return rect;
}

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
