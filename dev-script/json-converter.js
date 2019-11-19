var fs = require('fs');
var path = require('path');

var modelPath = path.dirname(__dirname) + '/data/model/';
var outPath = path.dirname(__dirname) + '/data/';


fs.readFile(modelPath + 'tab1_response.json', 'utf8', function (err, fileIn) {

    var jsonIn = JSON.parse(fileIn);
    var jsonOut = {};
    // Add request
    jsonOut.request = jsonIn.request;
    // Init array
    jsonOut.table = [];

    // Add table
    for (const tRoot in jsonIn.table) {

        var tRootElements = tRoot.split("**");
        var tChildElements = [];

        // Builds value array
        for (const child in jsonIn.table[tRoot]) {
            var as = child.split("**");
            var tChild = { "unit": as[0], "data": as[1], "tipo": as[2], "qty": jsonIn.table[tRoot][child] };
            tChildElements.push(tChild);
        }
        /* adds head and values */
        jsonOut.table.push({
            "head": { "layer": tRootElements[0], "direzione": tRootElements[1], "mps_rifiuto": tRootElements[2] },
            "value": tChildElements
        });

    }


    /* Adds graph */
    jsonOut.graph = {};
    /* Add nodes array */ 
    jsonOut.graph.nodes = [];
    for (const key in jsonIn.graph.nodeDict) {

        var nodeResult = {};
        nodeResult.name = key;
        for (const keyInside0 in jsonIn.graph.nodeDict[key]) {
            const valueInside1 = jsonIn.graph.nodeDict[key][keyInside0];
            nodeResult[keyInside0] = valueInside1;
        }
        jsonOut.graph.nodes.push(nodeResult);

    }

    /* Add links  */
    jsonOut.graph.links = [];
    for (const key in jsonIn.graph.edgeDict) {
        // console.log('[*]' + key);
        var as = key.split("**");
        // console.log('[XXX]' + jsonIn.graph.edgeDict[key].tons);
        jsonOut.graph.links.push({"source": as[0],"target": as[1],"tons": jsonIn.graph.edgeDict[key].tons});

    }


    /* Writes output on file */
    fs.writeFile(outPath + "tab1_response_real.json", JSON.stringify(jsonOut, null, 2), function (err) {

        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });


});


