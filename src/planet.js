function key(i, j) {
  return i + ":" + j;
}

class Planet {
  constructor() {
    this.camera = new Camera();
    this.chunks = { [key(0, 0)]: new Chunk(0, 0) };

    this.sky = new Sky();

    this.manageChunks();
    this.setPlayerYCoord();
  }

  createChunk(i, j) {
    if (key(i, j) in this.chunks) return;
    console.log(`creating chunk ${key(i, j)}`);
    this.chunks[key(i, j)] = new Chunk(i, j);
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

    // create new chunks as player moves (if they don't already exist)
    this.createChunk(curI, curJ); // just in case 0 wasn't generated
    for (let d = 1; d <= RENDER_DISTANCE; d++) {
      // create all chunks at distance d
      for (let i = -d; i <= d; i++) {
        this.createChunk(curI + i, curJ - d);
        this.createChunk(curI + i, curJ + d);
      }
      for (let j = -d; j <= d; j++) {
        this.createChunk(curI - d, curJ + j);
        this.createChunk(curI + d, curJ + j);
      }
      // this will get the corners twice but that's fine
    }
  }

  /** get chunk that contains x and y coordinate */
  getChunk(x, z) {
    const i = Math.floor((x + 8) / 16);
    const j = Math.floor((z + 8) / 16);
    return {
      i: i,
      j: j,
      chunk: this.chunks[key(i, j)],
    };
  }

  /** get chunk that contains camera coordinates */
  currentChunk() {
    const { x, z } = this.camera.position;
    return this.getChunk(x, z);
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

  canWalk(x, z) {
    const { chunk } = this.getChunk(x, z);
    if (!chunk.doneGenerating()) return false;
    return chunk.canWalk(x, z);
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

    const speed = running ? RUNNING_SPEED : WALKING_SPEED;

    // calculate new position after moving
    const newX =
      this.camera.position.x +
      direction.x * -Math.sin(-(Math.PI * this.camera.yaw) / 180) * speed +
      direction.z * -Math.cos(-(Math.PI * this.camera.yaw) / 180) * speed;
    const newZ =
      this.camera.position.z +
      direction.x * -Math.cos(-(Math.PI * this.camera.yaw) / 180) * speed +
      direction.z * +Math.sin(-(Math.PI * this.camera.yaw) / 180) * speed;

    if (!this.canWalk(newX, newZ)) return;

    this.camera.move(newX, newZ);

    this.manageChunks(); // create or delete chunks as appropriate
    this.setPlayerYCoord(); // move player feet to ground height
  }

  render() {
    this.sky.render(this.camera);

    // render each chunk
    Object.values(this.chunks).forEach((chunk) => chunk.render(this.camera));
    // water must be rendered last because it's transparent
    Object.values(this.chunks).forEach((chunk) =>
      chunk.renderTransparent(this.camera)
    );
  }
}
