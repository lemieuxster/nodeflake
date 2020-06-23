const idworker = require("../lib/idworker.js");
const worker = idworker.getIdWorker(0, 0);
const { performance } = require('perf_hooks');

const testTiming = () => {
  console.log("Timing Test - generating 1 million IDs");

  const startTimer = performance.now();

  for (var i = 0; i < 1000000; ++i) {
    worker.getId("test agent");
  }

  var endTimer = performance.now();

  console.log(endTimer - startTimer, "milliseconds");
}

const testUniqueness = () => {
  console.log("Timing Test - generating 1 million IDs and testing for uniqueness");


  const startTimer = performance.now();

  const idSet = new Set();
  for (var i = 0; i < 1000000; ++i) {
    const id = worker.getId("test agent");
    if (idSet.has(id)) {
      throw new Error("DUPLICATE ID FOUND");
    }

    idSet.add(id);
  }

  var endTimer = performance.now();
  console.log("Timing Test - generating 1 million IDs");
  console.log("generated", idSet.size, "unique ids");
  console.log(endTimer - startTimer, "milliseconds");
}

testTiming();
testUniqueness();