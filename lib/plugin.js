const Discord = require('discord.js');
const Events = Discord.Constants.Events;
const ValidEvents = Object.values(Events);

class Plugin{

  constructor(bot, options={}){
    this.metadata = {
      name:        options["name"] || "Unknown",
      description: options["description"] || "",
      author:      options["author"] || "Unknown",
      version:     options["version"] || "0.0.1",
      autoload:    options["autoload"] === false ? false : true
    };
    this.listeners = new Map();
    this.commands  = new Map();
    this.isLoaded = false;
    this.bot = bot;
  }

  __load(){
    // Does nothing by default.
  }

  __unload(){
    // Does nothing by default.
  }

  addCommand(name, method){
    if(this.commands.get(name)){
      throw `${name} is already registered!`;
    }else{
      this.commands.set(name, method.bind(this));
    }
  }

  addListener(discordEvent, method){
    if(!ValidEvents.includes(discordEvent)){
      throw `${discordEvent} is not a valid event!`;
    }

    let event_array = this.listeners.get(discordEvent);
    if(!Array.isArray(event_array)){
      event_array = [];
      this.listeners.set(discordEvent, event_array);
    }
    
    event_array.push(method.bind(this));
  }
}

module.exports = {
  Plugin: Plugin,
  Events: Events
};