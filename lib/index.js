import { rehypeMarkCompressable } from './compressable.js';
import { rehypeMarkHangable } from './hangable.js';
import { rehypeMarkSeparator } from './separator.js';

export { rehypeMarkCompressable, rehypeMarkHangable, rehypeMarkSeparator };

export const recommended = [
	...rehypeMarkCompressable,
	...rehypeMarkHangable,
	rehypeMarkSeparator,
];
