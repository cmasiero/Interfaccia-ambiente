/**
  * Adapter for real tab1 json file.
  * It makes a file with node container and child nodes.
 */

var adapterTab1 = function (_tab1RealJson) {

  var adapter = {
    jsonTab1: {}
  };

  /**
   * Check if node is source/destination of one or more nodes
   * @param {node to check} n 
   * @param {'source' or 'target'} direction 
   */
  var isInDirection = function (n, direction) {
    for (const l in _tab1RealJson.graph.links) {
      if (_tab1RealJson.graph.links[l][direction] === n.name) {
        return true;
      }
    }
    return false;
  }

  adapter.execute = function () {

    /* Add request to adapted */
    adapter.jsonTab1.request = _tab1RealJson.request;
    /* Add table to adapted */
    adapter.jsonTab1.table = _tab1RealJson.table;

    /* Add nodes */
    // They are on the left in the diagram.
    var nodeOnlySource = _tab1RealJson.graph.nodes.filter(function (n) {
      return !isInDirection(n, "target");
    });

    // They are on the right in the diagram.
    var nodeOnlyTarget = _tab1RealJson.graph.nodes.filter(function (n) {
      return !isInDirection(n, "source");
    });

    // add subnode-output
    for (ns in nodeOnlySource) {
      var linkOutput = _tab1RealJson.graph.links.filter(function (l) {
        if (nodeOnlySource[ns].name === l.source) {
          return true;
        }
      });
      var subnodeOutput = _tab1RealJson.graph.nodes.filter(function (n) {
        for (lo in linkOutput) {
          if (linkOutput[lo].target === n.name) {
            return true
          }
        }
      });
      nodeOnlySource[ns].subnode_output = subnodeOutput;
    }

    // Add subnode-input
    for (idxT in nodeOnlyTarget) {
      var linkInput = _tab1RealJson.graph.links.filter(function (l) {
        if (nodeOnlyTarget[idxT].name === l.target) {
          return true;
        }
      });
      var subnodeInput = _tab1RealJson.graph.nodes.filter(function (n) {
        for (idxI in linkInput) {
          if (linkInput[idxI].source === n.name) {
            return true
          }
        }
      });
      nodeOnlyTarget[idxT].subnode_input = subnodeInput;
    }

    // Node between nodeOnlySource and nodeOnlyTarget, they are 'in the middle'
    var nodeSourceTarget = nodeOnlySource.concat(nodeOnlyTarget);
    var nodeInTheMiddle = _tab1RealJson.graph.nodes.filter(function (n) {
      for (idx0 in nodeSourceTarget) {
        if (nodeSourceTarget[idx0].name === n.name) {
          return false;
        }
        if (nodeSourceTarget[idx0].subnode_input !== undefined) {
          for (idx1 in nodeSourceTarget[idx0].subnode_input) {
            if (nodeSourceTarget[idx0].subnode_input[idx1].name === n.name) {
              return false;
            }
          }
        }
        if (nodeSourceTarget[idx0].subnode_output !== undefined) {
          for (idx1 in nodeSourceTarget[idx0].subnode_output) {
            if (nodeSourceTarget[idx0].subnode_output[idx1].name === n.name) {
              return false;
            }
          }
        }
      }
      return true;
    });

    // console.log({nodeOnlySource});
    //console.log({nodeInTheMiddle});
    //console.log({nodeOnlyTarget});

    adapter.jsonTab1.graph = {};
    adapter.jsonTab1.graph.nodes = nodeOnlySource.concat(nodeInTheMiddle).concat(nodeOnlyTarget);
    /* Add nodes END*/

    /* Add links */
    // Add links for subnode_output owner's
    var linksSubnodeOutputOwner = [];
    nodeOnlySource.forEach(function (nsource) {
      // console.log('[nsource.name]'+nsource.name);
      nsource.subnode_output.forEach(function (snode) {
        // console.log('[snode.name]'+snode.name);
        var links = _tab1RealJson.graph.links.filter(function (l1) {
          if (snode.name === l1.source) {
            return true;
          }
        });
        // console.log({links});
        links.forEach(function (l) {
          const cloneL = Object.assign({}, l);
          cloneL.source_subnode = snode.name;
          cloneL.source = nsource.name;
          linksSubnodeOutputOwner.push(cloneL);
        });
      });
    });
    // console.log({linksSubnodeOutputOwner});

    // Add links in the middle, they are the same of the original.
    var nitmMap = nodeInTheMiddle.map(function (n) {
      return n.name;
    });
    //console.log(nitmMap);
    var linkInTheMiddle = _tab1RealJson.graph.links.filter(function (l) {
      //console.log( l.source +  ' ' + nitmMap.indexOf(l.source));
      if (nitmMap.indexOf(l.source) !== -1 && nitmMap.indexOf(l.target) !== -1) {
        return true;
      }
    });

    var linksSubnodeInputOwner = [];
    nodeOnlyTarget.forEach(function (ntarget) {
      // console.log('[ntarget.name]'+ntarget.name);
      ntarget.subnode_input.forEach(function (snode) {
        // console.log('[snode.name]'+snode.name);
        var links = _tab1RealJson.graph.links.filter(function (l1) {
          if (snode.name === l1.target) {
            return true;
          }
        });
        // console.log({ links });
        links.forEach(function (l) {
          const cloneL = Object.assign({}, l);
          cloneL.target_subnode = snode.name;
          cloneL.target = ntarget.name;
          linksSubnodeInputOwner.push(cloneL);
        });
      });
    });

    // console.log({linkInTheMiddle});
    //console.log('[size]'+ linkInTheMiddle.length);

    adapter.jsonTab1.graph.links = linksSubnodeOutputOwner.concat(linkInTheMiddle).concat(linksSubnodeInputOwner);

    // Correggi link che hanno come target un nodo che è diventato un subnode_input
    // direttamente da un subnode output
    var subnodeInputName = nodeOnlyTarget.map(function(n){
      n.subnode_input.forEach(function (s){
        console.log('[]' + s.name);
        return s.name;
      });
      //return n.subnode_input.name;
    });
    console.log({subnodeInputName});
    // adapter.jsonTab1.graph.links.forEach(function (lFix) {
    //      console.log({ lFix });

    // });
    // nodeOnlyTarget.forEach(function (nt){
    //   console.log({nt});
    // });



    return adapter;

  };

  return adapter;

};