import { DownloadableMessage, downloadContentFromMessage, proto } from "@adiwajshing/baileys";

export async function getMessageMediaBuffer(message: proto.IWebMessageInfo) {
    const stream = await extractMessageMediaStream(message);
    if (!stream) return;

    let buffer = Buffer.from([]);

    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }

    return buffer;
}

export async function extractMessageMediaStream(message: proto.IWebMessageInfo) {
    if (message.message?.imageMessage) {
      return downloadContentFromMessage(
        message.message?.imageMessage as DownloadableMessage,
        "image"
      );
    } else if (message.message?.videoMessage) {
      return downloadContentFromMessage(
        message.message?.videoMessage as DownloadableMessage,
        "video"
      );
    }
  }