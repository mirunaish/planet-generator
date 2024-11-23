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
  }
}
