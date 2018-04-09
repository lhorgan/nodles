function Port() {
    this.Nodle;
    this.value;
    this.many = {};
    this.one;
    this.id = randomString(10);
}

Port.prototype.addOutConnection = function(other) {
    this.many[other] = other;
    other.one = this;
}

Port.prototype.addInConnection = function(other) {
    this.one = other;
    other.many[this] = this;
}

Port.prototype.update = function(value) {
    if(value !== this.value) {
        this.value = value;
        for(var key in this.many) {
            var inPort = this.many[key];
            inPort.Nodle.schedule();
        }
    }
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

Port.prototype.toString = function() {
    return this.id;
}

function Nodle() {
    this.in = {};
    this.out = {};
    this.action;
    this.id = randomString(10);
}

Nodle.prototype.ready = function() {
    var allGood = true;
    for(var key in this.in) {
        var port = this.in[key];
        if(port.value === null) {
            allGood = false;
            break;
        }
    }
    
    return allGood;
}

Nodle.prototype.run = function() {
    var _this = this;
    this.action.run(this.in, function(outVals) {
        for(var key in outVals) {
            var outPort = this.out[key];
            //outPort.value = outVals[key];
            //outPort.updateConnections();
            outPort.update(value);
        }
    });
}

Nodle.prototype.render = function() {
    var portHeight = 10;
    var portSpacing = 5;
    
    var groupArr = [];
        
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
    
    /*var box2 = new fabric.Rect({
        width: 10,
        height: 10,
        top: 50,
        left: 50
    });*/
    
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
    
    return group;
}

Nodle.prototype.toString = function() {
    return this.id;
}

function Flow() {
    this.in = {};
    this.out = {};
    this.id = randomString(10);
}

Flow.prototype.ready = function() {
    var allGood = true;
    
    for(var key in this.in) {
        if(this.in[key] === null) {
            allGood = false;
            break;
        }
    }
    
    return allGood;
}

Flow.prototype.run = function() {
    for(var key in this.in) {
        var inPort = this.in[key];
        for(var con in inPort.many) {
            inPort.many[con].update(inPort.value);
        }
    }
}

Flow.prototype.toString = function() {
    return this.id;
}

function Action(fun, cb) {
    this.fun = fun;
    this.cb = cb;
}

Action.prototype.run = function(inPorts) {
    var args = {};
    for(port in inPorts) {
        args[port] = inPorts[port].value;
    }
    cb(this.fun(args));
}

function Scheduler() {
    programs = [];
}

Scheduler.prototype.add = function(program) {
    if(program.ready()) {
        program.run();
    }
}

/* Generate a random string of LENGTH characters */
function randomString(length) {
	var str = "";
	for(var i = 0; i < length; i++) {
		var charCode = 0;
		if(Math.random() < (26 / 36))
			charCode = Math.floor(Math.random() * 26) + 97;
		else
			charCode = Math.floor(Math.random() * 10) + 48;

		str += String.fromCharCode(charCode);
	}

	return str;
}
