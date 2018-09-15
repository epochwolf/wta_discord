let fs = require("fs");
let path = require("path");

class PluginManager{
  constructor(bot){
    this.bot = bot;
    this.plugins = new Map();
    this.reloadAll();
  }

  load(name){
    let plugin = this.plugins.get(name);
    try{
      if(!plugin){ return undefined; }
      if(plugin.isLoaded){ return false; }

      for(let [event, array] of plugin.listeners){
        for(let listener of array){
          listener.addToBot();
        }
      }
      for(let [_, command] of plugin.commands){
        command.addToBot();
      }
      plugin.__load();
      plugin.isLoaded = true;
      return true;
    }catch(e){
      console.log(`Plugin Load Error: ${name}`);
      console.log(plugin);
      throw e;
    }
  }

  unload(name){
    let plugin = this.plugins.get(name);
    try{
      if(!plugin){ return undefined; }
      if(!plugin.isLoaded){ return false; }

      for(let [event, array] of plugin.listeners){
        for(let listener of array){
          listener.removeFromBot();
        }
      }
      for(let [_, command] of plugin.commands){
        command.removeFromBot();
      }
      plugin.__unload();
      plugin.isLoaded = false;
      return true;
    }catch(e){
      console.log(`Plugin Unload Error: ${name}`);
      console.log(plugin);
      throw e;
    }
  }

  available(){
    return this.plugins.keys();
  }

  loaded(){
    return this.plugins.keys().every((k) => { return this.plugins[k].isLoaded; });
  }

  reloadAll(){
    for(let [name, plugin] of this.plugins){ 
      this.unload(name); 
    }
    this.plugins.clear();

    let plugin_dir = path.join(__dirname, 'plugins')
    let files = fs.readdirSync(plugin_dir);
    for(let file of files){
      if(file.match(/\.js$/)){
        let name = path.basename(file, '.js');
        delete require.cache[require.resolve(path.join(plugin_dir, file))];
        let klass = require(path.join(plugin_dir, file));
        let plugin = new klass(this.bot);
        plugin.metadata.plugin_name = name
        plugin.metadata.required_as = file
        this.plugins.set(name, plugin);
        this.load(name);
      }
    }
  }

}

module.exports = PluginManager