/**
 * @import {Element, Text, Root} from 'hast'
 */

import { flatMap, t } from './utils.js';

/**
 * a marker transforms {@link Text} to a list of {@link Text} and {@link Element} markup (mostly `<span>`).
 * @typedef {(_: Text) => (Text | Element)[]} Marker
 */

/**
 * @param {RegExp | string} pattern
 * @param {Element} node
 * @returns {Marker}
 *
 * @description a simple {@link Marker} that matches regex (or string) and replace it into given node
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
 * @returns {(_: Root) => Root}
 */
function mkMarkerTransformer(marker) {
	return flatMap(function (node) {
		return node.type == 'text' ? marker(node) : node;
	});
}

/**
 * @param {Marker} marker
 */
export function mkMarkerPlugin(marker) {
	return function () {
		/**
		 * @param {Root} tree
		 */
		return function (tree) {
			tree.children = mkMarkerTransformer(marker)(tree).children;
		};
	};
}
