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

setInterval(mark_channels_for_deletion, 600000); // should be 600000 (10 mins)





async function mark_channels_for_deletion() {
    try {
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
            setTimeout(discord_utils.delete_channels, 570000, client, to_be_deleted, "Registration completed"); // should be 570000

        });


    })


    }
    catch(err) {
        console.log(err);
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
                { name: 'About Us', value: 'Beyond The Five is a non-profit organization dedicated towards helping students from around the world pursue higher level education through free, online, self-paced courses ranging from AP to college-level courses. https://beyondthefive.org/courses' },
                { name: 'Registration', value: 'Registration for the 2021-22 school year is now open! Click the \"Register\" button below to get started.'},
                { name: 'Verification', value: `By clicking the \"Verify Me\" button below, you agree to all of the <#${discord_utils.rules_id}>`},

            )

    discord_utils.send_message_to_channel(client, discord_utils.welcome_id, msg=undefined, embeds=embed, components=row);

};

async function send_rules() {
    const embed = new MessageEmbed()
			.setColor('#10247d')
            .setAuthor('Beyond The Five', discord_utils.bt5_logo_link, 'https://beyondthefive.org')
			.setTitle('Beyond The Five Community Guidelines & Rules')
            .addFields(
                { name: 'Rule 1', value: 'Respect all of your other students, teachers, and staff members.' },
                { name: 'Rule 2', value: 'The sharing of illegal and copyrighted content is strictly forbidden.' },
                { name: 'Rule 3', value: 'Do not discuss anything potentially offensive or uncomfortable. The sharing of inappropriate or explicit content is strictly forbidden. Controversial topics, including current evolving events, can be discussed as long as it’s civil. Political and ideological discussions are generally prohibited.' },
                { name: 'Rule 4', value: 'Keep topics in their respective channels.' },
                { name: 'Rule 5', value: 'Advertising, links, and all other types of promotion must be approved by the Community Coordinators.' },
                { name: 'Rule 6', value: 'All decisions made by staff are final. You may appeal and question a decision by contacting the Operational Administrator.' },
                { name: 'Rule 7', value: 'Abide by Discord’s Terms of Service: https://discord.com/new/terms' },
                { name: 'Questions?', value: `If you have any questions about these rules, please ask in <#${discord_utils.general_id}>` },
            )
    discord_utils.send_message_to_channel(client, discord_utils.rules_id, msg=undefined, embeds=embed);

}



