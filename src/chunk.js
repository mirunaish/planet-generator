class Chunk {
  constructor(gl, i, j) {
    this.gl = gl;
    this.i = i;
    this.j = j;

    this.center = { x: CHUNK_SIZE * i, y: 0, z: CHUNK_SIZE * j };

    this.ground = new Ground(this.center); 
    this.trees = []; // trees in scene

    this.generateTrees(); 
  }

  //create trees at different locations
  generateTrees() {
    const treePositions = [
      { x: this.center.x + 5, y: 0, z: this.center.z + 5 },
      { x: this.center.x - 5, y: 0, z: this.center.z - 5 },
    ];

    for (const pos of treePositions) {
      const tree = new LSystemTree(
        pos,
        "F", // Axiom
        { F: "F[+F]F[-F]F" }, // Rule
        3, // Iterations
        2, // Length
        1.5, // Angle
        0.1, // Radius
        8 // Resolution
      );
      this.trees.push(tree);
    }
  }

  
  render(camera) {
    // Render ground (handled separately in Ground)
    //this.ground.render();

    // render the trees
    LSystemTree.renderAll(this.gl, this.trees, camera);
  }
}
