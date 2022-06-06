import { proto, WAMediaUpload, WASocket } from "@adiwajshing/baileys";
import { ICommand } from "./core/command";
import * as ytMusic from "node-youtube-music";
import YoutubeMp3Downloader from "youtube-mp3-downloader";
import { prefix as bot_prefix } from "../config";
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
import { getMessageBody } from "../utils/message_utils";
import yt from "yt-converter";
import fs from "fs";
import Ffmpeg from "fluent-ffmpeg";

export default class MusicCommand extends ICommand {
  command: string = "music";

  async execute(client: WASocket, message: proto.IWebMessageInfo) {
    const query =
      getMessageBody(message)?.slice(
        bot_prefix.length + this.command.length + 1
      ) ?? "";
    const musics = await ytMusic.searchMusics(query);

    const music = musics[0];

    await new Promise<string>(async (resolve, reject) => {
      const url = "https://www.youtube.com/watch?v=" + music.youtubeId!;
      const info = await yt.getInfo(url);
      let title = this.parserTitles(info.title);

      client.sendMessage(
        message.key.remoteJid!,
        {
          text: `Downloading song "${music.title}" by ${music.artists
            ?.map((artist) => artist.name)
            ?.join(", ")} from YouTube...`,
        },
        { quoted: message }
      );

      yt.convertAudio(
        {
          url: url,
          itag: 140,
          directoryDownload: "./music",
        },
        (data: string) => {},
        (data: string | undefined) => {
          title = title + ".mp3";
          const path = `./music/${title}`;
          if (fs.existsSync(path)) {
            return resolve(path);
          }
          reject(data);
        }
      );
    }).then(async (song) => {
      Ffmpeg(song)
        .audioCodec("libopus")
        .output(song + ".opus")
        .on("end", () => {
          client
            .sendMessage(
              message.key.remoteJid!,
              {
                audio: fs.readFileSync(song + ".opus") as WAMediaUpload,
                fileName: music.title + ".opus",
              },
              { quoted: message }
            )
            .then((id) => {
              fs.unlink(song, () => {});
              fs.unlink(song + ".opus", () => {});
            });
        })
        .run();
    });
  }

  private parserTitles(title: string) {
    const regex = /[\\,:,?,|,¿,*,<,>,",/]/g;
    return title.replace(regex, "");
  }
}
