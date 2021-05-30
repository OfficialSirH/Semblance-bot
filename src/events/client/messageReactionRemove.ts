import { Semblance } from "@semblance/src/structures";

export const messageReactionRemove = (client: Semblance) => {
    client.on("messageReactionRemove", (reaction, user) => {
        if (user.id == client.user.id) return;
    });
}