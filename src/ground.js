/** a single chunk of ground */
class Ground {
  // use the same rng for all ground instances, so they line up at the edges
  random = new Random(RANDOM_SEED + 937565);

  // constants for ground generation
  scale = 0.01; // noise scale
  octaves = 10; // noise octaves
  range = { min: -8, max: 20 }; // height range (roughly. may be +-20%)
  resolution = CHUNK_SIZE * 5; // nb of verts in each direction. one per 10cm

  constructor(center) {
    this.center = center;
    this.color = [0.5, 0.5, 0.5]; // grey
    this.generate();
    this.logRange();
  }

  /** return height of ground at x and y coordinates */
  height(pos) {
    return (
      this.center.y +
      this.random.noise(
        { x: pos.x, z: pos.z },
        this.scale,
        this.octaves,
        this.range
      )
    );
  }

  /** generate vertices of plane with height */
  generate() {
    const { vertices, faces } = plane(this.center, CHUNK_SIZE, this.resolution);

    for (let i = 0; i <= this.resolution; i++) {
      for (let j = 0; j <= this.resolution; j++) {
        const v = vertices[i * (this.resolution + 1) + j];
        v.y = this.height(v);
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

  /** render all ground in all visible chunks, making sure they connect */
  static renderAll(gl, allGround, camera) {
    // TODO

    // for now, make a mesh of each ground and render it
    // i will eventually have to combine all grounds into a single mesh
    allGround
      .map((g) => new Mesh(gl, g.vertices, g.faces))
      .forEach((m) => m.render(camera.model, camera.view, camera.projection));
  }
}
