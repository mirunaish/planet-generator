function key(i, j) {
  return i + ":" + j;
}

class Planet {
  constructor(gl) {
    this.gl = gl;

    this.camera = new Camera();
    this.chunks = {};

    this.manageChunks();
    this.setPlayerYCoord();
  }

  manageChunks() {
    const { i: curI, j: curJ } = this.currentChunk();

    // delete old chunks that are too far away
    for (let chunk of Object.values(this.chunks)) {
      if (
        Math.abs(chunk.i - curI) > RENDER_DISTANCE ||
        Math.abs(chunk.j - curJ) > RENDER_DISTANCE
      ) {
        console.log(`deleting chunk ${key(chunk.i, chunk.j)}`);
        delete this.chunks[key(chunk.i, chunk.j)];
      }
    }

    // create new chunks as player moves
    for (let i = curI - RENDER_DISTANCE; i <= curI + RENDER_DISTANCE; i++) {
      for (let j = curJ - RENDER_DISTANCE; j <= curJ + RENDER_DISTANCE; j++) {
        if (!(key(i, j) in this.chunks)) {
          console.log(`creating chunk ${key(i, j)}`);
          this.chunks[key(i, j)] = new Chunk(this.gl, i, j);
        }
      }
    }
  }

  /** get chunk that contains x and y coordinate */
  currentChunk() {
    const { x, z } = this.camera.position;
    const i = Math.floor((x + 8) / 16);
    const j = Math.floor((z + 8) / 16);
    return {
      i: i,
      j: j,
      chunk: this.chunks[key(i, j)],
    };
  }

  /**
   * set camera z coord to ground at the current location.
   * this function is called every time the player moves
   */
  setPlayerYCoord() {
    const { chunk } = this.currentChunk();
    const elevation = chunk.ground.height(this.camera.position);
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

    this.manageChunks(); // create or delete chunks as appropriate
    this.setPlayerYCoord(); // move player feet to ground height
  }

  render() {
    // render each chunk
    Object.values(this.chunks).forEach((chunk) =>
      chunk.render(this.gl, this.camera)
    );
  }
}
