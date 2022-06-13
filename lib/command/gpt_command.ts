import { proto, WASocket } from "@adiwajshing/baileys";
import { Configuration, OpenAIApi } from "openai";
import { whatsappBot } from "..";
import { prefix as bot_prefix } from "../config";
import { getMessageBody } from "../utils/message_utils";
import { ICommand } from "./core/command";

export default class GptCommand extends ICommand {
    command: string = "gpt";

    configuration: Configuration;
    openai: OpenAIApi;

    constructor() {
        super();
        this.configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });

        this.openai = new OpenAIApi(this.configuration);
    }

    async execute(client: WASocket, message: proto.IWebMessageInfo) {
        const query =
            getMessageBody(message)?.slice(
                bot_prefix.length + this.command.length + 1
            ) ?? "";

        client.sendMessage(message.key.remoteJid!, { text: 'Hmmmm, let me think about this one...' }, { quoted: message })

        this.openai.createCompletion({
            model: "text-davinci-002",
            prompt: query,
            temperature: 0.7,
            max_tokens: 3700,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        }).then((response) => {
            const blank = "Couldn't think of anything\nI'm blank!";
            const text = response.data.choices ? response.data.choices[0].text ?? blank : blank;
            client.sendMessage(message.key.remoteJid!, { text: text.trim() }, { quoted: message })
        }).catch((err) => {
            client.sendMessage(message.key.remoteJid!, { text: "That's way too long for me" }, { quoted: message })
        })
    }
}