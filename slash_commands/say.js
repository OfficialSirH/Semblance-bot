
module.exports = {
    permissionRequired: 0,
    run: async (client, interaction) => {
        return [{ content: interaction.data.options[0].value }];
    }
}
