const discord_utils = require('../discord_utils');

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
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
            
            Promise.all([has_verified, has_enrolled]).then((has_verified, has_enrolled) => {
                if(!has_verified) {
                    interaction.user.send("You haven't been verified yet! Click the \"Verify Me\" button to confirm that you agree to our server rules.");
                }
                else if(has_enrolled) {
                    interaction.user.send("You're already enrolled! Email admissions@beyondthefive.org if you would like to make any changes to your course selection.");
                }
                else { // the student records coord role should alr have access to the Registration category
                    new_channel = discord_utils.create_channel(interaction.client, `register-${interaction.user.id}`, category_id=discord_utils.registration_category_id);
                    new_channel.then((channel) => {
                        discord_utils.add_channel_overwrites(interaction.client, channel.id, 
                            [interaction.user.id], { VIEW_CHANNEL: true, SEND_MESSAGES : true});
                        discord_utils.send_message_to_channel(interaction.client, channel.id, `Registration Form: https://tally.so/r/m6dNOw?ID=${interaction.user.id}`);
                        discord_utils.send_message_to_channel(interaction.client, channel.id, "If you have any questions, you can ask our Student Records Coordinators here.");
                    });

                }
            });
            

	    }
    return interaction.deferUpdate();
    }   
};