var splitstr = ":"
exports.sourcekey = function (source, key) {
    return source + splitstr + key;
}

exports.desourcekey = function (sourcekey,source) {


    return sourcekey.substring(source.length+1);
     //(sourcekey.split(splitstr))[1];
}