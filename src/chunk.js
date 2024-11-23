class Chunk {
  constructor(gl, i, j) {
    this.gl = gl;
    this.i = i;
    this.j = j;

    this.center = { x: CHUNK_SIZE * i, y: 0, z: CHUNK_SIZE * j };

    this.ground = new Ground(this.center);

    this.generate();
  }

  generate() {
    // add ground
    this.ground = new Ground(this.center);

    // add water
    this.water = new Water(this.center);

    // add trees
    this.trees = new Trees(this.center);
  }

  doneGenerating() {
    // check that all workers are done generating
    if (!this.ground.mesh) return false;
    if (!this.water.mesh) return false;
    return true;
  }

  canWalk(x, z) {
    // check that i'm not in water
    if (this.ground.height({ x: x, z: z }) <= 0.1) return false;

    // check that there are no trees where i'm trying to walk
    // TODO

    return true;
  }

  render(camera) {
    if (!this.doneGenerating()) return;

    this.ground.render(camera);
    this.water.render(camera);
    // this.trees.render(camera);
  }
}
