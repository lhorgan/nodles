function Port() {
    this.node;
    this.value;
    this.in = {};
    this.out = {};
}

Port.prototype.addOutConnection(other) {
    this.out[other] = other;
    other.in[this] = this;
}

Port.prototype.addInConnection(other) {
    this.in[other] = other;
    other.out[this] = this;
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
    var outVals = this.action.run(this.in);
    for(key in outVals) {
        this.out[key].value = outVals[key];
    }
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
