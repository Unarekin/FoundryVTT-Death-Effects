import frag from "./default.frag";
import vert from "./default.vert"

function addGLESVersion(version: number, shader: string) {
  if (shader.includes(`#version ${version} es`)) return shader;

  const lines = shader.split("\n");
  const versionIndex = lines.findIndex(line => line.startsWith("#version"));
  if (versionIndex !== -1) {
    const version = lines.splice(versionIndex, 1);
    lines.unshift(...version);
  } else {
    lines.unshift(`#version ${version} es`);
  }

  return lines.join("\n");
}

export class CustomFilter<u extends Record<keyof u, unknown>> extends PIXI.Filter {
  constructor(vertex?: string, fragment?: string, uniforms?: u) {
    super(addGLESVersion(300, vertex ?? vert), addGLESVersion(300, fragment ?? frag), uniforms);
  }
}