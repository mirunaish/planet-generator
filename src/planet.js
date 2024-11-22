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

  move(running, movingForward, movingLeft, movingRight, movingBackward) {
    if (movingForward && movingBackward) movingBackward = false;
    if (movingLeft && movingRight) {
      movingLeft = false;
      movingRight = false;
    }

    const direction = new Vector(
      movingForward ? 1 : movingBackward ? -1 : 0,
      0,
      movingLeft ? 1 : movingRight ? -1 : 0
    ).unit();
    this.camera.move(direction, running ? RUNNING_SPEED : MOVEMENT_SPEED);

    this.setPlayerYCoord(); // move player feet to ground height
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
