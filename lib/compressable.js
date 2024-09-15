import { h } from 'hastscript';

import { mkPlugin, mkSearchReplaceMarker } from './marker.js';
import { stopRecursionClassName } from './utils.js';

const openingCompressableClassName = 'r-typography-opening-compressable';
const closingCompressableClassName = 'r-typography-closing-compressable';

/**
 * @param {string} punctutation
 */
export function mkOpeningCompressableNode(punctutation) {
	return h(
		`span.${openingCompressableClassName}.${stopRecursionClassName}`,
		punctutation,
	);
}

/**
 * @param {string} punctutation
 */
export function mkClosingCompressableNode(punctutation) {
	return h(
		`span.${closingCompressableClassName}.${stopRecursionClassName}`,
		punctutation,
	);
}

/* punctutations which are allowed to be "compressed" */
const openingCompressable = ['「', '『', '（', '《'];
const closingCompressable = ['」', '』', '）', '》'];

export const rehypeMarkCompressable = [
	...openingCompressable.map((compressable) =>
		mkPlugin(
			mkSearchReplaceMarker(
				compressable,
				mkOpeningCompressableNode(compressable),
			),
		),
	),

	...closingCompressable.map((compressable) =>
		mkPlugin(
			mkSearchReplaceMarker(
				compressable,
				mkClosingCompressableNode(compressable),
			),
		),
	),
];
