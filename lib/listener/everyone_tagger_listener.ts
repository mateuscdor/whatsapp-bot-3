import {
  isJidGroup,
  proto,

  WASocket,
} from "@adiwajshing/baileys";
import { getUserGroupLevel } from "../utils/group_utils";
import {getMessageBody} from "../utils/message_utils";
import {IListener} from "./core/listener";

export default class EveryoneTaggerListener extends IListener {
  filter(message: proto.IWebMessageInfo): boolean {
    const body = getMessageBody(message)?.toLowerCase();
    return body?.includes("@everyone") ?? false;
  }

  async execute(client: WASocket, message: proto.IWebMessageInfo) {
    if (!isJidGroup(message.key.remoteJid!)) {
      return client.sendMessage(
        message.key.remoteJid!,
        {
          text: "This command can only be used in groups.",
        },
        {quoted: message}
      );
    }

    const group = await client.groupMetadata(message.key.remoteJid!);
    const isAdmin: boolean = await getUserGroupLevel(client, message.key.remoteJid ?? '', message.key.participant ?? '') > 0;
    if (!isAdmin) {
      client.sendMessage(
        message.key.remoteJid!,
        {
          text: "Bro...\nOnly admins can use this command 😣",
        },
        {quoted: message}
      );
    }


    const mentions = group.participants.map((participant) => participant.id);
    client.sendMessage(
      message.key.remoteJid!,
      {
        text: `${group.subject}\nEveryone!\n${mentions.map(mention => `@${mention.split("@")[0]}`).join(" ")}`,
        mentions: mentions,
      },
      {quoted: message}
    );
  }
}
