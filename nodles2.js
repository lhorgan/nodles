function Port() {
    this.node;
    this.value;
    this.many = {};
    this.one;
}

Port.prototype.addOutConnection(other) {
    this.many[other] = other;
    other.one = this;
}

Port.prototype.addInConnection(other) {
    this.one = other;
    other.many[this] = this;
}

Port.prototype.update(value) {
    if(value !== this.value) {
        this.value = value;
        for(var key in this.many) {
            var inPort = this.many[key];
            inPort.node.schedule();
        }
    }
}

Port.prototype.toString() {
    return randomString(10);
}

function Node() {
    this.in = {};
    this.out = {};
    this.action;
}

Node.prototype.ready() {
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

Node.prototype.markStale() {
    SCHED.add(this);
}

Node.prototype.run() {
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

Node.prototype.toString() {
    return randomString(10);
}

function Flow() {
    this.in = {};
    this.out = {};
}

Flow.prototype.run() {
    for(var key in this.in) {
        var inPort = this.in[key];
        for(var con in inPort.many) {
            inPort.many[con].update(inPort.value);
        }
    }
}

Flow.prototype.toString() {
    return randomString(10);
}

Flow.prototype.run() {
    
}

function Action(fun, cb) {
    this.fun = fun;
    this.cb = cb;
}

Action.prototype.run(inPorts) {
    var args = {};
    for(port in inPorts) {
        args[port] = inPorts[port].value;
    }
    cb(this.fun(args));
}

function Scheduler() {
    programs = [];
}

Scheduler.prototype.add(program) {
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
