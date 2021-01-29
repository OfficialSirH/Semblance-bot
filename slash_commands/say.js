
module.exports = {
    permissionRequired: 7,
    run: async (client, interaction) => {
        return [{ content: interaction.data.options[0].value }];
    }
}