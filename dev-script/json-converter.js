var fs = require('fs');
var path = require('path');

var modelPath = path.dirname(__dirname) + '/data/model/'; 
var outPath = path.dirname(__dirname) + '/data/'; 


fs.readFile(modelPath + 'tab1_response.json', 'utf8', function(err, fileIn) {

    // console.log(fileIn);
    var jsonIn = JSON.parse(fileIn);

    var jsonOut = {};
    // Add request
    jsonOut.request = jsonIn.request;
    // Init array
    jsonOut.table = [];

    // Add table
    Object.keys(jsonIn.table).forEach(function(tRoot) {
        
        var tRootPart = tRoot.split("**");
        
        Object.keys(jsonIn.table[tRoot]).forEach(function (tChild) {
            console.log('[tChild] ' + tChild);
        });
        
        jsonOut.table.push({ "head":{ "layer":tRootPart[0], "direzione":tRootPart[1], "mps_rifiuto":tRootPart[2] } });

        //console.log('[] ' + tRoot + " " + typeof tRootPart);
        // add head to table, example  "head" : {"layer" : "FINALI", "direzione" : "MPS", "mps_rifiuto" : "TOTALE"}
        
        //jsonOut.table

        //jsonOut.table.tRootPart.push({"a": "b"});
        //jsonOut.table.tRootPart = {"a": "b"};

        //console.log('[**] ' + );
        
      });

    //console.log('[json-converter] File output');
    // console.log(JSON.stringify(jsonOut,null,2));
});
 

