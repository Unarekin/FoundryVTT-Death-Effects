#version 300 es

precision highp float;

uniform sampler2D uSampler;
in vec2 vTextureCoord;
out vec4 color;

uniform float progress;
uniform float block_size;
uniform vec2 pixel_size;

float random(vec2 uv) {
    return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 438.5453);
}


void main() {
    color = texture(uSampler, vTextureCoord);
    vec2 uv_snapped = floor(vTextureCoord / pixel_size / vec2(block_size));
    color.rgb /= color.a;
    color.a *= step(progress, random(uv_snapped));
    color.rgb *= color.a;
}