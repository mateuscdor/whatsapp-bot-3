import { proto, WAMediaUpload, WASocket } from "@adiwajshing/baileys";
import { ICommand } from "./core/command";
import { prefix as bot_prefix } from "../config";
import { getMessageBody } from "../utils/message_utils";
import fs from "fs";
import Ffmpeg from "fluent-ffmpeg";
import * as yt from 'youtube-search-without-api-key';
import * as ytdl from 'ytdl-core';

export default class MusicCommand extends ICommand {
  command: string = "music";

  async execute(client: WASocket, message: proto.IWebMessageInfo) {
    const query =
      getMessageBody(message)?.slice(
        bot_prefix.length + this.command.length + 1
      ) ?? "";
    const videos = await yt.search(query)

    const video = videos[0];


    client.sendMessage(
      message.key.remoteJid!,
      {
        text: `Downloading MP3 of "${video.title}" from YouTube...`,
      },
      { quoted: message }
    );
    const path = `./music/${video.title}.mp3`;

    try {
      ytdl.default(video.url).pipe(fs.createWriteStream(path)).addListener('finish', () => {
        Ffmpeg(path)
          .withAudioCodec("libmp3lame")
          .toFormat("mp3")
          .output(path + ".mp3")
          .on("end", () => {
            client
              .sendMessage(
                message.key.remoteJid!,
                {
                  audio: fs.readFileSync(path + ".mp3") as WAMediaUpload,
                  fileName: video.title + ".mp3",
                  mimetype: "audio/mpeg",
                },
                { quoted: message }
              )
              .then((id) => {
                fs.unlink(path, () => { });
                fs.unlink(path + ".mp3", () => { });
              });
          })
          .on('error', (err) => {
            this.handleError(client, message, path);
          })
          .run();
      });
    } catch (err) {
      this.handleError(client, message, path);
    }
  }

  private handleError(client, message, path: string) {
    fs.unlink(path, () => { });
    fs.unlink(path + ".mp3", () => { });
    client.sendMessage(message.key.remoteJid!, { text: "Failed to download the MP3 of this video." }, {quoted: message})
  }
}
