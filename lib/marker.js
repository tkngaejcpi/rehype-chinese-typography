/**
 * @import { Plugin } from 'unified'
 * @import { Element, Text, Root } from 'hast'
 */

import { flatMap, t } from './utils.js';

/**
 * a marker transforms {@link Text} to a list of {@link Text} and {@link Element} markup (mostly `<span>`).
 * @typedef {(_: Text) => (Text | Element)[]} Marker
 */

/**
 * a transformer transforms a html tree to another html tree.
 * @typedef {(_: Root) => Root} Transformer
 */

/**
 * @param {RegExp | string} pattern
 * @param {Element} node
 * @returns {Marker} a simple {@link Marker} that matches regex (or string) and replace it into given node
 *
 * @description constructor of {@link Marker}
 */
export function mkSearchReplaceMarker(pattern, node) {
	return function (text) {
		return text.value
			.split(pattern)
			.map(t)
			.flatMap((textNode) => [textNode, node])
			.slice(0, -1);
	};
}

/**
 * @param {Marker} marker
 * @returns {Transformer}
 */
function mkTransformer(marker) {
	return flatMap(function (node) {
		return node.type == 'text' ? marker(node) : node;
	});
}

/**
 * @param {Marker} marker
 * @returns {Plugin<[], Root, Root>}
 */
export function mkPlugin(marker) {
	return function () {
		/**
		 * @param {Root} tree
		 */
		return function (tree) {
			tree.children = mkTransformer(marker)(tree).children;
		};
	};
}
