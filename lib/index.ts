import {CommandHandler} from "./command/core/command_handler";
import RandomImageCommand from "./command/random_image_command";
import {ListenerHandler} from "./listener/core/listener_handler";
import {getMessageBody} from "./utils/message_utils";
import {WhatsAppBot} from "./whatsapp_bot";
import StickerCommand from "./command/sticker_command";
import {Listener} from "./listener/core/listener";
import {CodeCommand} from "./command/util_commands";
import {generateMessageID, generateWAMessage, generateWAMessageFromContent, processSenderKeyMessage, proto} from "@adiwajshing/baileys";
import TestCommand from "./command/test_command";
import EveryoneTaggerListener from "./listener/everyone_tagger_listener";
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
  commandHandler.registerCommand(new CodeCommand());
  commandHandler.registerCommand(new TestCommand());
}

function registerListeners() {
  listenerHandler.registerListener(new EveryoneTaggerListener());

  // listenerHandler.registerListener(
  //   new Listener(
  //     (msg) => getMessageBody(msg)?.includes("כרמל") ?? false,
  //     (client, msg) =>
  //       client.sendMessage(
  //         msg.key.remoteJid!,
  //         {text: "בחור טוב"},
  //         {quoted: msg}
  //       )
  //   )
  // );

  // listenerHandler.registerListener(
  //   new Listener(
  //     (msg) => getMessageBody(msg)?.includes("עומרי גיל") ?? false,
  //     (client, msg) => {
  //       const id = generateMessageID();
  //       const template = generateWAMessageFromContent(
  //         msg.key.remoteJid!,
  //         proto.Message.create({
  //           conversation: "fdsfds",
  //         }),
  //         {userJid: msg.key.participant!}
  //       );

  //       console.log("relay");
  //       processSenderKeyMessage
  //       client.relayMessage(msg.key.remoteJid!, template.message!, {
  //         participant: msg.key.participant!,
  //         cachedGroupMetadata: (jid) => client.groupMetadata(jid),
  //         messageId: id,
  //       });
  //     }
  //   )
  // );
}
