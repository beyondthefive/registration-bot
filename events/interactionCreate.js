const discord_utils = require('../discord_utils');
const notion_utils = require('../notion_utils');

module.exports = {
	name: 'interactionCreate',
	execute(interaction, notion) {
		if (!interaction.isButton()) return;
	    if (interaction.customId == "Verify_Me") {
            discord_utils.check_for_role(interaction.client, interaction.user.id, discord_utils.verified_id).then((has_verified) => {
                if(!has_verified) {
                    discord_utils.add_role(interaction.client, interaction.user.id, discord_utils.verified_id);
                    interaction.user.send("Verified!");
                }
            });
        }
        if(interaction.customId == "Register") {
            has_verified = discord_utils.check_for_role(interaction.client, interaction.user.id, discord_utils.verified_id);
            has_enrolled = discord_utils.check_for_role(interaction.client, interaction.user.id, discord_utils.enrolled_id);

            filter = {
                "and": [
                  {
                    "property": "Discord ID",
                    "text": {
                      "equals": interaction.user.id
                    }
                  },
                  {
                    "property": "Application Status",
                    "select": {
                      "is_empty": true
                    }
                  },
                            ]
                      };

            just_applied = notion_utils.get_records(notion, notion_utils.students_id, filter=filter);
            Promise.all([has_verified, has_enrolled, just_applied]).then((vals) => {
                has_verified = vals[0];
                has_enrolled = vals[1];
                just_applied = vals[2];
                reg = discord_utils.get_channel_by_id(interaction.client, discord_utils.registration_category_id);
                reg.then((reg) => {
                    reg = Array.from(reg.children.values());
                    r = []
                    for(channel of reg) {
                        r.push(channel.name);
                    }
                    
                    if(!has_verified) {
                        interaction.user.send("You haven't been verified yet! Click the \"Verify Me\" button to confirm that you agree to our server rules.");
                    }
                    else if(has_enrolled) {
                        interaction.user.send("You're already enrolled! Email admissions@beyondthefive.org if you would like to make any changes to your course selection.");
                    }
                    else if(r.includes(`register-${interaction.user.id}`)) {
                        interaction.user.send("You've already begun registering--please use your assigned registration channel.");
                    }
                    else if(just_applied.results.length !== 0) {
                        interaction.user.send("You've already applied! Please wait until you have received a decision via email.");
                    }
                    else { // the student records coord role should alr have access to the Registration category
    
                        new_channel = discord_utils.create_channel(interaction.client, `register-${interaction.user.id}`, category_id=discord_utils.registration_category_id);
                        new_channel.then((channel) => {
                            discord_utils.add_channel_overwrites(interaction.client, channel.id, 
                                [interaction.user.id], { VIEW_CHANNEL: true, SEND_MESSAGES : true});
                            discord_utils.send_message_to_channel(interaction.client, channel.id, `Registration Form: https://tally.so/r/m6dNOw?ID=${interaction.user.id}`);
                            discord_utils.send_message_to_channel(interaction.client, channel.id, "If you have any questions regarding registration or our courses, **don't submit your application just yet**—you can view a list of FAQs here: "); 
                            discord_utils.send_message_to_channel(interaction.client, channel.id, "If any of your concerns aren't covered in the above FAQs, feel free to ask our Student Records Coordinators here."); 

                        });
                    }
                });
            });
            

	    }
    return interaction.deferUpdate();
    }   
};