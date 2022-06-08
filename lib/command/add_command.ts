import {
    proto,
    WASocket,
} from "@adiwajshing/baileys";
import { ICommand } from "./core/command";
import vCard from 'vcard-parser';
import { isGroupAdmin } from "../utils/group_utils";


export default class AddCommand extends ICommand {

    command: string = "add";
    async execute(client: WASocket, message: proto.IWebMessageInfo) {
        let isAdmin = await isGroupAdmin(client, message.key.remoteJid ?? '', message.key.participant ?? '');
        let iAmAdmin = await isGroupAdmin(client, message.key.remoteJid ?? '', client.user.id.split(":")[0] + "@s.whatsapp.net" ?? '');

        if (!iAmAdmin) {
            return client.sendMessage(message.key.remoteJid!, { text: "Give the bot admin access in order to use this command." }, { quoted: message })
        }

        if (!isAdmin) {
            return client.sendMessage(message.key.remoteJid!, { text: "Only a group admin can run this command." }, { quoted: message })
        }

        let vcards = message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.contactMessage?.vcard || message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.contactsArrayMessage?.contacts!.map((contact) => contact.vcard) || [];
        const allNumbers: string[]  = []
        if (vcards && typeof vcards == typeof "") {
            vcards = [vcards as string]
        }
        
        (vcards as string[]).forEach(async (vcard) => {
            const vc = vCard.parse(vcard)
            const numbers = vc.tel.map((telObject) => (telObject.meta.waid + "@s.whatsapp.net"))
             numbers.forEach(element => {
                 allNumbers.push(element)
             });
        })

        client.groupParticipantsUpdate(message.key.remoteJid!, allNumbers, 'add').then(() => {
            client.sendMessage(message.key.remoteJid!, { text: "Success 🎊" }, { quoted: message })
        }).catch((err) => {
            client.sendMessage(message.key.remoteJid!, { text: "Failed 😢" }, { quoted: message })
        })
    }
}
