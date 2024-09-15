import { rehypeMarkCompressable } from './compressable.js';
import { rehypeMarkHangable } from './hangable.js';
import { rehypeMarkSeparator } from './separator.js';

export const recommended = [
	...rehypeMarkCompressable,
	...rehypeMarkHangable,
	rehypeMarkSeparator,
];
