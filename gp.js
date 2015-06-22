function Tree(op) {
    this.root = {
        op: op
    };
}

Tree.fromJSON = function(json) {
    var tree = new Tree();
    tree.root = JSON.parse(json);
    return tree;
};


Tree.prototype.getRandomNode = function() {
    var node = this.root;
    for (var i = 0; i < 5; i++) {
        var r = Math.random();
        if (r > 0.7) {
            if (!node.left || (typeof node.left === "string")) {
                node.left = {};
                return node.left;
            } else {
                node = node.left;
            }
        }
        if (r < 0.3) {
            if (!node.right || (typeof node.right === "string")) {
                node.right = {};
                return node.right;
            } else {
                node = node.right;
            }
        }
    }
    return node;
};

Tree.prototype.clone = function() {
    return Tree.fromJSON(JSON.stringify(this.root));
};

Tree.prototype.forEachNode = function(fn) {
    var iter = function(root) {
        if (!root) {
            return;
        }
        fn(root);
        iter(root.left);
        iter(root.right);
    };
    iter(this.root);
};

function GP(ops, values, fitness) {
    this.ops = ops;
    this.values = values;
    this.fitness = fitness;
    this.programs = ops.map(function(op) {
        return new Tree(op);
    });
    this.fixMissingValues();
}

GP.prototype.getRandomOp = function() {
    var ops = this.ops;
    return ops[parseInt(Math.random() * ops.length)];
};

GP.prototype.getRandomValue = function() {
    var values = this.values;
    return values[parseInt(Math.random() * values.length)];
};

GP.prototype.fixMissingValues = function() {
    var values = this.values;
    var gp = this;
    this.programs.forEach(function(p) {
        p.forEachNode(function(node) {
            if (values.indexOf(node.op) > -1) {
                return;
            }
            node.left = node.left || gp.getRandomValue();
            node.right = node.right || gp.getRandomValue();
        });
    });
};

GP.prototype.nextGen = function() {
    var gp = this;
    var next = this.programs.map(function(p) {
        var np = p.clone();
        np.getRandomNode().op = gp.getRandomOp();
        return np;
    });
    this.programs = this.programs.concat(next);
    this.fixMissingValues();
};

var repeat = function(str, n) {
    var s = '';
    for(var i = 0; i < n; i++) {
        s += str;
    }
    return s;
};

GP.prototype.tree2fn = function(root) {
    var iter = function(root, indent) {
        if (typeof root === "string") {
            return root;
        } else {
            indent += 4;
            return [root.op,
                    "(\n",
                    repeat(' ', indent),
                    "img.",
                    iter(root.left, indent),
                    ",\n",
                    repeat(' ', indent),
                    "img.",
                    iter(root.right, indent),
                    "\n",
                    repeat(' ', indent - 4),
                    ")"].join('');
        }
    };
    return "img." + iter(root, 0);
};

GP.prototype.log = function() {
    var gp = this;
    this.programs.forEach(function(p) {
        console.log(gp.tree2fn(p.root));
    });
};
