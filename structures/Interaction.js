const { GuildMember, MessageEmbed } = require('discord.js'), { MessageComponent } = require('.');

module.exports.Interaction = class Interaction {

    constructor(interaction) {
        this.client = interaction.client;
        this.id = interaction.id;
        this.token = interaction.token;
        this.applicationId = interaction.application_id;
        this.type = interaction.type;
        this.data = interaction.data || null;
        this.guild = interaction.client.guilds.cache.get(interaction.guild_id);
        this.channel = interaction.client.channels.cache.get(interaction.channel_id);
        this.messageId = interaction.message_id || null;
        this.member = this.guild.members.cache.get(interaction.member.user.id) || new GuildMember(interaction.member) || null;
        this.version = interaction.version;
        this.customId = interaction.custom_id;
    }

    async send(content, options) {
        if (typeof content === 'object') {
            options = content;
            content = undefined; 
        }
        if (!options) {
            if (options instanceof MessageEmbed) options = { embeds = [options], components = [], ephemeral = false, type = 4 };
            if (Array.isArray(options) && options.every(option => option instanceof MessageEmbed)) options = { embeds = options, components = [], ephemeral = false, type = 4 };
            if (options instanceof MessageComponent) options = { embeds = [], components = options, ephemeral = false, type = 4 };
        }
        let { embeds, components, ephemeral, type } = options;
        if (typeof content != 'string' && typeof content != 'object') throw new Error('Interaction Content must be a string or object type');
        if (typeof embeds != 'object') throw new Error('Interaction Embeds must be an object type');
        if (typeof ephemeral != 'boolean') throw new Error('Interaction Ephemeral must be a boolean type');
        if (components instanceof MessageComponent) throw new Error('Interaction Components must be a MessageComponent instance');
        if (!(embeds instanceof Array)) embeds = [embeds];
        if (content.length == 0 && embeds.length == 0) throw new Error('Interaction Responses must have content and/or embeds');
        embeds = embeds.map(embed => embed instanceof MessageEmbed ? embed.toJSON() : embed);
        return this.client.api.interactions(this.id, this.token).callback.post({data: {
            type,
            data: {
                content,
                embeds,
                components,
                flags: ephemeral ? 64 : 0
            }
        }})
        .catch(err => {
            client.api.interactions(this.id, this.token).callback.post({data: {
                type: 4,
                data: {
                    content: "An error occurred with the slash command, further errors should be reported to the developer(SirH) as soon as possible.",
                    embeds: [],
                    flags: 64
                }
            }});
            console.log(`An error occured with the slash command named ${this.data.name}.\nError: ${err}`);
        });
    }

    toJSON() {
        return {
            client: this.client.constructor.name,
            id: this.id,
            token: this.token,
            applicationId: this.applicationId,
            type: this.type,
            data: this.data,
            guild: this.guild.name,
            channel: this.channel.name,
            messageId: this.messageId,
            member: this.member.id,
            version: this.version,
            customId: this.customId
        };
    }
}