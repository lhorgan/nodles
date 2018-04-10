Graph.prototype.renderNodle = function(nodle) {
    if(this.nodles[nodle]["graphic"]) {
        console.log("this nodle already exists");
        this.canvas.remove(this.nodles[nodle]["graphic"]); // remove the nodle before re-rendering
    }

    var portHeight = 10;
    var portSpacing = 5;

    var _this = this;

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
            var port = new Port();
            nodle.addInPort(port, name);
        }
        else {
            var name = prompt("Enter a name for the output port.");
            var port = new Port();
            nodle.addOutPort(port, name);
        }

    });

    var group = new fabric.Group([box], {
        subTargetCheck: true
    });
    group.hasControls = false;

    group.inPorts = [];
    group.outPorts = [];

    var portX = nodle.x;
    var portY = nodle.y;
    for(var key in nodle.in) {
        var portGraphic = this.renderPort(nodle.in[key]);
        portGraphic.port = nodle.in[key];
        portGraphic.left = portX;
        portGraphic.top = portY;
        nodle.in[key].x = portX;
        nodle.in[key].y = portY;

        group.inPorts.push(portGraphic);

        portY += portHeight + portSpacing;

        group.addWithUpdate(portGraphic);
    }

    portX = nodle.x + 50 - portHeight;
    portY = nodle.y;
    for(var key in nodle.out) {
        var portGraphic = this.renderPort(nodle.out[key]);
        portGraphic.port = nodle.out[key];
        portGraphic.left = portX;
        portGraphic.top = portY;
        group.outPorts.push(portGraphic);

        portY += portHeight + portSpacing;

        group.addWithUpdate(portGraphic);
    }

    group.on("moving", function(e) {
        // update the nodle's intrinsic position
        nodle.x = this.left;
        nodle.y = this.top;

        for(var i = 0; i < this.inPorts.length; i++) {
            //console.log(this.inPorts[i]);
            var port = this.inPorts[i].port;
            if(_this.edges[port]) {
                var lineGraphic = _this.edges[port]["in"];
                console.log("I need to update the position of ");
                //console.log(this.top + this.inPorts[i].top);
                lineGraphic.set("y2", this.top - this.inPorts[i].top);
                lineGraphic.set("x2", this.left);
                console.log(lineGraphic);
                lineGraphic.set("dirty", true);
            }
        }

        for(var i = 0; i < this.outPorts.length; i++) {
            //console.log(this.outPorts);
            //console.log(this.outPorts[i]);
            var port = this.outPorts[i].port;
            console.log(_this.edges[port]);
            if(_this.edges[port]) {
                for(var z = 0; z < _this.edges[port]["out"].length; z++) {
                    var lineGraphic = _this.edges[port]["out"][z];
                    console.log("I need to update the position of ");
                    //console.log(this.top + this.inPorts[i].top);
                    lineGraphic.set("y1", this.top - this.inPorts[i].top);
                    lineGraphic.set("x1", this.left + this.width);
                    console.log(lineGraphic);
                    lineGraphic.set("dirty", true);
                }
            }
        }

        _this.canvas.renderAll();
    });

    return group;
}

Graph.prototype.renderPort = function(port) {
    var _this = this;

    var rect = new fabric.Rect({
        width: 10,
        height: 10
    });
    rect.port = port;

    rect.on("mousedblclick", function() {
        alert("HI");
    });

    rect.on("mouseup", function() {
        if(port === _this.selectedPort) {
            _this.selectedPort = null;

            this.fill = "black";
            this.set("dirty", true);
            _this.canvas.renderAll();
        }
        else if(_this.selectedPort !== null && port.getType() === "in") {
            console.log("we are ready to make a connection!");
            var outPort = _this.selectedPort;
            var inPort = port;
            outPort.addOutConnection(inPort);
        }
        else if(port.getType() === "out") {
            _this.selectedPort = port;
            console.log(port.getType());
            console.log(_this.selectedPort.nodle);

            this.fill = "red";
            this.set("dirty", true);
            _this.canvas.renderAll();
        }
    });

    return rect;
}

function Graph() {
    var node1 = new Nodle(this);
    var x = new Port();
    x.nodle = node1;
    var y = new Port();
    y.nodle = node1;
    var z = new Port();
    z.nodle = node1;
    //node1.in = {x: x, y: y};
    node1.in[x] = x;
    node1.in[y] = y;
    node1.out[z] = z;
    var _this = this;

    this.canvas = new fabric.Canvas("nodleCanvas");
    this.canvas.hoverCursor = 'pointer';

    this.selectedPort = null;

    this.nodles = {};
    this.nodles[node1] = {"nodle": node1, "graphic": null, "edges": null};
    this.edges = {};

    this.canvas.on("mouse:dblclick", function(e) {
        if(!e.target) { // just the canvas is clicked
            var nodle = new Nodle(_this);
            nodle.x = e.e.clientX;
            nodle.y = e.e.clientY;
            _this.updateNodle(nodle);
        }
    });
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

        //this.renderEdges(nodle);
    }
    else { // new nodle
        this.nodles[nodle] = {"nodle": nodle, "graphic": null, "edges": null};
        var nodleGraphic = this.renderNodle(nodle);
        this.nodles[nodle]["graphic"] = nodleGraphic;
        this.canvas.add(nodleGraphic);

        //this.renderEdges(nodle);
    }
}

Graph.prototype.renderEdges = function(nodle) {
    console.log("RENDERING EDGES");
    //var group = new fabric.Group([], {});

    for(var fromKey in nodle.out) {
       var outPort = nodle.out[fromKey];
       for(var toKey in outPort.many) {
           var inPort = outPort.many[toKey];
           console.log([outPort.x, outPort.y, inPort.x, inPort.y]);
           this.addEdge(outPort, inPort);
           //this.canvas.add(edge);
           //group.addWithUpdate(edge);
       }
   }
   //return group;
}

Graph.prototype.addEdge = function(outPort, inPort) {
    var edge = new fabric.Line([outPort.x, outPort.y, inPort.x, inPort.y], {
        fill: 'red',
        stroke: 'red',
        strokeWidth: 1,
        selectable: false
    });
    this.addOutEdge(outPort, edge);
    this.addInEdge(inPort, edge);
    this.canvas.add(edge);
}

Graph.prototype.addOutEdge = function(port, edge) {
    if(!this.edges[port]) {
        this.edges[port] = {"in": null, "out": []};
    }
    this.edges[port]["out"].push(edge);
}

Graph.prototype.addInEdge = function(port, edge) {
    if(!this.edges[port]) {
        this.edges[port] = {"in": null, "out": []};
    }
    this.edges[port]["in"] = edge;
}

Graph.prototype.render = function() {
    console.log("RENDERING!");
    for(var id in this.nodles) {
        var nodle = this.nodles[id]["nodle"];
        var nodleGraphic = this.renderNodle(nodle);
        this.nodles[nodle]["graphic"] = nodleGraphic;
        this.canvas.add(nodleGraphic);
    }

    for(var id in this.nodles) {
        this.renderEdges(this.nodles[id]["nodle"]);
    }
}
