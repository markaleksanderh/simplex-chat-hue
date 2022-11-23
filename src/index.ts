const {ChatClient} = require("simplex-chat")
const {ChatType} = require("simplex-chat/dist/command")
const {ciContentText, ChatInfoType} = require("simplex-chat/dist/response")

import * as dotenv from 'dotenv'
import { listConnectedLights, switchOn, switchLight } from './hue'


dotenv.config()

const bridge_ip: string = String(process.env.BRIDGE_IP_ADDRESS ?? "")
const authorised_user: string = String(process.env.AUTHORISED_USER ?? "")

const url: string = `http://${bridge_ip}/api/${authorised_user}/lights`

run()

async function run() {
    const chat = await ChatClient.create("ws://localhost:5225")
    const user = await chat.apiGetActiveUser()

    // const invitation = await chat.apiCreateLink()
    // console.log(invitation)

    if (!user) {
        console.log("No user profile")
        return
    }

    const lights = await listConnectedLights(url)
    console.log(lights)
    await processMessages(chat)

    async function processMessages(chat: typeof ChatClient) {
        for await (const r of chat.msgQ) {
            
            const resp = r instanceof Promise ? await r : r
            switch (resp.type) {
                case "contactConnected": {
                    const {contact} = resp
                    console.log(`${contact.profile.displayName} connected`)
                    await chat.apiSendTextMessage(
                        ChatType.Direct,
                        contact.contactId,
                        `Hello, ${contact.profile.displayName}`
                    )
                }

                case "newChatItem": {
                    const {chatInfo} = resp.chatItem
                    if (chatInfo.type !== ChatInfoType.Direct) continue
                    const msg = ciContentText(resp.chatItem.chatItem.content)
                    let reply
                    if (msg == "switch") {
                        // TODO add list lights command

                        // TODO update to get ID from user
                        
                        switchLight(url, 4)
                        reply = "Light switched"
                    } else {
                        // TODO create enum commands
                        reply = "Not a recognised command"
                    }

                    await chat.apiSendTextMessage(ChatType.Direct, chatInfo.contact.contactId, reply)
                }
            }
        }
    }

}
