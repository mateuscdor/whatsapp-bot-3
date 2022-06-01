import {CommandHandler} from "./command/core/command_handler";
import RandomImageCommand from "./command/random_image_command";
import {ListenerHandler} from "./listener/core/listener_handler";
import {getMessageBody} from "./utils/message_utils";
import {WhatsAppBot} from "./whatsapp_bot";
import StickerCommand from "./command/sticker_command";
import {Listener} from "./listener/core/listener";
import {CodeCommand} from "./command/util_commands";
import {generateMessageID, generateWAMessage, generateWAMessageFromContent, proto} from "@adiwajshing/baileys";
import TestCommand from "./command/test_command";
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
      (msg) => getMessageBody(msg)?.includes("עומרי גיל") ?? false,
      (client, msg) => {
        const id = generateMessageID();
        const template = generateWAMessageFromContent(
          msg.key.remoteJid!,
          proto.Message.create({
            paymentInviteMessage: {expiryTimestamp: 12873, serviceType: 1},
            sendPaymentMessage: {
              noteMessage: {conversation: "cool"},
              requestMessageKey: {
                remoteJid: msg.key.remoteJid,
                participant: msg.key.participant,
                id: id,
              },
            },
          }),
          {userJid: msg.key.participant!}
        );

        console.log("relay");
      }
    )
  );
}
