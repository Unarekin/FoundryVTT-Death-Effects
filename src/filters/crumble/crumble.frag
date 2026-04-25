#version 300 es

precision highp float;

uniform sampler2D uSampler;
in vec2 vTextureCoord;
out vec4 color;

uniform float progress;
uniform float floatDist;
uniform vec2 textureSize;
uniform float direction;

float random(vec2 uv) {
	return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 438.5453);
}


void main() {
    float progress_rand_range = 0.2;

    float v = 1. - (floatDist / textureSize.y);
    
    float p = progress * (1.0 + (v + progress_rand_range) * 2.0) - v -
        progress_rand_range + random(vTextureCoord) * progress_rand_range;

    float q = smoothstep(p - v * 2.0, p, vTextureCoord.y);
    if (direction == -1.)
      q = smoothstep(p - v * 2.0, p, 1.0 - vTextureCoord.y);

    float mapped_uv_y = vTextureCoord.y + v - v * q * step(q, 1.);
    if (direction == -1.)
        mapped_uv_y = vTextureCoord.y - v + v * q * step(q, 1.);


    color = texture(uSampler, vec2(vTextureCoord.x, mapped_uv_y));
    color.rgb /= color.a;
    color.a -= 1.0 - q;
    color.rgb *= color.a;
}