import { ApplicationCommandInteractionData, InteractionJSON, InteractionType, RawInteraction, SendOptions } from '@semblance/lib/interfaces/interaction';
import { MessageComponent } from '@semblance/lib/interfaces/MessageComponent';
import { Client, Guild, GuildMember, MessageEmbed, Snowflake, TextChannel } from 'discord.js';
import { Semblance } from '.';

export class Interaction {
    public readonly client: Semblance;
    public readonly id: Snowflake;
    public readonly token?: string;
    public readonly applicationId: Snowflake;
    public readonly type: InteractionType;
    public readonly data?: ApplicationCommandInteractionData;
    public readonly guild?: Guild;
    public readonly channel: TextChannel;
    public readonly messageId?: Snowflake;
    public readonly member: GuildMember;   
    public readonly version: number;
    public readonly customId?: string;

    constructor(interaction: RawInteraction) {
        this.client = interaction.client;
        this.id = interaction.id;
        this.token = interaction.token;
        this.applicationId = interaction.application_id;
        this.type = interaction.type;
        this.data = interaction.data;
        this.guild = interaction.client.guilds.cache.get(interaction.guild_id);
        this.channel = interaction.client.channels.cache.get(interaction.channel_id) as TextChannel;
        this.messageId = interaction.message_id;
        this.member = this.guild!.members.cache.get((interaction.member as GuildMember)!.user.id) ?? 
            new GuildMember(this.client as unknown as Client, interaction.member as object, this.guild as Guild);
        this.version = interaction.version;
        this.customId = interaction.custom_id;
    }

    async send(content: MessageEmbed | object | string | undefined, options?: SendOptions | MessageEmbed[] | MessageEmbed | MessageComponent) {
        const { MessageComponent } = require('.');
        let embeds, components, ephemeral, type;
        if (typeof content === 'object') {
            (options as unknown as string) = content as unknown as string;
            content = undefined; 
        }
        if (!!options) {
            if (options instanceof MessageEmbed) options = { embeds: [options], components: [], ephemeral: false, type: 4 };
            if (Array.isArray(options) && options.every(option => option instanceof MessageEmbed)) options = { embeds: options, components: [], ephemeral: false, type: 4 };
            if (options instanceof MessageComponent) (options as any) = { embeds: [], components: (options as MessageComponent).components, ephemeral: false, type: 4 };
            ({ embeds = [], components = [], ephemeral = false, type = 4 } = (options as any));
        } else ({ embeds, components, ephemeral, type } = { embeds: [], components: [], ephemeral: false, type: 4 });
        

        if (typeof content != 'string' && typeof content != 'object' && !embeds && !components) throw new Error('Interaction Content must be a string or object type');
        if (!!embeds && typeof embeds != 'object') throw new Error('Interaction Embeds must be an object type');
        if (!!ephemeral && typeof ephemeral != 'boolean') throw new Error('Interaction Ephemeral must be a boolean type');
        if (!!components && !(components instanceof MessageComponent) && !Array.isArray(components) && !Array.isArray((components as unknown as MessageComponent[])[0].components)) throw new Error('Interaction Components must be a MessageComponent instance');
        if (!!embeds && !(embeds instanceof Array)) embeds = [embeds];
        if ((content as string)?.length == 0 && embeds.length == 0 && ((components as []).length == 0 || (components as unknown as MessageComponent)?.components[0]?.components?.length == 0)) 
            throw new Error('Interaction Responses must have content, embeds, and/or components');
        embeds = embeds?.map((embed: MessageEmbed | object) => embed instanceof MessageEmbed ? embed.toJSON() : embed);
        return this.client.call.interactions(this.id, this.token).callback.post({data: {
            type,
            data: {
                content,
                embeds: embeds || [],
                components: components || [],
                flags: ephemeral ? 64 : 0
            }
        }})
        .catch((err: Error) => {
            this.client.call.interactions(this.id, this.token).callback.post({data: {
                type: 4,
                data: {
                    content: "An error occurred with the slash command, further errors should be reported to the developer(SirH) as soon as possible.",
                    embeds: [],
                    flags: 64
                }
            }});
            console.log(`An error occured with the slash command named ${this.data!.name}.\nError: ${err}`);
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
            guild: this.guild!.name,
            channel: this.channel.name,
            messageId: this.messageId,
            member: this.member.id,
            version: this.version,
            customId: this.customId
        };
    }
}