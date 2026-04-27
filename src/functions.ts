export function templatePath(file: string): string {
  return `modules/${__MODULE_ID__}/templates/${file}.hbs`;
}

export async function wait(duration: number) {
  return new Promise(resolve => { setTimeout(resolve, duration); });
}

export function uploadJSON<t = any>(): Promise<t> {
  return new Promise<t>((resolve, reject) => {
    const file = document.createElement("input");
    file.setAttribute("type", "file");
    file.setAttribute("accept", "application/json");
    file.onchange = e => {
      const file = (e.currentTarget as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error());
        return;
      }

      const reader = new FileReader();
      reader.onload = e => {
        if (!e.target?.result) throw new Error();
        if (typeof e.target.result === "string") resolve(JSON.parse(e.target.result) as t);
      }

      reader.readAsText(file);
    }

    file.onerror = (event, source, line, col, error) => {
      if (error) reject(error);
      else reject(new Error(typeof event === "string" ? event : typeof undefined));
    }

    file.click();
  })
}

export function downloadJSON(json: object, name: string) {
  const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
  const objUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objUrl;
  link.download = name.endsWith(".json") ? name : `${name}.json`;
  link.click();
  URL.revokeObjectURL(objUrl);
}
