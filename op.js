var createOp = function(fn) {
    return function(imgdata1, imgdata2) {
        var w = imgdata1.width;
        var h = imgdata1.height;
        var imgdata = new ImageData(w, h);
        var d = imgdata.data;
        var d1 = imgdata1.data;
        var d2 = imgdata2.data;
        for (var i = 0; i < d1.length; i++) {
            d[i] = (i + 1) % 4 === 0 ? 255 : fn(d1[i], d2[i], i);
        }
        return imgdata;
    };
};

var sub = createOp(function(v1, v2, i) {
    return v1 - v2;
});

var add = createOp(function(v1, v2, i) {
    return Math.min(v1 + v2, 255);
});

var mul = createOp(function(v1, v2) {
    return Math.min(v1 * v2, 255);
});

var invert = createOp(function(v1) {
    return 255 - v1;
});

var binarization = createOp(function(v) {
    return v > 128 ? 255 : 0;
});

var ops = ['add', 'sub', 'mul', 'invert', 'binarization'];
