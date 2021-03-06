import { CommandHandler } from "./command/core/command_handler";
import RandomImageCommand from "./command/random_image_command";
import { ListenerHandler } from "./listener/core/listener_handler";
import { getMessageBody } from "./utils/message_utils";
import { WhatsAppBot } from "./whatsapp_bot";
import StickerCommand from "./command/sticker_command";
import { CodeCommand, ExecuteCommand, ShutdownCommand } from "./command/util_commands";
import TestCommand from "./command/test_command";
import EveryoneTaggerListener from "./listener/everyone_tagger_listener";
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
import ffmpeg from "fluent-ffmpeg";
import MusicCommand from "./command/music_command";
import HelpCommand from "./command/help_command";
import SpoofCommand from "./command/spoof_command";
import JoinCommand from "./command/join_command";
import LeaveCommand from "./command/leave_gc_command";
import CloseGCCommand from "./command/group_utils/close_gc";
import MakeGCCommand from "./command/group_utils/make_gc";
import GoodBotListener from "./listener/good_bot";
import LmgtfyCommand from "./command/lmgtfy_command";
import AddCommand from "./command/add_command";
import KickCommand from "./command/kick_command";
import { BaileysEventEmitter } from "@adiwajshing/baileys";
import GptCommand from "./command/gpt_command";

export const whatsappBot: WhatsAppBot = new WhatsAppBot("./session", registerEventHandlers);
ffmpeg.setFfmpegPath(ffmpegPath);
whatsappBot.start();

const listenerHandler = new ListenerHandler(whatsappBot.client!);
const commandHandler = new CommandHandler(whatsappBot.client!, listenerHandler);

registerCommands();
registerListeners();

function registerEventHandlers(eventListener: BaileysEventEmitter, bot: WhatsAppBot) {
  eventListener?.on("messages.upsert", async (chats) => {
    chats.messages.forEach((message) => {
      console.info('Received message')
      if (message?.key?.participant?.includes(":") ?? false) {
        message.key!.participant = message?.key!.participant?.split(":")[0] + '@s.whatsapp.net';
      }

      if (message?.key?.fromMe) {
        message.key!.fromMe = false;
      }
      

      // if (message.key.participant != '972585551784@s.whatsapp.net' && message.key.remoteJid != '972585551784@s.whatsapp.net') return;

      console.info('Finding listeners')
      const listeners = listenerHandler.findListeners(message);
      console.info(`Found ${listeners.length} listeners`);
      try {
        listenerHandler.executeListeners(message, ...listeners);
      } catch (e) {
        console.error(e)
        bot.client?.sendMessage(message.key.remoteJid!, {text: "*ErIRH EROROORRRR _ahhhA_HHH _ERROR!!_*"})
      }
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
  commandHandler.registerCommand(new HelpCommand());
  commandHandler.registerCommand(new SpoofCommand());
  commandHandler.registerCommand(new JoinCommand());
  commandHandler.registerCommand(new LeaveCommand());
  commandHandler.registerCommand(new MakeGCCommand());
  commandHandler.registerCommand(new CloseGCCommand());
  commandHandler.registerCommand(new LmgtfyCommand());
  commandHandler.registerCommand(new AddCommand());
  commandHandler.registerCommand(new KickCommand());
  commandHandler.registerCommand(new GptCommand());
  // commandHandler.registerCommand(new ExecuteCommand());
}

function registerListeners() {
  listenerHandler.registerListener(new EveryoneTaggerListener());
  listenerHandler.registerListener(new GoodBotListener());
}
