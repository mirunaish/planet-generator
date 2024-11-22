class Chunk {
  constructor(i, j) {
    this.i = i;
    this.j = j;

    this.ground = new Ground();
  }

  render() {
    this.ground.render();
  }
}
