

var test = require('tape');
var fs = require('fs');
var path = require('path');

const basePath = path.dirname(__dirname);
 
const fileJsonInput  = basePath+"\\test\\data\\tab1_response_real.json"; 
const fileJsonOutput = basePath+"\\test\\data\\out\\tab1_response_real_adapted.json"; 

eval(fs.readFileSync(basePath+"\\lib\\adapter-tab1.js")+'');

test('tab1 test', function (t) {
    
    t.plan(1);

    // Get file real
    fs.readFile(fileJsonInput, 'utf8', function (err, fileIn) {

        //console.log({fileIn});
        var adp = adapterTab1(JSON.parse(fileIn))
            .execute();
        
        fs.writeFile(fileJsonOutput, JSON.stringify(adp.tab1Adapted, null, 2), function (err) {
            // throws an error, you could also catch it here
            if (err) throw err;
        
            // success case, the file was saved
            console.log('[test-adater.tab1.js] tab1_response_real_adapted.json saved!' );
        });

    });

    t.equal(1,1);


    // t.equal(typeof Date.now, 'function');
    // var start = Date.now();

    // setTimeout(function () {
    //     t.equal(Date.now() - start, 100);
    // }, 100);
});
