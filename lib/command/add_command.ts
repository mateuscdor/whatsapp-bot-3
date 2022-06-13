import {
    isJidGroup,
    proto,
    WASocket,
} from "@adiwajshing/baileys";
import { ICommand } from "./core/command";
import vCard from 'vcard-parser';
import { getBotGroupLevel, getUserGroupLevel } from "../utils/group_utils";
import { whatsappBot } from "..";


export default class AddCommand extends ICommand {

    command: string = "add";
    async execute(client: WASocket, message: proto.IWebMessageInfo) {
        if (isJidGroup(message.key.remoteJid!)) {
            return client.sendMessage(
                message.key.remoteJid!,
                {
                    text: "This command can only be used in groups.",
                },
                { quoted: message }
            );
        }

        let isAdmin = await getUserGroupLevel(client, message.key.remoteJid ?? '', message.key.participant ?? '') > 0;
        let iAmAdmin = await getBotGroupLevel(client, message.key.remoteJid ?? '') > 0

        if (!iAmAdmin) {
            return client.sendMessage(message.key.remoteJid!, { text: "Give the bot admin access in order to use this command." }, { quoted: message })
        }

        if (!isAdmin) {
            return client.sendMessage(message.key.remoteJid!, { text: "Only a group admin can run this command." }, { quoted: message })
        }

        let vcards = message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.contactMessage?.vcard || message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.contactsArrayMessage?.contacts!.map((contact) => contact.vcard) || [];
        const allNumbers = new Set<string>();
        if (vcards && typeof vcards == typeof "") {
            vcards = [vcards as string]
        }

        (vcards as string[]).forEach(async (vcard) => {
            const vc = vCard.parse(vcard)
            const numbers = vc.tel.map((telObject) => (telObject.meta.waid + "@s.whatsapp.net"))
            numbers.forEach(element => {
                allNumbers.add(element)
            });
        })

        try {
            for (const number of allNumbers) {
                await client.groupParticipantsUpdate(message.key.remoteJid!, [number], 'add')
            }
        } catch (err) {
            client.sendMessage(message.key.remoteJid!, { text: "Failed 😢" }, { quoted: message })
        }

        client.sendMessage(message.key.remoteJid!, { text: "Success 🎊" }, { quoted: message })
    }
}
