import { h } from 'hastscript';

import { mkPlugin, mkSearchReplaceMarker } from './marker.js';

const separatorClassName = 'r-typography-western-phrase-separator';

const separatorNode = h(`span.${separatorClassName}`, ' ');

/* space between western phrase and chinese phrase ignoring order */
const separatorRE =
	/(?:(?<=[\p{Script=Latin}0-9\.])[ ](?=[^\p{Script=Latin}0-9\.]))|(?:(?<=[^\p{Script=Latin}0-9\.])[ ](?=[\p{Script=Latin}0-9\.]))/u;

export const rehypeMarkSeparator = mkPlugin(
	mkSearchReplaceMarker(separatorRE, separatorNode),
);
