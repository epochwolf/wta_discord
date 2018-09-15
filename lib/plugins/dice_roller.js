const {Plugin} = require("../plugin.js");

class DiceRoller extends Plugin{

  constructor(bot){
    super(bot, {
      name:        "Dice Roller",
      author:      "epochwolf",
      version:     "0.0.1"
    });


    this.addCommand("roll", this.normalRoll, {
      signatures: [
        "[dicepool(+willpower=0)] (difficulty=6) (reason)",
        "[dice]d[sides] (reason)"
      ],
      description: "1s subtract successes, willpower adds automatic successes",
      aliases: [
        "dice"
      ]
    });

    this.addCommand("sroll", this.specialityRoll, {
      signatures: [
        "[dicepool(+willpower=0)] (difficulty=6) (reason)"
      ],
      description: "1s subtract successes, 10s add two, willpower adds automatic successes",
    });

    this.addCommand("droll", this.soakOrDamageRoll, {
      signature: "[dicepool] (reason)",
      description: "1s do not subtract successes",
      aliases: [
        "damage", 
        "soak"
      ]
    });
  }

  // roll 3 
  // roll 3 6
  // roll 3+1
  // roll 3+1 6
  // roll 1d6
  normalRoll(message, args, options={}){
    let {speciality=false, soak=false} = options;
    let [dice, sides, difficulty, automaticSucccesses, reason] = this.parseArgs(args);
    if(dice === undefined) return message.reply("Couldn't parse that. :confused:");
    if(difficulty > sides) return message.reply("That's always going to botch. :confused:");

    let results = this.roll(dice, sides);
    let displayDice = this.formatResults(results, difficulty, !soak, speciality);

    if(difficulty){
      if(automaticSucccesses){
        for(var i = 0; i < automaticSucccesses; i++){
          displayDice += ` A `;
        }
      }
      let failures = this.countFailures(results, difficulty);
      let successes = this.countSuccesses(results, difficulty, speciality) + automaticSucccesses;
      let finalResult = soak ? successes : (successes - failures);
      let displaySuccesses = '';
      let displayResult = ` __**Result = ${finalResult}**__`;

      if(soak){
        displaySuccesses = `${successes} successes`;
      }else{
        displaySuccesses = `${successes} successes, ${failures} failures`;
        if(finalResult < 0){
          displayResult += " __**BOTCH!**__";
        } 
      }
      return message.reply(`${reason} :game_die: (${displayDice}). ${displaySuccesses}. ${displayResult}`);
    }else{
      let finalResult = results.reduce((total, result)=>{ return total+result; }, 0);
      return message.reply(`${reason} :game_die: (${displayDice}) = __**${finalResult}**__`);
    }
  }

  specialityRoll(message, args){
    this.normalRoll(message, args, {speciality: true});
  }

  soakOrDamageRoll(message, args){
    this.normalRoll(message, args, {soak: true});
  }

  // Parses
  // ['6'] => [6, 10, 6, 0, '']
  // ['6'] => [6, 10, 6, 0, '']
  // Returns 
  // [dice, sides, difficulty, automaticSucccesses, reason]
  parseArgs(args){
    let dice, difficulty, add, sides, reason;
    add = "0";
    sides = "10";
    [dice="", difficulty, ...reason] = args;

    if(dice.match(/^\d+(\+\d+)?$/)){
      [dice, add="0"] = dice.split('+', 2)

      if(difficulty && difficulty.match(/^\d$/)){
        difficulty = parseInt(difficulty);
      }else if(difficulty){
        reason.unshift(difficulty);
      }else{
        difficulty = "6"
      }
    }else if(dice.match(/^\d+d\d+$/)){
      [dice, sides] = dice.split("d", 2);
      if(difficulty) reason.unshift(difficulty);
      difficulty = "0" // Disable difficulty if we are dealing with a specific number of sides.
    }else{
      return [];
    }

    reason = reason.join(" ");
    return [parseInt(dice), parseInt(sides), parseInt(difficulty), parseInt(add), reason];
  }

  formatResults(results, difficulty, bold_ones=true, bold_tens=false){
    let response = results.map((result) => {
      return this.formatResult(result, difficulty, bold_ones, bold_tens);
    }).join('');
    return `${response}`;
  }

  formatResult(number, difficulty, bold_ones=true, bold_tens=false){
    if(!difficulty) return ` ${number} `;

    if(number >= difficulty){
      if((bold_tens && number == 10)){
        return ` **${number}** `;
      }else{
        return ` ${number} `;
      }
    }else{
      if(bold_ones && number == 1){
        return ` ~~**${number}**~~ `;
      }else{
        return ` ~~${number}~~ `;
      }
    }
  }

  countSuccesses(results, difficulty, speciality=false){
    return results.reduce((count, result) => {
      if(result >= difficulty){
        if(speciality && result == 10){
          return count + 2;
        }else{
          return count + 1;
        }
      }else{
        return count;
      }
    }, 0);
  }

  countFailures(results, difficulty){
    return results.reduce((count, result) => {
      return count + ((result == 1) ? 1 : 0)
    }, 0);
  }

  roll(number, sides){
    number = parseInt(number);
    sides = parseInt(sides);
    if(!Number.isInteger(number) || !Number.isInteger(sides)){
      return [];
    }
    var results = [];
    for(var i=0; i < number; i++){
      results.push(DiceRoller.rollDie(sides));
    } 
    return results;
  }

  static rollDie(sides){
    if(sides < 1) return 0;

    return this._getRandomInt(sides) + 1;
  }

  // Returns integer from 0 to <max>
  static _getRandomInt(max){
    return Math.floor(Math.random() * Math.floor(max));
  }
}

module.exports = DiceRoller;