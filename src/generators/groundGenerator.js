const GroundGenerator = {
  resolution: 100, // nb of verts in each direction

  heightSeed: RANDOM_SEED + 543,
  colorSeed: RANDOM_SEED + 1946,

  colorRandom: new Random(this.colorSeed),

  // constants for ground generation
  scale: 0.01, // noise scale
  octaves: [0, 1, 2, 4], // noise octaves
  range: { min: -8, max: 20 }, // height range (roughly. may be +-20%)

  // gradient from ground to grass
  grassGradient: getGradient(COLORS.grass, [0, 0.75, 1]),
  groundGradient: getGradient(COLORS.ground, [0, 0.5, 1]),
  sandGradient: getGradient(COLORS.sand, [0, 0.5, 1]),
  snowGradient: getGradient(COLORS.snow, [0, 0.5, 1]),

  /** return height of ground at x and y coordinates */
  height: (pos) => {
    return GroundGenerator.colorRandom.noise(
      { x: pos.x, z: pos.z },
      GroundGenerator.scale,
      GroundGenerator.octaves,
      GroundGenerator.range
    );
  },

  /** get color of ground at this position */
  color: (pos) => {
    const grassT = GroundGenerator.colorRandom.noise(
      pos,
      25, // scale
      3, // octaves
      { min: 0, max: 1 }
    );
    const groundT = GroundGenerator.colorRandom.noise(
      pos,
      2, // scale
      10, // octaves
      { min: 0, max: 1 }
    );
    const sandT = GroundGenerator.colorRandom.noise(
      pos,
      30, // scale
      3, // octaves
      { min: 0, max: 1 }
    );
    const snowT = GroundGenerator.colorRandom.noise(
      pos,
      0.2, // scale
      [1, 2, 10], // octaves
      { min: 0, max: 1 }
    );

    const grassColor = GroundGenerator.grassGradient(grassT);
    const groundColor = GroundGenerator.groundGradient(groundT);
    const sandColor = GroundGenerator.sandGradient(sandT);
    const snowColor = GroundGenerator.snowGradient(snowT);

    // pick / interpolate between ground and grass colors based on normal
    let k = normal(GroundGenerator.height, pos).unit().y;

    k = clip((k - 0.85) * 10, 0, 1);

    let color = lerpColor(groundColor, grassColor, k);
    // if close to shore, draw sand
    color = lerpColor(sandColor, color, clip(pos.y - 0.5, 0, 1));
    // if high up, draw snow
    color = lerpColor(color, snowColor, clip(pos.y - 15, 0, 1));

    return color;
  },

  generate: ({ center }) => {
    const resolution = GroundGenerator.resolution;

    const { vertices, faces } = plane(center, CHUNK_SIZE, resolution);
    const normals = [];
    const colors = [];

    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        const v = vertices[i * (resolution + 1) + j];
        v.y += GroundGenerator.height(v);
        normals.push(normal(GroundGenerator.height, v)); // normal at this vertex
        colors.push(GroundGenerator.color(v)); // color at this vertex
      }
    }

    return { vertices, faces, normals, colors };
  },
};
