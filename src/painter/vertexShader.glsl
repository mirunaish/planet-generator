uniform mat4 Model;
uniform mat4 ModelViewProjection;

attribute vec3 Position;
attribute vec3 Normal;
attribute vec3 Color;
attribute vec2 TextureCoord;
attribute float Texture0Weight;
attribute float Texture1Weight;
attribute float Texture2Weight;
attribute float Texture3Weight;

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vColor;
varying vec2 vTextureCoord;
varying float vTexture0Weight;
varying float vTexture1Weight;
varying float vTexture2Weight;
varying float vTexture3Weight;

void main() {
    gl_Position = ModelViewProjection * vec4(Position, 1);
    vWorldPosition = (Model * vec4(Position, 1)).xyz;
    vNormal = (Model * vec4(Normal, 1)).xyz;
    vColor = Color;
    vTextureCoord = TextureCoord;
    vTexture0Weight = Texture0Weight;
    vTexture1Weight = Texture1Weight;
    vTexture2Weight = Texture2Weight;
    vTexture3Weight = Texture3Weight;
}
