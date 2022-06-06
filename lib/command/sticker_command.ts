import {
  DownloadableMessage,
  downloadContentFromMessage,
  generateWAMessageFromContent,
  proto,
  WASocket,
} from "@adiwajshing/baileys";
import Sticker, { StickerTypes } from "wa-sticker-formatter/dist";
import { getMessageMediaBuffer } from "../utils/media_utils";
import { ICommand } from "./core/command";

export default class StickerCommand extends ICommand {
  command: string = "sticker";
  async execute(client: WASocket, message: proto.IWebMessageInfo) {
    let messageMediaBuffer = await getMessageMediaBuffer(message);

    if (!messageMediaBuffer){
      const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage
      if (quoted) messageMediaBuffer = await getMessageMediaBuffer(generateWAMessageFromContent(message.key.remoteJid!, quoted!, {userJid: message.participant!}));
      
      if (!messageMediaBuffer) {
        return await client.sendMessage(
          message.key.remoteJid!,
          {text: "You must send a video, image, sticker or quote one along with the command."},
          {quoted: message}
        );
      }

      return await client.sendMessage(
        message.key.remoteJid!,
        {sticker: await this.createSticker(messageMediaBuffer).toBuffer()},
        {quoted: message}
      );
    }

    await client.sendMessage(
        message.key.remoteJid!,
        {sticker: await this.createSticker(messageMediaBuffer).toBuffer()},
        {quoted: message}
      );
  }

  private createSticker(buffer: Buffer, author: string="bot", pack: string = "bot") {
      return new Sticker(
          buffer, {
              pack: pack,
              author: author,
              type: StickerTypes.FULL,
              quality: 30,
          }
      );
  }
}
