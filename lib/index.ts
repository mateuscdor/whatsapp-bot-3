import { CommandHandler } from "./command/core/command_handler";
import RandomImageCommand from "./command/random_image_command";
import { ListenerHandler } from "./listener/core/listener_handler";
import { getMessageBody } from "./utils/message_utils";
import { WhatsAppBot } from "./whatsapp_bot";
import StickerCommand from "./command/sticker_command";
import { CodeCommand, ShutdownCommand } from "./command/util_commands";
import TestCommand from "./command/test_command";
import EveryoneTaggerListener from "./listener/everyone_tagger_listener";
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
import ffmpeg from "fluent-ffmpeg";
import MusicCommand from "./command/music_command";

export const whatsappBot: WhatsAppBot = new WhatsAppBot("./session");
ffmpeg.setFfmpegPath(ffmpegPath);
whatsappBot.start();
registerEventHandlers();

const listenerHandler = new ListenerHandler(whatsappBot.client!);
const commandHandler = new CommandHandler(whatsappBot.client!, listenerHandler);

registerCommands();
registerListeners();

function registerEventHandlers() {
  whatsappBot.eventListener?.on("messages.upsert", async (chats) => {
    chats.messages.forEach((message) => {
      if (message?.key?.participant?.includes(":")) {
        message.key.participant = message.key.participant.split(":")[0] + '@s.whatsapp.net';
      }

      const listeners = listenerHandler.findListeners(message);
      listenerHandler.executeListeners(message, ...listeners);
    });
  });
}

function registerCommands() {
  commandHandler.registerCommand(new StickerCommand());
  commandHandler.registerCommand(new RandomImageCommand());
  commandHandler.registerCommand(new CodeCommand());
  commandHandler.registerCommand(new TestCommand());
  commandHandler.registerCommand(new MusicCommand());
  commandHandler.registerCommand(new ShutdownCommand());
}

function registerListeners() {
  listenerHandler.registerListener(new EveryoneTaggerListener());

  // listenerHandler.registerListener(
  //   new Listener(
  //     (msg) => getMessageBody(msg)?.includes("כרמל") ?? false,
  //     (client, msg) =>
  //       client.sendMessage(
  //         msg.key.remoteJid!,
  //         {text: "חרמן מטונף"},
  //         {quoted: msg}
  //       )
  //   )
  // );

  // listenerHandler.registerListener(
  //   new Listener(
  //     (msg) => getMessageBody(msg)?.includes("oldest message") ?? false,
  //     async (client, msg) => {}
  //   )
  // );
}
