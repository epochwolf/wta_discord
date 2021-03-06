const Discord = require('discord.js');
// https://github.com/discordjs/discord.js/blob/master/src/util/Constants.js
const Events = Discord.Constants.Events;

/**
 * Handles parsing messages into commands. 
 */
class CommandProcessor {
  constructor(disordClient, triggerCharacter="!"){
    this.commands = new Map();
    this.triggerCharacter = triggerCharacter;

    disordClient.on(Events.MESSAGE_CREATE, this.eventHandler.bind(this));
  }

  addCommand(command, method){
    if(this.commands.has(command)){
      throw `${command} already registered!`;
    }
    this.commands.set(command, method);
  }

  removeCommand(command){
    this.commands.delete(command);
  }

  triggerCommand(command, message){
    const method = this.commands.get(command);
    if(method){
      const args = this.parseMessageIntoArgs(message)
      return method(message, args);
    }
  }

  parseMessageIntoArgs(message){
    const content = message.content;
    const args = content.split(' ');
    args.shift(); //Remove the command from the arguments. 
    return args;
  }

  eventHandler(message){
    const msg = message.content;
    if(msg.startsWith(this.triggerCharacter)){
      const [commandWithTrigger, _] = msg.split(" ", 1);
      const command = commandWithTrigger.substring(this.triggerCharacter.length);
      return this.triggerCommand(command, message);
    }
  }
}

module.exports = CommandProcessor;