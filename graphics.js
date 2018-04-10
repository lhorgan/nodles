Graph.prototype.renderNodle = function(nodle) {
    if(this.nodles[nodle]["graphic"]) {
        console.log("this nodle already exists");
        this.canvas.remove(this.nodles[nodle]["graphic"]); // remove the nodle before re-rendering
    }

    var portHeight = 10;
    var portSpacing = 5;

    var height = Math.max(Object.keys(nodle.in).length, Object.keys(nodle.out).length) * (portHeight + portSpacing) - portSpacing;
    console.log("my height is " + height);
    console.log(nodle.x + ", " + nodle.y);

    var box = new fabric.Rect({
        left: nodle.x,
        top: nodle.y,
        height: height,
        width: 50,
        fill: "white",
        stroke: "black",
        strokeWidth: 1,
        hasControls: false
    });
    box.nodle = nodle;

    box.on("mousedblclick", function(e) {
        //console.log(this);
        var width = e.target.width * e.target.scaleX;
        var posX = e.target.left;
        var clickX = e.e.clientX;

        if(clickX < posX + width / 2) {
            var name = prompt("Enter a name for the input port.");
        }
        else {
            var name = prompt("Enter a name for the output port.");
        }

    });

    var group = new fabric.Group([box], {
        subTargetCheck: true
    });
    group.hasControls = false;

    var portX = nodle.x;
    var portY = nodle.y;
    for(var key in nodle.in) {
        var port = this.renderPort(nodle.in[key]);
        port.left = portX;
        port.top = portY;

        portY += portHeight + portSpacing;

        group.addWithUpdate(port);
    }

    portX = nodle.x + 50 - portHeight;
    portY = nodle.y;
    for(var key in nodle.out) {
        var port = this.renderPort(nodle.out[key]);
        port.left = portX;
        port.top = portY;

        portY += portHeight + portSpacing;

        group.addWithUpdate(port);
    }

    return group;
}

Graph.prototype.renderPort = function(port) {
    var rect = new fabric.Rect({
        width: 10,
        height: 10
    });
    rect.port = port;

    rect.on("mousedblclick", function() {
        alert("HI");
    });

    return rect;
}

function Graph() {
    var node1 = new Nodle();
    var x = new Port();
    x.port = node1;
    var y = new Port();
    y.port = node1;
    var z = new Port();
    z.port = node1;
    node1.in = {"x": x, "y": y};
    node1.out = {"z": z};

    this.canvas = new fabric.Canvas("nodleCanvas");
    this.canvas.hoverCursor = 'pointer';

    this.nodles = {};
    this.nodles[node1] = {"nodle": node1, "graphic": null};
}

Graph.prototype.updateNodle = function(nodle, remove) {
    if(typeof(remove) !== "undefined" && remove === true) {
        console.log("removing nodle" + nodle);
        this.canvas.remove(this.nodles[nodle]["graphic"]);
        delete this.nodles[nodle];
    }
    else if(nodle in this.nodles) {
        var nodleGraphic = this.renderNodle(nodle);
        this.nodles[nodle]["graphic"] = nodleGraphic;
        this.canvas.add(nodleGraphic);
    }
    else { // new nodle
        this.nodles[nodle] = {"nodle": nodle, "graphic": null};
        var nodleGraphic = this.renderNodle(nodle);
        this.nodles[nodle]["graphic"] = nodleGraphic;
        this.canvas.add(nodleGraphic);
    }
}

Graph.prototype.render = function() {
    console.log("RENDERING!");
    for(var id in this.nodles) {
        var nodle = this.nodles[id]["nodle"];
        var nodleGraphic = this.renderNodle(nodle);
        this.nodles[nodle]["graphic"] = nodleGraphic;
        this.canvas.add(nodleGraphic);
    }
}
