const Discord = require('discord.js');
const Events = Discord.Constants.Events;
const ValidEvents = Object.values(Events);

class Plugin{
  constructor(bot, options={}){
    this.name        = options["name"]        || "Unknown",
    this.description = options["description"] || "",
    this.author      = options["author"]      || "Unknown",
    this.version     = options["version"]     || "0.0.1",
    this.listeners   = new Map();
    this.commands    = new Map();
    this.isLoaded    = false;
    this.bot         = bot;
  }

  __load(){
    // Does nothing by default.
  }

  __unload(){
    // Does nothing by default.
  }

  addCommand(name, callback, metadata={}){
    if(this.commands.get(name)){
      throw `${name} is already registered!`;
    }else{
      let command = new Command(this, name, callback.bind(this), metadata);
      this.commands.set(name, command);
    }
  }

  addListener(event, callback, metadata={}){
    if(!ValidEvents.includes(event)){
      throw `${event} is not a valid event!`;
    }

    let listener = new Listener(this, event,  callback.bind(this), metadata);
    let event_array = this.listeners.get(event);
    if(!Array.isArray(event_array)){
      event_array = [];
      this.listeners.set(event, event_array);
    }
    
    event_array.push(listener);
  }
}


class Command{
  constructor(plugin, name, callback, metadata){
    this.plugin       = plugin;
    this.name         = name;
    this.callback     = callback;
    this.description  = metadata.description || "";
    this.aliases      = metadata.aliases || [];

    if(metadata.signature){
      this.signatures = [metadata.signature];
    }else if(metadata.signatures){
      this.signatures = metadata.signatures;
    }else{
      this.signatures = [""];
    }
  }

  addToBot(){
    try{
      this.plugin.bot.commandProcessor.addCommand(this.name, this.callback);
      for(let alias of this.aliases){
        this.plugin.bot.commandProcessor.addCommand(alias, this.callback);
      }
    }catch(e){
      console.log(this);
      throw e;
    }
  }

  removeFromBot(){
    try{
      this.plugin.bot.commandProcessor.removeCommand(this.name);
      for(let alias of this.aliases){
        this.plugin.bot.commandProcessor.removeCommand(alias);
      }
    }catch(e){
      console.log(this);
      throw e;
    }
  }
}

class Listener{
  constructor(plugin, event, callback, metadata){
    this.plugin       = plugin;
    this.event        = event;
    this.callback     = callback;
    this.description  = metadata.description;
  }

  addToBot(){
    try{
      this.plugin.bot.client.on(this.event, this.callback); 
    }catch(e){
      console.log(this);
      throw e;
    }
  }

  removeFromBot(){
    try{
      this.plugin.bot.client.off(this.event, this.callback);  
    }catch(e){
      console.log(this);
      throw e;
    }
  }
}

module.exports = {
  Plugin: Plugin,
  Events: Events
};