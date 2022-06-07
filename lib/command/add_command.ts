import {
    proto,
    WASocket,
  } from "@adiwajshing/baileys";
  import {ICommand} from "./core/command";
 import vCard from 'vcard-parser';

  
  export default class AddCommand extends ICommand {
    command: string = "add";
    async execute(client: WASocket, message: proto.IWebMessageInfo) {
        const groupMeta = await client.groupMetadata(message.key.remoteJid!);
        let isAdmin = false;
        for (const participant of groupMeta.participants) {
            if (participant.id == message.key.participant && participant.admin) {
                isAdmin = true;
            }
        }

        if (!isAdmin) {
            return client.sendMessage(message.key.remoteJid!, {text: "Only a group admin can run this command."}, {quoted: message})
        }

        const vcard = message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.contactMessage?.vcard;
        if (vcard) {
            const vc = vCard.parse(vcard)
            const numbers = vc.map((telObject) => telObject.value + "@s.whatsapp.net")
            await client.groupParticipantsUpdate(message.key.remoteJid!, numbers, 'add')
            return client.sendMessage(message.key.remoteJid!, {text: "Success"}, {quoted: message})
        }

    }
  }
  