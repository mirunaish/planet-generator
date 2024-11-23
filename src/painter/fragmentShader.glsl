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
    gl_FragColor = vec4(color * lambert(), 1.0);
}
