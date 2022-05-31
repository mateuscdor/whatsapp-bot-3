import {proto, WASocket} from "@adiwajshing/baileys";
import {Command} from "./command";
import fs from "fs";
import { getMessageBody } from "../utils/message";

export default class RandomImageCommand implements Command {
  command: string = "random";
  async execute(client: WASocket, message: proto.IWebMessageInfo) {
    const body = getMessageBody(message)?.toLowerCase() ?? '';
    const split = body.split(" ").slice(1).join('/');
    const dir = fs.readdirSync("./images/" + split);
    
    await client.sendMessage(
        message.key.remoteJid!,
        {image: fs.readFileSync("./images/" + split + '/' + dir[Math.floor(Math.random() * dir.length)])},
        {quoted: message}
      );
  }
}
