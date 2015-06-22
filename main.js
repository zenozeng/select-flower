var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var target = document.getElementById('target');
var source = document.getElementById('source');
var result = document.getElementById('result');

var ready = function(fn) {
    if (target.width > 0 && target.height > 0 && source.width > 0 && source.height > 0) {
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

var draw = function(imgdata) {
    var c = document.createElement('canvas');
    c.width = imgdata.width;
    c.height = imgdata.height;
    c.getContext('2d').putImageData(imgdata, 0, 0);
    document.body.appendChild(c);
};

ready(function() {
    var w = target.width;
    var h = target.height;
    canvas.width = w;
    canvas.height = h;
    result.width = w;
    result.height = h;

    ctx.drawImage(target, 0, 0, w, h);
    target = ctx.getImageData(0, 0, w, h);

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(source, 0, 0, w, h);
    source = ctx.getImageData(0, 0, w, h);

    img.R = getR(source, source);
    img.G = getG(source, source);
    img.B = getB(source, source);

    draw(img.R);
    draw(img.G);
    draw(img.B);

    var fitness = function(fn) {
        var res = (new Function("return " + fn))();
        res = binarization(res, res);
        var fitness = 1 - diff(res, target);
        return fitness;
    };

    var display = function(fn) {
        var res = (new Function("return " + fn))();
        res = binarization(res, res);
        var fitness = 1 - diff(res, target);

        document.body.appendChild(document.createElement('hr'));

        var c = document.createElement('canvas');
        c.style.float = "right";
        c.width = w;
        c.height = h;
        document.body.appendChild(c);

        // don't block
        setTimeout(function() {
            var ctx = c.getContext('2d');
            ctx.putImageData(res, 0, 0);
        }, 1);

        var pre = document.createElement('pre');
        pre.innerHTML = fn;
        document.body.appendChild(pre);

        var div = document.createElement('div');
        div.innerHTML = JSON.stringify({fitness: fitness});
        document.body.appendChild(div);
    };

    var gp = new GP(window.ops, ['R', 'G', 'B'], fitness);

    var gcount = 1;
    var ng = function() {
        document.body.appendChild(document.createElement('hr'));
        var h2 = document.createElement('h2');
        h2.innerHTML = 'Generation ' + gcount;
        document.body.appendChild(h2);

        gp.nextGen();
        gp.log();

        gp.programs.forEach(function(p) {
            display(gp.tree2fn(p));
        });

        gcount++;
    };

    var limit = 20;
    var ngint = setInterval(function() {
        limit--;
        if (limit < 0) {
            clearInterval(ngint);
        }
        ng();
    }, 1000);
});
