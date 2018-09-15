# Bot Terms

## Player

A player in the game. There is a 1:1 relationship between players and discord users. A player has the following fields: 

* discord_user_id:snowflake (snowflake is a discord object type, stored as a string)
* ooc_name:string

### Later

* game_roles:Array<string> (stored as comma seperated values)
* created_at:datetime
* updated_at:datetime

A player is distinct from a discord user. Game roles are distinct from Discord roles on GuildUser. 

## Character

* name:string (Lower case, no spaces?)
* owner_discord_user_id:snowflake (owner of the character)
* character_sheet_url:string

### Later 

* approval_discord_user_id:snowflake (player that approved the character)
* created_at:datetime
* updated_at:datetime 
* approved_at:datetime
* last_used_at:datetime (Last time the owner used the character.)

## Scene

