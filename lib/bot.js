const Discord = require('discord.js');
const CommandProcessor = require('./command_processor.js');
const PluginManager = require('./plugin_manager.js');


// Players
// Characters
// Scenes

class Bot {
  constructor(config){
    this.config = config;

    this.client = new Discord.Client({
      disabledEvents: ['TYPING_START']
    });
    this.commandProcessor = new CommandProcessor(this.client, this.config.trigger);
    this.pluginManager = new PluginManager(this);

    this.commandProcessor.addCommand("_reload_plugins", (message, args)=>{
      try{
        this.pluginManager.reloadAll();
        return message.reply(`Done!`);
      }catch(e){
        console.log(e);
        return message.reply(`Error, check console. :(`);
      }
    })
  }

  login(){
    this.client.login(this.config.discord_token);
  }
}

module.exports = Bot;