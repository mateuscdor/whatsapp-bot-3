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

    const video = videos.filter((vid) => {
      if (!vid || !vid.duration_raw) return;
      return (vid.duration_raw.length == 7 && vid.duration_raw[0] < 3) || vid.duration_raw.length < 7
    })[0];

    if (!video) return client.sendMessage(
      message.key.remoteJid!,
      {
        text: `Failed to find video.`,
      },
      { quoted: message }
    )

    video.title = this.parseTitle(video.title);


    client.sendMessage(
      message.key.remoteJid!,
      {
        text: `Downloading MP3 of "${video.title}" from YouTube...`,
      },
      { quoted: message }
    );
    const path = `./music/${video.title}.mp3`;

    try {
      ytdl.default(video.url).pipe(fs.createWriteStream(path)).addListener('finish', async () => {
        await client
          .sendMessage(
            message.key.remoteJid!,
            {
              audio: fs.readFileSync(path) as WAMediaUpload,
              fileName: video.title + ".mp3",
              mimetype: "audio/mpeg",
            },
            { quoted: message }
          )
        fs.unlink(path, () => { });
      }).addListener('error', () => {
        this.handleError(client, message, path);
      }).on("error", () => {
        this.handleError(client, message, path);
      })
    } catch (err) {
      this.handleError(client, message, path);
    }
  }

  private handleError(client, message, path: string) {
    fs.unlink(path, () => { });
    fs.unlink(path + ".mp3", () => { });
    client.sendMessage(message.key.remoteJid!, { text: "Failed to download the MP3 of this video." }, { quoted: message })
  }

  private parseTitle(title: string) {
    const regex = /[\\,:,?,|,¿,*,<,>,",/]/g;
    return title.replace(regex, "");
  }
}
