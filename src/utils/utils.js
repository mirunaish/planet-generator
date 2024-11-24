// any necessary math functions etc go here

function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}

function lerpColor(a, b, t) {
  return {
    r: lerp(a.r, b.r, t),
    g: lerp(a.g, b.g, t),
    b: lerp(a.b, b.b, t),
  };
}

function clamp(x, a, b) {
  if (x < a) return a;
  if (x > b) return b;
  return x;
}

/**
 * get a gradient with given colors and their positions.
 * positions should be increasing from 0 to 1.
 * returns a function (t) => color:
 * for a t between 0 and 1, get the color at that position in the gradient
 */
function getGradient(colors, positions) {
  return (t) => {
    // t may be out of bounds, return edge colors
    if (t <= 0) return colors[0];
    if (t >= 1) return colors[colors.length - 1];

    // find colors to left and right of t
    let right = 0;
    while (t > positions[right]) right++;
    const left = right - 1;
    const c1 = colors[left];
    const c2 = colors[right];

    // scale t to be between 0 and 1 (distance between a and b)
    const weight = (t - positions[left]) / (positions[right] - positions[left]);

    // interpolate btw c1 and c2
    const r = c1.r + weight * (c2.r - c1.r);
    const g = c1.g + weight * (c2.g - c1.g);
    const b = c1.b + weight * (c2.b - c1.b);

    return { r, g, b };
  };
}

/** given a height function and a position, calculate normal at this position */
function normal(height, pos) {
  const delta = 0.001;

  const dx =
    height({ x: pos.x + delta, z: pos.z }) -
    height({ x: pos.x - delta, z: pos.z });
  const dz =
    height({ x: pos.x, z: pos.z + delta }) -
    height({ x: pos.x, z: pos.z - delta });

  return new Vector(-dx / (delta * 2), 1, -dz / (delta * 2));
}

/** get the normal to a triangular face in a mesh */
function calcFaceNormal({ vertices, faces }, faceIndex) {
  var v1 = vertices[faces[faceIndex][0]];
  var v2 = vertices[faces[faceIndex][1]];
  var v3 = vertices[faces[faceIndex][2]];

  var e1 = v2.subtract(v1);
  var e2 = v3.subtract(v1);

  return e1.cross(e2).unit();
}

/** compute normals at vertices */
function computeNormals(vertices, faces) {
  // initialize averaged normals to zero
  var avgNormals = Array(vertices.length).fill(new Vector(0, 0, 0));

  for (var i = 0; i < faces.length; ++i) {
    var faceNormal = calcFaceNormal({ vertices, faces }, i);
    for (var j = 0; j < faces[i].length - 2; ++j) {
      var v1 = faces[i][0];
      var v2 = faces[i][j + 1];
      var v3 = faces[i][j + 2];

      avgNormals[v1] = avgNormals[v1].add(faceNormal);
      avgNormals[v2] = avgNormals[v2].add(faceNormal);
      avgNormals[v3] = avgNormals[v3].add(faceNormal);
    }
  }

  // normalize normals
  for (var i = 0; i < avgNormals.length; ++i) {
    avgNormals[i] = avgNormals[i].unit();
  }

  return avgNormals;
}
