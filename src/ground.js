console.log("starting ground worker");
const groundWorker = new Worker("src/webWorkers/generateWorker.js");
groundWorker.onerror = function (error) {
  console.error("ground worker error:", error);
};

/** a single chunk of ground */
class Ground {
  constructor(center) {
    this.center = { x: center.x, y: 0, z: center.z };
    this.name = `ground:${center.x}:${center.z}`;

    this.subscribeToWorker();
    this.generate();
  }

  /** once vertices, faces etc have been generated, create a mesh object */
  updateMesh({
    vertices,
    faces,
    normals,
    colors,
    textureCoordinates,
    textureWeights,
  }) {
    // worker returns normal data as objects, not vectors
    // need to convert to vectors again
    normals = normals.map((n) => new Vector(n.x, n.y, n.z));

    this.mesh = new Mesh(
      vertices,
      faces,
      normals,
      colors,
      textureCoordinates,
      [
        GroundGenerator.groundTexture,
        GroundGenerator.grassTexture,
        GroundGenerator.sandTexture,
        GroundGenerator.snowTexture,
      ],
      textureWeights
    );
  }

  subscribeToWorker() {
    const callback = (e) => {
      const { caller, result } = e.data;

      if (caller !== this.name) return; // not for me

      // create a mesh from data given to me by worker
      this.updateMesh(result);
    };

    // when worker responds with data, update my stuff
    groundWorker.addEventListener("message", callback);
  }

  /**
   * return height of ground at x and y coordinates.
   * if you update this, make sure to update groundGenerator.js too
   */
  height(pos) {
    return GroundGenerator.height(pos);
  }

  /** generate vertices of plane with height */
  generate() {
    // ask ground worker to generate terrain for me
    // worker will respond with a message when it's done
    groundWorker.postMessage({
      type: "ground",
      caller: this.name,
      center: this.center,
    });
  }

  render(camera) {
    if (!this.mesh) return; // waiting for generator
    this.mesh.render(camera.model, camera.view, camera.projection);
  }
}
