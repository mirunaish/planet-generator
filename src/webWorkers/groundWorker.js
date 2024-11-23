// import stuff separately because worker doesn't have access to the DOM
importScripts("../utils/consts.js");
importScripts("../utils/primitives.js");
importScripts("../utils/random.js");
importScripts("../utils/utils.js");
importScripts("../../res/openSimplexNoise.js");
importScripts("../../res/vector.js");
importScripts("../generators/groundGenerator.js");

console.log("ground worker has been started");

// listen for caller telling me to do stuff
self.onmessage = (e) => {
  const args = e.data;
  const result = GroundGenerator.generate(args.center);

  // send result back to caller
  self.postMessage({ caller: args.caller, result });
};
