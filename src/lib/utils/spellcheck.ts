import Typo from 'typo-js';
import aff from 'typo-js/dictionaries/en_US/en_US.aff?raw';
import dic from 'typo-js/dictionaries/en_US/en_US.dic?raw';

const dictionary = new Typo('en_US', aff, dic, { platform: 'any' });

export const escapeHtml = (str: string): string =>
	str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');

export type Misspelled = { original: string; suggestions: string[] };

export const spellcheck = (params: {
	text: string;
	maxSuggestions?: number | undefined;
}): { html: string; misspelled: Misspelled[] } => {
	const { text, maxSuggestions } = params;

	const htmlArray: string[] = [];
	const misspelled: Misspelled[] = [];

	(text || '').split(/([\p{L}']+)/gu).forEach((segment) => {
		if (segment.match(/[\p{L}']+/u) && !dictionary.check(segment)) {
			htmlArray.push(
				`<span style="text-decoration: underline red wavy; text-underline-offset: 3px;">${escapeHtml(segment)}</span>`
			);
			if (maxSuggestions !== 0) {
				const suggestions: string[] = dictionary.suggest(segment);
				misspelled.push({ original: segment, suggestions: suggestions.slice(0, maxSuggestions) });
			}
		} else {
			htmlArray.push(escapeHtml(segment));
		}
	});
	return { html: htmlArray.join(''), misspelled };
};
