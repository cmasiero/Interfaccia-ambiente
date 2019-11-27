var san = function() {

    var san = {name: "Mario"}, name = "john", surname  = "smith";

    san.concatName = function(_){
        if (!arguments.length) return name;
        console.log('[]' + name);
        //san.name = +_;
        san.name += _;
        console.log('[*]' + san.name);
        return san;
    }

    san.concatSurName = function(_){
        if (!arguments.length) return surName;
        surname = +_;
        return san;
    }

    return san;

};


var x = san().concatName("pippo");

console.log('[]' + x.name);

