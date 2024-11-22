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
  for (let x = corner.x; x < corner.x + size; x += size / resolution) {
    for (let z = corner.z; z < corner.z + size; z += size / resolution) {
      vertices.push(new Vector(x, corner.y, z));
    }
    // last column (of each row):
    // make it equal to corner + size to avoid numerical precision issues
    vertices.push(new Vector(x, corner.y, corner.z + size));
  }
  // last row:
  for (let z = corner.z; z < corner.z + size; z += size / resolution) {
    vertices.push(new Vector(corner.x + size, corner.y, z));
  }

  // construct faces
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const v1 = i * resolution + j;
      const v2 = i * resolution + j + 1;
      const v3 = (i + 1) * resolution + j;
      const v4 = (i + 1) * resolution + j + 1;

      faces.push([v1, v2, v4]);
      faces.push([v1, v4, v3]);
    }
  }

  return { vertices, faces };
}
