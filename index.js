const fs = require("fs");
const axios = require('axios');
const login = require("@xaviabot/fca-unofficial");
const bardai = require("./bardai.js");
const server = require("./server.js");
const util = require('util');

server.server();

login({
    appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))
}, (err, api) => {
    if (err) {
        console.error(err);
        return;
    }

    api.setOptions({
        listenEvents: true
    });

    const stopListening = api.listen(async (err, event) => {
        if (err) {
            console.error(err);
            return;
        }

        await api.markAsRead(event.threadID);
        switch (event.type) {
            case "message":
                if (event.body === '/stop') {
                    api.sendMessage("Goodbye…", event.threadID);
                    stopListening();
                    return;
                } else if (event.body.startsWith('/bard')) {
                    const question = event.body.replace('/bard', '');
                    console.log(question);
                    await bardai.ASKBARD(question, api, event);
                } else if (event.body.startsWith('/box')) {
                    const question = event.body.replace('/box', '');
                    await bardai.Box(question, api, event)
                } else if (event.body.startsWith('/pin')) {
                    const question = event.body.replace('/pin', '');
                    await bardai.Pinterest(question, api, event)
                } else if (event.body.startsWith('/menu')) {
                    const question = event.body.replace('/menu', '');
                    await bardai.Menu(api, event)
                } else if (event.body.startsWith('/addUser')) {
                    const id = event.body.replace('/addUser', '');
                    await bardai.addUser(id,api, event)
                }else if (event.body.startsWith('/imagene')) {
                    const q = event.body.replace('/imagene', '');
                    await bardai.Imagene(q,api, event)
                }else if (event.body.startsWith('/tik')) {
                    const q = event.body.replace('/tik', '');
                    await bardai.Tik(q,api, event)
                }else if (event.body.startsWith('/fbdl')) {
                    const q = event.body.replace('/fbdl', '');
                    await bardai.Fbdl(q,api, event)
                }else if (event.body.startsWith('/song')) {
                    const q = event.body.replace('/song', '');
                    await bardai.song(q,api, event)
                }
                    break;
            case "message_request":
                api.acceptMessageRequest(event.threadID, (acceptError, acceptResult) => {
        if (!acceptError) {
          console.log(`Accepted message request in thread: ${event.threadID}`);
        } else {
          console.error(`Error accepting message request: ${acceptError}`);
        }
      });
                break;
        }
    });
});