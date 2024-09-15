import assert from 'node:assert';
import { describe, test } from 'node:test';

import { unified } from 'unified';
import { h } from 'hastscript';

import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';

import { t, map, flatMap, stopRecursionClassName } from './lib/utils.js';

import { rehypeMarkCompressable } from './lib/compressable.js';
import { rehypeMarkHangable } from './lib/hangable.js';
import { rehypeMarkSeparator } from './lib/separator.js';

const openingCompressableClassName = 'r-typography-opening-compressable';
const closingCompressableClassName = 'r-typography-closing-compressable';
const hangableContainerClassName = 'r-typography-hangable-container';
const hangableClassName = 'r-typography-hangable';
const separatorClassName = 'r-typography-western-phrase-separator';

describe('utils', function () {
	const tree = h('article', [
		h('p', 'apple'),
		h('p', 'banana'),

		h('p', [h('span', 'orange'), 'kiwi']),
	]);

	test('map', function () {
		const result = map(function (node) {
			return node.type == 'text' && node.value == 'banana'
				? t('strawberry')
				: node;
		})(tree);

		const expectedResult = h('article', [
			h('p', 'apple'),
			h('p', 'strawberry'),

			h('p', [h('span', 'orange'), 'kiwi']),
		]);

		assert.deepStrictEqual(result, expectedResult);
	});

	test('flatMap', function () {
		const result = flatMap(function (node) {
			return node.type == 'element' && node.tagName == 'span'
				? [h('span', 'orange'), h('span', 'lemon'), t('grape')]
				: [node];
		})(tree);

		const expectedResult = h('article', [
			h('p', 'apple'),
			h('p', 'banana'),

			h('p', [h('span', 'orange'), h('span', 'lemon'), t('grape'), 'kiwi']),
		]);

		assert.deepStrictEqual(result, expectedResult);
	});
});

describe('plugins', function () {
	const text =
		'<html><head></head><body><p>《狐狸與獵犬》（英語：The Fox and the Hound）是 Daniel P. Mannix 於 1967 年創作的小說。</p></body></html>';

	/**
	 * @import { PluggableList } from 'unified'
	 */

	/**
	 * @param {PluggableList} plugin
	 */
	const transformText = (plugin) =>
		unified()
			.use(rehypeParse)
			.use(plugin)
			.use(rehypeStringify)
			.process(text)
			.then((vFile) => vFile.value);

	test('rehypeMarkCompressable', async function () {
		const result = await transformText(rehypeMarkCompressable);

		const openingBookmark = `<span class="${openingCompressableClassName} ${stopRecursionClassName}">《</span>`;
		const closingBookmark = `<span class="${closingCompressableClassName} ${stopRecursionClassName}">》</span>`;
		const openingBracket = `<span class="${openingCompressableClassName} ${stopRecursionClassName}">（</span>`;
		const closingBracket = `<span class="${closingCompressableClassName} ${stopRecursionClassName}">）</span>`;

		const expectedResult = `<html><head></head><body><p>${openingBookmark}狐狸與獵犬${closingBookmark}${openingBracket}英語：The Fox and the Hound${closingBracket}是 Daniel P. Mannix 於 1967 年創作的小說。</p></body></html>`;

		assert.strictEqual(result, expectedResult);
	});

	test('rehypeMarkHangable', async function () {
		const result = await transformText(rehypeMarkHangable);

		const stopHangableHtml = `<span class="${hangableContainerClassName}"><span class="${hangableClassName} ${stopRecursionClassName}">。</span></span>`;
		const expectedResult = `<html><head></head><body><p>《狐狸與獵犬》（英語：The Fox and the Hound）是 Daniel P. Mannix 於 1967 年創作的小說${stopHangableHtml}</p></body></html>`;

		assert.strictEqual(result, expectedResult);
	});

	test('rehypeMarkSeparator', async function () {
		const result = await transformText(rehypeMarkSeparator);

		const separatorHtml = `<span class="${separatorClassName}"> </span>`;
		const expectedResult = `<html><head></head><body><p>《狐狸與獵犬》（英語：The Fox and the Hound）是${separatorHtml}Daniel P. Mannix${separatorHtml}於${separatorHtml}1967${separatorHtml}年創作的小說。</p></body></html>`;

		assert.strictEqual(result, expectedResult);
	});
});
