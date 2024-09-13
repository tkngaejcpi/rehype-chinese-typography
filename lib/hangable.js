import { h } from 'hastscript';

import { mkMarkerPlugin, mkSearchReplaceMarker } from './marker.js';
import { stopRecursionClassName } from './utils.js';

export const hangableContainerClassName = 'r-typography-hangable-container';
export const hangableClassName = 'r-typography-hangable';

/**
 * @param {string} punctutation
 */
export function mkHangableNode(punctutation) {
	return h(`span.${hangableContainerClassName}`, [
		h(`span.${hangableClassName}.${stopRecursionClassName}`, punctutation),
	]);
}

/* punctutations which are allowed to "hang" on the end of the line (overflow) */
const hangables = ['，', '。'];

export const rehypeMarkHangable = hangables.map((hangable) =>
	mkMarkerPlugin(mkSearchReplaceMarker(hangable, mkHangableNode(hangable))),
);
