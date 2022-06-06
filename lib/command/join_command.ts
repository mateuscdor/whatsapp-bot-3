import {
    proto,
    WASocket,
  } from "@adiwajshing/baileys";
import { whatsappBot } from "..";
import { prefix as bot_prefix } from "../config";
import { getMessageBody } from "../utils/message_utils";
  import {ICommand} from "./core/command";
  
  export default class JoinCommand implements ICommand {
    command: string = "join";
    async execute(client: WASocket, message: proto.IWebMessageInfo) {
        if (!message.message?.groupInviteMessage) {
            return client.sendMessage(message.key.remoteJid!, {text:"You must add an group invite link to the message."}, {quoted: message})
        }

        await client.groupAcceptInviteV4(message.key.remoteJid!, message.message.groupInviteMessage!);
        client.sendMessage(message.message.groupInviteMessage.groupJid!, {text: "**Disclaimer**\nThis bot is handled and managed by Ori Harel.\nAs such, he poses the ability to see the messages in this group chat.\nHe does not plan to but the possibility is there. If you are not keen with this, please remove the bot."})
    }
  }
  