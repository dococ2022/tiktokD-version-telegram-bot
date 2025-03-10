import TelegramBot from "node-telegram-bot-api";
import { getUrl } from "./src/getUrl.js";
import { lang } from "./src/language.js";
import { validateDomain } from "./src/validateDomain.js";

const token = '5599787287:AAE6Lb-PCLsRlRrXKubsbZRbQsYroBhHTmE';
const bot = new TelegramBot(token, {polling: true});
if(lang.welcome === '') lang.cb('en');

// start message
bot.onText(/^\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, lang.welcome);
});
// language
bot.onText(/^\/lang/, msg => {
    let chatId = msg.chat.id;

    let options = {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{ text: '🇪🇸 Spanish', callback_data: '1' }],
            [{ text: '🇺🇸 English', callback_data: '2' }]
          ]
        })
    };

    bot.sendMessage(chatId, lang.lang, options)
})
// detect url
bot.onText(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:((www|[a-zA-Z0-9]+)\.))?([^:\/\n\?\=]+)/, async (msg, math) => {
    let chatId = msg.chat.id;
    let url = math.input;
    
    if(validateDomain(url)){
        getUrl(url, link => {
            bot.sendVideo(chatId, link);
        });
    }else{
        bot.sendMessage(chatId, lang.error);
    }
});

// get errors
bot.on('polling_error', function(error){
    console.log(error);
});
// get language options
bot.on('callback_query', msg => {
    msg.data === '1' ? lang.cb('es') : lang.cb('en');
    let text = msg.data === '1' ? 'cambiaste el idioma del bot a Español' : 'change language to English';
    bot.answerCallbackQuery(msg.id, {text: text, show_alert: true})
})
