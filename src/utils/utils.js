// any necessary math functions etc go here

/** get the normal to a triangular face in a mesh */
function calcFaceNormal(mesh, faceIndex) {
  var v1 = mesh.vertices[mesh.faces[faceIndex][0]];
  var v2 = mesh.vertices[mesh.faces[faceIndex][1]];
  var v3 = mesh.vertices[mesh.faces[faceIndex][2]];

  var e1 = v2.subtract(v1);
  var e2 = v3.subtract(v1);

  return e1.cross(e2).unit();
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
