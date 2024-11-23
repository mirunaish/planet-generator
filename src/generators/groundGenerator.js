const GroundGenerator = {
  heightSeed: RANDOM_SEED + 543,
  colorSeed: RANDOM_SEED + 1946,
  heightRandom: new Random(this.heightSeed),
  colorRandom: new Random(this.colorSeed),

  // constants for ground generation
  scale: 0.01, // noise scale
  octaves: 9, // noise octaves
  range: { min: -8, max: 20 }, // height range (roughly. may be +-20%)
  resolution: CHUNK_SIZE * 8, // nb of verts in each direction

  // constants for coloring
  cScale: 1,
  cOctaves: 10,
  cRange: { min: 0, max: 1 },
  // gradient from ground to grass
  gradient: getGradient(
    [...COLORS.ground, ...COLORS.grass],
    [0, 0.3, 0.6, 0.7, 0.8, 1]
  ),

  /** return height of ground at x and y coordinates */
  height: (pos) => {
    return GroundGenerator.heightRandom.noise(
      { x: pos.x, z: pos.z },
      GroundGenerator.scale,
      GroundGenerator.octaves,
      GroundGenerator.range
    );
  },

  /** calculate normal at this position */
  normal: (pos) => {
    const delta = 0.001;

    const dx =
      GroundGenerator.height({ x: pos.x + delta, z: pos.z }) -
      GroundGenerator.height({ x: pos.x - delta, z: pos.z });
    const dz =
      GroundGenerator.height({ x: pos.x, z: pos.z + delta }) -
      GroundGenerator.height({ x: pos.x, z: pos.z - delta });

    return new Vector(-dx / (delta * 2), 1, -dz / (delta * 2));
  },

  /** get color of ground at this position */
  color: (pos) => {
    const t = GroundGenerator.colorRandom.noise(
      { x: pos.x, z: pos.z },
      GroundGenerator.cScale,
      GroundGenerator.cOctaves,
      GroundGenerator.cRange
    );

    return GroundGenerator.gradient(t);
  },

  generate: (center) => {
    const resolution = GroundGenerator.resolution;

    const { vertices, faces } = plane(center, CHUNK_SIZE, resolution);
    const normals = [];
    const colors = [];

    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        const v = vertices[i * (resolution + 1) + j];
        v.y += GroundGenerator.height(v);
        normals.push(GroundGenerator.normal(v)); // normal at this vertex
        colors.push(GroundGenerator.color(v)); // color at this vertex
      }
    }

    return { vertices, faces, normals, colors };
  },
};
