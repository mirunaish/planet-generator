class Chunk {
  constructor(i, j) {
    this.i = i;
    this.j = j;

    this.center = { x: CHUNK_SIZE * i, y: 0, z: CHUNK_SIZE * j };

    this.generate();
  }

  generate() {
    // add ground
    this.ground = new Ground(this.center);

    // add water
    this.water = new Water(this.center);

    // add trees
    this.trees = [];

    for (let i = 0; i < TreeGenerator.treeDensity; i++) {
      let attempts = 0; // limit for attempts to find a place to generate tree
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        attempts++;

        const x = (Math.random() - 0.5) * CHUNK_SIZE + this.center.x;
        const z = (Math.random() - 0.5) * CHUNK_SIZE + this.center.z;

        if (this.canWalk(x, z)) {
          //not water or another tree, can place here
          const y = this.ground.height({ x, z }) - 0.5;
          const treeType = TreeGenerator.randomType();
          this.trees.push(new LSystemTree({ x, y, z }, treeType));
          break;
        }
      }
    }
  }

  doneGenerating() {
    // check that all workers are done generating
    if (!this.ground.mesh) return false;
    if (!this.water.mesh) return false;
    for (const tree of this.trees) {
      if (!tree.mesh) return false;
    }
    return true;
  }

  canWalk(x, z) {
    // check that i'm not in water
    if (this.ground.height({ x: x, z: z }) <= 0) return false;

    // check that there are no trees where i'm trying to walk
    for (let tree of this.trees) {
      if (tree.collision({ x, z })) return false;
    }

    return true;
  }

  render(camera) {
    if (!this.doneGenerating()) return;

    this.ground.render(camera);
    this.trees.forEach((t) => t.render(camera));
  }

  // water must be rendered last because it's transparent
  renderTransparent(camera) {
    if (!this.doneGenerating()) return;

    this.water.render(camera);
  }
}
