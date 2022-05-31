import { WAMessage } from '@adiwajshing/baileys';

export function getMessageBody(message: WAMessage) {
    return message.message?.conversation || message.message?.extendedTextMessage?.text
        || message.message?.imageMessage?.caption || message.message?.videoMessage?.caption;
}

