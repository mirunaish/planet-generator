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


//cylinder function
function cylinder(startPosition, endPosition, radius, radialResolution, transform) {
  const vertices = [];
  const faces = [];

  // direction
  const direction = new Vector(
    endPosition.x - startPosition.x,
    endPosition.y - startPosition.y,
    endPosition.z - startPosition.z
  );

  // height
  const height = direction.length();
  direction.unit();

  // vertices
  for (let i = 0; i <= radialResolution; i++) {
    const angle = (i / radialResolution) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);

    // Bottom base
    const bottomVertex = new Vector(
      startPosition.x + x,
      startPosition.y,
      startPosition.z + z
    );
    vertices.push(bottomVertex);

    // Top cap
    const topVertex = new Vector(
      endPosition.x + x,
      endPosition.y,
      endPosition.z + z
    );
    const transformedTopVertex = transform ? transform.transformPoint(topVertex) : topVertex;
    vertices.push(transformedTopVertex);
  }

  // Add center vertices for the caps
  const bottomCenter = vertices.length;
  vertices.push(new Vector(startPosition.x, startPosition.y, startPosition.z));
  const topCenter = vertices.length;
  vertices.push(new Vector(endPosition.x, endPosition.y, endPosition.z));

  // faces for the sides, bottom, and top caps
  for (let i = 0; i < radialResolution; i++) {
    const v1 = i * 2;
    const v2 = v1 + 1;
    const v3 = (i * 2 + 2) % (radialResolution * 2);
    const v4 = (v3 + 1) % (radialResolution * 2);

    // Side faces
    faces.push([v1, v3, v4]);
    faces.push([v1, v4, v2]);

    // Bottom cap faces
    faces.push([v1, bottomCenter, v3]);

    // Top cap faces
    faces.push([v4, topCenter, v2]);
  }

  return { vertices, faces };
}


