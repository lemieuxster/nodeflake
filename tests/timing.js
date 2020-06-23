const idworker = require("../lib/idworker.js");
const worker = idworker.getIdWorker(0, 0);
const { performance } = require('perf_hooks');

const testTiming = () => {
  console.log("Timing Test - generating 1 million IDs");

  const startTimer = performance.now();

  for (let i = 0; i < 1000000; ++i) {
    worker.getId("test agent");
  }

  const endTimer = performance.now();

  console.log(endTimer - startTimer, "milliseconds");
}

const testUniqueness = () => {
  console.log("Uniqueness Test - generating 1 million IDs and testing for uniqueness");


  const startTimer = performance.now();

  const idSet = new Set();
  for (let i = 0; i < 1000000; ++i) {
    const id = worker.getId("test agent");
    if (idSet.has(id)) {
      throw new Error("DUPLICATE ID FOUND");
    }

    idSet.add(id);
  }

  const endTimer = performance.now();
  console.log("Timing Test - generating 1 million IDs");
  console.log("generated", idSet.size, "unique ids");
  console.log(endTimer - startTimer, "milliseconds");
}

const testMultiServer = () => {
  console.log("Uniqueness Test - generating 1 million IDs with 5 workers");

  const worker1 = idworker.getIdWorker(1, 0);
  const worker2 = idworker.getIdWorker(2, 0);
  const worker3 = idworker.getIdWorker(3, 0);
  const worker4 = idworker.getIdWorker(4, 0);
  const worker5 = idworker.getIdWorker(5, 0);

  const workers = [worker, worker1, worker2, worker3, worker4, worker5];

  const startTimer = performance.now();

  const idSet = new Set();
  for (let i = 0; i < 1000000; ++i) {
    for (const worker of workers) {
      const id = worker.getId("test agent");
      idSet.add(id);
    }
  }

  if (idSet.size !== 1000000 * workers.length) {
    throw new Error('ID Set not large enough');
  }

  const endTimer = performance.now();
  console.log("Timing Test - generating 1 million IDs");
  console.log("generated", idSet.size, "unique ids");
  console.log(endTimer - startTimer, "milliseconds");
}

testTiming();
testUniqueness();
testMultiServer();
