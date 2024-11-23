class Chunk {
  constructor(gl, i, j) {
    this.i = i;
    this.j = j;

    this.center = { x: CHUNK_SIZE * i, y: 0, z: CHUNK_SIZE * j };

    this.ground = new Ground(gl, this.center);
  }

  render(gl, camera) {
    // ground is rendered separately
    // but render everything else in the chunk here
    this.ground.render(camera);
  }
}
