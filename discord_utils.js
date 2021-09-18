const { create } = require("combined-stream");

const guild_id = "876513971191046194";
const registration_category_id = "888273811361902602";
const welcome_id = "888271675819442226";
const rules_id = "888271741992984596";
const bt5_logo_link = "https://cdn.discordapp.com/attachments/746820839907000341/888643747502514186/Beyond_The_Five_Logo.png"
const bt5_logo_with_text_link = "https://cdn.discordapp.com/attachments/746820839907000341/888644924516487198/Beyond_The_Five_Logo_Text_White.png";

async function add_role(client, uid, role_id) {
    guild = await client.guilds.fetch(guild_id);
    member = await guild.members.fetch(uid);
    role = await guild.roles.fetch(role_id);
    await member.roles.add(role);
};


async function check_for_role(client, uid, role_id) {
    guild = await client.guilds.fetch(guild_id);
    member = await guild.members.fetch(uid);
    return member._roles.includes(role_id);
};

async function send_message_to_channel(client, channel_id, msg=undefined, embeds=undefined, components=undefined) {
	guild = await client.guilds.fetch(guild_id);
	channel = await guild.channels.fetch(channel_id);

	await channel.send({
        ...(!(msg == undefined) && {content: msg}),
        ...(!(embeds == undefined) && {embeds: [embeds]}),
        ...(!(components == undefined) && {components : [components]})
    });
   // await channel.send({embeds: [embeds], components : [components]})
};

async function send_message_to_user(client, user_id, msg) {
    await client.users.fetch(user_id).send(msg);
};

async function delete_channel(client, channel_id, reason) {
    guild = await client.guilds.fetch(guild_id);
	channel = await guild.channels.fetch(channel_id);
    await channel.delete(reason);

};

async function create_channel(client, name, category_id=undefined) {
    guild = await client.guilds.fetch(guild_id);
    return guild.channels.create(name, {...(!(category_id == undefined) && {parent : category_id})});
};

async function get_channel(client, channel_id) {
    guild = await client.guilds.fetch(guild_id);
	channel = await guild.channels.fetch(channel_id);
    return channel;
}


module.exports = {
    guild_id : guild_id,
    registration_category_id : registration_category_id,
    welcome_id : welcome_id,
    rules_id : rules_id,
    bt5_logo_link : bt5_logo_link,
    bt5_logo_with_text_link : bt5_logo_with_text_link,
    add_role : add_role,
    check_for_role : check_for_role,
    send_message_to_channel : send_message_to_channel,
    send_message_to_user : send_message_to_user,
    delete_channel : delete_channel,
    create_channel : create_channel

};