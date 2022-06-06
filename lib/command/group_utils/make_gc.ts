import {
    proto,
    WASocket,
  } from "@adiwajshing/baileys";
  import {ICommand} from "../core/command";
  
  export default class MakeGCCommand extends ICommand {
    command: string = "makegc";
    async execute(client: WASocket, message: proto.IWebMessageInfo) {
        console.log(message)
        console.log(message.message)
    }
  }
  