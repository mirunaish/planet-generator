// import stuff separately because worker doesn't have access to the DOM
importScripts("../../res/openSimplexNoise.js");
importScripts("../../res/vector.js");
importScripts("../utils/consts.js");
importScripts("../utils/primitives.js");
importScripts("../utils/random.js");
importScripts("../utils/utils.js");

importScripts("../generators/groundGenerator.js");
importScripts("../generators/waterGenerator.js");

console.log("worker has started");

const functions = {
  ground: GroundGenerator.generate,
  water: WaterGenerator.generate,
};

// listen for caller telling me to do stuff
self.onmessage = (e) => {
  const { type, caller, ...args } = e.data;

  const generate = functions[type];

  const result = generate(args);

  // send result back to caller
  self.postMessage({ caller, result });
};
