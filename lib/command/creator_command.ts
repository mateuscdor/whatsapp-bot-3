import { proto, WASocket } from "@adiwajshing/baileys";
import { whatsappBot } from "..";

export default class CreatorCommand {
    command: string = "creator";
    async execute(client: WASocket, message: proto.IWebMessageInfo) {
        console.log(whatsappBot.store.contacts)
        const vcard = "BEGIN:VCARD\
        VERSION:3.0\
        FN;CHARSET=UTF-8:אורי הראל\
        N;CHARSET=UTF-8:הראל;אורי;;;\
        PHOTO;ENCODING=b;TYPE=PNG:IMAGEDATA..\
        TEL;TYPE=CELL:+972585551784\
        REV:2022-06-11T21:21:21.658Z\
        END:VCARD\
        "

        client.sendMessage(message.key.remoteJid!, { contacts: {contacts: [{vcard: vcard}]} }, { quoted: message })
    }
}