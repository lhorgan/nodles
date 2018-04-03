function Node() {
    this.in = {};
    this.out = {};
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

        if(typeof(this.action) === "function") { // this is just a simple node with a direct action
            this.out = this.action(this.in);
        }
        else if(typeof(this.node) === "Object") { // I'm connected to a node that I contain, and somewhere in this mess is the node that actually has the action!
            this.node.markChildrenStale(true); // todo: the nested node may not depend on all inputs of its parent, so it may not actually be stale
            this.out = this.node.run();
        }

        this.markChildrenStale(false); // mark all children (not including self) as stale
    }

    return this.out;
}

Node.prototype.markChildrenStale(includeSelf) {
    this.stale = includeSelf;
    for(key in this.out) {
        var child = this.out[key];
        child.markChildrenStale(true);
    }
}

Node.prototype.render(stage, pos) {

}
