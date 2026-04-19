export function templatePath(file: string): string {
  return `modules/${__MODULE_ID__}/templates/${file}.hbs`;
}

export async function wait(duration: number) {
  return new Promise(resolve => { setTimeout(resolve, duration); });
}