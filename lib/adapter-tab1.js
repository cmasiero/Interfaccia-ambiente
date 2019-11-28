/**
  * Adapter for real tab1 json file.
  * It makes a file with node container and child nodes.
 */

var adapterTab1 =  function (_tab1RealJson) {

    var adapter = {
      tab1Adapted: {}
    };

    adapter.execute = function() {

      /* Add request to adapted */
      adapter.tab1Adapted.request = _tab1RealJson.request;
      /* Add table to adapted */
      adapter.tab1Adapted.table   = _tab1RealJson.table;

      /* Add nodes */
      // They are on the left in the diagram.
      var nodeOnlySource = _tab1RealJson.graph.nodes.filter(function (n) {
        return !isInDirection(n,"target");
      });

      // They are on the right in the diagram.
      var nodeOnlyTarget = _tab1RealJson.graph.nodes.filter(function (n) {
        return !isInDirection(n,"source");
      });

      // add subnode-output
      for (ns in nodeOnlySource) {
        var linkOutput = _tab1RealJson.graph.links.filter(function (l) {
          if (nodeOnlySource[ns].name === l.source){
            return true;
          }
        });
        var subnodeOutput = _tab1RealJson.graph.nodes.filter(function (n) {
          for (lo in linkOutput){
            if (linkOutput[lo].target === n.name){
              return true
            }
          }
        });
        nodeOnlySource[ns].subnode_output = subnodeOutput;
      }

      // Add subnode-input
      for (idxT in nodeOnlyTarget) {
        var linkInput = _tab1RealJson.graph.links.filter(function (l) {
          if (nodeOnlyTarget[idxT].name === l.target){
            return true;
          }
        });
        var subnodeInput = _tab1RealJson.graph.nodes.filter(function (n) {
          for (idxI in linkInput){
            if (linkInput[idxI].source === n.name){
              return true
            }
          }
        });
        nodeOnlyTarget[idxT].subnode_input = subnodeInput;
      }

      // Node in between nodeOnlySource and nodeOnlyTarget, they are 'in the middle'
      var nodeSourceTarget = nodeOnlySource.concat(nodeOnlyTarget);
      var nodeInTheMiddle = _tab1RealJson.graph.nodes.filter(function (n) {
        for (idx0 in nodeSourceTarget) {
          if (nodeSourceTarget[idx0].name === n.name) {
            return false;
          }
          if (nodeSourceTarget[idx0].subnode_input !== undefined){
            for (idx1 in nodeSourceTarget[idx0].subnode_input){
              if (nodeSourceTarget[idx0].subnode_input[idx1].name === n.name){
                return false;
              }
            }
          }
          if (nodeSourceTarget[idx0].subnode_output !== undefined){
            for (idx1 in nodeSourceTarget[idx0].subnode_output){
              if (nodeSourceTarget[idx0].subnode_output[idx1].name === n.name){
                return false;
              }
            }
          }
        }
        return true;
      });
      
      // console.log({nodeOnlySource});
      // console.log({nodeInTheMidlle});
      // console.log({nodeOnlyTarget});

      adapter.tab1Adapted.graph = {};
      adapter.tab1Adapted.graph.nodes = nodeOnlySource.concat(nodeInTheMiddle).concat(nodeOnlyTarget);
      /* Add nodes END*/

      return adapter;

    };
    

    /**
     * Check if node is source/destination of one or more nodes
     * @param {node to check} n 
     * @param {'source' or 'target'} direction 
     */
    var isInDirection = function(n,direction) {
      for (const l in _tab1RealJson.graph.links) {
        if ( _tab1RealJson.graph.links[l][direction] === n.name) {
          return true;
        }
      }
      return false;
    }

    return adapter;

};