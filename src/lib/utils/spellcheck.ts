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

	(text || '').split(/([0-9\p{L}'’]+)/gu).forEach((segment) => {
		const word = prepareWord(segment);
		if (!!word && word.match(/[0-9\p{L}'’]+/u) && !dictionary.check(word)) {
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

const prepareWord = (word: string): string => {
	// if `word` doesn't contain any letter, return an empty string
	// so typo.js skips checking it
	if (!word.match(/[\p{L}]+/u)) {
		return '';
	}

	// replace curly right quotes with straight right quotes
	let result = word.replace(/[’]/g, "'");

	// strip the trailing striaght right quote if it is preceded by "s" or "x"
	// so typo.js doesn't mark it as a misspelling
	if (result.endsWith("s'") || result.endsWith("x'")) {
		result = result.slice(0, -1);
	}

	return result;
};
