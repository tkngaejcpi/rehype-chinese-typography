import { h } from 'hastscript';

import { mkMarkerPlugin, mkSearchReplaceMarker } from './marker.js';
import { stopRecursionClassName } from './utils.js';

export const openingCompressableClassName = 'r-typography-opening-compressable';
export const closingCompressableClassName = 'r-typography-closing-compressable';

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
		mkMarkerPlugin(
			mkSearchReplaceMarker(
				compressable,
				mkOpeningCompressableNode(compressable),
			),
		),
	),

	...closingCompressable.map((compressable) =>
		mkMarkerPlugin(
			mkSearchReplaceMarker(
				compressable,
				mkClosingCompressableNode(compressable),
			),
		),
	),
];
