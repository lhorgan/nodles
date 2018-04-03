function Node() {
    this.in = {};
    this.out = {};
    this.cachedOutput = {};
    this.node;
    this.action;
    this.stale = false;
}

Node.prototype.run() {
    if(this.stale){ // this node is "stale", so we have to evalute its antecedents
        this.stale = false;
        for(key in this.in) {
            var parent = this.in[key];
            this.in[key] = parent.run()[key];
            this.stale = false;
        }

        if(typeof(this.action) === function) {
            this.cachedOutput = this.action(this.in);
        }
        else { // it's not a function, it's a module
            // the action is a module
            this.cachedOutput = this.module.run();
        }

        this.markChildrenStale(false); // mark all children (not including self) as stale
    }

    return this.cachedOutput;
}

Node.prototype.markChildrenStale(includeSelf) {
    this.stale = includeSelf;
    for(key in this.out) {
        var child = this.out[key];
        child.markChildrenStale(true);
    }
}

function Module() {
    this.nodes = [];
}

Node.prototype.render(stage, pos) {

}
