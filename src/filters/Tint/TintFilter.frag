#version 300 es

precision highp float;

uniform sampler2D uSampler;
in vec2 vTextureCoord;
out vec4 color;

uniform vec3 tint;
uniform bool ignoreAlpha;

void main() {
    vec4 pixel = texture(uSampler, vTextureCoord);
    if (ignoreAlpha) {
        color = vec4(tint.r, tint.g, tint.b, 1.0);
    } else {
        color = vec4(tint.r * pixel.a, tint.g * pixel.a, tint.b * pixel.a, pixel.a);
    }
}