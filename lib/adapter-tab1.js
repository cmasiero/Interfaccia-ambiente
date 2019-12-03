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
    for (idxS in nodeOnlySource) {
      var linkOutput = _tab1RealJson.graph.links.filter(function (l) {
        if (nodeOnlySource[idxS].name === l.source) {
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
      nodeOnlySource[idxS].subnode_target = subnodeOutput;
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
      nodeOnlyTarget[idxT].subnode_source = subnodeInput;
    }

    // Node between nodeOnlySource and nodeOnlyTarget, they are 'in the middle'
    var nodeSourceTarget = nodeOnlySource.concat(nodeOnlyTarget);
    var nodeInTheMiddle = _tab1RealJson.graph.nodes.filter(function (n) {
      for (idx0 in nodeSourceTarget) {
        if (nodeSourceTarget[idx0].name === n.name) {
          return false;
        }
        if (nodeSourceTarget[idx0].subnode_source !== undefined) {
          for (idx1 in nodeSourceTarget[idx0].subnode_source) {
            if (nodeSourceTarget[idx0].subnode_source[idx1].name === n.name) {
              return false;
            }
          }
        }
        if (nodeSourceTarget[idx0].subnode_target !== undefined) {
          for (idx1 in nodeSourceTarget[idx0].subnode_target) {
            if (nodeSourceTarget[idx0].subnode_target[idx1].name === n.name) {
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

    /* Add nodes END */


    /*** Add links ***/

    adapter.jsonTab1.graph.links = [];
    linksTmp = [];


    const nodeOnlySourceUtil = nodeOnlySource.map(function (subnode) {
      var result = {};
      result.name = subnode.name;
      result.subnodeTargetArray = [];
      subnode.subnode_target.forEach(function (so) {
        result.subnodeTargetArray.push(so.name);
      });
      return result;
    });

    const nodeOnlyTargetUtil = nodeOnlyTarget.map(function (subnode) {
      var result = {};
      result.name = subnode.name;
      result.subnodeSourceArray = [];
      subnode.subnode_source.forEach(function (so) {
        result.subnodeSourceArray.push(so.name);
      });
      return result;
    });

    for (idx in _tab1RealJson.graph.links) {

      const l = _tab1RealJson.graph.links[idx];

      if (removeOnTheLeft()) {
        continue;
      }

      if (removeOnTheRight()) {
        continue;
      }

      if (changeBySubnodeSource()) {
        continue;
      }

      if (changeBySubnodeTarget()) {
        continue;
      }

      // No changes for this link
      var cloneL = Object.assign({}, l);
      adapter.jsonTab1.graph.links.push(cloneL);



      /**
       * Removes links between nodes on the left and first children.
       */
      function removeOnTheLeft() {
        var sourceUltil = nodeOnlySourceUtil.filter(function (elem) {
          return elem.name === l.source;
        });
        return (sourceUltil[0] !== undefined && sourceUltil[0].subnodeTargetArray.indexOf(l.target) !== -1);
      }

      /**
       * Removes links between nodes on the right and first parents.
       */
      function removeOnTheRight() {
        var targetUltil = nodeOnlyTargetUtil.filter(function (elem) {
          return elem.name === l.target;
        });
        return (targetUltil[0] !== undefined && targetUltil[0].subnodeSourceArray.indexOf(l.source) !== -1);
      }

      /**
       *  Change source by subnode_target
       */
      function changeBySubnodeTarget() {
        var result = false;
        for (idx1 in nodeOnlySourceUtil) {
          const nsu = nodeOnlySourceUtil[idx1];
          //console.log("-->" + l.source);
          //console.log({ nsu });
          for (idx2 in nsu.subnodeTargetArray) {
            //console.log("*" + nsu.subnodeTargetArray[idx2]);
            if (nsu.subnodeTargetArray[idx2] === l.source) {
              // console.log("*** " + l.source + " change in " + nsu.name);
              var cloneL = Object.assign({}, l);
              cloneL.source = nsu.name;
              adapter.jsonTab1.graph.links.push(cloneL);
              result = true;
            }
          }
        }
        return result;
      }

      // Change target by subnode_source
      function changeBySubnodeSource() {
        var result = false;
        for (idx1 in nodeOnlyTargetUtil) {
          const ntu = nodeOnlyTargetUtil[idx1];
          // console.log("-->" + l.source);
          //console.log({ ntu });
          for (idx2 in ntu.subnodeSourceArray) {
            //console.log("*" + nsu.subnodeTargetArray[idx2]);
            if (ntu.subnodeSourceArray[idx2] === l.target) {
              // console.log("*** " + l.target + " change in " + ntu.name);
              var cloneL = Object.assign({}, l);
              cloneL.target = ntu.name;
              adapter.jsonTab1.graph.links.push(cloneL);
              result = true;
            }
          }
        }
        return result;
      }

    }
    
    adapter.jsonTab1.graph.links.forEach(function (l) {
      var s = fixLink(l.source);
      l.source = (s === undefined) ? l.source : s;
      var t = fixLink(l.target);
      l.target = (t === undefined) ? l.target : t;
    });

    // var x = adapter.jsonTab1.graph.links;
    // console.log({x});

    function fixLink(value) {
      var result = undefined;
      for (idx1 in nodeOnlyTargetUtil) {
        const ntu = nodeOnlyTargetUtil[idx1];
        for (idx2 in ntu.subnodeSourceArray) {
          if (ntu.subnodeSourceArray[idx2] === value) {
            result = ntu.name;
            break;
          }
        }
      }

      for (idx1 in nodeOnlySourceUtil) {
        const ntu = nodeOnlySourceUtil[idx1];
        for (idx2 in ntu.subnodeTargetArray) {
          if (ntu.subnodeTargetArray[idx2] === value) {
            result = ntu.name;
            break;
          }
        }
      }

      return result;

    }

    /*** Add links END ***/

    //console.log({ x });
    return adapter;

  };

  return adapter;

};