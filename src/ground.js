/** a single chunk of ground */
class Ground {
  // use the same rng for all ground instances, so they line up at the edges
  heightRandom = new Random(RANDOM_SEED + 937565);
  colorRandom = new Random(RANDOM_SEED + 5735401);

  // constants for ground generation
  scale = 0.01; // noise scale
  octaves = 9; // noise octaves
  range = { min: -8, max: 20 }; // height range (roughly. may be +-20%)
  resolution = CHUNK_SIZE * 10; // nb of verts in each direction. one per 10cm

  // constants for coloring
  cScale = 1;
  cOctaves = 10;
  cRange = { min: 0, max: 1 };
  // gradient from ground to grass
  gradient = COLORS.gradient(
    [...COLORS.ground, ...COLORS.grass],
    [0, 0.3, 0.6, 0.7, 0.8, 1]
  );

  constructor(center) {
    this.center = center;

    this.vertices = [];
    this.faces = [];
    this.normals = [];
    this.colors = [];

    this.generate();
    this.logRange();

    this.mesh = new Mesh(this.vertices, this.faces, this.normals, this.colors);
  }

  /** return height of ground at x and y coordinates */
  height(pos) {
    return (
      this.center.y +
      this.heightRandom.noise(
        { x: pos.x, z: pos.z },
        this.scale,
        this.octaves,
        this.range
      )
    );
  }

  /** calculate normal at this position */
  normal(pos) {
    const delta = 0.001;
    const dx =
      this.height({ x: pos.x + delta, z: pos.z }) -
      this.height({ x: pos.x - delta, z: pos.z });
    const dz =
      this.height({ x: pos.x, z: pos.z + delta }) -
      this.height({ x: pos.x, z: pos.z - delta });

    return new Vector(-dx / (delta * 2), 1, -dz / (delta * 2));
  }

  /** get color of ground at this position */
  color(pos) {
    const t = this.colorRandom.noise(
      { x: pos.x, z: pos.z },
      this.cScale,
      this.cOctaves,
      this.cRange
    );

    return this.gradient(t);
  }

  /** generate vertices of plane with height */
  generate() {
    const { vertices, faces } = plane(this.center, CHUNK_SIZE, this.resolution);

    for (let i = 0; i <= this.resolution; i++) {
      for (let j = 0; j <= this.resolution; j++) {
        const v = vertices[i * (this.resolution + 1) + j];
        v.y = this.height(v);
        this.normals.push(this.normal(v)); // normal at this vertex
        this.colors.push(this.color(v)); // color at this vertex
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

  render(camera) {
    this.mesh.render(camera.model, camera.view, camera.projection);
  }
}
