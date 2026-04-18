export function templatePath(file: string): string {
  return `modules/${__MODULE_ID__}/templates/${file}.hbs`;
}