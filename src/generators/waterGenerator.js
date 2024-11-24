const WaterGenerator = {
  resolution: 32, // nb of verts in each direction

  color: COLORS.water,
  textureScale: 3,
  texture: "textures/water.jpg",

  waterSpeed: 0.00002,

  // TODO fancy water algorithm
  height: (pos) => {
    return 0;
  },

  textureCoords: (pos, center) => {
    return {
      u: ((pos.x - center.x) / CHUNK_SIZE + 0.5) * WaterGenerator.textureScale,
      v: ((pos.z - center.z) / CHUNK_SIZE + 0.5) * WaterGenerator.textureScale,
    };
  },

  generate: ({ center }) => {
    const resolution = WaterGenerator.resolution;

    const { vertices, faces } = plane(center, CHUNK_SIZE, resolution);
    const normals = [];
    const transparency = [];
    const textureWeights = [[]];
    const textureCoords = [];

    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        const v = vertices[i * (resolution + 1) + j];
        v.y += WaterGenerator.height(v);
        normals.push(normal(WaterGenerator.height, v)); // normal at this vertex
        transparency.push(
          clamp(-0.5 * GroundGenerator.height(v) + 0.3, 0.3, 1)
        );

        // texture weights at this vertex
        textureWeights[0].push(1);

        // texture coords at this vertex
        const coords = WaterGenerator.textureCoords(v, center);
        textureCoords.push(coords);
      }
    }

    return {
      vertices,
      faces,
      normals,
      transparency,
      textureWeights,
      textureCoordinates: textureCoords,
    };
  },

  animate: (textureCoordinates) => {
    return textureCoordinates.map((coord) => ({
      u: coord.u + ((WaterGenerator.waterSpeed * Date.now()) % 100),
      v: coord.v - ((WaterGenerator.waterSpeed * Date.now()) % 100),
    }));
  },
};
