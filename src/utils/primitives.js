/** returns vertices and triangle faces of a square flat plane */
function plane(center, size, resolution) {
  const corner = {
    x: center.x - size / 2,
    y: center.y,
    z: center.z - size / 2,
  };

  const vertices = [];
  const faces = [];

  // generate all vertices
  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      const x = corner.x + i * (size / resolution);
      const z = corner.z + j * (size / resolution);

      vertices.push(new Vector(x, corner.y, z));
    }
  }

  // construct faces
  for (let i = 0; i < resolution - 1; i++) {
    for (let j = 0; j < resolution - 1; j++) {
      const v1 = i * (resolution + 1) + j;
      const v2 = i * (resolution + 1) + j + 1;
      const v3 = (i + 1) * (resolution + 1) + j;
      const v4 = (i + 1) * (resolution + 1) + j + 1;

      faces.push([v1, v2, v4]);
      faces.push([v1, v4, v3]);
    }
  }

  return { vertices, faces };
}
