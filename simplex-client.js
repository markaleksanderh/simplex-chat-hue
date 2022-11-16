const {ChatClient} = require("simplex-chat")
const {ChatType} = require("simplex-chat/dist/command")
const {ciContentText, ChatInfoType} = require("simplex-chat/dist/response")

run()

async function run() {
    const chat = await ChatClient.create("ws://localhost:5225")
    const user = await chat.apiGetActiveUser()

    if (!user) {
        console.log("No user profile")
        return
    }
    console.log(user)
    console.log(`Bot profile: ${user.profile.displayName}`)

    const address = (await chat.apiGetUserAddress()) || (await chat.apiCreateUserAddress())
    console.log(`Bot address: ${address}`)

    await chat.addressAutoAccept(true)
    
}






