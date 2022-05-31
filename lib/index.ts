import makeWASocket, {makeInMemoryStore, useSingleFileAuthState, proto, DisconnectReason, downloadMediaMessage, downloadContentFromMessage, DownloadableMessage, AnyMessageContent, WAMessage, WAMediaUpload} from "@adiwajshing/baileys";
import Sticker, { StickerTypes } from "wa-sticker-formatter/dist";
import { CommandHandler } from "./command/command_handler";
import RandomImageCommand from "./command/random_image_command";
import StickerCommand from "./command/sticker_command";
import { prefix as bot_prefix } from "./config";
import { ListenerHandler } from "./listener/listener_handler";
import { getMessageBody } from "./utils/message";
import { WhatsAppBot } from "./whatsapp_bot";
const {Boom} = require('@hapi/boom');
const P = require('pino');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

const whatsappBot: WhatsAppBot = new WhatsAppBot("./session");
ffmpeg.setFfmpegPath(ffmpegPath);
whatsappBot.start();
registerListeners();

const listenerHandler = new ListenerHandler(whatsappBot.client!);
const commandHandler = new CommandHandler(whatsappBot.client!, listenerHandler);

registerCommands();

function registerListeners() {
    whatsappBot.eventListener?.on('messages.upsert', async chats => {
        chats.messages.forEach(message => {
            const listeners = listenerHandler.findListeners(message);
            listenerHandler.executeListeners(message, ...listeners);
        });
    })
}

function registerCommands() {
    commandHandler.registerCommand(new StickerCommand())
    commandHandler.registerCommand(new RandomImageCommand())
}
