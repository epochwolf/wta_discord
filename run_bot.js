const config = require('./config');
const CommandProcessor = require('./lib/command_processor.js');
const DiceRoller = require('./lib/dice_roller.js');
const Discord = require('discord.js');

const bot = new Discord.Client({
  disabledEvents: ['TYPING_START']
});

const cmdp = new CommandProcessor(bot, '!');
const dice_roller = new DiceRoller(cmdp);

// Setup event trap
process.stdin.resume()
process.on('SIGINT', () => {
  bot.destroy().then(() => {
    console.log("Disconnected Successfully.");
    process.exit();
  }, ()=>{
    console.log("Error disconnecting, quitting anyway.");
    process.exit();
  });
});

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
  // if (msg.content === 'rename me') {
  //   var guild_member = msg.member;
  //   if(guild_member){
  //     guild_member.setNickname("Bubble Breath", "They asked me to?").then(() => {
  //       msg.reply("Your wish is my command, Bubble Breath.");
  //     }, ()=>{
  //       msg.reply("Um... apparently I'm not allowed to do that?");
  //     });
  //   }
  // }
});

cmdp.register("ping", msg => {
  msg.reply("Pong!");
});

console.log("Stating bot");
bot.login(config.discord_token);