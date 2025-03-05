const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { ASKBARD, Box, Pinterest, Menu, addUser, Imagene, Tik, Fbdl, song } = require('./bardi.js');

const app = express();
app.use(bodyParser.json());

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

// Verify Webhook
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === process.env.VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// Handle Webhook Events
app.post('/webhook', (req, res) => {
    const body = req.body;

    if (body.object === 'page') {
        body.entry.forEach(entry => {
            const webhookEvent = entry.messaging[0];
            const senderId = webhookEvent.sender.id;
            const messageText = webhookEvent.message.text;

            if (messageText) {
                handleMessage(senderId, messageText);
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

// Handle Messages
function handleMessage(senderId, messageText) {
    if (messageText.startsWith('/bard')) {
        const question = messageText.split('/bard')[1].trim();
        ASKBARD(question, api, { threadID: senderId, messageID: senderId });
    } else if (messageText.startsWith('/box')) {
        const question = messageText.split('/box')[1].trim();
        Box(question, api, { threadID: senderId, messageID: senderId });
    } else if (messageText.startsWith('/pin')) {
        const query = messageText.split('/pin')[1].trim();
        Pinterest(query, api, { threadID: senderId, messageID: senderId });
    } else if (messageText.startsWith('/menu')) {
        Menu(api, { threadID: senderId, messageID: senderId });
    } else if (messageText.startsWith('/addUser')) {
        const userId = messageText.split('/addUser')[1].trim();
        addUser(userId, api, { threadID: senderId, messageID: senderId });
    } else if (messageText.startsWith('/imagene')) {
        const prompt = messageText.split('/imagene')[1].trim();
        Imagene(prompt, api, { threadID: senderId, messageID: senderId });
    } else if (messageText.startsWith('/tik')) {
        const url = messageText.split('/tik')[1].trim();
        Tik(url, api, { threadID: senderId, messageID: senderId });
    } else if (messageText.startsWith('/fbdl')) {
        const url = messageText.split('/fbdl')[1].trim();
        Fbdl(url, api, { threadID: senderId, messageID: senderId });
    } else if (messageText.startsWith('/song')) {
        const query = messageText.split('/song')[1].trim();
        song(query, api, { threadID: senderId, messageID: senderId });
    } else {
        sendMessage(senderId, "Unknown command. Type /menu for a list of commands.");
    }
}

// Send Message Function
function sendMessage(senderId, message) {
    axios.post(`https://graph.facebook.com/v12.0/me/messages`, {
        recipient: { id: senderId },
        message: { text: message }
    }, {
        params: { access_token: ACCESS_TOKEN }
    });
}

// API Object (Mock)
const api = {
    sendMessage: sendMessage,
    getUserInfo: async (userId) => {
        const response = await axios.get(`https://graph.facebook.com/v12.0/${userId}`, {
            params: { access_token: ACCESS_TOKEN, fields: 'name' }
        });
        return { [userId]: { name: response.data.name } };
    }
};

module.exports = app;
