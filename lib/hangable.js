import { h } from 'hastscript';

import { mkPlugin, mkSearchReplaceMarker } from './marker.js';
import { stopRecursionClassName } from './utils.js';

const hangableContainerClassName = 'r-typography-hangable-container';
const hangableClassName = 'r-typography-hangable';

/**
 * @param {string} punctutation
 */
function mkHangableNode(punctutation) {
	return h(`span.${hangableContainerClassName}`, [
		h(`span.${hangableClassName}.${stopRecursionClassName}`, punctutation),
	]);
}

/* punctutations which are allowed to "hang" on the end of the line (overflow) */
const hangables = ['，', '。'];

export const rehypeMarkHangable = hangables.map((hangable) =>
	mkPlugin(mkSearchReplaceMarker(hangable, mkHangableNode(hangable))),
);
