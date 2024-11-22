/** a single chunk of ground */
class Ground {
  // use the same rng for all ground instances, so they line up at the edges
  random = new Random(RANDOM_SEED + 937565);

  // constants for ground generation
  octaves = 4; // noise octaves
  range = { min: -8, max: 20 }; // height range (roughly. may be +-20%)
  resolution = CHUNK_SIZE * 10; // nb of verts in each direction. one per 10cm

  constructor(center) {
    this.center = center;
    this.color = [0.5, 0.5, 0.5]; // grey
    this.generate();
    this.logRange();
  }

  /** return height of ground at x and y coordinates */
  height(pos) {
    return this.center.y; // + this.random.noise({ x: pos.x, y:pos.z }, this.octaves, this.range) / 20
  }

  /** generate vertices of plane with height */
  generate() {
    const { vertices, faces } = plane(this.center, CHUNK_SIZE, this.resolution);

    for (let x = 0; x < this.resolution; x++) {
      for (let z = 0; z < this.resolution; z++) {
        const v = vertices[x * this.resolution + z];
        v.y = this.height({ x: v.x, z: v.z });
      }
    }

    this.vertices = vertices;
    this.faces = faces;
  }

  /** log the minimum and maximum height to the console: for debugging purposes */
  logRange() {
    let min = Infinity;
    let max = -Infinity;
    for (let v of this.vertices) {
      min = Math.min(min, v.y);
      max = Math.max(max, v.y);
    }
    console.log(`min: ${min}, max: ${max}`);
  }

  render() {
    // TODO
  }

  /** render all ground in all visible chunks, making sure they connect */
  static renderAll(allGround) {
    // TODO
  }
}
