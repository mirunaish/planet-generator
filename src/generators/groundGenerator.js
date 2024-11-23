const GroundGenerator = {
  resolution: 100, // nb of verts in each direction

  heightSeed: RANDOM_SEED + 543,
  colorSeed: RANDOM_SEED + 1946,

  colorRandom: new Random(this.colorSeed),

  // constants for ground generation
  scale: 0.01, // noise scale
  octaves: 10, // noise octaves
  range: { min: -8, max: 20 }, // height range (roughly. may be +-20%)

  // color gradients (currently unused)
  grassGradient: getGradient(COLORS.grass, [0, 0.75, 1]),
  groundGradient: getGradient(COLORS.ground, [0, 0.5, 1]),
  sandGradient: getGradient(COLORS.sand, [0, 0.5, 1]),
  snowGradient: getGradient(COLORS.snow, [0, 0.5, 1]),

  // textures
  textureScale: 3, // how many textures in a chunk
  groundTexture: "textures/ground3.jpg",
  grassTexture: "textures/grass.jpg",
  sandTexture: "textures/sand2.jpg",
  snowTexture: "textures/snow.jpg",

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

    k = clamp((k - 0.85) * 10, 0, 1);

    let color = lerpColor(groundColor, grassColor, k);
    // if close to shore, draw sand
    color = lerpColor(sandColor, color, clamp(pos.y - 0.5, 0, 1));
    // if high up, draw snow
    color = lerpColor(color, snowColor, clamp(pos.y - 15, 0, 1));

    return color;
  },

  textureCoords: (pos, center) => {
    return {
      u: ((pos.x - center.x) / CHUNK_SIZE + 0.5) * GroundGenerator.textureScale,
      v: ((pos.z - center.z) / CHUNK_SIZE + 0.5) * GroundGenerator.textureScale,
    };
  },

  /** get color of ground at this position */
  textureWeights: (pos) => {
    // interpolate between ground and grass textures based on normal
    let groundWeight = normal(GroundGenerator.height, pos).unit().y;
    groundWeight = 1 - clamp((groundWeight - 0.85) * 10, 0, 1);

    const sandWeight = 1 - clamp(pos.y - 0.5, 0, 1);
    const snowWeight = clamp(pos.y - 15, 0, 1);

    // ground, grass, sand, snow
    const weights = [
      groundWeight * (1 - sandWeight - snowWeight),
      (1 - groundWeight) * (1 - sandWeight - snowWeight),
      sandWeight,
      snowWeight,
    ];

    return weights;
  },

  generate: ({ center }) => {
    const resolution = GroundGenerator.resolution;

    const { vertices, faces } = plane(center, CHUNK_SIZE, resolution);
    const normals = [];
    const colors = [];
    const textureWeights = [[], [], [], []];
    const textureCoords = [];

    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        const v = vertices[i * (resolution + 1) + j];
        v.y += GroundGenerator.height(v);
        normals.push(normal(GroundGenerator.height, v)); // normal at this vertex

        // texture weights at this vertex
        const weights = GroundGenerator.textureWeights(v);
        textureWeights[0].push(weights[0]);
        textureWeights[1].push(weights[1]);
        textureWeights[2].push(weights[2]);
        textureWeights[3].push(weights[3]);

        // texture coords at this vertex
        const coords = GroundGenerator.textureCoords(v, center);
        textureCoords.push(coords);
      }
    }

    return {
      vertices,
      faces,
      normals,
      colors,
      textureWeights,
      textureCoordinates: textureCoords,
    };
  },
};
