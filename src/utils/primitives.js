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



/** Returns vertices and triangle faces of a cylinder */
function cylinder(center, radius, height, radialResolution) {
  const vertices = [];
  const faces = [];

  // vertices
  for (let i = 0; i <= radialResolution; i++) {
    const angle = (i / radialResolution) * 2 * Math.PI;
    const x = center.x + radius * Math.cos(angle);
    const z = center.z + radius * Math.sin(angle);

    vertices.push(new Vector(x, center.y, z)); // bottom circle
    vertices.push(new Vector(x, center.y + height, z)); // top circle
  }

  // center vertices for caps
  const bottomCenter = vertices.length;
  vertices.push(new Vector(center.x, center.y, center.z));
  const topCenter = vertices.length;
  vertices.push(new Vector(center.x, center.y + height, center.z));

  // faces
  for (let i = 0; i < radialResolution; i++) {
    const v1 = i * 2;
    const v2 = v1 + 1;
    const v3 = (i * 2 + 2) % (radialResolution * 2);
    const v4 = (v3 + 1) % (radialResolution * 2);

    // Side faces
    faces.push([v1, v3, v4]);
    faces.push([v1, v4, v2]);

    // Bottom cap
    faces.push([v1, bottomCenter, v3]);

    // Top cap
    faces.push([v4, topCenter, v2]);
  }

  return { vertices, faces };
}

