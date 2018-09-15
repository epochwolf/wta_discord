const config = require('./config');
const Bot = require('./lib/bot.js');

const bot = new Bot(config);

bot.login();