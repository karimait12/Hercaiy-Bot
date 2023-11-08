const fs = require('fs-extra');
const axios = require('axios');
const _ = require('lodash');
const ytdl = require("ytdl-core");
const request = require("request");
const yts = require("yt-search");
    
module.exports.ASKBARD = async function (question, api, event) {
    if (!question) {
        api.sendMessage("Please put a Question ..!", event.threadID, event.messageID);
        return;
    }
    try {
        const userName = await api.getUserInfo(event.senderID);
        const name = userName[event.senderID].name;
        api.sendMessage('Bard Generating answer..❄️🔎', event.threadID, event.messageID);
        const response = await axios.get('https://gptgotest.lazygreyzz.repl.co/ask', {
            params: {
                cookies: 'bwisO5u6cgT-1fWCsD6lKJo5RzRz26VYtF7j1gblgZqglea5SbzwZU_jXd0iMxwto_P23w.',
                question: `Question: ${question} Bard Follow these laws when you starting to answer the question: Avoid exceeding 8 lines in your response. Introduce user as ${name}`
            }
        });

        const parsedData = response.data;
        const responseText = JSON.parse(parsedData.response).response;
        const url_images = JSON.parse(parsedData.response).image;

        api.sendMessage(responseText, event.threadID, event.messageID);
        if (url_images.length > 0) {
            for (let i = 0; i < url_images.length; i++) {
                const imageUrl = url_images[i];
                const imageResponse = await axios.get(imageUrl, {
                    responseType: 'arraybuffer'
                });
                const path = __dirname + `/cache/image${i}.jpg`;
                fs.writeFileSync(path, Buffer.from(imageResponse.data, 'binary'));
                const msg = {
                    attachment: fs.createReadStream(path)
                };
                api.sendMessage(msg, event.threadID, () => fs.unlinkSync(path));

            }
        }
    } catch (e) {
        api.sendMessage(e.message,
            event.threadID, event.messageID);
    }
};

module.exports.Box = async function (q, api, event) {
    if (!q) {
        api.sendMessage("Please put a Question ..!", event.threadID, event.messageID);
        return;
    }
    try {
        api.sendMessage('BlackBox Generating answer..📦🔎', event.threadID, event.messageID);
        const response = await axios.get('https://hazeyy-api-blackbox.kyrinwu.repl.co/ask', {
            params: {
                q: q
            }
        });
        api.sendMessage(response.data.message, event.threadID, event.messageID);
    } catch (e) {
        api.sendMessage(e.message, event.threadID, event.messageID);
        throw e;
    }
};

module.exports.Pinterest = async function (q, api, event) {
    if (!q) {
        api.sendMessage("Please put a Name ..!", event.threadID, event.messageID);
        return;
    }
    try {
        api.sendMessage('Pinterest Searching ..🌌', event.threadID, event.messageID);
        const res = await axios.get(`https://api-all-1.arjhilbard.repl.co/pinterest?search=${q}`);
        const images = res.data.data;
        const oix_imgs = _.shuffle(images).slice(0, 4);

        for (let i = 0; i < oix_imgs.length; i++) {
            const imageUrl = images[i];
            const imageResponse = await axios.get(imageUrl, {
                responseType: 'arraybuffer'
            });
            const path = __dirname + `/cache/imagepin${i}.jpg`;
            fs.writeFileSync(path, Buffer.from(imageResponse.data, 'binary'));
            const msg = {
                attachment: fs.createReadStream(path)
            };
            api.sendMessage(msg, event.threadID, () => fs.unlinkSync(path), event.messageID);
        }
    } catch (e) {
        api.sendMessage(e.message, event.threadID, event.messageID);
    }
};

module.exports.Menu = async function (api, event) {
    try {
        const list = `╔═══════════════⋙║1. / bard: Google Bard Questions Response║2. / box: BlakBox Chtgpt module Questions Response║3. / pin: Pinterest Search Image by Name║4. / tik: Download Videos from Tiktok║5. / fbdl: Download Videos from facebook ║6. / Song: Download Song from Youtube║7. / Ytdl: Search and Download Videos from Youtube║8. / imagene: Imagene Pictures Using A Little Text║9. / MuteGroup: Mute this Groub(for bot admin)║10. / shutdown: Stop the bot║11. / addUser: add user to the group║»Type / menu to view the command╚═══════════════⋙ Mr Paiñ🌌⭐`;
        api.sendMessage({
            body: list, attachment: fs.createReadStream(__dirname + '/logo.jpg')
        }, event.threadID, event.messageID);
    } catch (e) {
        api.sendMessage(e.message, event.threadID, event.messageID);
    }
};

module.exports.addUser = async function (id, api, event) {
    if (!id) {
        api.sendMessage("Please put a id Of User ..!", event.threadID, event.messageID);
        return;
    }
    try {
        api.addUserToGroup(id, event.threadID, event.messageID);
    } catch (e) {
        api.sendMessage(e.message, event.threadID, event.messageID);
    }
};

