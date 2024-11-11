import { addFormatters } from '@skyra/http-framework-i18n';

addFormatters({
	name: 'lowerCapital',
	format: (value: string) => {
		const characters = [...value];
		characters[0] = characters[0].toLowerCase();
		return characters.join('');
	}
});
