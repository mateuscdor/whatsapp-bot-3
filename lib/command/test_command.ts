import {
  proto,
  WASocket,
} from "@adiwajshing/baileys";
import {ICommand} from "./core/command";

export default class TestCommand extends ICommand {
  command: string = "test";
  async execute(client: WASocket, message: proto.IWebMessageInfo) {
    
    console.log(message.key.participant);
    console.log(message.participant);
    console.log(message);
  }
}
