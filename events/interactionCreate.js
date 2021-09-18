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
            discord_utils.check_for_role(interaction.client, interaction.user.id, discord_utils.verified_id).then((has_verified) => {
                if(!has_verified) {
                    interaction.user.send("You haven't been verified yet! Click the \"Verify Me\" button to confirm that you agree to our server rules.");
                }
            });

            discord_utils.check_for_role(interaction.client, interaction.user.id, discord_utils.enrolled_id).then((has_enrolled) => {
                if(has_enrolled) {
                    interaction.user.send("You're already enrolled! Email admissions@beyondthefive.org if you would like to make any changes to your course selection.");
                }
            });

	    }
    return interaction.deferUpdate();
    }   
};