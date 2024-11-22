class Planet {
  constructor(gl) {
    this.camera = new Camera();
    this.chunks = [new Chunk(0, 0)];

    // this mesh will store and render all vertices and faces for all objects
    this.mesh = new Mesh(
      gl,
      this.chunks[0].ground.vertices,
      this.chunks[0].ground.faces
    );

    this.setPlayerYCoord();
  }

  /** get chunk that contains x and y coordinate */
  currentChunk({ x, y }) {
    // TODO
  }

  /**
   * set camera z coord to ground at the current location.
   * this function is called every time the player moves
   */
  setPlayerYCoord() {
    const elevation = this.chunks[0].ground.height(this.camera.position);
    this.camera.position.y = elevation + PLAYER_HEIGHT;
    this.camera.setView();
  }

  render() {
    // render each chunk with everything included in it
    // this.chunks.forEach((chunk) => chunk.render());

    this.mesh.render(
      this.camera.model,
      this.camera.view,
      this.camera.projection
    );
  }
}
