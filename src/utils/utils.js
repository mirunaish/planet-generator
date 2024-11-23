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
