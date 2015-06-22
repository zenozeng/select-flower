var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var target = document.getElementById('target');
var source = document.getElementById('source');
var result = document.getElementById('result');

var ready = function(fn) {
    if (target.width > 0 && source.width > 0) {
        fn();
    } else {
        setTimeout(function() {
            ready(fn);
        }, 10);
    }
};

var img = {};
window.ops.forEach(function(op) {
    img[op] = window[op];
});

ready(function() {
    var w = target.width;
    var h = target.height;
    canvas.width = w;
    canvas.height = h;
    result.width = w;
    result.height = h;

    ctx.drawImage(target, 0, 0, w, h);
    target = ctx.getImageData(0, 0, w, h);
    ctx.drawImage(source, 0, 0, w, h);
    source = ctx.getImageData(0, 0, w, h);

    img.R = getR(source, source);
    img.G = getG(source, source);
    img.B = getB(source, source);

    var fitness = function(fn) {
        var res = (new Function("return " + fn))();
        var fitness = 1 - diff(res, target);

        document.body.appendChild(document.createElement('hr'));

        var c = document.createElement('canvas');
        c.style.float = "right";
        c.width = w;
        c.height = h;
        var ctx = c.getContext('2d');
        var b = binarization(res, res);
        ctx.putImageData(b, 0, 0);
        document.body.appendChild(c);

        var pre = document.createElement('pre');
        pre.innerHTML = fn;
        document.body.appendChild(pre);

        var div = document.createElement('div');
        div.innerHTML = JSON.stringify({fitness: fitness});
        document.body.appendChild(div);

        return fitness;
    };

    var gp = new GP(window.ops, ['R', 'G', 'B'], fitness);

    var h2 = document.createElement('h2');
    h2.innerHTML = 'Generation 1';
    document.body.appendChild(h2);

    gp.nextGen();

    h2 = document.createElement('h2');
    h2.innerHTML = 'Generation 2';
    document.body.appendChild(h2);

    gp.nextGen();
});
