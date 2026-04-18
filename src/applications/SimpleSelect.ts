interface SimpleSelectOption {
  key: string;
  label: string;
  icon?: string;
  tooltip?: string;
}


function createButton(option: SimpleSelectOption): string {
  return `
    <button
      type="submit"
      ${option.tooltip ? ` data-tooltip="${option.tooltip}"` : ``}
      data-action="selectItem"
      data-key="${option.key}"
      >
        ${option.icon ? `<i class="${option.icon}"></i>` : ``}
        ${game.i18n?.localize(option.label) ?? option.label}
    </button>
  `;
}


export async function simpleSelect<t = string>(options: SimpleSelectOption[], title?: string, text?: string): Promise<t | undefined> {
  let resolved = false;
  return new Promise<t | undefined>((resolve, reject) => {
    new foundry.applications.api.DialogV2({
      window: { title },
      content: [
        ...(text ? [game.i18n?.localize(text) ?? text] : []),
        ...options.map(createButton),
      ].join("\n"),
      actions: {
        selectItem(e: Event, button: HTMLElement) {
          const key = button.dataset.key;
          resolved = true;
          resolve(key as t);
        }
      },
      buttons: [
        {
          action: "cancel",
          label: "Cancel",
          default: true,
          icon: "fa-solid fa-times"
        }],
      // eslint-disable-next-line @typescript-eslint/require-await
      submit: async () => {
        if (!resolved)
          resolve(undefined);
      }
    }).render({ force: true }).catch(reject);
  })


}