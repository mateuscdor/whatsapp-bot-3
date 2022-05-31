import makeWASocket, {
  makeInMemoryStore,
  useSingleFileAuthState,
  proto,
  DisconnectReason,
  downloadMediaMessage,
  downloadContentFromMessage,
  DownloadableMessage,
  AnyMessageContent,
  WAMessage,
  WAMediaUpload,
} from "@adiwajshing/baileys";
import Sticker, {StickerTypes} from "wa-sticker-formatter/dist";
import {CommandHandler} from "./command/command_handler";
import RandomImageCommand from "./command/commands/random_image_command";
import {prefix as bot_prefix} from "./config";
import {ListenerHandler} from "./listener/listener_handler";
import {getMessageBody} from "./utils/message_utils";
import {WhatsAppBot} from "./whatsapp_bot";
import StickerCommand from "./command/commands/sticker_command";
import {Listener} from "./listener/listener";
const {Boom} = require("@hapi/boom");
const P = require("pino");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");

const whatsappBot: WhatsAppBot = new WhatsAppBot("./session");
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
      const listeners = listenerHandler.findListeners(message);
      listenerHandler.executeListeners(message, ...listeners);
    });
  });
}

function registerCommands() {
  commandHandler.registerCommand(new StickerCommand());
  commandHandler.registerCommand(new RandomImageCommand());
}

function registerListeners() {
  listenerHandler.registerListener(
    new Listener(
      (msg) => getMessageBody(msg)?.includes("כרמל") ?? false,
      (client, msg) =>
        client.sendMessage(
          msg.key.remoteJid!,
          {text: "בחור טוב"},
          {quoted: msg}
        )
    )
  );

  listenerHandler.registerListener(
    new Listener(
      (msg) => getMessageBody(msg)?.includes("עומרי") ?? false,
      (client, msg) => {
        const quoted = new proto.WebMessageInfo(msg);
        console.log(quoted);
        client.sendMessage(msg.key.remoteJid!, {text: "דידי"}, {quoted: msg});
      }
    )
  );
}
