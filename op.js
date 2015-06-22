var createOp = function(fn) {
    return function(imgdata1, imgdata2) {
        var w = imgdata1.width;
        var h = imgdata1.height;
        var imgdata = new ImageData(w, h);
        var d = imgdata.data;
        var d1 = imgdata1.data;
        var d2 = imgdata2.data;
        for (var i = 0; i < d1.length; i++) {
            d[i] = (i + 1) % 4 === 0 ? 255 : fn(d1[i], d2[i], i, d1, d2);
        }
        return imgdata;
    };
};

var sub = createOp(function(v1, v2) {
    return v1 - v2;
});

var add = createOp(function(v1, v2) {
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

var getR = createOp(function(_1, _2, i, d1) {
    i = parseInt(i / 4) * 4;
    return d1[i];
});

var getG = createOp(function(_1, _2, i, d1) {
    i = parseInt(i / 4) * 4;
    return d1[i+1];
});

var getB = createOp(function(_1, _2, i, d1) {
    i = parseInt(i / 4) * 4;
    return d1[i+2];
});

var diff = function(imgData1, imgData2) {
    var _diff = function(imgData1, imgData2) {
        var count = 0;
        for (var i = 0; i < imgData1.data.length; i += 1) {
            if (imgData1.data[i] != imgData2.data[i]) {
                count++;
            }
        }
        return count / (imgData1.width * imgData1.height * 4);
    };
    return Math.min(_diff(imgData1, imgData2),
                    _diff(invert(imgData1, imgData1), imgData2));
};

var ops = ['add', 'sub', 'mul', 'invert'];
