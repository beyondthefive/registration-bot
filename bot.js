const { Client : DiscordClient, Collection, Intents, Guild, GuildMember, Permissions, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Client : NotionClient} = require("@notionhq/client");

const discord_utils = require('./discord_utils');
const notion_utils = require('./notion_utils');
const fs = require('fs');
//const { channel } = require('diagnostics_channel');
require('dotenv').config();

const client = new DiscordClient({ intents: [Intents.FLAGS.GUILDS] });
client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity('beyondthefive.org', { type: 'WATCHING' });

    //send_welcome_msg(); 
    //send_rules();
});

client.login(process.env.token);

const notion = new NotionClient({
    auth: process.env.notion_key,
  });


const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, notion));
	} else {
		client.on(event.name, (...args) => event.execute(...args, notion));
	}
}

setInterval(mark_channels_for_deletion, 5000); // should be 600000 (10 mins)





async function mark_channels_for_deletion() {
    reg = discord_utils.get_channel_by_id(client, discord_utils.registration_category_id);
    reg.then((reg_const) => {
        reg = Array.from(reg_const.children.values());
        r = []
        for(c of reg) {
            r.push(c.name);
        }

        filter = { "or": [] };

        for(n of r) {
            filter["or"].push({
                    "property" : "Discord ID",
                    "text" : {
                        "contains" : n.substring(9),
                    }
            });
        }

        // add IDs to the filter here (elements of r minus the register part)

        registered = notion_utils.get_records(notion, notion_utils.students_id, filter=filter);
        registered.then(async function(registered) {

            to_be_deleted = []
            for(res of registered.results) { 
                try {
                channel_name = "register-" + res.properties["Discord ID"].rich_text[0].plain_text
                channel = await discord_utils.get_channel_by_name(client, channel_name);
                if(channel !== undefined) {
                    to_be_deleted.push(channel[1].id); // get the channel ID using that^, then push everything to this list
                    discord_utils.send_message_to_channel(client, channel[1].id, `<@${res.properties["Discord ID"].rich_text[0].plain_text}>, thank you for submitting your application! We will review it shortly. \n This channel will be closed in **ten minutes**--please email \`admissions@beyondthefive.org\` or direct message any of our Student Records Coordinators if you have any further questions.`)
                    // send a msg in each of the channels to be deleted: this channel will be deleted in 1 hr + if you still have qs, take it to DMs or email admissions
                }

                }
                catch(err) {
                    console.log(err);
                }
            }
            
            // then use setTimeout and discord_utils.delete_channels to delete these after a little less than 10 mins
            setTimeout(discord_utils.delete_channels, 4900, client, to_be_deleted, "Registration completed");

        });


    })
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

async function send_rules() {

}



