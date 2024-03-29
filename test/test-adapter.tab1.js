

var test = require('tape');
var fs = require('fs');
var path = require('path');

const basePath = path.dirname(__dirname);

const fileJsonInput = basePath + "\\test\\data\\tab1_response_real_fake.json";
const fileJsonOutput = basePath + "\\test\\data\\out\\tab1_response_real_adapted.json";

eval(fs.readFileSync(basePath + "\\lib\\adapter-tab1.js") + '');

test('tab1 test', function (t) {

    // Get file real
    fs.readFile(fileJsonInput, 'utf8', function (err, fileIn) {

        //console.log({fileIn});
        var adp = adapterTab1(JSON.parse(fileIn)).execute();

        fs.writeFile(fileJsonOutput, JSON.stringify(adp.jsonTab1, null, 2), function (err) {
            // throws an error, you could also catch it here
            if (err) throw err;

            // success case, the file was saved
            console.log('[test-adater.tab1.js] tab1_response_real_adapted.json saved!');
        });

        var subnodeOutputCount = 0;
        adp.jsonTab1.graph.nodes.forEach(n => {
            if (n.subnode_target !== undefined) {
                subnodeOutputCount += n.subnode_target.length;
            }
        });

        var subnodeInputCount = 0;
        adp.jsonTab1.graph.nodes.forEach(n => {
            if (n.subnode_source !== undefined) {
                subnodeInputCount += n.subnode_source.length;
            }
        });

        


        t.plan(4);
        t.equal(adp.jsonTab1.graph.nodes.length, 19);
        t.equal(subnodeOutputCount, 19);
        t.equal(subnodeInputCount, 16);
        t.equal(adp.jsonTab1.graph.links.length, 62);



    });




    // t.equal(typeof Date.now, 'function');
    // var start = Date.now();

    // setTimeout(function () {
    //     t.equal(Date.now() - start, 100);
    // }, 100);
});
