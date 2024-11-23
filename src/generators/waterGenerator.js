const WaterGenerator = {
  resolution: CHUNK_SIZE, // nb of verts in each direction

  color: COLORS.water,

  // TODO fancy water algorithm
  height: (pos) => {
    return 0;
  },

  generate: ({ center }) => {
    const resolution = WaterGenerator.resolution;

    const { vertices, faces } = plane(center, CHUNK_SIZE, resolution);
    const normals = [];
    const colors = [];

    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        const v = vertices[i * (resolution + 1) + j];
        v.y += WaterGenerator.height(v);
        normals.push(normal(WaterGenerator.height, v)); // normal at this vertex
        colors.push(WaterGenerator.color); // color at this vertex
      }
    }

    return { vertices, faces, normals, colors };
  },
};
