import {
  DownloadableMessage,
  downloadContentFromMessage,
  proto,
  WASocket,
} from "@adiwajshing/baileys";
import Sticker, { StickerTypes } from "wa-sticker-formatter/dist";
import { getMessageMediaBuffer } from "../../utils/media_utils";
import { ICommand } from "../command";

export default class StickerCommand implements ICommand {
  command: string = "sticker";
  async execute(client: WASocket, message: proto.IWebMessageInfo) {
    const messageMediaBuffer = await getMessageMediaBuffer(message);

    if (!messageMediaBuffer){
      await client.sendMessage(
        message.key.remoteJid!,
        {text: "You must send a video or image along with the command."},
        {quoted: message}
      );
      return;
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
              type: StickerTypes.FULL
          }
      );
  }
}
