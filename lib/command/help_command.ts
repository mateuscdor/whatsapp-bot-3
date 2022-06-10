import {
    proto,
    WASocket,
} from "@adiwajshing/baileys";
import { ICommand } from "./core/command";

export default class HelpCommand extends ICommand {
    command: string = "help";
    async execute(client: WASocket, message: proto.IWebMessageInfo) {
        let helpMessage = "*----- HELP ME I'M RETARDED ----*\n>>help - Sends this message\n>>music (song name) - Downloads the song from YouTube\n>>sticker - Send along with an image or video to create a sticker\n"
        helpMessage += ">>code - The code to this bot\n>>random folder_name - Send a random picture of some dude\n@ everyone - (Without the space) Tag everyone in the group\n"
        helpMessage += ">>join <group link> - adds the bot to a group (you can send the bot a private message)\n"
        helpMessage += '>>spoof <tag> "<spoofed message>" "<user message>"\n>>Lmgtfy <query> - condescending way to explain Google to someone\n'
        helpMessage += '>>add - Reply to a message with a contact to add that contact\n>>kick @person @person2 - Kick people from group\n'
        helpMessage += 'מקווה שעזרתי ✌\n~bot'

        client.sendMessage(message.key.remoteJid!, { text: helpMessage }, { quoted: message })
    }
}