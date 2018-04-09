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

Port.prototype.toString() {
    return randomString(10);
}

function Node() {
    this.in = {};
    this.out = {};
    this.action;
}

Node.prototype.run() {
    var nodesToRun = [this];
    var nodesToRunSet = Set();
    
    
    
    var outVals = this.action.run(this.in);
    for(key in outVals) {
        this.out[key].value = outVals[key];
    }
}

/*
topologically sort the node graph to resolve dependencies
*/
Node.prototype.topologicalSort() {
    
}

Node.prototype.toString() {
    return randomString(10);
}

function Flow() {
    this.nodes = [];
    this.in = {};
    this.out = {};
}

Flow.prototype.toString() {
    return randomString(10);
}

Flow.prototype.run() {

}

function Action(fun) {
    this.fun = fun;
}

Action.prototype.run(inPorts) {
    var args = {};
    for(port in inPorts) {
        args[port] = inPorts[port].value;
    }
    return this.fun(args);
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
