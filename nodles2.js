function Port() {
    this.nodle;
    this.value;
    this.many = {};
    this.one;
    this.id = randomString(10);

    this.x = Math.random() * 800;
    this.y = Math.random() * 800;
}

Port.prototype.addOutConnection = function(other) {
    this.many[other] = other;
    other.one = this;
    this.nodle.renderer.addEdge(this, other);
}

Port.prototype.addInConnection = function(other) {
    this.one = other;
    other.many[this] = this;
    this.nodle.renderer.updateNodle(this.nodle);
}

Port.prototype.getType = function() {
    console.log(this.nodle.out);
    if(this in this.nodle.in) {
        return "in";
    }
    else if(this in this.nodle.out) {
        return "out";
    }
}

Port.prototype.update = function(value) {
    if(value !== this.value) {
        this.value = value;
        for(var key in this.many) {
            var inPort = this.many[key];
            inPort.nodle.schedule();
        }
    }
}

Port.prototype.toString = function() {
    return this.id;
}

function Nodle(renderer) {
    this.in = {};
    this.out = {};
    this.action;
    this.id = randomString(10);

    this.x = 50;
    this.y = 50;

    this.renderer = renderer;
}

Nodle.prototype.addInPort = function(port, name) {
    port.nodle = this;
    this.in[port] = port;
    this.renderer.updateNodle(this);
}

Nodle.prototype.addOutPort = function(port, name) {
    port.nodle = this;
    this.out[name] = port;
    this.renderer.updateNodle(this);
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
