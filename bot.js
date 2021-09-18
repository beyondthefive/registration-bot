const { Client : DiscordClient, Collection, Intents, Guild, GuildMember, Permissions, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const discord_utils = require('./discord_utils');
const fs = require('fs');
require('dotenv').config();

const client = new DiscordClient({ intents: [Intents.FLAGS.GUILDS] });
client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity('beyondthefive.org', { type: 'WATCHING' });

    //send_welcome_msg(); // only once
});


client.login(process.env.token);



const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

async function send_welcome_msg() {
    const row = new MessageActionRow()
			.addComponents(
                new MessageButton()
                    .setCustomId('Verify_Me')
					.setLabel('Verify Me')
					.setStyle('SECONDARY'),
				new MessageButton()
					.setCustomId('Register')
					.setLabel('Register')
					.setStyle('SUCCESS'),
                
			);
    const embed = new MessageEmbed()
			.setColor('#10247d')
            .setAuthor('Beyond The Five', discord_utils.bt5_logo_link, 'https://beyondthefive.org')
            .setThumbnail(discord_utils.bt5_logo_with_text_link)
			.setTitle('Welcome to Beyond The Five!')
            .setFooter('We look forward to learning with you!', discord_utils.bt5_logo_link)
            .addFields(
                { name: 'About Us', value: 'Beyond The Five is a non-profit organization dedicated towards helping students from around the world pursue higher level education through free, online, self-paced courses ranging from AP, SAT/ACT, to college-level courses. https://beyondthefive.org/courses' },
                { name: 'Registration', value: 'Registration for the 2021-22 school year is now open! Click the \"Register\" button below to get started.'},
                { name: 'Verification', value: `By clicking the \"Verify Me\" button below, you agree to all of the <#${discord_utils.rules_id}>`},

            )

    discord_utils.send_message_to_channel(client, discord_utils.welcome_id, msg=undefined, embeds=embed, components=row);

};




