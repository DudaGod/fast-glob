import * as assert from 'assert';

import * as util from './pattern';

import { Pattern } from '../types/patterns';

describe('Utils → Pattern', () => {
	describe('.isStaticPattern', () => {
		it('should return true for static pattern', () => {
			const actual = util.isStaticPattern('dir');

			assert.ok(actual);
		});

		it('should return false for dynamic pattern', () => {
			const actual = util.isStaticPattern('*');

			assert.ok(!actual);
		});
	});

	describe('.isDynamicPattern', () => {
		it('should return true for dynamic pattern', () => {
			const actual = util.isDynamicPattern('*');

			assert.ok(actual);
		});

		it('should return false for static pattern', () => {
			const actual = util.isDynamicPattern('dir');

			assert.ok(!actual);
		});
	});

	describe('.unixifyPattern', () => {
		it('should convert backslashes to forward slashes', () => {
			const expected: Pattern = '**/*';

			const actual = util.unixifyPattern('**\\*');

			assert.equal(actual, expected);
		});
	});

	describe('.convertToPositivePattern', () => {
		it('should returns converted positive pattern', () => {
			const expected: Pattern = '*.js';

			const actual = util.convertToPositivePattern('!*.js');

			assert.equal(actual, expected);
		});

		it('should returns pattern without changes', () => {
			const expected: Pattern = '*.js';

			const actual = util.convertToPositivePattern('*.js');

			assert.equal(actual, expected);
		});
	});

	describe('.convertToNegativePattern', () => {
		it('should returns converted negative pattern', () => {
			const expected: Pattern = '!*.js';

			const actual = util.convertToNegativePattern('*.js');

			assert.equal(actual, expected);
		});
	});

	describe('.isNegativePattern', () => {
		it('should returns true', () => {
			const actual = util.isNegativePattern('!*.md');

			assert.ok(actual);
		});

		it('should returns false', () => {
			const actual = util.isNegativePattern('*.md');

			assert.ok(!actual);
		});

		it('should returns false for extglob', () => {
			const actual = util.isNegativePattern('!(a|b|c)');

			assert.ok(!actual);
		});
	});

	describe('.isPositivePattern', () => {
		it('should returns true', () => {
			const actual = util.isPositivePattern('*.md');

			assert.ok(actual);
		});

		it('should returns false', () => {
			const actual = util.isPositivePattern('!*.md');

			assert.ok(!actual);
		});
	});

	describe('.getNegativePatterns', () => {
		it('should returns only negative patterns', () => {
			const expected: Pattern[] = ['!*.spec.js'];

			const actual = util.getNegativePatterns(['*.js', '!*.spec.js', '*.ts']);

			assert.deepEqual(actual, expected);
		});

		it('should returns empty array', () => {
			const expected: Pattern[] = [];

			const actual = util.getNegativePatterns(['*.js', '*.ts']);

			assert.deepEqual(actual, expected);
		});
	});

	describe('.getPositivePatterns', () => {
		it('should returns only positive patterns', () => {
			const expected: Pattern[] = ['*.js', '*.ts'];

			const actual = util.getPositivePatterns(['*.js', '!*.spec.js', '*.ts']);

			assert.deepEqual(actual, expected);
		});

		it('should returns empty array', () => {
			const expected: Pattern[] = [];

			const actual = util.getPositivePatterns(['!*.js', '!*.ts']);

			assert.deepEqual(actual, expected);
		});
	});

	describe('.getBaseDirectory', () => {
		it('should returns base directory', () => {
			const expected = 'root';

			const actual = util.getBaseDirectory('root/*.js');

			assert.equal(actual, expected);
		});
	});

	describe('.hasGlobStar', () => {
		it('should returns true for pattern that includes globstar', () => {
			const actual = util.hasGlobStar('**/*.js');

			assert.ok(actual);
		});

		it('should returns false for pattern that has no globstar', () => {
			const actual = util.hasGlobStar('*.js');

			assert.ok(!actual);
		});
	});

	describe('.endsWithSlashGlobStar', () => {
		it('should returns true for pattern that ends with slash and globstar', () => {
			const actual = util.endsWithSlashGlobStar('name/**');

			assert.ok(actual);
		});

		it('should returns false for pattern that has no slash, but ends with globstar', () => {
			const actual = util.endsWithSlashGlobStar('**');

			assert.ok(!actual);
		});

		it('should returns false for pattern that does not ends with globstar', () => {
			const actual = util.endsWithSlashGlobStar('name/**/*');

			assert.ok(!actual);
		});
	});

	describe('.isAffectDepthOfReadingPattern', () => {
		it('should return true for pattern that ends with slash and globstar', () => {
			const actual = util.isAffectDepthOfReadingPattern('name/**');

			assert.ok(actual);
		});

		it('should return true for pattern when the last partial of the pattern is static pattern', () => {
			const actual = util.isAffectDepthOfReadingPattern('**/name');

			assert.ok(actual);
		});

		it('should return false', () => {
			const actual = util.isAffectDepthOfReadingPattern('**/name/*');

			assert.ok(!actual);
		});
	});

	describe('.getDepth', () => {
		it('should returns 4', () => {
			const expected: number = 4;

			const actual = util.getDepth('a/b/*/*.js');

			assert.equal(actual, expected);
		});
	});

	describe('.makePatternRe', () => {
		it('should return regexp for provided pattern', () => {
			const expected: RegExp = /^(?:(?:\.[\\/](?=.))?(?![\\/])(?!\.)(?=.)[^\\/]*?\.js(?:[\\/]|$))$/;

			const actual = util.makeRe('*.js', {});

			assert.equal(actual.source, expected.source);
		});
	});

	describe('.convertPatternsToRe', () => {
		it('should return regexps for provided patterns', () => {
			const expected: RegExp = /^(?:(?:\.[\\/](?=.))?(?![\\/])(?!\.)(?=.)[^\\/]*?\.js(?:[\\/]|$))$/;

			const [actual] = util.convertPatternsToRe(['*.js'], {});

			assert.equal(actual.source, expected.source);
		});
	});
	describe('.matchAny', () => {
		it('should return true', () => {
			const actual = util.matchAny('fixtures/file.txt', [/fixture/, /fixtures\/file/]);

			assert.ok(actual);
		});

		it('should return false', () => {
			const actual = util.matchAny('fixtures/directory', [/fixtures\/file/]);

			assert.ok(!actual);
		});
	});
});
