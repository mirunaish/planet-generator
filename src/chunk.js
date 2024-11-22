class Chunk {
  constructor(i, j) {
    this.i = i;
    this.j = j;

    this.center = { x: CHUNK_SIZE * i, y: 0, z: CHUNK_SIZE * j };

    this.ground = new Ground(this.center);
  }

  render() {
    // ground is rendered separately
    // but render everything else in the chunk here
  }
}