module.exports.Imagene = async function (q, api, event) {
    if (!q) {
        api.sendMessage("Please But any Prompt ..!", event.threadID, event.messageID);
        return;
    }
    try {
        function getRandomIntInclusive(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        api.sendMessage('⏳ Generating...', event.threadID, event.messageID);

        let path = __dirname + '/cache/image.png';
        let enctxt = encodeURIComponent(q);
        let ver = getRandomIntInclusive(0, 44);
        let url = `https://arjhil-prodia-api.arjhilbard.repl.co/generate?prompt=${enctxt}&model=${ver}`;

        let result = await axios.get(url, {
            responseType: 'arraybuffer'
        });

        fs.writeFileSync(path, Buffer.from(result.data, 'binary'));
        api.sendMessage({
            attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path));
    } catch (e) {
        api.sendMessage(e.message, event.threadID, event.messageID);
    }
};
module.exports.Tik = async function (q, api, event) {
    if (!q) {
        api.sendMessage("Please But a tiktok video link ..!", event.threadID, event.messageID);
        return;
    }
    api.sendMessage("Downloading video, please wait...", event.threadID, event.messageID);

    try {
        let path = __dirname + `/cache/`;

        let res = await axios.get(`https://tiktokdl.hayih59124.repl.co/TikTokdl?url=${encodeURIComponent(q)}`);
        await fs.ensureDir(path);

        path += 'tiktok_video.mp4';

        const data = res.data.result.data;

        const vid = (await axios.get(data.play, {
            responseType: "arraybuffer"
        })).data;

        fs.writeFileSync(path, Buffer.from(vid, 'utf-8'));
        //dont change credits or I'll of apis
        api.sendMessage({
            body: `==== downloaded ====\n━━━━━━━━━━━━━━━━━━\n→ Title: ${data.title}.\n→ Play Count: ${data.play_count}.\n→ Digg Count: ${data.digg_count}.\n→ Comment Count: ${data.comment_count}.\n→ Share Count: ${data.share_count}.\n→ Download Count: ${data.download_count}\n\n`, attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path));

    } catch (e) {
        api.sendMessage(e.message, event.threadID, event.messageID);
    }
};
module.exports.Fbdl = async function (q, api, event) {
    if (!q) {
        api.sendMessage("Please But a Facebook video link  ..!", event.threadID, event.messageID);
        return;
    }
    api.sendMessage("downloading video, please wait...", event.threadID, event.messageID);

    try {
        let path = __dirname + `/cache/`;


        await fs.ensureDir(path);

        path += 'fbVID.mp4';

        const aa = await axios.get(`https://facebookdl.hayih59124.repl.co/facebook?url=${encodeURI(q)}`);


        const videoUrl = aa.data.result.sd_q;

        const vid = (await axios.get(videoUrl, {
            responseType: "arraybuffer",
        })).data;

        fs.writeFileSync(path, Buffer.from(vid, 'utf-8'));

        api.sendMessage({
            body: `downloaded!!!`,
            attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path), event.messageID);


    } catch (e) {
        api.sendMessage(e.message, event.threadID, event.messageID);
    }
};
module.exports.song = async function (q, api, event) {
    if (!q) {
        api.sendMessage("Please write music name..!", event.threadID, event.messageID);
        return;
    }
    try {
      api.sendMessage(`🔍 | 𝙎𝙚𝙖𝙧𝙘𝙝𝙞𝙣𝙜 𝙥𝙡𝙚𝙖𝙨𝙚 𝙬𝙖𝙞𝙩...`, event.threadID);

      const res = await axios.get(`https://api.popcat.xyz/lyrics?song=${encodeURIComponent(q)}`);
      const lyrics = res.data.lyrics || "Not found!";
      const title = res.data.title || "Not found!";
      const artist = res.data.artist || "Not found!";

      const searchResults = await yts(q);
      if (!searchResults.videos.length) {
        return api.sendMessage("Error: Invalid request.", event.threadID, event.messageID);
      }

      const video = searchResults.videos[0];
      const videoUrl = video.url;

      const stream = ytdl(videoUrl, { filter: "audioonly" });

      const fileName = `${event.senderID}.mp3`;
      const filePath = __dirname + `/cache/${fileName}`;

      stream.pipe(fs.createWriteStream(filePath));

      stream.on('response', () => {
        console.info('[DOWNLOADER]', 'Starting download now!');
      });

      stream.on('info', (info) => {
        console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
      });

      stream.on('end', () => {
        console.info('[DOWNLOADER] Downloaded');

        if (fs.statSync(filePath).size > 26214400) {
          fs.unlinkSync(filePath);
          return api.sendMessage('[ERR] The file could not be sent because it is larger than 25MB.', event.threadID);
        }

        const message = {
          body: `❏ 𝙩𝙞𝙩𝙡𝙚: ${title}\n❏ 𝙖𝙧𝙩𝙞𝙨𝙩: ${artist}\n\n❏ 𝙡𝙮𝙧𝙞𝙘𝙨: ${lyrics}`,
          attachment: fs.createReadStream(filePath)
        };

        api.sendMessage(message, event.threadID, () => {
          fs.unlinkSync(filePath);
        });
      });
    } catch (e) {
        api.sendMessage(e.message, event.threadID, event.messageID);
    }
};