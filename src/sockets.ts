import { DeathEffectsConfig, DeathPlaceable, SocketMessage } from "types"

// let socket: any;

const SOCKET_IDENTIFIER = `module.${__MODULE_ID__}`;

function createMessage<t extends SocketMessage = SocketMessage>(message: Partial<t>): t {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    id: foundry.utils.randomID(),
    timestamp: Date.now(),
    sender: game.user?.id ?? "",
    ...message
  } as any;
}


Hooks.once("ready", () => {
  if (!game.socket) throw new Error(`Socket not initialized`);

  game.socket.on(SOCKET_IDENTIFIER, (message: SocketMessage) => {
    // Early exit
    if (!message.users.includes((game.user as User).id ?? "")) return;


    switch (message.type) {
      case "play": {
        // TODO: Get this to actually type guard.  May require multiple message types
        const { target, config } = (message as { target: string, config: DeathEffectsConfig });
        const token = canvas?.scene?.tokens.get(target);
        if (!token?.object) return console.warn(`Unable to locate token to execute death effects: ${target}`);
        (token.object as unknown as DeathPlaceable).playDeathEffects(config, true).catch(console.error);
      }
    }
  });
});

export function SendSocketMessage<t extends SocketMessage>(message: Partial<t>) {
  if (!game?.socket) throw new Error(`Socket not initialized`);
  game.socket.emit(SOCKET_IDENTIFIER, createMessage(message));
}