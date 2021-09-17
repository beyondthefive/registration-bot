const { Client : DiscordClient, Collection, Intents, Guild, GuildMember, Permissions } = require('discord.js');
const discord_utils = require('./discord_utils');
const fs = require('fs');
require('dotenv').config();

const client = new DiscordClient({ intents: [Intents.FLAGS.GUILDS] });
client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity('beyondthefive.org', { type: 'WATCHING' });

    // msg checks and sending goes here

});
client.login(process.env.token);



async function create_welcome(client) {
    welcome_id = await discord_utils.create_channel(client, "welcome", category_id=discord_utils.information_category_id);
    welcome_id.then(() => {
        
    });
}; 



/*
outline:
- if welcome msg and buttons aren't in #welcome -> send them
- verified button event (gray button) -> if user who clicked doesn't have the role, add them
- registration button event (green button) ->
    - check if they already have the enrolled role -> if so, DM them the bt5 email w/ a message; if not, proceed
    - create a new channel (in the "Registration" category using guildchannel.setparent) called register-[user id]
    w/ only the person who clicked and the student records managers
    - bot sends:
        - the form (w/ discord id)
        - a message providing info abt registration and directing them to student records managers if they have any questions
        - a button that they should click after they fill out the form (on click, delete channel)
            - wait actually how should channels be deleted? either the applicant or a records coordinator can delete the channel?
            - also add an "are you sure" button as a safeguard against accidental clicks
            

---
- remember to put all events into a separate module and use the thing from discordjs.guide

*/

