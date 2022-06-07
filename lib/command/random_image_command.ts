import {proto, WASocket} from "@adiwajshing/baileys";
import {ICommand} from "./core/command";
import fs from "fs";
import { getMessageBody } from "../utils/message_utils";

export default class RandomImageCommand extends ICommand {
  command: string = "random";
  async execute(client: WASocket, message: proto.IWebMessageInfo) {
    const body = getMessageBody(message)?.toLowerCase() ?? '';
    const split = body.split(" ").slice(1).join('/');
    let dir;
    let image;
    try {
     dir = fs.readdirSync("./images/" + split);
     image = fs.readFileSync("./images/" + split + '/' + dir[Math.floor(Math.random() * dir.length)])
    } catch {
      return client.sendMessage(
        message.key.remoteJid!,
        {text: `There is no directory '${split}'\nValid options are: ${fs.readdirSync("./images").join('\n')}`},
        {quoted: message}
      );
    }
    
    await client.sendMessage(
        message.key.remoteJid!,
        {image: image},
        {quoted: message}
      );
  }
}
