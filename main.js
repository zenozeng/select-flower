var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var target = document.getElementById('target');
var source = document.getElementById('source');
var ready = function(fn) {
    if (target.width > 0 && source.width > 0) {
        fn();
    } else {
        setTimeout(function() {
            ready(fn);
        }, 10);
    }
};

ready(function() {
    var w = target.width;
    var h = target.height;
    canvas.width = w;
    canvas.height = h;

    ctx.drawImage(target, 0, 0, w, h);
    target = ctx.getImageData(0, 0, w, h);
    ctx.drawImage(source, 0, 0, w, h);
    source = ctx.getImageData(0, 0, w, h);

    var gp = new GP(window.ops, ['R', 'G', 'B']);
    gp.log();
    gp.nextGen();
    gp.log();
    gp.nextGen();
    gp.log();
});
