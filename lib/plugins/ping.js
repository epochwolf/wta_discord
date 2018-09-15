const {Plugin} = require("../plugin.js");

class Ping extends Plugin{

  constructor(bot){
    super(bot, {
      name:        "Ping",
      author:      "epochwolf",
      version:     "0.0.1",
      autoload:    true
    });

    this.addCommand("ping", this.pong);
  }

  pong(message, args, options={}){
    message.reply("Pong!");
  }
}

module.exports = Ping;