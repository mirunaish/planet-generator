precision highp float;

const vec3 LightDirection = normalize(vec3(4, 3, 4));
const vec3 LightColor = vec3(1, 1, 0.9);

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vColor;

vec3 lambert() {
    vec3 color = LightColor *
            max(vec3(0), dot(normalize(vNormal), LightDirection));
    return color;
}

void main() {
    vec3 color = vColor;
    vec3 ambient = vec3(0.3, 0.35, 0.4);
    vec3 lightColor = lambert(); // amount of light on this area
    gl_FragColor = vec4(color * (lightColor + ambient * (vec3(1.0) - lightColor)), 1.0);
}
