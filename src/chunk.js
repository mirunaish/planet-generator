class Chunk {
  constructor(gl, i, j) {
    this.gl = gl;
    this.i = i;
    this.j = j;

    this.center = { x: CHUNK_SIZE * i, y: 0, z: CHUNK_SIZE * j };

    this.ground = new Ground(this.center); 
    this.trees = []; // trees in scene

    this.generate();

    this.generateTrees(); 
    this.generateSmallTrees();
    this.generateLargeTrees();
    this.generateBushyTrees();
    this.generateCurvyTrees();
  }

  //create bamboo trees at different locations
  generateTrees() {
    const treePositions = [
      { x: this.center.x + 5, y: -2, z: this.center.z + 5 },
      { x: this.center.x - 5, y: -2, z: this.center.z - 5 },
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
        8, // Resolution
        0.0 // Decay Factor
      );
      this.trees.push(tree);
    }
  }

  //generate smaller plants at different locations 
  //create trees at different locations
  generateSmallTrees() {
    const treePositions = [
      { x: this.center.x + Math.random(), y: 0, z: this.center.z + Math.random() },
      { x: this.center.x - Math.random(), y: 0, z: this.center.z - Math.random() },
    ];

    for (const pos of treePositions) {
      const tree = new LSystemTree(
        pos,
        "F", // Axiom
        { F: "F[+F]F[-F]F" }, // Rule
        2, // Iterations
        1, // Length
        45, // Angle
        0.05, // Radius
        8, // Resolution
        0.2 // Decay Factor
      );
      this.trees.push(tree);
    }
  }

  //generate larger trees at different locations
  generateLargeTrees() {
    const treePositions = [
      { x: this.center.x + 8, y: -2, z: this.center.z + 8 },
      { x: this.center.x - 8, y: -2, z: this.center.z - 8 },
    ];

    for (const pos of treePositions) {
      const tree = new LSystemTree(
        pos,
        "F", // Axiom
        { F: "F[+F]F[-F]F" }, // Rule
        3, // Iterations
        2, // Length
        15, // Angle
        0.1, // Radius
        8, // Resolution
        0.0 // Decay Factor
      );
      this.trees.push(tree);
    }
  }

  //generate bushy trees at different locations
  generateBushyTrees() {
    const treePositions = [
      { x: this.center.x + 15, y: -2, z: this.center.z + 15 },
      { x: this.center.x - 15, y: -2, z: this.center.z - 15 },
    ];

    for (const pos of treePositions) {
      const tree = new LSystemTree(
        pos,
        "F", // Axiom
        { F: "F[+F[+F]]F[-F[-F]]" }, // Rule
        3, // Iterations
        2, // Length
        20, // Angle
        0.1, // Radius
        8, // Resolution
        0.5 // Decay Factor
      );
      this.trees.push(tree);
    }
  }

  //generate curvy trees at different locations
  generateCurvyTrees() {
    const treePositions = [
      { x: this.center.x + 20, y: -1, z: this.center.z + 5 },
      { x: this.center.x - 20, y: -1, z: this.center.z - 5 },
    ];

    for (const pos of treePositions) {
      const tree = new LSystemTree(
        pos,
        "F", // Axiom
        { F: "F → FF-[-F+F+F]+[+F-F-F]" }, // Rule
        2, // Iterations
        0.5, // Length
        15, // Angle
        0.1, // Radius
        8, // Resolution
        0.5 // Decay Factor
      );
      this.trees.push(tree);
    }
  }

  
  

  generate() {
    // add ground
    this.ground = new Ground(this.center);

    // add water
    this.water = new Water(this.center);
  }

  doneGenerating() {
    // check that all workers are done generating
    if (!this.ground.mesh) return false;
    if (!this.water.mesh) return false;
    return true;
  }

  render(camera) {
    if (!this.doneGenerating()) return;

    this.ground.render(camera);
    this.water.render(camera);
    LSystemTree.renderAll(this.gl, this.trees, camera);
  }
}
