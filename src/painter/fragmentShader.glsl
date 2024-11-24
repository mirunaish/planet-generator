precision highp float;

const vec3 LightDirection = normalize(vec3(4, 3, 4));
const vec3 LightColor = vec3(1, 1, 0.9);

varying vec3 vWorldPosition;
varying vec3 vNormal;

varying vec3 vColor;
varying float vTransparency;
uniform bool uUseTransparency;

varying vec2 vTextureCoord;
uniform int uUseTextures; // how many textures to use

// up to 4 different textures
uniform sampler2D uSampler0;
uniform sampler2D uSampler1;
uniform sampler2D uSampler2;
uniform sampler2D uSampler3;

varying float vTexture0Weight;
varying float vTexture1Weight;
varying float vTexture2Weight;
varying float vTexture3Weight;

vec3 lambert() {
    vec3 color = LightColor *
            max(vec3(0), dot(normalize(vNormal), LightDirection));
    return color;
}

vec3 textureColor() {
    vec3 color = vec3(0);
    if (uUseTextures >= 1) color += texture2D(uSampler0, vTextureCoord).rgb * vTexture0Weight;
    if (uUseTextures >= 2) color += texture2D(uSampler1, vTextureCoord).rgb * vTexture1Weight;
    if (uUseTextures >= 3) color += texture2D(uSampler2, vTextureCoord).rgb * vTexture2Weight;
    if (uUseTextures >= 4) color += texture2D(uSampler3, vTextureCoord).rgb * vTexture3Weight;
    return color;
}

void main() {
    vec3 color = vec3(0.0, 0.0, 0.0);
    if (uUseTextures == 0) color = vColor;
    float transparency = 1.0;
    if (uUseTransparency) transparency = vTransparency;

    vec3 texture = textureColor();

    vec3 ambient = vec3(0.3, 0.35, 0.4);
    vec3 lightColor = lambert(); // amount of light on this area

    gl_FragColor = vec4((color + texture) * (lightColor + ambient * (vec3(1.0) - lightColor)), transparency);
}
