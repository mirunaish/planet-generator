uniform mat4 Model;
uniform mat4 ModelViewProjection;

attribute vec3 Position;
attribute vec3 Normal;
// attribute vec3 Color;

varying vec3 vWorldPosition;
varying vec3 vNormal;
// varying vec3 vColor;

void main() {
    gl_Position = ModelViewProjection * vec4(Position, 1);
    vWorldPosition = (Model * vec4(Position, 1)).xyz;
    vNormal = (Model * vec4(Normal, 1)).xyz;
    // vColor = Color;
}
