function Node() {
    this.in = {};
    this.out = {};
    this.node;
    this.action;
    this.stale = false;
}

Node.prototype.run() {
    if(!this.stale) {
        return this.out;
    }
    else { // this node is "stale", so we have to evalute its antecedents
        this.stale = false;
        for(key in this.in) {
            var parent = this.in[key];
            this.in[key] = parent.run()[key];
            this.stale = false;
        }

        // todo: handle recursive nodes
        this.action(this.in);

        this.markChildrenStale(false); // mark all children (not including self) as stale
    }
}

Node.prototype.markChildrenStale(includeSelf) {
    this.stale = includeSelf;
    for(key in this.out) {
        var child = this.out[key];
        child.markChildrenStale(true);
    }
}

// function Connection(fromNode, fromKey, toNode, toKey) {
//     this.fromNode = fromNode;
//     this.fromKey = fromKey;
//     this.toNode = toNode;
//     this.toKey = toKey;
// }

Node.prototype.render(stage, pos) {

}
