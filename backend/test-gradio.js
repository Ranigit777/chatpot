const { Client } = require('@gradio/client');

async function testIt() {
    try {
        const client = await Client.connect("RaniGowda/ChatPot");
        const endpoints = client.view_api();
        console.log(JSON.stringify(endpoints));
    } catch (err) {
        console.error("Error:", err);
    }
}
testIt();
