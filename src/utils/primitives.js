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
      const x = corner.x + size * (i / resolution);
      const z = corner.z + size * (j / resolution);

      vertices.push(new Vector(x, corner.y, z));
    }
  }

  // construct faces
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
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

/** returns vertices and triangle faces of a sphere */
function sphere(center, radius, resolution) {
  const vertices = [];
  const faces = [];

  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      // two angles, one around y axis and one around x
      const theta = (i / resolution) * Math.PI;
      const phi = (j / resolution) * Math.PI * 2;

      const point = {
        x: center.x + radius * Math.sin(theta) * Math.cos(phi),
        y: center.y + radius * Math.cos(theta),
        z: center.z + radius * Math.sin(theta) * Math.sin(phi),
      };

      vertices.push(new Vector(point.x, point.y, point.z));
    }
  }

  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const v1 = i * (resolution + 1) + j;
      const v2 = i * (resolution + 1) + j + 1;
      const v3 = (i + 1) * (resolution + 1) + j;
      const v4 = (i + 1) * (resolution + 1) + j + 1;

      // two faces for each square
      faces.push([v1, v2, v4]);
      faces.push([v1, v4, v3]);
    }
  }

  return { vertices, faces };
}
