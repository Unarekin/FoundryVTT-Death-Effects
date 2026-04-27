#version 300 es

precision highp float;

uniform sampler2D uSampler;
in vec2 vTextureCoord;
out vec4 color;

uniform float progress;
uniform float seed;

uniform vec2 direction;
uniform float vignette_strength;
uniform vec2 vignette_center;


float random (vec2 uv) {
    return fract(sin(dot(uv.xy,
        vec2(12.9898,78.233))) * 43758.5453123);
}


void main() {
  // color = texture(uSampler, vTextureCoord);

  vec2 center = vec2(0.5);
  float circle_grad = 1. - distance(vTextureCoord, center) * 3.;
  vec2 offset = vec2(random(vTextureCoord * seed), random(vTextureCoord * seed));
  offset.x = clamp(offset.x, 0., 0.5);
  offset.y = clamp(offset.y, 0., 1.5);

  vec2 offset_uv = offset;
  offset_uv = offset_uv * progress + vTextureCoord + direction * progress;
  
  float circle_clip = distance(vTextureCoord, vignette_center);

  color = texture(uSampler, offset_uv);
  color.rgb /= color.a;
  color.a = (color.a - clamp(offset.x * progress, 0.0, 3.0) - progress) - circle_clip * progress * vignette_strength * 3.0;
  color.rgb *= color.a;
}