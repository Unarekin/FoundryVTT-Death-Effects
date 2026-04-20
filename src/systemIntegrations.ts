import { DefaultDeathEffectsConfig } from "settings"

function setTriggerResource(resource: string) {
  DefaultDeathEffectsConfig.autoTriggerCondition = "resource";
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  (DefaultDeathEffectsConfig as any).resource = resource;
}

function setTriggerStatus(status: string) {
  DefaultDeathEffectsConfig.autoTriggerCondition = "status";
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  (DefaultDeathEffectsConfig as any).statusEffect = status;
}

export const SystemIntegrations: Record<string, (() => void)> = {
  dnd4e() { setTriggerResource("attributes.hp.value"); },
  dnd5e() { setTriggerResource("attributes.hp"); },
  exaltedessence() { setTriggerResource("health.value"); },
  exaltedthird() { setTriggerResource("health.value"); },
  projectfu() { setTriggerStatus("ko"); },
}