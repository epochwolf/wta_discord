const {Plugin, Events} = require("../plugin.js");

class ConsoleMessages extends Plugin{

  constructor(bot){
    super(bot, {
      name:        "Console Messages",
      author:      "epochwolf",
      version:     "0.0.1",
      autoload:    true
    });

    this.addListener(Events.READY, this.handleReady.bind(this));
    this.handleSigIntBind = this.handleSigInt.bind(this);
  }

  __load(){
    process.on('SIGINT', this.handleSigIntBind);
  }

  __unload(){
    process.off('SIGINT', this.handleSigIntBind);
  }

  handleReady(){
    let user = this.bot.client.user;
    console.log(`Logged in as ${user.tag}!`);
  }

  handleSigInt(){
    this.bot.client.destroy().then(() => {
      console.log("Disconnected Successfully.");
      process.exit();
    }, ()=>{
      console.log("Error disconnecting, quitting anyway.");
      process.exit();
    });
  }
}

module.exports = ConsoleMessages;




