import { h } from 'hastscript';

import { mkMarkerPlugin, mkSearchReplaceMarker } from './marker.js';

export const separatorClassName = 'r-typography-western-phrase-separator';

export const separatorNode = h(`span.${separatorClassName}`, ' ');

/* space between western phrase and chinese phrase ignoring order */
const separatorRE =
	/(?:(?<=[\p{Script=Latin}0-9\.])[ ](?=[^\p{Script=Latin}0-9\.]))|(?:(?<=[^\p{Script=Latin}0-9\.])[ ](?=[\p{Script=Latin}0-9\.]))/u;

export const rehypeMarkSeparator = mkMarkerPlugin(
	mkSearchReplaceMarker(separatorRE, separatorNode),
);
