const WaterGenerator = {
  resolution: CHUNK_SIZE, // nb of verts in each direction

  color: COLORS.water,
  textureScale: 3,
  texture: "textures/water.jpg",

  // TODO fancy water algorithm
  height: (pos) => {
    return 0;
  },

  textureCoords: (pos, center) => {
    return {
      u: ((pos.x - center.x) / CHUNK_SIZE + 0.5) * GroundGenerator.textureScale,
      v: ((pos.z - center.z) / CHUNK_SIZE + 0.5) * GroundGenerator.textureScale,
    };
  },

  generate: ({ center }) => {
    const resolution = WaterGenerator.resolution;

    const { vertices, faces } = plane(center, CHUNK_SIZE, resolution);
    const normals = [];
    const colors = [];
    const textureWeights = [[]];
    const textureCoords = [];

    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        const v = vertices[i * (resolution + 1) + j];
        v.y += WaterGenerator.height(v);
        normals.push(normal(WaterGenerator.height, v)); // normal at this vertex
        colors.push(WaterGenerator.color); // color at this vertex

        // texture weights at this vertex
        textureWeights[0].push(1);

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
