const { create } = require("combined-stream");

// all updated to main
const guild_id = "691976404983611412";
const registration_category_id = "888882155097309264";
const welcome_id = "715254355778994267";
const rules_id = "695982250952622141";
const general_id = "695982619917025300";
const verified_id = "714279112671232020";
const enrolled_id = "696391357022863392";
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
    try {
	guild = await client.guilds.fetch(guild_id);
	channel = await guild.channels.fetch(channel_id);

	await channel.send({
        ...(!(msg == undefined) && {content: msg}),
        ...(!(embeds == undefined) && {embeds: [embeds]}),
        ...(!(components == undefined) && {components : [components]})
    });
   // await channel.send({embeds: [embeds], components : [components]})
    }
    catch(err) {
        console.log(err);
    }
};

async function send_message_to_user(client, user_id, msg) {
    try {
    await client.users.fetch(user_id).send(msg);
    }
    catch(err) {
        console.log(err);
    }
};

async function delete_channel(client, channel_id, reason) {
    try {
    guild = await client.guilds.fetch(guild_id);
	channel = await guild.channels.fetch(channel_id);
    await channel.delete(reason);
    }
    catch(err)
    {
        console.log(err);
    }
};

async function delete_channels(client, channel_ids, reason) {
    try{
    guild = await client.guilds.fetch(guild_id);
    if(channel_ids.length !== 0) {
        for(c of channel_ids) {
            channel = await guild.channels.fetch(c);
            await channel.delete(reason);
        }
    }
    }
    catch(err) {
        console.log(err);
    }
}

async function create_channel(client, name, category_id=undefined) {
    try{
    guild = await client.guilds.fetch(guild_id);
    return guild.channels.create(name, {...(!(category_id == undefined) && {parent : category_id})});
    }
    catch(err) {
        console.log(err);
    }
};

async function get_channel_by_id(client, channel_id) {
    guild = await client.guilds.fetch(guild_id);
	channel = await guild.channels.fetch(channel_id);
    return channel;
}

async function get_channel_by_name(client, channel_name) {
    guild = await client.guilds.fetch(guild_id);
    channels = Array.from(guild.channels.cache);
    channel = channels.find(
        (channel) => {
            return channel[1]["name"].toLowerCase() === channel_name
        })
    return channel;
      
}

async function add_channel_overwrites(client, channel_id, uids, perms) {
    try {
    guild = await client.guilds.fetch(guild_id);
	channel = await guild.channels.fetch(channel_id);
    for(uid of uids) {
        member = await guild.members.fetch(uid);
        channel.permissionOverwrites.edit(member, perms);
    }
    }
    catch(err) {
        console.log(err);
    }

}


module.exports = {
    guild_id : guild_id,
    registration_category_id : registration_category_id,
    welcome_id : welcome_id,
    rules_id : rules_id,
    general_id : general_id,
    verified_id : verified_id,
    enrolled_id : enrolled_id,
    bt5_logo_link : bt5_logo_link,
    bt5_logo_with_text_link : bt5_logo_with_text_link,
    add_role : add_role,
    check_for_role : check_for_role,
    send_message_to_channel : send_message_to_channel,
    send_message_to_user : send_message_to_user,
    delete_channel : delete_channel,
    delete_channels : delete_channels,
    create_channel : create_channel,
    get_channel_by_id : get_channel_by_id,
    get_channel_by_name : get_channel_by_name,
    add_channel_overwrites : add_channel_overwrites

};