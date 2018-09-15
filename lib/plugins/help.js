const {Plugin} = require("../plugin.js");

class HelpPlugin extends Plugin{

  constructor(bot){
    super(bot, {
      name:        "Help",
      author:      "epochwolf",
      version:     "0.0.1"
    });

    this.addCommand("help", this.showHelp, {
      description: "show list of available commands.",
      aliases: [
        "commands"
      ]
    });
  }

  showHelp(msg, args, options={}){
    let plugins = this.bot.pluginManager.plugins;
    let messages = [
      "The following commands are accepted (parameters in brackets are mandatory, parentheses are optional):",
    ];

    for(let [_, plugin] of plugins){
      if(plugin.commands.size > 0){
        messages.push('');
        messages.push(`__${plugin.name}__`);

      }
      for(let [_, command] of plugin.commands){
        let name = command.name;
        if(command.aliases.length > 0){
          name += "** / **" + command.aliases.join("** / **");
        }
        command.signatures.forEach((signature, index) => {
          if(index == 0 && command.description){
            messages.push(`**${name}** ${signature} - *${command.description}*`);
          }else{
            messages.push(`**${name}** ${signature}`);
          }
        })
      }
    } 

    msg.author.send(messages.join("\n"));
  }
}

module.exports = HelpPlugin;