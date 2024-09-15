/**
 * @import { Nodes } from 'hast'
 */

/**
 * @description a special class that stop recursion in `map` and `flatMap`,
 * it is used to avoid some self-repeat loop.
 */
export const stopRecursionClassName = 'r-typography-stop-recursion';

/**
 * @param {Nodes} node
 */
function isParent(node) {
	return node.type == 'root' || node.type == 'element';
}

/**
 * @param {Nodes} node
 */
function shouldStopRecursion(node) {
	return node.properties?.className?.includes(stopRecursionClassName)
		? true
		: false;
}

/**
 * @param {string} text
 * @returns {Text}
 *
 * @description constructor of {@link Text} node.
 */
export function t(text) {
	return { type: 'text', value: text };
}

/**
 * @param {(_: Nodes) => Nodes} mapFunc
 *
 * @description `map` funtion for hast,
 * assume the `mapFunc` is logically correct.
 */
export function map(mapFunc) {
	/**
	 * @param {Nodes} node
	 * @returns {Nodes}
	 */
	function doMap(node) {
		if (shouldStopRecursion(node)) return node;

		const mapped = mapFunc(node);

		return isParent(mapped)
			? { ...mapped, children: mapped.children.map(doMap) }
			: mapped;
	}

	return doMap;
}

/**
 * @param {(_: Nodes) => Nodes[]} flatMapFunc
 *
 * @description `flatMap` funtion for hast,
 * assume the `flatMapFunc` is logically correct.
 */
export function flatMap(flatMapFunc) {
	return map(function (node) {
		return isParent(node)
			? {
					...node,
					children: node.children.flatMap(flatMapFunc),
				}
			: node;
	});
}
