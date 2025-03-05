const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const axios = require('axios');
const _ = require('lodash');
const ytdl = require("ytdl-core");
const yts = require("yt-search");

const app = express();
app.use(bodyParser.json());

const { ASKBARD, Box, Pinterest, Menu, addUser, Imagene, Tik, Fbdl, song } = require('./bardi.js');

// Webhook for Facebook Messenger
app.post('/webhook', (req, res) => {
    const body = req.body;
    const message = body.message;
    const senderId = body.sender.id;

    if (message.startsWith('/bard')) {
        const question = message.split('/bard')[1].trim();
        ASKBARD(question, api, { threadID: senderId, messageID: body.messageId });
    } else if (message.startsWith('/box')) {
        const question = message.split('/box')[1].trim();
        Box(question, api, { threadID: senderId, messageID: body.messageId });
    } else if (message.startsWith('/pin')) {
        const query = message.split('/pin')[1].trim();
        Pinterest(query, api, { threadID: senderId, messageID: body.messageId });
    } else if (message.startsWith('/menu')) {
        Menu(api, { threadID: senderId, messageID: body.messageId });
    } else if (message.startsWith('/addUser')) {
        const userId = message.split('/addUser')[1].trim();
        addUser(userId, api, { threadID: senderId, messageID: body.messageId });
    } else if (message.startsWith('/imagene')) {
        const prompt = message.split('/imagene')[1].trim();
        Imagene(prompt, api, { threadID: senderId, messageID: body.messageId });
    } else if (message.startsWith('/tik')) {
        const url = message.split('/tik')[1].trim();
        Tik(url, api, { threadID: senderId, messageID: body.messageId });
    } else if (message.startsWith('/fbdl')) {
        const url = message.split('/fbdl')[1].trim();
        Fbdl(url, api, { threadID: senderId, messageID: body.messageId });
    } else if (message.startsWith('/song')) {
        const query = message.split('/song')[1].trim();
        song(query, api, { threadID: senderId, messageID: body.messageId });
    } else {
        api.sendMessage("Unknown command. Type /menu for a list of commands.", senderId);
    }

    res.status(200).send('OK');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
