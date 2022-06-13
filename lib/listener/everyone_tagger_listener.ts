import {
  proto,

  WASocket,
} from "@adiwajshing/baileys";
import {getMessageBody} from "../utils/message_utils";
import {IListener} from "./core/listener";

export default class EveryoneTaggerListener extends IListener {
  filter(message: proto.IWebMessageInfo): boolean {
    const body = getMessageBody(message)?.toLowerCase();
    return body?.includes("@everyone") ?? false;
  }

  async execute(client: WASocket, message: proto.IWebMessageInfo) {
    const group = await client.groupMetadata(message.key.remoteJid!);
    if (group.subject.includes("גאמא")) {
      return;
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
