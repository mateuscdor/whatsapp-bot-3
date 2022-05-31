import makeWASocket, {makeInMemoryStore, useSingleFileAuthState, proto, DisconnectReason, downloadMediaMessage, downloadContentFromMessage, DownloadableMessage, AnyMessageContent, WAMessage, WAMediaUpload} from "@adiwajshing/baileys";
import Sticker, { StickerTypes } from "wa-sticker-formatter/dist";
import { CommandHandler } from "./command/command_handler";
import StickerCommand from "./command/sticker_command";
import { prefix as bot_prefix } from "./config";
import { getMessageBody } from "./utils/message";
import { WhatsAppBot } from "./whatsapp_bot";
const {Boom} = require('@hapi/boom');
const P = require('pino');

const whatsappBot: WhatsAppBot = new WhatsAppBot("./session");
whatsappBot.start();
registerListeners();

const commandHandler = new CommandHandler(whatsappBot.client!);
registerCommands();

function registerListeners() {
    whatsappBot.eventListener?.on('messages.upsert', async chats => {
        chats.messages.forEach(message => {
            const body = getMessageBody(message);
            if (!body?.startsWith(bot_prefix)) return;

            const command_text = body.substring(bot_prefix.length);
            console.log(command_text)
            const commands = commandHandler.findCommands(command_text);
            commandHandler.executeCommands(message, ...commands);
        });
    })
}

function registerCommands() {
    commandHandler.registerCommand(new StickerCommand())
}
