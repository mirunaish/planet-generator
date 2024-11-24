console.log("starting water worker");
const waterWorker = new Worker("src/webWorkers/generateWorker.js");
waterWorker.onerror = function (error) {
  console.error("water worker error:", error);
};

/** a chunk of water */
class Water {
  constructor(center) {
    this.center = { x: center.x, y: 0, z: center.z };
    this.name = `water:${center.x}:${center.z}`;

    this.subscribeToWorker();
    this.generate();
  }

  /** once vertices, faces etc have been generated, create a mesh object */
  updateMesh({
    vertices,
    faces,
    normals,
    transparency,
    textureCoordinates,
    textureWeights,
  }) {
    // worker returns normal data as objects, not vectors
    // need to convert to vectors again
    normals = normals.map((n) => new Vector(n.x, n.y, n.z));

    const mesh = new Mesh({
      vertices,
      faces,
      normals,
      transparency,
      textureCoordinates,
      textures: [WaterGenerator.texture],
      textureWeights,
    });
    this.mesh = mesh;
  }

  subscribeToWorker() {
    const callback = (e) => {
      const { caller, result } = e.data;

      if (caller !== this.name) return; // not for me

      // create a mesh from data given to me by worker
      this.updateMesh(result);
    };

    // when worker responds with data, update my stuff
    waterWorker.addEventListener("message", callback);
  }

  generate() {
    // ask water worker to generate water
    waterWorker.postMessage({
      type: "water",
      caller: this.name,
      center: this.center,
    });
  }

  render(camera) {
    // every frame, move texture a bit
    this.mesh.setTextureCoordinates(
      WaterGenerator.animate(this.mesh.textureCoordinates)
    );

    this.mesh.render(camera.model, camera.view, camera.projection);
  }
}
