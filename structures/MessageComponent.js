'use strict';

module.exports.MessageComponent = class MessageComponent {

    constructor(data) {
        this.components = [{
            type: 1,
            components: []
        }];

        if (Array.isArray(data)) addButtons(data); 
        else if (typeof data === 'object') addButton(data);
    }

    addButton(component) {
        this.components[0].components.push(this.constructor.normalizeComponent(component));
        return this;
    }

    addButtons(components) {
        if (!Array.isArray(components)) throw new Error('components must be an Array'); 
        if (!components.every(component => typeof component === 'object')) throw new Error('components array must be all objects');
            components.forEach(function(component) {
                    this.components[0].components.push(this.constructor.normalizeComponent({
                        type: component.type,
                        disabled: component.disabled,
                        style: component.style,
                        custom_id: component.custom_id,
                        label: component.label,
                        url: component.url,
                        emoji: component.emoji
                    }));
            });
        return this;
    }

    toJSON() {
        return this.components;
    }

    static normalizeComponent(component) {
        // if (typeof component.type != 'number') throw new Error('COMPONENT_FIELD_TYPE');
        if (typeof component.style != 'number') throw new Error('COMPONENT_FIELD_STYLE');
        if (!['number', 'string'].includes(typeof component.custom_id) && !component.url) throw new Error('COMPONENT_FIELD_CUSTOM_ID');
        if (typeof component.label != 'string') throw new Error('COMPONENT_FIELD_LABEL');
        return {
            type: component.type || 2,
            disabled: component.disabled || false,
            style: component.style,
            custom_id: component.custom_id,
            label: component.label,
            url: typeof component.url == 'string' ? component.url : null,
            emoji: (component.emoji &&
                (component.emoji.id ||
                component.emoji.name ||
                component.emoji.animated)) ? component.emoji : null
        }
    }

    static get STYLES() {
        return {
            PRIMARY: 1,
            SECONDARY: 2,
            SUCCESS: 3,
            DESTRUCTIVE: 4,
            LINK: 5
        }
    }
}