//References: used ChatGPT to help with debuggin

console.log("starting L system worker");
const lSystemWorker = new Worker("src/webWorkers/generateWorker.js");
lSystemWorker.onerror = function (error) {
  console.error("L system worker error:", error);
};

class LSystemTree {
  constructor(position, type) {
    this.name = `tree:${position.x}:${position.z}`;

    this.position = position;
    this.type = type;

    this.subscribeToWorker();
    this.generate();
  }

  /**
   * check if position is inside collision box of this tree
   * collision box is a square around the tree
   */
  collision({ x, z }) {
    const treeSize = TreeGenerator.types[this.type].radius;
    const collision =
      Math.abs(this.position.x - x) < treeSize &&
      Math.abs(this.position.z - z) < treeSize;
    if (collision)
      console.log("collided with tree!!!", { x, z }, this.position);
    return collision;
  }

  /** once vertices, faces etc have been generated, create a mesh object */
  updateMesh({ vertices, faces, normals, colors }) {
    // worker returns normal data as objects, not vectors
    // need to convert to vectors again
    normals = normals.map((n) => new Vector(n.x, n.y, n.z));

    this.mesh = new Mesh({ vertices, faces, normals, colors });
  }

  subscribeToWorker() {
    const callback = (e) => {
      const { caller, result } = e.data;

      if (caller !== this.name) return; // not for me

      // create a mesh from data given to me by worker
      this.updateMesh(result);
    };

    // when worker responds with data, update my stuff
    lSystemWorker.addEventListener("message", callback);
  }

  /** generate vertices of plane with height */
  generate() {
    // ask tree worker to generate the tree mesh for me
    // worker will respond with a message when it's done
    lSystemWorker.postMessage({
      type: "tree",
      caller: this.name,
      position: this.position,
      treeType: this.type,
    });
  }

  render(camera) {
    if (!this.mesh) return; // waiting for worker to generate the mesh

    // the time and the amplitude and the speed for the swaying of trees
    const time = performance.now() / 1000;
    const swayAmplitude = 0.1;
    const swaySpeed = 1.0;

    // height of tree
    const maxTreeHeight = Math.max(...this.mesh.vertices.map((v) => v.y));

    // apply sway to vertices
    const animatedVertices = this.mesh.vertices.map((vertex) => {
      // damping for more sway near top of trees
      const damping = vertex.y / maxTreeHeight;

      // swaying in the x and z axis
      const swayX =
        damping * swayAmplitude * Math.sin(swaySpeed * time + vertex.y);
      const swayZ =
        damping * swayAmplitude * 0.5 * Math.cos(swaySpeed * time + vertex.y);

      return new Vector(vertex.x + swayX, vertex.y, vertex.z + swayZ);
    });

    // render using animated mesh
    this.mesh.setVertices(animatedVertices);
    this.mesh.render(camera.model, camera.view, camera.projection);
  }
}
