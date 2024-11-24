const CloudGenerator = {
  resolution: 200,

  cloudSeed: RANDOM_SEED + 2747,
  cloudRandom: new Random(this.cloudSeed),

  scale: 3,
  octaves: 7,
  range: { min: -0.7, max: 1 },

  getColor: (pos) => {
    let noise = CloudGenerator.cloudRandom.noise3D(
      pos,
      CloudGenerator.scale,
      CloudGenerator.octaves,
      CloudGenerator.range
    );

    return clamp(noise, 0, 1);
  },

  generate: () => {
    const { vertices, faces } = sphere(
      { x: 0, y: 0, z: 0 },
      1, // radius
      CloudGenerator.resolution
    );
    const white = [];

    for (let i = 0; i < vertices.length; i++) {
      white.push(CloudGenerator.getColor(vertices[i]));
    }

    return { vertices, faces, white };
  },
};
