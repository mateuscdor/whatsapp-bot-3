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
  downloading_list = {}

  async execute(client: WASocket, message: proto.IWebMessageInfo) {
    const query =
      getMessageBody(message)?.slice(
        bot_prefix.length + this.command.length + 1
      ) ?? "";
    const videos = await yt.search(query)

    const video = videos.filter((vid) => {
      if (!vid || !vid.duration_raw) return;

      const durationsSeconds = this.rawTimeToSeconds(vid.duration_raw); 
      return durationsSeconds < 60 * 10 && durationsSeconds > 0
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
        this.deleteFiles(video.title, path)
        this.handleError(client, message);
      }).on("error", () => {
        this.deleteFiles(video.title, path)
        this.handleError(client, message);
      })
    } catch (err) {
      this.deleteFiles(video.title, path)
      this.handleError(client, message);
    }
  }

  private rawTimeToSeconds(time: string) {
    const split = time.split(":")
    let seconds = 0;
    let minutes = 0
    let hours = 0;

    switch (split.length) {
      case 1:
        seconds = Number.parseInt(split[0]);
        break;
      case 2:
        seconds = Number.parseInt(split[1]);
        minutes = Number.parseInt(split[0]);
        break;
      case 3:
        seconds = Number.parseInt(split[2]);
        minutes = Number.parseInt(split[1]);
        hours = Number.parseInt(split[0]);
        break;
      default:
        return -1
    }

    return hours * 60 *  60 + minutes * 60 + seconds;
  }
  
  private handleError(client, message) {
    client.sendMessage(message.key.remoteJid!, { text: "Failed to download the MP3 of this video." }, { quoted: message })
  }

  private deleteFiles(title: string, path: string) {
    fs.unlink(path, () => { });
    fs.unlink(path + ".mp3", () => { });
  }

  private parseTitle(title: string) {
    const regex = /[\\,:,?,|,¿,*,<,>,",/]/g;
    return title.replace(regex, "");
  }
}
