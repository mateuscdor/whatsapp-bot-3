import {
    proto,
    WASocket,
  } from "@adiwajshing/baileys";
import { getMessageBody } from "../utils/message_utils";
  import {ICommand} from "./core/command";
  
  export default class JoinCommand implements ICommand {
    command: string = "join";
    groupInviteRegex: RegExp = RegExp(/(https?:\/\/)?chat\.whatsapp\.com\/(?:invite\/)?([a-zA-Z0-9_-]{22})/g)

    async execute(client: WASocket, message: proto.IWebMessageInfo) {
        const body = getMessageBody(message);
        const matches = this.groupInviteRegex.exec(body ?? "");

        if (!matches || (matches && matches.length < 1)) {
            return client.sendMessage(message.key.remoteJid!, {text:"You must have one group invite link in the message."}, {quoted: message})
        }

        const code = matches[2];
        try{
            const res = await client.groupAcceptInvite(code);
            client.sendMessage(message.key.remoteJid!, {text:"Joining the group..."}, {quoted: message})
            client.sendMessage(res, {text: "**Disclaimer**\nThis bot is handled and managed by Ori Harel.\nAs such, he poses the ability to see the messages in this group chat.\nHe does not plan to but the possibility is there.\nIf you are not keen with this, please remove the bot."})

        } catch (e) {
            client.sendMessage(message.key.remoteJid!, {text:"Failed to join group.\nUnauthorized."}, {quoted: message})
        }
    }
  }
  